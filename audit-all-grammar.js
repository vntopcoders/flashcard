#!/usr/bin/env node

// Comprehensive audit of all daily grammar lessons
const http = require('http');

// Define the complete daily lesson structure (3 weeks = 21 days)
const DAILY_LESSON_STRUCTURE = [
  // Week 1: Basic Tenses
  ['Present Simple & Continuous', 'Question Formation', 'Experience vs Finished Actions'],
  // Week 2: Past and Perfect
  ['Past Simple & Continuous', 'Already/Yet/Just', 'Time Expressions'],
  // Week 3: Future and Advanced  
  ['Future Forms', 'Will vs Going to', 'Present Continuous for Future'],
  // Week 4: Modals and Conditionals
  ['Modal Verbs', 'Can/Could/May/Might', 'Permission & Possibility'],
  // Week 5: Complex structures
  ['Conditional Sentences', 'First Conditional', 'If vs When'],
  // Week 6: Articles and determiners
  ['Articles & Determiners', 'A/An/The Usage', 'Quantifiers'],
  // Week 7: Advanced topics
  ['Passive Voice', 'Reported Speech', 'Relative Clauses']
];

async function checkPage(day, topic) {
  return new Promise((resolve) => {
    const url = `http://localhost:3000/grammar/day-${day}-topic-${topic}`;
    
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Check if page has proper content (not fallback)
        const hasProperContent = !data.includes('Cấu trúc ngữ pháp và mẫu câu') &&
                                !data.includes('Ví dụ câu với giải thích') &&
                                data.includes('Day ' + day + ':');
        
        // Extract topic name from title
        const titleMatch = data.match(/<title>Day \d+: ([^<]+) - IELTS Grammar<\/title>/);
        const topicName = titleMatch ? titleMatch[1] : 'Unknown';
        
        resolve({
          day,
          topic,
          url,
          hasContent: hasProperContent,
          topicName,
          accessible: res.statusCode === 200
        });
      });
    });
    
    req.on('error', () => {
      resolve({
        day,
        topic,
        url,
        hasContent: false,
        topicName: 'Error',
        accessible: false
      });
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      resolve({
        day,
        topic,
        url,
        hasContent: false,
        topicName: 'Timeout',
        accessible: false
      });
    });
  });
}

async function auditAllLessons() {
  console.log('🔍 Starting comprehensive grammar audit...\n');
  
  const results = [];
  const failedLessons = [];
  
  // Check all 21 days x 3 topics = 63 lessons
  for (let weekIndex = 0; weekIndex < 7; weekIndex++) {
    const week = DAILY_LESSON_STRUCTURE[weekIndex];
    if (!week) continue;
    
    console.log(`📅 Week ${weekIndex + 1}:`);
    
    for (let topicIndex = 0; topicIndex < 3; topicIndex++) {
      const day = weekIndex * 3 + topicIndex + 1;
      const topic = topicIndex + 1;
      const expectedTopic = week[topicIndex];
      
      const result = await checkPage(day, topic);
      results.push(result);
      
      const status = result.accessible ? 
        (result.hasContent ? '✅' : '❌') : '🔴';
      
      console.log(`  Day ${day} Topic ${topic}: ${result.topicName} ${status}`);
      
      if (!result.hasContent || !result.accessible) {
        failedLessons.push({
          ...result,
          expectedTopic
        });
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log('');
  }
  
  // Summary
  const totalLessons = results.length;
  const workingLessons = results.filter(r => r.hasContent && r.accessible).length;
  const failedCount = failedLessons.length;
  
  console.log('📊 AUDIT SUMMARY:');
  console.log(`  Total lessons checked: ${totalLessons}`);
  console.log(`  Working lessons: ${workingLessons} ✅`);
  console.log(`  Failed lessons: ${failedCount} ❌`);
  console.log(`  Success rate: ${((workingLessons / totalLessons) * 100).toFixed(1)}%`);
  
  if (failedLessons.length > 0) {
    console.log('\n⚠️  FAILED LESSONS:');
    failedLessons.forEach(lesson => {
      console.log(`  ❌ Day ${lesson.day} Topic ${lesson.topic}: ${lesson.expectedTopic}`);
      console.log(`     URL: ${lesson.url}`);
      console.log(`     Status: ${lesson.accessible ? 'Accessible but no content' : 'Not accessible'}`);
      console.log('');
    });
    
    console.log('🔧 REQUIRED ACTIONS:');
    const missingTopics = [...new Set(failedLessons.map(l => l.expectedTopic))];
    missingTopics.forEach(topic => {
      console.log(`  📝 Create content for: "${topic}"`);
    });
  } else {
    console.log('\n🎉 ALL LESSONS ARE WORKING PERFECTLY!');
  }
}

// Run the audit
auditAllLessons().catch(console.error);