import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // Seed remaining weeks 9-24 with key points and resources
    const remainingWeeksData = [
      // Weeks 9-16 (Development Phase)
      {
        week: 9,
        keyPoints: [
          'Defining clauses: không dấu phẩy, cần thiết để hiểu nghĩa',
          'Non-defining clauses: có dấu phẩy, thông tin bổ sung',
          'Relative pronouns: who, which, that, whose, where, when',
          'Reduced relative clauses: The man (who is) standing there'
        ],
        resources: [
          { type: 'lesson', title: 'Relative Clauses Basics', url: '/lessons/relative-basic' },
          { type: 'lesson', title: 'Advanced Relative Clauses', url: '/lessons/relative-advanced' },
          { type: 'grammar', title: 'Relative Pronouns Guide', url: '/grammar/relative-pronouns' }
        ]
      },
      {
        week: 10,
        keyPoints: [
          'Tense backshift trong reported speech',
          'Thay đổi đại từ và trạng từ chỉ thời gian/nơi chốn',
          'Reporting verbs: say, tell, ask, suggest, advise, warn',
          'Reported questions và commands'
        ],
        resources: [
          { type: 'lesson', title: 'Reported Speech Basics', url: '/lessons/reported-basic' },
          { type: 'lesson', title: 'Reporting Verbs', url: '/lessons/reporting-verbs' },
          { type: 'grammar', title: 'Reported Speech Rules', url: '/grammar/reported-rules' }
        ]
      },
      {
        week: 11,
        keyPoints: [
          'Type 3: If + Past Perfect, would have + V3',
          'Mixed conditionals: Type 2 + Type 3',
          'Conditional without if: Had I known..., Should you need...',
          'Alternative conditional structures'
        ],
        resources: [
          { type: 'lesson', title: 'Third Conditional', url: '/lessons/third-conditional' },
          { type: 'lesson', title: 'Mixed Conditionals', url: '/lessons/mixed-conditionals' },
          { type: 'grammar', title: 'Advanced Conditionals', url: '/grammar/advanced-conditionals' }
        ]
      },
      {
        week: 12,
        keyPoints: [
          'It is + adjective + that + S + (should) + base verb',
          'I wish + Past Simple/Past Perfect',
          'If only structures cho regrets',
          'As if/As though với subjunctive'
        ],
        resources: [
          { type: 'lesson', title: 'Subjunctive Mood', url: '/lessons/subjunctive' },
          { type: 'lesson', title: 'Wish and If Only', url: '/lessons/wish-structures' },
          { type: 'grammar', title: 'Subjunctive Guide', url: '/grammar/subjunctive-guide' }
        ]
      },
      {
        week: 13,
        keyPoints: [
          'Have/Get something done (causative)',
          'Passive infinitives: to be done, to have been done',
          'Passive gerunds: being done, having been done',
          'Reporting structures: It is said that..., He is said to...'
        ],
        resources: [
          { type: 'lesson', title: 'Causative Have/Get', url: '/lessons/causative' },
          { type: 'lesson', title: 'Passive Infinitives', url: '/lessons/passive-infinitives' },
          { type: 'grammar', title: 'Advanced Passive', url: '/grammar/advanced-passive' }
        ]
      },
      {
        week: 14,
        keyPoints: [
          'Negative adverbs + inversion: Never, Rarely, Seldom',
          'Not only... but also với inversion',
          'So/Such... that với inversion',
          'Should/Were/Had inversion trong conditionals'
        ],
        resources: [
          { type: 'lesson', title: 'Inversion Basics', url: '/lessons/inversion-basic' },
          { type: 'lesson', title: 'Advanced Inversion', url: '/lessons/inversion-advanced' },
          { type: 'grammar', title: 'Inversion Rules', url: '/grammar/inversion-rules' }
        ]
      },
      {
        week: 15,
        keyPoints: [
          'Present participle clauses: Walking down the street...',
          'Past participle clauses: Built in 1990...',
          'Perfect participle clauses: Having finished...',
          'Participle clauses for time, reason, result'
        ],
        resources: [
          { type: 'lesson', title: 'Participle Clauses', url: '/lessons/participle-clauses' },
          { type: 'lesson', title: 'Reducing Adverb Clauses', url: '/lessons/reducing-clauses' },
          { type: 'grammar', title: 'Participle Guide', url: '/grammar/participle-guide' }
        ]
      },
      {
        week: 16,
        keyPoints: [
          'It clefts: It was John who broke the window',
          'Wh-clefts: What I need is a good rest',
          'Pseudo-clefts: The thing that annoys me is...',
          'Cleft sentences trong IELTS Writing'
        ],
        resources: [
          { type: 'lesson', title: 'Cleft Sentences', url: '/lessons/cleft-sentences' },
          { type: 'lesson', title: 'Emphasis Techniques', url: '/lessons/emphasis' },
          { type: 'grammar', title: 'Cleft Structures', url: '/grammar/cleft-structures' }
        ]
      },
      // Weeks 17-24 (Advanced Phase)
      {
        week: 17,
        keyPoints: [
          'Modal + perfect infinitive: must have done, should have done',
          'Degrees of certainty: might, could, must, can\'t',
          'Past habits: used to, would, was/were used to',
          'Need/Dare as modal-like verbs'
        ],
        resources: [
          { type: 'lesson', title: 'Modal Perfect', url: '/lessons/modal-perfect' },
          { type: 'lesson', title: 'Degrees of Certainty', url: '/lessons/certainty' },
          { type: 'grammar', title: 'Advanced Modals', url: '/grammar/advanced-modals' }
        ]
      },
      {
        week: 18,
        keyPoints: [
          'Verb → Noun: decide → decision, analyze → analysis',
          'Adjective → Noun: important → importance, different → difference',
          'Academic nominalization patterns',
          'Using nominalization trong IELTS Writing'
        ],
        resources: [
          { type: 'lesson', title: 'Nominalization Basics', url: '/lessons/nominalization' },
          { type: 'lesson', title: 'Academic Writing Style', url: '/lessons/academic-style' },
          { type: 'grammar', title: 'Nominalization Guide', url: '/grammar/nominalization-guide' }
        ]
      },
      {
        week: 19,
        keyPoints: [
          'Parallel structures: Not only... but also, Both... and',
          'Ellipsis: avoiding repetition',
          'Substitution: one, ones, so, not',
          'Complex embedded clauses'
        ],
        resources: [
          { type: 'lesson', title: 'Parallel Structures', url: '/lessons/parallel' },
          { type: 'lesson', title: 'Ellipsis and Substitution', url: '/lessons/ellipsis' },
          { type: 'grammar', title: 'Complex Sentences', url: '/grammar/complex-sentences' }
        ]
      },
      {
        week: 20,
        keyPoints: [
          'Hedging language: It seems that, It appears that',
          'Qualifying statements: To some extent, In some cases',
          'Tentative language: tend to, likely to, probably',
          'Academic caution trong IELTS Writing'
        ],
        resources: [
          { type: 'lesson', title: 'Hedging Language', url: '/lessons/hedging' },
          { type: 'lesson', title: 'Academic Writing', url: '/lessons/academic-writing' },
          { type: 'grammar', title: 'Qualifying Language', url: '/grammar/qualifying' }
        ]
      },
      {
        week: 21,
        keyPoints: [
          'Additive connectors: Furthermore, Moreover, In addition',
          'Contrastive connectors: However, Nevertheless, On the other hand',
          'Causal connectors: Therefore, Consequently, As a result',
          'Cohesive devices cho IELTS Writing'
        ],
        resources: [
          { type: 'lesson', title: 'Linking Words', url: '/lessons/linking-words' },
          { type: 'lesson', title: 'Cohesion Techniques', url: '/lessons/cohesion' },
          { type: 'grammar', title: 'Cohesive Devices', url: '/grammar/cohesive-devices' }
        ]
      },
      {
        week: 22,
        keyPoints: [
          'Causative verbs: make, let, have, get + object + verb',
          'Verb + object + infinitive: want, expect, allow',
          'Verb + gerund vs infinitive với nghĩa khác nhau',
          'Complex verb patterns trong academic English'
        ],
        resources: [
          { type: 'lesson', title: 'Causative Verbs', url: '/lessons/causative-verbs' },
          { type: 'lesson', title: 'Verb Patterns', url: '/lessons/verb-patterns' },
          { type: 'grammar', title: 'Advanced Verb Patterns', url: '/grammar/verb-patterns' }
        ]
      },
      {
        week: 23,
        keyPoints: [
          'Formal vs Informal vocabulary choices',
          'Phrasal verbs vs single-word verbs',
          'Register trong IELTS Speaking vs Writing',
          'Colloquialisms và academic language'
        ],
        resources: [
          { type: 'lesson', title: 'Register and Style', url: '/lessons/register' },
          { type: 'lesson', title: 'Formal Language', url: '/lessons/formal-language' },
          { type: 'grammar', title: 'Language Register', url: '/grammar/register' }
        ]
      },
      {
        week: 24,
        keyPoints: [
          'Subject-verb agreement errors',
          'Article usage mistakes',
          'Preposition errors',
          'Common IELTS grammar mistakes và cách tránh'
        ],
        resources: [
          { type: 'lesson', title: 'Error Analysis', url: '/lessons/error-analysis' },
          { type: 'lesson', title: 'Grammar Review', url: '/lessons/grammar-review' },
          { type: 'grammar', title: 'Common Mistakes', url: '/grammar/common-mistakes' }
        ]
      }
    ]

    // Insert key points for remaining weeks
    for (const weekData of remainingWeeksData) {
      // Get the grammar topic ID for this week
      const { data: topic, error: topicError } = await supabase
        .from('grammar_topics')
        .select('id')
        .eq('week_number', weekData.week)
        .single()

      if (topicError || !topic) {
        console.error(`No topic found for week ${weekData.week}`)
        continue
      }

      // Insert key points
      for (let i = 0; i < weekData.keyPoints.length; i++) {
        const { error: pointError } = await supabase
          .from('grammar_key_points')
          .insert({
            grammar_topic_id: topic.id,
            point_vietnamese: weekData.keyPoints[i],
            order_index: i + 1
          })

        if (pointError) {
          console.error(`Error inserting key point for week ${weekData.week}:`, pointError)
        }
      }

      // Insert study resources
      for (let i = 0; i < weekData.resources.length; i++) {
        const resource = weekData.resources[i]
        const { error: resourceError } = await supabase
          .from('study_resources')
          .insert({
            week_number: weekData.week,
            resource_type: resource.type,
            title: resource.title,
            url: resource.url,
            order_index: i + 1
          })

        if (resourceError) {
          console.error(`Error inserting resource for week ${weekData.week}:`, resourceError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully seeded remaining weeks 9-24 with grammar data'
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}