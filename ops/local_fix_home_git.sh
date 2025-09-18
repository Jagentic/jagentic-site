#!/usr/bin/env bash
set -euo pipefail

# Backup the mistaken home .git
mkdir -p ~/Desktop/git-backups
tar -czf ~/Desktop/git-backups/home-dotgit-$(date +%Y%m%d-%H%M%S).tgz -C ~ .git
# Remove the accidental home repo metadata (files remain)
rm -rf ~/.git
[ -f ~/.gitmodules ] && rm ~/.gitmodules
# Verify, then show correct status in project
cd ~; git rev-parse --is-inside-work-tree 2>/dev/null || echo "Home is NOT a git repo (good)"
cd ~/Business/CodexProjects/jagentic-site; git rev-parse --is-inside-work-tree 2>/dev/null || git init; git branch -M main; git status
