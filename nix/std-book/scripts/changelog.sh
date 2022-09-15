#!/usr/bin/env bash

set -euo pipefail

# Stash working directory
if git status --porcelain 2>/dev/null | wc -l; then
    # echo "Working directory is dirty. Please commit all changes and re-run."
    echo "Stashing changes..."
    STASHED=1
    git stash
fi

# Check if changelog branch exists
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
CURRENT_HASH=$(git rev-parse HEAD)
if ! git branch --list | grep -q changelog; then
    echo "Changelog branch does not exist. Creating it..."
    git checkout -b changelog
else
    git checkout changelog
fi

# Update changelog branch
echo "Updating changelog..."
cog changelog >CHANGELOG.md

# Commit and push
git add CHANGELOG.md
git commit -m "chore: Update changelog to ${CURRENT_HASH}"
git push origin changelog

# Check for PR
PR_BODY=$(cog changelog)
if ! gh pr view changelog; then
    echo "No PR exists for changelog. Creating it..."
    gh pr create --title "chore(changelog): Update changelog to ${CURRENT_HASH}" --body "${PR_BODY}" --head changelog
else
    echo "Updating PR body..."
    gh pr edit changelog --title "chore(changelog): Update changelog to ${CURRENT_HASH}" --body "${PR_BODY}"
fi

# Restore working directory
if [[ -z ${STASHED+x} ]]; then
    echo "Restoring changes..."
    git checkout "${CURRENT_BRANCH}"
    git stash pop
fi
