#!/usr/bin/env node

const API_BASE = 'http://localhost:3001'
const BATCH_SIZE = 100
const DELAY_BETWEEN_BATCHES = 2000 // 2 seconds

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function getStatistics() {
  try {
    const response = await fetch(`${API_BASE}/api/flashcards/auto-generate-examples`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('❌ Error getting statistics:', error)
    return null
  }
}

async function processBatch(startIndex, batchSize) {
  try {
    console.log(`🔄 Processing batch starting at index ${startIndex}...`)
    
    const response = await fetch(`${API_BASE}/api/flashcards/auto-generate-examples`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startIndex,
        batchSize,
        forceUpdate: false
      })
    })

    const data = await response.json()
    
    if (data.success) {
      console.log(`✅ Batch complete: ${data.summary.updated} updated, ${data.summary.skipped} skipped, ${data.summary.failed} failed`)
      console.log(`📊 Progress: ${data.summary.progress}`)
      return data.summary
    } else {
      console.error('❌ Batch failed:', data.error)
      return null
    }
  } catch (error) {
    console.error('❌ Error processing batch:', error)
    return null
  }
}

async function main() {
  console.log('🚀 Starting auto-generation of examples for all flashcards...')
  console.log('=' .repeat(60))

  // Get initial statistics
  const stats = await getStatistics()
  if (!stats || !stats.success) {
    console.error('❌ Failed to get initial statistics')
    return
  }

  console.log(`📊 Initial Statistics:`)
  console.log(`   Total words: ${stats.statistics.totalWords}`)
  console.log(`   With examples: ${stats.statistics.withExamples}`)
  console.log(`   Without examples: ${stats.statistics.withoutExamples}`)
  console.log(`   Completion: ${stats.statistics.completionPercentage}%`)
  console.log(`   Estimated batches: ${Math.ceil(stats.statistics.withoutExamples / BATCH_SIZE)}`)
  console.log('=' .repeat(60))

  if (stats.statistics.withoutExamples === 0) {
    console.log('🎉 All words already have examples!')
    return
  }

  let startIndex = 0
  let totalUpdated = 0
  let totalSkipped = 0
  let totalFailed = 0
  let batchCount = 0

  const totalWords = stats.statistics.totalWords
  const startTime = Date.now()

  while (startIndex < totalWords) {
    batchCount++
    console.log(`\n🔄 Batch ${batchCount}: Processing words ${startIndex} to ${Math.min(startIndex + BATCH_SIZE, totalWords)}`)
    
    const batchResult = await processBatch(startIndex, BATCH_SIZE)
    
    if (batchResult) {
      totalUpdated += batchResult.updated
      totalSkipped += batchResult.skipped  
      totalFailed += batchResult.failed

      // Log running totals
      console.log(`📈 Running totals: ${totalUpdated} updated, ${totalSkipped} skipped, ${totalFailed} failed`)
      
      if (!batchResult.hasMore) {
        console.log('✅ All batches completed!')
        break
      }
      
      startIndex = batchResult.nextStartIndex
    } else {
      console.error(`❌ Batch ${batchCount} failed, skipping to next...`)
      startIndex += BATCH_SIZE
    }

    // Delay between batches to avoid overwhelming the server
    if (startIndex < totalWords) {
      console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`)
      await delay(DELAY_BETWEEN_BATCHES)
    }
  }

  const endTime = Date.now()
  const totalTime = Math.round((endTime - startTime) / 1000)

  console.log('\n' + '=' .repeat(60))
  console.log('🎉 AUTO-GENERATION COMPLETE!')
  console.log('=' .repeat(60))
  console.log(`📊 Final Results:`)
  console.log(`   Total batches processed: ${batchCount}`)
  console.log(`   Words updated: ${totalUpdated}`)
  console.log(`   Words skipped: ${totalSkipped}`)
  console.log(`   Words failed: ${totalFailed}`)
  console.log(`   Total time: ${totalTime} seconds`)
  console.log(`   Average: ${Math.round(totalUpdated / (totalTime / 60))} words/minute`)

  // Get final statistics
  console.log('\n🔄 Getting final statistics...')
  const finalStats = await getStatistics()
  if (finalStats && finalStats.success) {
    console.log(`📊 Final Statistics:`)
    console.log(`   Total words: ${finalStats.statistics.totalWords}`)
    console.log(`   With examples: ${finalStats.statistics.withExamples}`)
    console.log(`   Without examples: ${finalStats.statistics.withoutExamples}`)
    console.log(`   Completion: ${finalStats.statistics.completionPercentage}%`)
  }

  console.log('\n✨ All done! Your flashcards now have examples!')
}

// Run the script
main().catch(console.error)