import fs from "fs/promises";

/**
 * Curates news.json into BIZ (dev/engineering) and BUZZ (AI/tools) feeds
 * for the ticker ribbon at the bottom of the site.
 */

// Keywords for filtering AI engineering and dev tools content
const BIZ_KEYWORDS = [
  'github', 'git', 'ci/cd', 'deploy', 'docker', 'kubernetes', 'container',
  'api', 'rest', 'graphql', 'typescript', 'javascript', 'python', 'node',
  'react', 'nextjs', 'vercel', 'aws', 'azure', 'cloud', 'serverless',
  'performance', 'optimization', 'security', 'testing', 'dev', 'developer',
  'engineering', 'csp', 'lcp', 'web vitals', 'build', 'bundle'
];

const BUZZ_KEYWORDS = [
  'ai', 'ml', 'llm', 'gpt', 'claude', 'openai', 'anthropic', 'chatgpt',
  'agent', 'agents', 'langchain', 'llama', 'mistral', 'gemini', 'copilot',
  'embedding', 'vector', 'rag', 'prompt', 'fine-tune', 'inference',
  'transformer', 'model', 'neural', 'deep learning', 'machine learning',
  'sdk', 'api', 'assistant', 'automation', 'agentic', 'reasoning'
];

function scoreItem(item, keywords) {
  const text = `${item.title} ${item.url}`.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (text.includes(kw.toLowerCase())) {
      score++;
    }
  }
  return score;
}

function toTickerFormat(item) {
  return {
    t: item.title,
    u: item.url
  };
}

try {
  // Read news.json
  const newsData = JSON.parse(await fs.readFile("news.json", "utf8"));

  // Score and filter items
  const scoredItems = newsData.map(item => ({
    ...item,
    bizScore: scoreItem(item, BIZ_KEYWORDS),
    buzzScore: scoreItem(item, BUZZ_KEYWORDS)
  }));

  // BIZ feed: development, engineering, tools
  const bizItems = scoredItems
    .filter(item => item.bizScore > 0)
    .sort((a, b) => b.bizScore - a.bizScore)
    .slice(0, 15)
    .map(toTickerFormat);

  // BUZZ feed: AI, ML, agents, LLMs
  const buzzItems = scoredItems
    .filter(item => item.buzzScore > 0)
    .sort((a, b) => b.buzzScore - a.buzzScore)
    .slice(0, 15)
    .map(toTickerFormat);

  // Fallback content if feeds are empty
  const bizFallback = [
    { t: "Building with modern dev tools and platforms", u: "/" },
    { t: "Engineering excellence through automation", u: "/" }
  ];

  const buzzFallback = [
    { t: "AI agents transforming software development", u: "/" },
    { t: "From conception to deployment with AI assistance", u: "/" }
  ];

  const finalBiz = bizItems.length > 0 ? bizItems : bizFallback;
  const finalBuzz = buzzItems.length > 0 ? buzzItems : buzzFallback;

  // Write to web/data directory
  await fs.writeFile("web/data/biz_feed.json", JSON.stringify(finalBiz, null, 2));
  await fs.writeFile("web/data/buzz_feed.json", JSON.stringify(finalBuzz, null, 2));

  console.log(`✓ BIZ feed: ${finalBiz.length} items`);
  console.log(`✓ BUZZ feed: ${finalBuzz.length} items`);

} catch (error) {
  console.error("Error curating feeds:", error.message);
  process.exit(1);
}
