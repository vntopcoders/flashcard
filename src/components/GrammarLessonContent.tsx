'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, ArrowLeft, BookOpen, PenTool } from 'lucide-react'
import Link from 'next/link'

interface LessonData {
  title: string
  level: string
  week: number
  description: string
  isDailyContent?: boolean
  day?: number
  topic?: string
}

interface Props {
  lesson: string
  lessonData: LessonData
}

// Grammar lesson content data
interface Exercise {
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface TheoryType {
  name: string
  structure: string
  use: string
  example: string
  vietnamese: string
}

interface LessonContent {
  theory: {
    introduction: string
    types: TheoryType[]
  }
  exercises: Exercise[]
}

// Function to generate daily lesson content
const generateDailyLessonContent = (topic: string, day: number): LessonContent => {
  const contentMap: Record<string, { introduction: string; types: TheoryType[] }> = {
    'Present Simple & Continuous': {
      introduction: `Học những kiến thức cơ bản về thì Hiện tại đơn và Hiện tại tiếp diễn. Đây là những thì thiết yếu để diễn tả thói quen, sự thật và hành động đang xảy ra.`,
      types: [
        {
          name: 'Present Simple',
          structure: 'Subject + base verb (+ s/es for 3rd person)',
          use: 'Sự thật, thói quen hàng ngày, chân lý, sự kiện đã lên lịch',
          example: 'She works at a bank. / The train leaves at 9 AM.',
          vietnamese: 'Diễn tả sự thật, thói quen, lịch trình'
        },
        {
          name: 'Present Continuous',
          structure: 'Subject + am/is/are + verb-ing',
          use: 'Hành động đang xảy ra bây giờ, tình huống tạm thời, kế hoạch tương lai',
          example: 'I am studying English. / We are meeting tomorrow.',
          vietnamese: 'Diễn tả hành động đang xảy ra, tình huống tạm thời'
        }
      ]
    },
    'Past Simple & Continuous': {
      introduction: `Thành thạo các thì quá khứ để mô tả những hành động đã hoàn thành và những hành động đang diễn ra trong quá khứ.`,
      types: [
        {
          name: 'Past Simple',
          structure: 'Subject + verb-ed (or irregular past form)',
          use: 'Hành động đã hoàn thành trong quá khứ, thói quen trong quá khứ',
          example: 'I visited London last year. / She studied hard.',
          vietnamese: 'Hành động đã hoàn thành trong quá khứ'
        },
        {
          name: 'Past Continuous',
          structure: 'Subject + was/were + verb-ing',
          use: 'Hành động đang diễn ra trong quá khứ, hành động bị gián đoạn',
          example: 'I was reading when he called. / They were working.',
          vietnamese: 'Hành động đang diễn ra trong quá khứ'
        }
      ]
    },
    'Present Perfect': {
      introduction: `Kết nối những hành động từ quá khứ đến hiện tại với thì Hiện tại hoàn thành.`,
      types: [
        {
          name: 'Present Perfect',
          structure: 'Subject + have/has + past participle',
          use: 'Kinh nghiệm sống, hành động gần đây, khoảng thời gian chưa kết thúc',
          example: 'I have visited 10 countries. / She has just arrived.',
          vietnamese: 'Kinh nghiệm, hành động từ quá khứ đến hiện tại'
        },
        {
          name: 'Present Perfect vs Past Simple',
          structure: 'Present Perfect (no specific time) vs Past Simple (specific time)',
          use: 'Present Perfect: thời gian chưa kết thúc / Past Simple: thời gian đã kết thúc',
          example: 'I have been to Paris (experience) vs I went to Paris in 2020 (specific)',
          vietnamese: 'Phân biệt thời gian không cụ thể vs cụ thể'
        }
      ]
    },
    'Future Forms': {
      introduction: `Nắm vững các dạng thì tương lai để diễn tả dự đoán, kế hoạch và quyết định tự phát.`,
      types: [
        {
          name: 'Will for Predictions',
          structure: 'Subject + will + base verb',
          use: 'Dự đoán, quyết định tự phát, lời hứa',
          example: 'It will rain tomorrow. / I will help you.',
          vietnamese: 'Dự đoán và quyết định đột xuất'
        },
        {
          name: 'Going to for Plans',
          structure: 'Subject + am/is/are + going to + base verb',
          use: 'Kế hoạch đã định trước, dự đoán có bằng chứng',
          example: 'I am going to study abroad. / Look! It is going to rain.',
          vietnamese: 'Kế hoạch và dự đoán có căn cứ'
        }
      ]
    },
    'Modal Verbs': {
      introduction: `Học các động từ khuyết thiếu để diễn tả khả năng, khả năng xảy ra và sự cần thiết.`,
      types: [
        {
          name: 'Can/Could',
          structure: 'Subject + can/could + base verb',
          use: 'Khả năng, sự cho phép, yêu cầu lịch sự',
          example: 'I can swim. / Could you help me?',
          vietnamese: 'Khả năng và yêu cầu lịch sự'
        },
        {
          name: 'Must/Have to',
          structure: 'Subject + must/have to + base verb',
          use: 'Sự bắt buộc, cần thiết',
          example: 'You must study hard. / I have to go now.',
          vietnamese: 'Sự bắt buộc và cần thiết'
        }
      ]
    },
    'Conditional Sentences': {
      introduction: `Thành thạo câu điều kiện để diễn tả các tình huống giả định và hệ quả của chúng.`,
      types: [
        {
          name: 'First Conditional',
          structure: 'If + present simple, will + base verb',
          use: 'Tình huống có thể xảy ra trong tương lai',
          example: 'If it rains, I will stay home.',
          vietnamese: 'Điều kiện có thể xảy ra'
        },
        {
          name: 'Second Conditional',
          structure: 'If + past simple, would + base verb',
          use: 'Tình huống không có thật ở hiện tại',
          example: 'If I were rich, I would travel the world.',
          vietnamese: 'Điều kiện không có thật ở hiện tại'
        }
      ]
    },
    'Articles & Determiners': {
      introduction: `Sử dụng chính xác mạo từ và từ hạn định để làm rõ danh từ trong câu.`,
      types: [
        {
          name: 'A/An/The',
          structure: 'a/an + singular countable noun / the + specific noun',
          use: 'Xác định tính cụ thể của danh từ',
          example: 'I saw a cat. The cat was black.',
          vietnamese: 'Mạo từ xác định và không xác định'
        },
        {
          name: 'Some/Any',
          structure: 'some (positive) / any (negative, questions)',
          use: 'Số lượng không xác định',
          example: 'I have some money. / Do you have any questions?',
          vietnamese: 'Lượng từ không xác định'
        }
      ]
    }
  }

  const defaultContent = {
    introduction: `Học về ${topic.toLowerCase()} với các ví dụ thực tế và bài tập.`,
    types: [
      {
        name: topic,
        structure: 'Cấu trúc ngữ pháp và mẫu câu',
        use: 'Cách sử dụng phổ biến và ứng dụng',
        example: 'Ví dụ câu với giải thích',
        vietnamese: 'Giải thích bằng tiếng Việt'
      }
    ]
  }

  return {
    theory: contentMap[topic] || defaultContent,
    exercises: generateDailyExercises(topic, day)
  }
}

const generateDailyExercises = (topic: string, day: number): Exercise[] => {
  const exerciseMap: Record<string, Exercise[]> = {
    'Present Simple & Continuous': [
      {
        question: 'Chọn thì đúng: She _______ (work) in a bank.',
        options: ['work', 'works', 'is working', 'worked'],
        correct: 1,
        explanation: 'Công việc cố định dùng Present Simple. Third person singular thêm -s.'
      },
      {
        question: 'Câu nào đúng để diễn tả hành động đang xảy ra?',
        options: ['I study now', 'I am studying now', 'I studied now', 'I have studied now'],
        correct: 1,
        explanation: 'Present Continuous (am/is/are + V-ing) dùng cho hành động đang xảy ra.'
      },
      {
        question: 'Every morning, he _______ (drink) coffee.',
        options: ['is drinking', 'drinks', 'drink', 'drank'],
        correct: 1,
        explanation: 'Thói quen hàng ngày dùng Present Simple với "every".'
      },
      {
        question: 'Look! The children _______ (play) in the garden.',
        options: ['play', 'plays', 'are playing', 'played'],
        correct: 2,
        explanation: '"Look!" là dấu hiệu của Present Continuous - hành động đang xảy ra.'
      },
      {
        question: 'Chọn câu sai:',
        options: ['Water boils at 100°C', 'She is cooking dinner now', 'They are study English', 'I work here'],
        correct: 2,
        explanation: 'Sau "are" phải là V-ing, không phải infinitive. Đúng là "They are studying English".'
      }
    ],
    'Past Simple & Continuous': [
      {
        question: 'Yesterday, I _______ (visit) my grandmother.',
        options: ['visit', 'visited', 'am visiting', 'have visited'],
        correct: 1,
        explanation: '"Yesterday" là dấu hiệu của Past Simple - hành động đã hoàn thành.'
      },
      {
        question: 'While I _______ (read), he _______ (call) me.',
        options: ['read / called', 'was reading / called', 'read / was calling', 'was reading / was calling'],
        correct: 1,
        explanation: 'Past Continuous cho hành động đang diễn ra + Past Simple cho hành động xen vào.'
      },
      {
        question: 'They _______ (not go) to school last week.',
        options: ["didn't went", "didn't go", "wasn't go", "not went"],
        correct: 1,
        explanation: 'Past Simple phủ định: didn\'t + V(infinitive).'
      },
      {
        question: 'What _______ you _______ (do) at 8 PM yesterday?',
        options: ['did / do', 'were / doing', 'are / doing', 'have / done'],
        correct: 1,
        explanation: 'Thời gian cụ thể trong quá khứ + "What" dùng Past Continuous.'
      },
      {
        question: 'When I was young, I _______ (play) football every day.',
        options: ['play', 'played', 'was playing', 'am playing'],
        correct: 1,
        explanation: 'Thói quen trong quá khứ dùng Past Simple.'
      }
    ],
    'Present Perfect': [
      {
        question: 'I _______ (never be) to Japan.',
        options: ['never was', 'have never been', 'never am', 'never have been'],
        correct: 1,
        explanation: 'Kinh nghiệm sống dùng Present Perfect: have/has + past participle.'
      },
      {
        question: 'She _______ (live) here since 2020.',
        options: ['lived', 'has lived', 'is living', 'lives'],
        correct: 1,
        explanation: '"Since" + thời điểm cụ thể dùng Present Perfect.'
      },
      {
        question: '_______ you _______ (finish) your homework yet?',
        options: ['Did / finish', 'Have / finished', 'Are / finishing', 'Do / finish'],
        correct: 1,
        explanation: '"Yet" trong câu hỏi dùng Present Perfect.'
      },
      {
        question: 'We _______ (just move) to a new house.',
        options: ['just moved', 'have just moved', 'are just moving', 'just move'],
        correct: 1,
        explanation: '"Just" dùng với Present Perfect để diễn tả hành động vừa mới xảy ra.'
      },
      {
        question: 'Chọn câu đúng:',
        options: ['I went to Paris in 2020', 'I have been to Paris in 2020', 'I go to Paris in 2020', 'I am going to Paris in 2020'],
        correct: 0,
        explanation: 'Thời gian cụ thể trong quá khứ ("in 2020") dùng Past Simple, không dùng Present Perfect.'
      }
    ],
    'Future Forms': [
      {
        question: 'Tomorrow it _______ rain. (dự đoán)',
        options: ['is going to', 'will', 'is', 'would'],
        correct: 1,
        explanation: '"Will" dùng cho dự đoán không có bằng chứng cụ thể.'
      },
      {
        question: 'Look at those clouds! It _______ rain.',
        options: ['will', 'is going to', 'is', 'would'],
        correct: 1,
        explanation: '"Going to" dùng cho dự đoán có bằng chứng (mây đen).'
      },
      {
        question: 'I _______ help you with that.',
        options: ['am going to', 'will', 'am', 'would'],
        correct: 1,
        explanation: '"Will" dùng cho quyết định tự phát tại thời điểm nói.'
      },
      {
        question: 'We _______ visit our grandparents next weekend. (kế hoạch)',
        options: ['will', 'are going to', 'are', 'would'],
        correct: 1,
        explanation: '"Going to" dùng cho kế hoạch đã định trước.'
      },
      {
        question: 'The train _______ at 9 AM tomorrow.',
        options: ['will leave', 'is going to leave', 'leaves', 'is leaving'],
        correct: 2,
        explanation: 'Lịch trình cố định dùng Present Simple, ngay cả khi nói về tương lai.'
      }
    ],
    'Modal Verbs': [
      {
        question: 'I _______ swim when I was 5 years old.',
        options: ['can', 'could', 'may', 'must'],
        correct: 1,
        explanation: '"Could" là dạng quá khứ của "can" - khả năng trong quá khứ.'
      },
      {
        question: '_______ you please help me?',
        options: ['Can', 'Could', 'May', 'Must'],
        correct: 1,
        explanation: '"Could" lịch sự hơn "can" khi đưa ra yêu cầu.'
      },
      {
        question: 'You _______ wear a helmet when riding a motorcycle.',
        options: ['can', 'may', 'must', 'could'],
        correct: 2,
        explanation: '"Must" diễn tả sự bắt buộc, quy định pháp luật.'
      },
      {
        question: 'It _______ rain later. I\'m not sure.',
        options: ['will', 'might', 'must', 'should'],
        correct: 1,
        explanation: '"Might" diễn tả khả năng không chắc chắn.'
      },
      {
        question: 'You _______ see a doctor about that cough.',
        options: ['can', 'may', 'should', 'must'],
        correct: 2,
        explanation: '"Should" dùng để đưa ra lời khuyên.'
      }
    ],
    'Conditional Sentences': [
      {
        question: 'If it _______ (rain) tomorrow, I _______ (stay) home.',
        options: ['rains / will stay', 'will rain / stay', 'rain / will stay', 'rains / stay'],
        correct: 0,
        explanation: 'First Conditional: If + Present Simple, will + V(infinitive).'
      },
      {
        question: 'If I _______ (be) rich, I _______ (travel) the world.',
        options: ['am / will travel', 'was / would travel', 'were / would travel', 'am / would travel'],
        correct: 2,
        explanation: 'Second Conditional: If + Past Simple, would + V. Dùng "were" cho tất cả ngôi.'
      },
      {
        question: 'If she _______ (study) harder, she _______ (pass) the exam.',
        options: ['studied / would pass', 'had studied / would have passed', 'studies / will pass', 'study / pass'],
        correct: 1,
        explanation: 'Third Conditional: If + Past Perfect, would have + Past Participle.'
      },
      {
        question: 'If you heat water to 100°C, it _______.',
        options: ['will boil', 'would boil', 'boils', 'boiled'],
        correct: 2,
        explanation: 'Zero Conditional cho sự thật khoa học: If + Present Simple, Present Simple.'
      },
      {
        question: 'Loại điều kiện nào diễn tả tình huống không có thật ở hiện tại?',
        options: ['Zero Conditional', 'First Conditional', 'Second Conditional', 'Third Conditional'],
        correct: 2,
        explanation: 'Second Conditional diễn tả tình huống không có thật hoặc khó xảy ra ở hiện tại.'
      }
    ],
    'Articles & Determiners': [
      {
        question: 'I saw _______ cat in the garden. _______ cat was black.',
        options: ['a / The', 'the / A', 'a / A', 'the / The'],
        correct: 0,
        explanation: 'Lần đầu nhắc đến dùng "a", lần sau dùng "the" vì đã xác định.'
      },
      {
        question: 'Do you have _______ questions about the lesson?',
        options: ['some', 'any', 'a', 'the'],
        correct: 1,
        explanation: '"Any" dùng trong câu hỏi và câu phủ định.'
      },
      {
        question: 'There are _______ apples in the basket.',
        options: ['some', 'any', 'a', 'an'],
        correct: 0,
        explanation: '"Some" dùng trong câu khẳng định với danh từ đếm được số nhiều.'
      },
      {
        question: '_______ Sun rises in _______ east.',
        options: ['A / a', 'The / the', 'A / the', 'The / a'],
        correct: 1,
        explanation: 'Các thiên thể và hướng địa lý luôn dùng "the".'
      },
      {
        question: 'She is _______ honest person.',
        options: ['a', 'an', 'the', 'any'],
        correct: 1,
        explanation: '"Honest" bắt đầu bằng âm nguyên âm /ɒ/ nên dùng "an".'
      }
    ]
  }

  const baseExercises = exerciseMap[topic] || [
    {
      question: `Chọn đáp án đúng cho ${topic}:`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 0,
      explanation: `Giải thích cho ${topic}.`
    }
  ]

  // Add day-specific variation by rotating exercises
  const dayOffset = (day - 1) % baseExercises.length
  return [...baseExercises.slice(dayOffset), ...baseExercises.slice(0, dayOffset)].slice(0, 5)
}

const LESSON_CONTENT: Record<string, LessonContent> = {
  'conditional-types': {
    theory: {
      introduction: 'Conditional sentences express hypothetical situations and their consequences. There are four main types of conditionals in English.',
      types: [
        {
          name: 'Zero Conditional',
          structure: 'If + present simple, present simple',
          use: 'General truths, scientific facts',
          example: 'If you heat water to 100°C, it boils.',
          vietnamese: 'Nếu bạn đun nước đến 100°C, nó sẽ sôi.'
        },
        {
          name: 'First Conditional',
          structure: 'If + present simple, will + base form',
          use: 'Real future possibilities',
          example: 'If it rains tomorrow, I will stay at home.',
          vietnamese: 'Nếu ngày mai trời mưa, tôi sẽ ở nhà.'
        },
        {
          name: 'Second Conditional',
          structure: 'If + past simple, would + base form',
          use: 'Unreal present/future situations',
          example: 'If I had more money, I would travel the world.',
          vietnamese: 'Nếu tôi có nhiều tiền hơn, tôi sẽ đi du lịch khắp thế giới.'
        },
        {
          name: 'Third Conditional',
          structure: 'If + past perfect, would have + past participle',
          use: 'Unreal past situations',
          example: 'If I had studied harder, I would have passed the exam.',
          vietnamese: 'Nếu tôi đã học chăm chỉ hơn, tôi đã thi đậu rồi.'
        }
      ]
    },
    exercises: [
      {
        question: 'Complete the sentence: If I _______ (have) time tomorrow, I _______ (help) you.',
        options: ['had / would help', 'have / will help', 'will have / help', 'would have / helped'],
        correct: 1,
        explanation: 'This is a first conditional expressing a real future possibility.'
      },
      {
        question: 'Which conditional type is this: "If water reaches 0°C, it freezes"?',
        options: ['First conditional', 'Zero conditional', 'Second conditional', 'Third conditional'],
        correct: 1,
        explanation: 'Zero conditional is used for general truths and scientific facts.'
      },
      {
        question: 'Complete: If she _______ (not miss) the train, she _______ (arrive) on time.',
        options: ["didn't miss / would arrive", "hadn't missed / would have arrived", "doesn't miss / will arrive", "won't miss / arrives"],
        correct: 1,
        explanation: 'Third conditional expresses an unreal past situation and its consequence.'
      }
    ]
  },
  'present-simple': {
    theory: {
      introduction: 'Present Simple is used for facts, habits, routines, and general truths.',
      types: [
        {
          name: 'Facts and General Truths',
          structure: 'Subject + base verb (+ s/es for 3rd person)',
          use: 'Permanent situations, facts',
          example: 'The sun rises in the east.',
          vietnamese: 'Mặt trời mọc ở phía đông.'
        },
        {
          name: 'Habits and Routines',
          structure: 'Subject + base verb (+ s/es for 3rd person)',
          use: 'Regular activities',
          example: 'I drink coffee every morning.',
          vietnamese: 'Tôi uống cà phê mỗi sáng.'
        },
        {
          name: 'Scheduled Events',
          structure: 'Subject + base verb (+ s/es for 3rd person)',
          use: 'Timetables, schedules',
          example: 'The train leaves at 9 AM.',
          vietnamese: 'Tàu khởi hành lúc 9 giờ sáng.'
        }
      ]
    },
    exercises: [
      {
        question: 'She _______ (work) in a bank.',
        options: ['work', 'works', 'working', 'worked'],
        correct: 1,
        explanation: 'Third person singular requires -s ending in present simple.'
      },
      {
        question: '_______ you _______ (like) pizza?',
        options: ['Are / liking', 'Do / like', 'Does / like', 'Did / like'],
        correct: 1,
        explanation: 'Present simple questions with "you" use "do" + base form.'
      },
      {
        question: 'Which sentence is correct in present simple?',
        options: ['He go to school every day', 'He goes to school every day', 'He is go to school every day', 'He going to school every day'],
        correct: 1,
        explanation: 'Third person singular (he, she, it) requires -s or -es ending in present simple.'
      },
      {
        question: 'Complete: They _______ (not watch) TV on weekdays.',
        options: ["don't watches", "doesn't watch", "don't watch", "not watch"],
        correct: 2,
        explanation: 'Negative present simple with plural subjects uses "don\'t" + base form.'
      },
      {
        question: 'How often _______ you _______ (exercise)?',
        options: ['are / exercising', 'do / exercise', 'does / exercise', 'did / exercise'],
        correct: 1,
        explanation: 'Questions about frequency in present simple use "How often do/does" + base form.'
      },
      {
        question: 'The museum _______ (open) at 9 AM every day.',
        options: ['open', 'opens', 'is opening', 'opened'],
        correct: 1,
        explanation: 'Scheduled events and timetables use present simple with third person -s ending.'
      },
      {
        question: 'Select the correct sentence:',
        options: ['Water is boil at 100°C', 'Water boils at 100°C', 'Water boiling at 100°C', 'Water will boil at 100°C'],
        correct: 1,
        explanation: 'Scientific facts and general truths use present simple tense.'
      }
    ]
  },
  'past-simple': {
    theory: {
      introduction: 'Past Simple is used to describe completed actions in the past, often with specific time references.',
      types: [
        {
          name: 'Regular Verbs',
          structure: 'Subject + verb + -ed',
          use: 'Most verbs add -ed to form past simple',
          example: 'I walked to school yesterday.',
          vietnamese: 'Tôi đã đi bộ đến trường hôm qua.'
        },
        {
          name: 'Irregular Verbs',
          structure: 'Subject + irregular past form',
          use: 'Some verbs have special past forms',
          example: 'She went to Paris last month.',
          vietnamese: 'Cô ấy đã đi Paris tháng trước.'
        },
        {
          name: 'Negative Form',
          structure: 'Subject + did not (didn\'t) + base verb',
          use: 'To express negative past actions',
          example: 'They didn\'t come to the party.',
          vietnamese: 'Họ đã không đến bữa tiệc.'
        },
        {
          name: 'Question Form',
          structure: 'Did + subject + base verb?',
          use: 'To ask about past actions',
          example: 'Did you see the movie?',
          vietnamese: 'Bạn đã xem phim chưa?'
        }
      ]
    },
    exercises: [
      {
        question: 'I _______ (visit) my grandmother last weekend.',
        options: ['visit', 'visited', 'was visiting', 'have visited'],
        correct: 1,
        explanation: 'Past simple is used for completed actions in the past with specific time reference.'
      },
      {
        question: 'She _______ (not go) to work yesterday because she was sick.',
        options: ["didn't went", "didn't go", "wasn't go", "not went"],
        correct: 1,
        explanation: 'Negative past simple uses "didn\'t" + base form of the verb.'
      },
      {
        question: '_______ you _______ (finish) your homework last night?',
        options: ['Were / finishing', 'Did / finish', 'Have / finished', 'Do / finish'],
        correct: 1,
        explanation: 'Past simple questions use "Did" + subject + base form of the verb.'
      },
      {
        question: 'Which sentence is correct?',
        options: ['He buyed a new car', 'He bought a new car', 'He has bought a new car yesterday', 'He was bought a new car'],
        correct: 1,
        explanation: '"Buy" is an irregular verb. The past simple form is "bought", not "buyed".'
      },
      {
        question: 'The children _______ (play) in the park all afternoon.',
        options: ['play', 'played', 'were play', 'playing'],
        correct: 1,
        explanation: 'Regular verbs form past simple by adding -ed to the base form.'
      },
      {
        question: 'Complete: We _______ (be) very happy at the wedding.',
        options: ['was', 'were', 'are', 'been'],
        correct: 1,
        explanation: 'The past simple of "be" is "was" for I/he/she/it and "were" for you/we/they.'
      },
      {
        question: '_______ it _______ (rain) heavily last night?',
        options: ['Was / raining', 'Did / rain', 'Does / rain', 'Is / raining'],
        correct: 1,
        explanation: 'Questions in past simple use "Did" + base form, even for weather verbs.'
      },
      {
        question: 'My father _______ (teach) me how to drive when I was 18.',
        options: ['teach', 'taught', 'teached', 'was teach'],
        correct: 1,
        explanation: '"Teach" is irregular. The past simple form is "taught", not "teached".'
      },
      {
        question: 'They _______ (not have) enough money to buy the house.',
        options: ["didn't had", "didn't have", "not had", "weren't have"],
        correct: 1,
        explanation: 'Negative past simple with "have" uses "didn\'t have", not "didn\'t had".'
      },
      {
        question: 'What time _______ the movie _______ (start) yesterday?',
        options: ['was / starting', 'did / start', 'does / start', 'is / starting'],
        correct: 1,
        explanation: 'Wh-questions in past simple use "did" + base form of the verb.'
      },
      {
        question: 'Last summer, we _______ (travel) to five different countries.',
        options: ['travel', 'traveled', 'travelling', 'were travel'],
        correct: 1,
        explanation: 'Regular verbs add -ed for past simple. "Travel" becomes "traveled".'
      },
      {
        question: 'Select the incorrect sentence:',
        options: ['She arrived at 6 PM', 'He didn\'t call me', 'They goed to the store', 'We watched a movie'],
        correct: 2,
        explanation: '"Go" is irregular. The correct past simple form is "went", not "goed".'
      }
    ]
  },
  'present-continuous': {
    theory: {
      introduction: 'Present Continuous (Progressive) is used for actions happening now or temporary situations.',
      types: [
        {
          name: 'Actions Happening Now',
          structure: 'Subject + am/is/are + verb-ing',
          use: 'Actions in progress at the moment of speaking',
          example: 'I am reading a book right now.',
          vietnamese: 'Tôi đang đọc sách ngay bây giờ.'
        },
        {
          name: 'Temporary Situations',
          structure: 'Subject + am/is/are + verb-ing',
          use: 'Situations that are temporary, not permanent',
          example: 'She is staying with friends this week.',
          vietnamese: 'Tuần này cô ấy đang ở với bạn bè.'
        },
        {
          name: 'Future Arrangements',
          structure: 'Subject + am/is/are + verb-ing',
          use: 'Fixed plans and arrangements for the near future',
          example: 'We are meeting at 7 PM tomorrow.',
          vietnamese: 'Chúng tôi sẽ gặp nhau lúc 7 giờ tối mai.'
        },
        {
          name: 'Changing Situations',
          structure: 'Subject + am/is/are + verb-ing',
          use: 'Situations that are changing or developing',
          example: 'The weather is getting warmer.',
          vietnamese: 'Thời tiết đang trở nên ấm hơn.'
        }
      ]
    },
    exercises: [
      {
        question: 'Look! The children _______ (play) in the garden.',
        options: ['play', 'plays', 'are playing', 'played'],
        correct: 2,
        explanation: 'Present continuous is used for actions happening at the moment of speaking.'
      },
      {
        question: 'She _______ (not work) today because it\'s a holiday.',
        options: ['is not work', 'isn\'t working', 'doesn\'t work', 'not working'],
        correct: 1,
        explanation: 'Negative present continuous uses "am/is/are not" + verb-ing.'
      },
      {
        question: '_______ you _______ (listen) to music?',
        options: ['Do / listen', 'Are / listening', 'Is / listening', 'Did / listen'],
        correct: 1,
        explanation: 'Questions in present continuous use "Am/Is/Are" + subject + verb-ing.'
      },
      {
        question: 'I can\'t talk now. I _______ (drive).',
        options: ['drive', 'am driving', 'drives', 'drove'],
        correct: 1,
        explanation: 'Present continuous shows an action in progress at the time of speaking.'
      },
      {
        question: 'What _______ she _______ (do) these days?',
        options: ['does / do', 'is / doing', 'did / do', 'will / do'],
        correct: 1,
        explanation: 'Present continuous is used for temporary situations or current activities.'
      },
      {
        question: 'The company _______ (expand) rapidly this year.',
        options: ['expand', 'expands', 'is expanding', 'expanded'],
        correct: 2,
        explanation: 'Present continuous describes ongoing changes or developments.'
      },
      {
        question: 'We _______ (have) dinner at 8 PM tonight. (arrangement)',
        options: ['have', 'has', 'are having', 'will have'],
        correct: 2,
        explanation: 'Present continuous can express fixed future arrangements.'
      },
      {
        question: 'Which verb is NOT usually used in continuous form?',
        options: ['run', 'know', 'eat', 'work'],
        correct: 1,
        explanation: 'Stative verbs like "know" are not typically used in continuous forms.'
      },
      {
        question: 'It _______ (rain) heavily right now.',
        options: ['rain', 'rains', 'is raining', 'rained'],
        correct: 2,
        explanation: 'Weather conditions happening now use present continuous.'
      },
      {
        question: 'The students _______ (not pay) attention to the teacher.',
        options: ['don\'t pay', 'aren\'t paying', 'isn\'t paying', 'not paying'],
        correct: 1,
        explanation: 'Negative present continuous with plural subjects uses "aren\'t" + verb-ing.'
      }
    ]
  },
  'modal-verbs': {
    theory: {
      introduction: 'Modal verbs express ability, possibility, permission, obligation, and advice. They don\'t change form and are followed by bare infinitive.',
      types: [
        {
          name: 'Can/Could',
          structure: 'Subject + can/could + base verb',
          use: 'Ability, possibility, permission',
          example: 'I can swim. Could you help me?',
          vietnamese: 'Tôi có thể bơi. Bạn có thể giúp tôi không?'
        },
        {
          name: 'May/Might',
          structure: 'Subject + may/might + base verb',
          use: 'Possibility, formal permission',
          example: 'It may rain later. May I come in?',
          vietnamese: 'Trời có thể mưa sau. Tôi có thể vào không?'
        },
        {
          name: 'Must/Have to',
          structure: 'Subject + must/have to + base verb',
          use: 'Strong obligation, necessity',
          example: 'You must wear a seatbelt.',
          vietnamese: 'Bạn phải thắt dây an toàn.'
        },
        {
          name: 'Should/Ought to',
          structure: 'Subject + should/ought to + base verb',
          use: 'Advice, recommendation',
          example: 'You should study harder.',
          vietnamese: 'Bạn nên học chăm chỉ hơn.'
        }
      ]
    },
    exercises: [
      {
        question: 'I _______ speak three languages fluently.',
        options: ['can', 'could', 'may', 'must'],
        correct: 0,
        explanation: '"Can" expresses present ability.'
      },
      {
        question: '_______ I borrow your pen, please?',
        options: ['Can', 'Must', 'Should', 'Have to'],
        correct: 0,
        explanation: '"Can" is used for informal requests and asking permission.'
      },
      {
        question: 'Students _______ wear uniforms at this school.',
        options: ['can', 'may', 'must', 'could'],
        correct: 2,
        explanation: '"Must" expresses strong obligation or rules.'
      },
      {
        question: 'You _______ see a doctor about that cough.',
        options: ['can', 'may', 'must', 'should'],
        correct: 3,
        explanation: '"Should" is used for giving advice and recommendations.'
      },
      {
        question: 'It _______ be sunny tomorrow, but I\'m not sure.',
        options: ['can', 'might', 'must', 'should'],
        correct: 1,
        explanation: '"Might" expresses possibility when you\'re not certain.'
      },
      {
        question: 'When I was young, I _______ run very fast.',
        options: ['can', 'could', 'may', 'must'],
        correct: 1,
        explanation: '"Could" expresses past ability.'
      },
      {
        question: '_______ you please close the window?',
        options: ['Can', 'Could', 'May', 'Must'],
        correct: 1,
        explanation: '"Could" is more polite than "can" for requests.'
      },
      {
        question: 'You _______ not smoke in this area.',
        options: ['can', 'may', 'must', 'should'],
        correct: 2,
        explanation: '"Must not" expresses prohibition or things that are not allowed.'
      },
      {
        question: 'She _______ be at home. Her car is in the driveway.',
        options: ['can', 'may', 'must', 'could'],
        correct: 2,
        explanation: '"Must" expresses logical deduction when you\'re almost certain.'
      },
      {
        question: 'We _______ leave early tomorrow to avoid traffic.',
        options: ['can', 'may', 'ought to', 'could'],
        correct: 2,
        explanation: '"Ought to" gives advice or recommendation about what is best to do.'
      }
    ]
  },
  'present-perfect': {
    theory: {
      introduction: 'Present Perfect connects past actions or experiences with the present moment. It emphasizes the result or relevance to now.',
      types: [
        {
          name: 'Life Experiences',
          structure: 'Subject + have/has + past participle',
          use: 'Experiences up to now, without specific time',
          example: 'I have been to Japan three times.',
          vietnamese: 'Tôi đã đến Nhật Bản ba lần.'
        },
        {
          name: 'Completed Actions with Present Result',
          structure: 'Subject + have/has + past participle',
          use: 'Past actions that affect the present',
          example: 'She has finished her homework.',
          vietnamese: 'Cô ấy đã hoàn thành bài tập về nhà.'
        },
        {
          name: 'Actions Continuing to Present',
          structure: 'Subject + have/has + past participle + for/since',
          use: 'Actions that started in the past and continue',
          example: 'We have lived here for five years.',
          vietnamese: 'Chúng tôi đã sống ở đây được năm năm.'
        },
        {
          name: 'Recent Actions',
          structure: 'Subject + have/has + just + past participle',
          use: 'Actions that happened very recently',
          example: 'He has just arrived.',
          vietnamese: 'Anh ấy vừa mới đến.'
        }
      ]
    },
    exercises: [
      {
        question: 'I _______ (never visit) Australia.',
        options: ['never visited', 'have never visited', 'never have visited', 'am never visiting'],
        correct: 1,
        explanation: 'Present perfect is used for life experiences with "never".'
      },
      {
        question: 'She _______ (live) in London since 2015.',
        options: ['lived', 'has lived', 'is living', 'lives'],
        correct: 1,
        explanation: 'Present perfect with "since" shows duration from a specific point to now.'
      },
      {
        question: '_______ you _______ (finish) your project yet?',
        options: ['Did / finish', 'Have / finished', 'Are / finishing', 'Do / finish'],
        correct: 1,
        explanation: 'Present perfect questions with "yet" ask about completion up to now.'
      },
      {
        question: 'We _______ (just move) to a new apartment.',
        options: ['just moved', 'have just moved', 'are just moving', 'just move'],
        correct: 1,
        explanation: 'Present perfect with "just" indicates very recent completion.'
      },
      {
        question: 'How long _______ you _______ (study) English?',
        options: ['do / study', 'are / studying', 'have / studied', 'did / study'],
        correct: 2,
        explanation: '"How long" questions about duration use present perfect.'
      },
      {
        question: 'I _______ (not see) him today.',
        options: ["didn't see", "haven't seen", "am not seeing", "don't see"],
        correct: 1,
        explanation: 'Present perfect negative with unfinished time periods like "today".'
      },
      {
        question: 'They _______ (already eat) dinner.',
        options: ['already ate', 'have already eaten', 'are already eating', 'already eat'],
        correct: 1,
        explanation: 'Present perfect with "already" shows completion before expected time.'
      },
      {
        question: 'Choose the correct sentence:',
        options: ['I have been to Paris last year', 'I went to Paris last year', 'I have gone to Paris last year', 'I am being to Paris last year'],
        correct: 1,
        explanation: 'Past simple is used with specific past time references like "last year".'
      },
      {
        question: 'The movie _______ (start). We\'re too late.',
        options: ['started', 'has started', 'is starting', 'starts'],
        correct: 1,
        explanation: 'Present perfect shows a past action with present relevance (we missed it).'
      },
      {
        question: '_______ she ever _______ (travel) alone?',
        options: ['Did / travel', 'Has / traveled', 'Is / traveling', 'Does / travel'],
        correct: 1,
        explanation: 'Present perfect with "ever" asks about experiences in someone\'s life.'
      }
    ]
  },
  'passive-voice': {
    theory: {
      introduction: 'Passive voice is used when the focus is on the action rather than who performs it. The object of the active sentence becomes the subject of the passive sentence.',
      types: [
        {
          name: 'Present Passive',
          structure: 'Subject + am/is/are + past participle',
          use: 'For actions happening regularly or general facts',
          example: 'English is spoken worldwide.',
          vietnamese: 'Tiếng Anh được nói trên toàn thế giới.'
        },
        {
          name: 'Past Passive',
          structure: 'Subject + was/were + past participle',
          use: 'For completed actions in the past',
          example: 'The house was built in 1995.',
          vietnamese: 'Ngôi nhà được xây năm 1995.'
        },
        {
          name: 'Future Passive',
          structure: 'Subject + will be + past participle',
          use: 'For future actions',
          example: 'The project will be completed next month.',
          vietnamese: 'Dự án sẽ được hoàn thành vào tháng tới.'
        },
        {
          name: 'Modal Passive',
          structure: 'Subject + modal + be + past participle',
          use: 'With modal verbs for ability, possibility, etc.',
          example: 'This problem can be solved easily.',
          vietnamese: 'Vấn đề này có thể được giải quyết dễ dàng.'
        }
      ]
    },
    exercises: [
      {
        question: 'People speak Spanish in many countries. → Spanish _______ in many countries.',
        options: ['speaks', 'is spoken', 'is speaking', 'spoke'],
        correct: 1,
        explanation: 'Present passive uses "is/are + past participle" for general facts.'
      },
      {
        question: 'They built this bridge last year. → This bridge _______ last year.',
        options: ['built', 'was built', 'is built', 'has been built'],
        correct: 1,
        explanation: 'Past passive uses "was/were + past participle" for completed past actions.'
      },
      {
        question: 'The company will announce the results tomorrow. → The results _______ tomorrow.',
        options: ['will announce', 'will be announced', 'are announced', 'were announced'],
        correct: 1,
        explanation: 'Future passive uses "will be + past participle".'
      },
      {
        question: 'You should clean your room. → Your room _______.',
        options: ['should clean', 'should be cleaned', 'should cleaned', 'should be clean'],
        correct: 1,
        explanation: 'Modal passive uses "modal + be + past participle".'
      },
      {
        question: 'Someone stole my bike. → My bike _______.',
        options: ['stole', 'was stolen', 'is stolen', 'has stolen'],
        correct: 1,
        explanation: 'Past passive when the doer is unknown or unimportant.'
      },
      {
        question: 'They are repairing the road. → The road _______ repaired.',
        options: ['is', 'is being', 'was', 'has been'],
        correct: 1,
        explanation: 'Present continuous passive uses "is/are being + past participle".'
      },
      {
        question: 'We must finish this work today. → This work _______ today.',
        options: ['must finish', 'must be finished', 'must finished', 'must be finish'],
        correct: 1,
        explanation: 'Modal passive shows necessity or obligation.'
      },
      {
        question: 'Choose the incorrect sentence:',
        options: ['The letter was written by John', 'The book is being read', 'The car was bought yesterday', 'The homework was did carefully'],
        correct: 3,
        explanation: 'Past participle of "do" is "done", not "did". Correct: "was done".'
      },
      {
        question: 'Nobody has seen him for days. → He _______ for days.',
        options: ["hasn't seen", "hasn't been seen", "wasn't seen", "isn't seen"],
        correct: 1,
        explanation: 'Present perfect passive uses "have/has been + past participle".'
      },
      {
        question: 'They might cancel the meeting. → The meeting _______.',
        options: ['might cancel', 'might be canceled', 'might canceled', 'might be cancel'],
        correct: 1,
        explanation: 'Modal passive with "might" expresses possibility.'
      }
    ]
  },
  'reported-speech': {
    theory: {
      introduction: 'Reported speech (indirect speech) is used to tell someone what another person said without using their exact words.',
      types: [
        {
          name: 'Statements',
          structure: 'Subject + said (that) + reported statement',
          use: 'To report what someone said',
          example: '"I am tired" → He said (that) he was tired.',
          vietnamese: 'Anh ấy nói rằng anh ấy mệt.'
        },
        {
          name: 'Questions',
          structure: 'Subject + asked + if/whether/wh-word + statement order',
          use: 'To report questions',
          example: '"Are you coming?" → She asked if I was coming.',
          vietnamese: 'Cô ấy hỏi liệu tôi có đến không.'
        },
        {
          name: 'Commands/Requests',
          structure: 'Subject + told/asked + object + (not) to + infinitive',
          use: 'To report commands or requests',
          example: '"Close the door" → He told me to close the door.',
          vietnamese: 'Anh ấy bảo tôi đóng cửa.'
        },
        {
          name: 'Time/Place Changes',
          structure: 'Various changes needed',
          use: 'Adjust references to time and place',
          example: '"I saw him yesterday" → She said she had seen him the day before.',
          vietnamese: 'Cô ấy nói cô ấy đã gặp anh ấy ngày hôm trước.'
        }
      ]
    },
    exercises: [
      {
        question: '"I love chocolate." → She said _______.',
        options: ['she loves chocolate', 'she loved chocolate', 'I love chocolate', 'I loved chocolate'],
        correct: 1,
        explanation: 'Present tense changes to past tense in reported speech.'
      },
      {
        question: '"Where do you live?" → He asked me _______.',
        options: ['where do I live', 'where I lived', 'where I live', 'where did I live'],
        correct: 1,
        explanation: 'Reported questions use statement word order and tense changes.'
      },
      {
        question: '"Don\'t touch that!" → She told me _______.',
        options: ['not to touch that', "don't touch that", 'not touch that', 'to not touch that'],
        correct: 0,
        explanation: 'Negative commands in reported speech use "told + object + not to + infinitive".'
      },
      {
        question: '"I will call you tomorrow." → He said _______.',
        options: ['he will call me tomorrow', 'he would call me the next day', 'I will call you tomorrow', 'he would call me tomorrow'],
        correct: 1,
        explanation: '"Will" becomes "would" and "tomorrow" becomes "the next day".'
      },
      {
        question: '"Are you feeling better?" → She asked _______.',
        options: ['am I feeling better', 'if I was feeling better', 'if I am feeling better', 'was I feeling better'],
        correct: 1,
        explanation: 'Yes/No questions in reported speech use "if" or "whether" + statement order.'
      },
      {
        question: '"I have finished my work." → He said _______.',
        options: ['he has finished his work', 'he had finished his work', 'he finished his work', 'I have finished my work'],
        correct: 1,
        explanation: 'Present perfect changes to past perfect in reported speech.'
      },
      {
        question: '"Can you help me?" → She asked _______.',
        options: ['can I help her', 'if I can help her', 'if I could help her', 'could I help her'],
        correct: 2,
        explanation: '"Can" changes to "could" in reported speech questions.'
      },
      {
        question: '"I saw him here yesterday." → She said _______.',
        options: ['she saw him here yesterday', 'she had seen him there the day before', 'she saw him there yesterday', 'I saw him here yesterday'],
        correct: 1,
        explanation: 'Past tense → past perfect, "here" → "there", "yesterday" → "the day before".'
      },
      {
        question: '"What time is it?" → He asked _______.',
        options: ['what time is it', 'what time it was', 'what time was it', 'what time it is'],
        correct: 1,
        explanation: 'Wh-questions in reported speech use statement order with tense changes.'
      },
      {
        question: '"Please sit down." → She asked me _______.',
        options: ['please sit down', 'to sit down', 'sit down', 'if I sit down'],
        correct: 1,
        explanation: 'Polite requests in reported speech use "asked + object + to + infinitive".'
      }
    ]
  },
  'relative-clauses': {
    theory: {
      introduction: 'Relative clauses provide additional information about nouns. They use relative pronouns like who, which, that, whose, where, when.',
      types: [
        {
          name: 'Defining Relative Clauses',
          structure: 'Noun + relative pronoun + clause (no commas)',
          use: 'Essential information to identify the noun',
          example: 'The man who lives next door is a doctor.',
          vietnamese: 'Người đàn ông sống bên cạnh là bác sĩ.'
        },
        {
          name: 'Non-defining Relative Clauses',
          structure: 'Noun, + relative pronoun + clause, (with commas)',
          use: 'Extra information about an already identified noun',
          example: 'My brother, who lives in London, is a teacher.',
          vietnamese: 'Anh trai tôi, người sống ở London, là một giáo viên.'
        },
        {
          name: 'Relative Pronouns',
          structure: 'who (people), which (things), that (both), whose (possession)',
          use: 'Different pronouns for different functions',
          example: 'The book that/which I bought is interesting.',
          vietnamese: 'Cuốn sách mà tôi mua rất thú vị.'
        },
        {
          name: 'Relative Adverbs',
          structure: 'where (place), when (time), why (reason)',
          use: 'For place, time, and reason',
          example: 'This is the place where we first met.',
          vietnamese: 'Đây là nơi chúng ta gặp nhau lần đầu.'
        }
      ]
    },
    exercises: [
      {
        question: 'The woman _______ is talking to John is my sister.',
        options: ['who', 'which', 'whose', 'where'],
        correct: 0,
        explanation: '"Who" is used for people as the subject of the defining relative clause.'
      },
      {
        question: 'This is the book _______ I told you about.',
        options: ['who', 'which', 'whose', 'where'],
        correct: 1,
        explanation: '"Which" is used for things. "That" would also be correct here.'
      },
      {
        question: 'The car _______ door is broken belongs to my neighbor.',
        options: ['who', 'which', 'whose', 'that'],
        correct: 2,
        explanation: '"Whose" shows possession - the door belongs to the car.'
      },
      {
        question: 'My teacher, _______ has been teaching for 20 years, is retiring.',
        options: ['who', 'which', 'that', 'whose'],
        correct: 0,
        explanation: 'Non-defining relative clause (with commas) for a person uses "who".'
      },
      {
        question: 'This is the restaurant _______ we had dinner last night.',
        options: ['which', 'that', 'where', 'when'],
        correct: 2,
        explanation: '"Where" is used for places in relative clauses.'
      },
      {
        question: 'I remember the day _______ we graduated.',
        options: ['which', 'that', 'where', 'when'],
        correct: 3,
        explanation: '"When" is used for time references in relative clauses.'
      },
      {
        question: 'The people _______ live upstairs are very noisy.',
        options: ['who', 'which', 'whose', 'where'],
        correct: 0,
        explanation: '"Who" is used for people in defining relative clauses.'
      },
      {
        question: 'Choose the correct sentence:',
        options: ['The man, that I met yesterday, was kind', 'The man that I met yesterday was kind', 'The man who I met yesterday, was kind', 'The man, who I met yesterday was kind'],
        correct: 1,
        explanation: 'Defining relative clauses don\'t use commas. "That" is correct for defining clauses.'
      },
      {
        question: 'London, _______ is the capital of England, has many tourists.',
        options: ['who', 'which', 'that', 'where'],
        correct: 1,
        explanation: 'Non-defining relative clause for a place uses "which", not "that".'
      },
      {
        question: 'Is this the reason _______ you left early?',
        options: ['which', 'that', 'why', 'when'],
        correct: 2,
        explanation: '&quot;Why&quot; is used for reasons in relative clauses.'
      }
    ]
  }
}

export default function GrammarLessonContent({ lesson, lessonData }: Props) {
  const [currentSection, setCurrentSection] = useState<'theory' | 'exercises'>('theory')
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)

