#!/usr/bin/env node

/**
 * Quiz Curation Agent
 *
 * This agent uses OpenAI SDK to curate daily quiz questions based on:
 * - Recent tech news from news.json
 * - Content from the curated repository
 * - Current trends in AI, development, and technology
 *
 * Runs on a schedule via GitHub Actions to update quiz content.
 */

import OpenAI from 'openai';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const CURATED_DIR = 'content/curated';
const NEWS_FILE = 'news.json';
const QUIZ_CATEGORIES = ['biz', 'buzz'];

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Load recent news items for context
 */
async function loadRecentNews() {
  try {
    if (!existsSync(NEWS_FILE)) return [];
    const content = await fs.readFile(NEWS_FILE, 'utf-8');
    const news = JSON.parse(content);
    return news.slice(0, 10); // Top 10 most recent
  } catch (error) {
    console.error('Failed to load news:', error.message);
    return [];
  }
}

/**
 * Load existing curated content for context
 */
async function loadCuratedContext() {
  try {
    await fs.mkdir(CURATED_DIR, { recursive: true });
    const files = await fs.readdir(CURATED_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    if (jsonFiles.length === 0) return [];

    // Load the most recent curated file
    const latest = jsonFiles.sort().pop();
    const content = await fs.readFile(path.join(CURATED_DIR, latest), 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to load curated context:', error.message);
    return [];
  }
}

/**
 * Generate quiz questions using OpenAI SDK
 */
async function generateQuizQuestions(category, newsItems, existingQuestions) {
  const newsContext = newsItems.map(item =>
    `- ${item.title} (${item.source})`
  ).join('\n');

  const systemPrompt = `You are a quiz question curator for a tech-focused millionaire-style quiz game.

Category: ${category.toUpperCase()}
- BIZ: Technical questions about developer tools, Mac productivity, GitHub, APIs, coding best practices
- BUZZ: Pop culture, tech personalities, company news, trends, memes

Create 5 high-quality multiple choice questions based on recent tech news and current trends.

Requirements:
- Questions must be factual and have one clear correct answer
- 4 answer choices each (A, B, C, D)
- Mix of difficulty levels (easy, medium, hard)
- Include a brief explanation for the correct answer
- Keep questions concise and engaging
- Avoid questions too similar to existing ones

Format as JSON array with this structure:
[
  {
    "id": "unique-id",
    "type": "mcq",
    "category": "${category}",
    "difficulty": "easy|medium|hard",
    "question": "Question text?",
    "choices": ["A", "B", "C", "D"],
    "answer_index": 0-3,
    "explain": "Brief explanation",
    "source": "optional source URL",
    "tags": ["tag1", "tag2"]
  }
]`;

  const userPrompt = `Recent tech news for context:
${newsContext}

Generate 5 fresh, engaging quiz questions for the ${category.toUpperCase()} category.`;

  try {
    console.log(`Generating ${category} questions using OpenAI...`);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    const parsed = JSON.parse(response);

    // Handle both array and object with questions array
    const questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);

    console.log(`✓ Generated ${questions.length} ${category} questions`);
    return questions;

  } catch (error) {
    console.error(`Failed to generate ${category} questions:`, error.message);
    return [];
  }
}

/**
 * Save curated questions to timestamped file
 */
async function saveCuratedQuestions(questions) {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `curated-${timestamp}.json`;
  const filepath = path.join(CURATED_DIR, filename);

  await fs.mkdir(CURATED_DIR, { recursive: true });

  const output = {
    generated_at: new Date().toISOString(),
    total_questions: questions.length,
    categories: {
      biz: questions.filter(q => q.category === 'biz').length,
      buzz: questions.filter(q => q.category === 'buzz').length
    },
    questions
  };

  await fs.writeFile(filepath, JSON.stringify(output, null, 2));
  console.log(`\n✓ Saved ${questions.length} curated questions to ${filepath}`);

  return filepath;
}

/**
 * Update compiled packs with new questions
 */
async function updateCompiledPacks(newQuestions) {
  const compiledDir = 'content/compiled';

  for (const category of QUIZ_CATEGORIES) {
    const packFile = path.join(compiledDir, `pack.${category}.json`);

    try {
      let pack = { questions: [] };
      if (existsSync(packFile)) {
        const content = await fs.readFile(packFile, 'utf-8');
        pack = JSON.parse(content);
      }

      // Add new questions for this category
      const categoryQuestions = newQuestions.filter(q => q.category === category);
      pack.questions = [...(pack.questions || []), ...categoryQuestions];

      // Keep only the most recent 50 questions
      pack.questions = pack.questions.slice(-50);

      // Update metadata
      pack.pack_id = `${category}-compiled`;
      pack.mode = category;
      pack.version = 'r1';
      pack.last_updated = new Date().toISOString();

      await fs.writeFile(packFile, JSON.stringify(pack, null, 2));
      console.log(`✓ Updated ${packFile} (${pack.questions.length} questions)`);

    } catch (error) {
      console.error(`Failed to update ${packFile}:`, error.message);
    }
  }
}

/**
 * Main curation workflow
 */
async function main() {
  console.log('🤖 Quiz Curation Agent Starting...\n');

  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable not set');
    console.log('\nTo run locally: export OPENAI_API_KEY="your-key-here"');
    console.log('For GitHub Actions: Add OPENAI_API_KEY to repository secrets');
    process.exit(1);
  }

  // Load context
  console.log('Loading context...');
  const newsItems = await loadRecentNews();
  const existingQuestions = await loadCuratedContext();
  console.log(`✓ Loaded ${newsItems.length} news items`);
  console.log(`✓ Loaded ${existingQuestions.length} existing questions\n`);

  // Generate questions for each category
  const allQuestions = [];
  for (const category of QUIZ_CATEGORIES) {
    const questions = await generateQuizQuestions(category, newsItems, existingQuestions);
    allQuestions.push(...questions);
  }

  if (allQuestions.length === 0) {
    console.error('❌ No questions generated');
    process.exit(1);
  }

  // Save curated questions
  await saveCuratedQuestions(allQuestions);

  // Update compiled packs
  console.log('\nUpdating compiled packs...');
  await updateCompiledPacks(allQuestions);

  console.log('\n✅ Quiz curation complete!');
  console.log(`Generated ${allQuestions.length} new questions`);
  console.log(`Categories: BIZ=${allQuestions.filter(q => q.category === 'biz').length}, BUZZ=${allQuestions.filter(q => q.category === 'buzz').length}`);
}

// Run the agent
main().catch(error => {
  console.error('❌ Curation failed:', error);
  process.exit(1);
});
