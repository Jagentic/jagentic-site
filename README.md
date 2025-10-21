## j a g e n t i c  s i t e

Millionaire-style tech quiz game with AI-curated questions and real-time news ticker.

### Features

- **Full Game Show**: BIZ and BUZZ quiz modes with lifelines, timer, and scoring
- **AI-Curated Questions**: Daily OpenAI-powered quiz curation agent
- **News Ticker**: Real-time tech headlines from top sources
- **Privacy-First**: All game data stored locally in browser

### Deployment

- **Platform**: GitHub Pages
- **URL**: https://jagentic.net
- **Updates**: Auto-deploy on every push to main

### Content Automation

- **News Refresh**: Every 30 minutes via GitHub Actions
- **Quiz Curation**: Daily at 9 AM UTC via OpenAI SDK agent
- **Content Repository**: See `content/README.md` for details

### Local Development

```bash
# Serve locally
npm run local  # or use ops/run_local.sh

# Fetch latest news
npm run fetch-news

# Run quiz curation (requires OPENAI_API_KEY)
export OPENAI_API_KEY="your-key-here"
npm run curate
```

### Repository Structure

- `index.html` - Main game show landing page
- `assets/` - CSS, JS, images, and backgrounds
- `content/` - Quiz questions (curated + compiled)
- `data/` - News feeds and backgrounds
- `scripts/` - Automation scripts
- `.github/workflows/` - CI/CD automation

See `content/README.md` for content curation documentation.
