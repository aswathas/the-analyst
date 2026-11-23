#!/usr/bin/env bash
# Finalize the sem 7 build: verify, commit, push, deploy.
# Run from the repo root. Safe to re-run.
set -uo pipefail
cd "$(dirname "$0")/.."
REPO=$(pwd)

echo "=== branch"
git branch --show-current

echo "=== typecheck + build"
if ! npm run build 2>&1 | tail -15; then
  echo "BUILD FAILED — not committing"
  exit 1
fi

echo "=== tests"
if ! npx playwright test 2>&1 | tail -25; then
  echo "TESTS FAILED — not committing"
  exit 1
fi

echo "=== commit"
git add -A
git status --short
if git diff --cached --quiet; then
  echo "nothing staged"
else
  git commit -q -m "feat: sem 7 subject pages, master PDFs and semester-aware home

Co-Authored-By: Claude Code <noreply@anthropic.com>"
  echo "committed $(git rev-parse --short HEAD)"
fi

echo "=== push"
git push -u origin feature/sem7-prep

echo "=== done — Vercel builds from the pushed branch"
