#!/usr/bin/env node

// Script to check all grammar lessons for missing content
const fs = require('fs');
const path = require('path');

// Read the grammar lesson content file
const contentFile = path.join(__dirname, 'src/components/GrammarLessonContent.tsx');
const content = fs.readFileSync(contentFile, 'utf8');

// Extract lesson topics directly
console.log('📁 Content structure analysis...\n');

// Extract all content keys from the entire file
const keyRegex = /'([^']+)':\s*\{/g;
const allKeys = [];
let match;
while ((match = keyRegex.exec(content)) !== null) {
  allKeys.push(match[1]);
}

// Separate content sections
const contentMapMatch = content.match(/const contentMap[^{]*\{([\s\S]*?)\n  \}/);
const exerciseMapMatch = content.match(/const exerciseMap[^{]*\{([\s\S]*?)\n  \}/);

const contentKeys = [];
const exerciseKeys = [];

if (contentMapMatch) {
  const contentRegex = /'([^']+)':\s*\{/g;
  let match;
  while ((match = contentRegex.exec(contentMapMatch[1])) !== null) {
    contentKeys.push(match[1]);
  }
}

if (exerciseMapMatch) {
  const exerciseRegex = /'([^']+)':\s*\[/g;
  let match;
  while ((match = exerciseRegex.exec(exerciseMapMatch[1])) !== null) {
    exerciseKeys.push(match[1]);
  }
}

console.log('📖 Content Topics Available:', contentKeys.length);
contentKeys.forEach(key => console.log(`  ✅ ${key}`));

console.log('\n🧪 Exercise Sets Available:', exerciseKeys.length);
exerciseKeys.forEach(key => console.log(`  ✅ ${key}`));

// Check for missing exercises
console.log('\n⚠️  Content without exercises:');
const missingExercises = contentKeys.filter(key => !exerciseKeys.includes(key));
if (missingExercises.length === 0) {
  console.log('  ✅ All content topics have exercises');
} else {
  missingExercises.forEach(key => console.log(`  ❌ ${key}`));
}

console.log('\n⚠️  Exercises without content:');
const missingContent = exerciseKeys.filter(key => !contentKeys.includes(key));
if (missingContent.length === 0) {
  console.log('  ✅ All exercises have content topics');
} else {
  missingContent.forEach(key => console.log(`  ❌ ${key}`));
}

// Check daily lesson structure
console.log('\n🗓️  Daily Lesson Structure:');
const baseTopics = [
  ['Present Simple & Continuous', 'Question Formation', 'Negative Sentences'],
  ['Past Simple & Continuous', 'Time Expressions', 'Irregular Verbs'],
  ['Present Perfect', 'Already/Yet/Just', 'Experience vs Finished Actions'],
  ['Future Forms', 'Will vs Going to', 'Present Continuous for Future'],
  ['Modal Verbs', 'Can/Could/May/Might', 'Permission & Possibility'],
  ['Conditional Sentences', 'First Conditional', 'If vs When'],
  ['Articles & Determiners', 'A/An/The Usage', 'Quantifiers']
];

baseTopics.forEach((week, weekIndex) => {
  console.log(`\n  Week ${weekIndex + 1}:`);
  week.forEach((topic, topicIndex) => {
    const hasContent = dailyContentKeys.includes(topic);
    const hasExercises = exerciseKeys.includes(topic);
    const status = hasContent && hasExercises ? '✅' : hasContent ? '⚠️' : '❌';
    console.log(`    Day ${weekIndex * 7 + topicIndex + 1}: ${topic} ${status} ${!hasContent ? '(no content)' : !hasExercises ? '(no exercises)' : ''}`);
  });
});

console.log('\n📊 Summary:');
console.log(`  📚 Static lessons: ${lessonKeys.length}`);
console.log(`  📖 With content: ${lessonKeys.length - missingStaticContent.length}`);
console.log(`  🧪 With exercises: ${staticContentKeys.length - missingExercises.length}`);
console.log(`  🗓️  Daily topics: ${dailyContentKeys.length}`);
console.log(`  📝 Daily exercises: ${exerciseKeys.filter(key => dailyContentKeys.includes(key)).length}`);