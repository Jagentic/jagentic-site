import fs from "fs/promises";
import OpenAI from "openai";

/**
 * AI-powered quiz question generator
 *
 * Uses OpenAI API to generate quiz questions from curated news items.
 * Questions focus on AI engineering, development tools, and emerging technologies.
 *
 * Environment variables:
 * - OPENAI_API_KEY: Your OpenAI API key
 *
 * Usage:
 *   node scripts/ai-curate-quiz.mjs
 */

const SYSTEM_PROMPT = `You are an AI engineering educator creating quiz questions for developers learning about:
- AI agents and agentic frameworks
- OpenAI SDK and API usage
- Claude AI and Anthropic tools
- Modern development platforms (Vercel, GitHub, etc.)
- LLMs, embeddings, RAG, and AI architectures
- Developer tools and best practices

Generate engaging, educational quiz questions based on recent news and developments.
Each question should have 4 choices with only one correct answer.
Include a concise explanation (1-2 sentences) for the correct answer.

Return questions in this exact JSON format:
{
  "questions": [
    {
      "id": "unique_id",
      "category": "category_name",
      "question": "The question text?",
      "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
      "answer": 0,
      "explain": "Brief explanation of the correct answer."
    }
  ]
}`;

async function generateQuestions(newsItems, count = 5) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("⚠ OPENAI_API_KEY not set. Skipping AI quiz generation.");
    return null;
  }

  const openai = new OpenAI({ apiKey });

  // Prepare news context
  const newsContext = newsItems
    .slice(0, 10)
    .map((item, i) => `${i + 1}. ${item.title} (${item.source})`)
    .join('\n');

  const userPrompt = `Based on these recent tech news items, generate ${count} quiz questions:

${newsContext}

Focus on AI/ML developments, developer tools, and engineering practices.
Make questions educational and relevant to developers building with AI.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    const parsed = JSON.parse(response);

    return parsed.questions || [];
  } catch (error) {
    console.error("Error generating questions:", error.message);
    return null;
  }
}

async function main() {
  try {
    // Read news.json
    const newsData = JSON.parse(await fs.readFile("news.json", "utf8"));

    // Generate new questions
    console.log("🤖 Generating quiz questions with AI...");
    const newQuestions = await generateQuestions(newsData, 5);

    if (!newQuestions || newQuestions.length === 0) {
      console.log("No new questions generated.");
      return;
    }

    console.log(`✓ Generated ${newQuestions.length} new questions`);

    // Read existing questions
    const existingPath = "data/questions-ai-generated.json";
    let existingData = { items: [] };

    try {
      existingData = JSON.parse(await fs.readFile(existingPath, "utf8"));
    } catch {
      // File doesn't exist yet, will be created
    }

    // Add new questions (keep last 20 to avoid growing indefinitely)
    const allQuestions = [...newQuestions, ...existingData.items];
    const uniqueQuestions = Array.from(
      new Map(allQuestions.map(q => [q.id, q])).values()
    ).slice(0, 20);

    // Save updated questions
    await fs.writeFile(
      existingPath,
      JSON.stringify({ items: uniqueQuestions }, null, 2)
    );

    console.log(`✓ Saved to ${existingPath}`);
    console.log(`✓ Total AI-generated questions: ${uniqueQuestions.length}`);

  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