  // Get content from static lessons or generate for daily lessons
  let content = LESSON_CONTENT[lesson]
  
  // If no static content and this is daily content, generate it
  if (!content && lessonData.isDailyContent && lessonData.topic) {
    content = generateDailyLessonContent(lessonData.topic, lessonData.day || 1)
  }
  
  if (!content) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Lesson Content Coming Soon
        </h3>
        <p className="text-gray-600 mb-6">
          We&apos;re working on creating comprehensive content for {lessonData.title}.
        </p>
        <Link 
          href="/grammar"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Grammar Lessons
        </Link>
      </div>
    )
  }

  const handleAnswerSelect = (exerciseIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [exerciseIndex]: answerIndex
    }))
  }

  const checkAnswers = () => {
    setShowResults(true)
  }

  const resetExercises = () => {
    setSelectedAnswers({})
    setShowResults(false)
  }

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex border-b">
          <button
            onClick={() => setCurrentSection('theory')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
              currentSection === 'theory'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Theory & Examples
          </button>
          <button
            onClick={() => setCurrentSection('exercises')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
              currentSection === 'exercises'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <PenTool className="w-5 h-5" />
            Practice Exercises
          </button>
        </div>

        {/* Theory Section */}
        {currentSection === 'theory' && (
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-8">
                {content.theory.introduction}
              </p>

              <div className="space-y-8">
                {content.theory.types.map((type: TheoryType, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {type.name}
                    </h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Structure:</h4>
                          <code className="bg-white px-3 py-1 rounded text-blue-600">
                            {type.structure}
                          </code>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Use:</h4>
                          <p className="text-gray-700">{type.use}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Example:</h4>
                      <p className="text-gray-900 mb-2">🇬🇧 {type.example}</p>
                      <p className="text-gray-600">🇻🇳 {type.vietnamese}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Exercises Section */}
        {currentSection === 'exercises' && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Practice Exercises
              </h3>
              <p className="text-gray-600">
                Test your understanding with these exercises.
              </p>
            </div>

            <div className="space-y-6">
              {content.exercises.map((exercise: Exercise, exerciseIndex: number) => (
                <div key={exerciseIndex} className="border rounded-lg p-6">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Question {exerciseIndex + 1}:
                    </h4>
                    <p className="text-lg text-gray-800">{exercise.question}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {exercise.options.map((option: string, optionIndex: number) => (
                      <label
                        key={optionIndex}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedAnswers[exerciseIndex] === optionIndex
                            ? showResults
                              ? optionIndex === exercise.correct
                                ? 'border-green-500 bg-green-50'
                                : 'border-red-500 bg-red-50'
                              : 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`exercise-${exerciseIndex}`}
                          value={optionIndex}
                          checked={selectedAnswers[exerciseIndex] === optionIndex}
                          onChange={() => handleAnswerSelect(exerciseIndex, optionIndex)}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswers[exerciseIndex] === optionIndex
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedAnswers[exerciseIndex] === optionIndex && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-800">{option}</span>
                          {showResults && optionIndex === exercise.correct && (
                            <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                          )}
                          {showResults && 
                           selectedAnswers[exerciseIndex] === optionIndex && 
                           optionIndex !== exercise.correct && (
                            <XCircle className="w-5 h-5 text-red-600 ml-auto" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  {showResults && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Explanation:</h5>
                      <p className="text-gray-700">{exercise.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              {!showResults ? (
                <button
                  onClick={checkAnswers}
                  disabled={Object.keys(selectedAnswers).length < content.exercises.length}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Check Answers
                </button>
              ) : (
                <button
                  onClick={resetExercises}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Try Again
                </button>
              )}
              <Link
                href="/grammar"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Lessons
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}