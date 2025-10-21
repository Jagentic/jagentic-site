# Content Curation System

## Overview

Jagentic uses an automated content curation system to keep the site fresh with relevant AI engineering and developer tool news.

## Components

### 1. News Fetching (`scripts/fetch-news.mjs`)

Fetches news from AI/dev-focused RSS feeds:
- OpenAI official news
- GitHub Blog
- Hacker News
- TechCrunch AI section
- The Verge AI coverage
- Anthropic news
- Google AI Blog
- LangChain Blog
- Simon Willison's blog

**Runs:** Every 30 minutes via GitHub Actions
**Output:** `news.json` (top 30 most recent items)

### 2. Feed Curation (`scripts/curate-feeds.mjs`)

Filters and categorizes news into two feeds:

**BIZ Feed** (Development & Engineering)
- Keywords: GitHub, CI/CD, Docker, APIs, TypeScript, React, Cloud, Performance
- Output: `web/data/biz_feed.json`

**BUZZ Feed** (AI & ML)
- Keywords: AI, LLM, GPT, Claude, Agents, RAG, Embeddings, OpenAI, Anthropic
- Output: `web/data/buzz_feed.json`

**Runs:** Every 30 minutes (after news fetch) + on deploy
**Display:** Scrolling ticker ribbon at bottom of page

### 3. AI Quiz Generation (`scripts/ai-curate-quiz.mjs`)

Uses OpenAI API to generate quiz questions from recent news.

**Features:**
- Generates 5 new questions daily
- Focuses on AI engineering education
- Questions about OpenAI SDK, Claude, agents, LLMs
- Maintains pool of 20 most recent AI-generated questions
- Automatically merged into main quiz pool

**Runs:** Daily at noon UTC via GitHub Actions
**Output:** `data/questions-ai-generated.json`
**Requires:** `OPENAI_API_KEY` secret in GitHub repository

### 4. Quiz Building (`scripts/build-quiz.mjs`)

Compiles all question sources into single quiz file:
- `data/questions-openai.json` (manual)
- `data/questions-github.json` (manual)
- `data/questions-fundamentals.json` (manual)
- `data/questions-ai-generated.json` (AI-generated)

**Runs:** On every deploy
**Output:** `quiz.json`

## Workflows

### News Updates (`.github/workflows/news.yml`)
- **Trigger:** Every 30 minutes
- **Steps:** Fetch news → Curate feeds → Commit changes
- **Updates:** `news.json`, `biz_feed.json`, `buzz_feed.json`

### AI Curation (`.github/workflows/ai-curate.yml`)
- **Trigger:** Daily at noon UTC
- **Steps:** Fetch news → Generate questions → Build quiz → Commit
- **Updates:** `questions-ai-generated.json`, `quiz.json`
- **Requires:** `OPENAI_API_KEY` secret

### Pages Deploy (`.github/workflows/pages.yml`)
- **Trigger:** Push to main branch
- **Steps:** Build quiz → Fetch news → Curate feeds → Deploy
- **Ensures:** All content fresh on every deployment

## Setup

### For Local Development

```bash
# Install dependencies
npm install

# Fetch news
node scripts/fetch-news.mjs

# Curate feeds
node scripts/curate-feeds.mjs

# Generate AI questions (requires OPENAI_API_KEY)
export OPENAI_API_KEY=your_key_here
node scripts/ai-curate-quiz.mjs

# Build quiz
node scripts/build-quiz.mjs
```

### For GitHub Actions

Add the following secret to your repository:
- `OPENAI_API_KEY` - Your OpenAI API key for quiz generation

## Architecture Vision

The AI curation agent represents a shift from static content to dynamic, learning-focused material:

1. **Daily Learning Cycle**
   - Agent pulls latest AI/dev news
   - Filters for relevance to learning objectives
   - Generates educational quiz questions
   - Some questions recycled, some fresh and timely

2. **Developer Stack Focus**
   - OpenAI SDK usage patterns
   - Claude and Claude Code workflows
   - AI agent frameworks
   - Modern deployment platforms
   - Best practices for AI engineering

3. **Continuous Improvement**
   - Questions evolve with the field
   - Stays current with latest developments
   - Balances fundamentals with cutting-edge topics
   - Tracks what's most efficient for project delivery

## Future Enhancements

- [ ] Use Claude API in addition to OpenAI for question generation
- [ ] Add difficulty levels (beginner, intermediate, advanced)
- [ ] Track question performance/engagement
- [ ] Add image/diagram questions for architecture topics
- [ ] Community-submitted question review system
- [ ] Multi-language support
