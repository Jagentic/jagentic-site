import fs from "fs/promises";

const files = [
  "data/questions-openai.json",
  "data/questions-github.json",
  "data/questions-fundamentals.json",
  "data/questions-ai-generated.json"
];

const items = [];

for (const f of files) {
  try {
    const j = JSON.parse(await fs.readFile(f, "utf8"));
    if (Array.isArray(j.items)) items.push(...j.items);
  } catch {}
}

await fs.writeFile("quiz.json", JSON.stringify({ items }, null, 2));
console.log(`quiz.json built with ${items.length} items`);
