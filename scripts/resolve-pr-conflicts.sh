#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "error: GitHub CLI (gh) is required." >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "error: jq is required." >&2
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "error: run this script inside a git repository." >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: working tree is dirty. Commit or stash changes first." >&2
  exit 1
fi

base_branch="${1:-$(gh repo view --json defaultBranchRef -q '.defaultBranchRef.name')}"
limit="${2:-20}"

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

current_branch="$(git rev-parse --abbrev-ref HEAD)"

echo "Fetching latest refs..."
git fetch --all --prune

echo "Collecting open pull requests with merge conflicts against ${base_branch}..."
mapfile -t conflicted_prs < <(
  gh pr list \
    --state open \
    --base "$base_branch" \
    --limit "$limit" \
    --json number,headRefName,mergeStateStatus,title \
    | jq -r '.[] | select(.mergeStateStatus == "DIRTY") | [.number, .headRefName, .title] | @tsv'
)

if ((${#conflicted_prs[@]} == 0)); then
  echo "No conflicting PRs found."
  exit 0
fi

echo "Found ${#conflicted_prs[@]} conflicting PR(s). Attempting automatic rebases..."

declare -a resolved_prs=()
declare -a unresolved_prs=()

for line in "${conflicted_prs[@]}"; do
  IFS=$'\t' read -r pr_number pr_branch pr_title <<<"$line"

  work_branch="resolve/pr-${pr_number}"
  echo ""
  echo "---"
  echo "PR #${pr_number}: ${pr_title}"

  if ! git show-ref --verify --quiet "refs/remotes/origin/${pr_branch}"; then
    echo "⚠️  missing remote branch origin/${pr_branch}; skipping"
    unresolved_prs+=("#${pr_number} ${pr_title}")
    continue
  fi

  git checkout -B "$work_branch" "origin/${pr_branch}" >/dev/null 2>&1

  if git rebase "origin/${base_branch}"; then
    git push --force-with-lease origin "${work_branch}:${pr_branch}"
    resolved_prs+=("#${pr_number} ${pr_title}")
    echo "✅ Rebased and pushed ${pr_branch}"
  else
    echo "❌ Rebase failed for PR #${pr_number}; aborting rebase"
    git rebase --abort || true
    unresolved_prs+=("#${pr_number} ${pr_title}")
  fi

done

git checkout "$current_branch" >/dev/null 2>&1

echo ""
echo "=== Summary ==="
echo "Resolved: ${#resolved_prs[@]}"
for item in "${resolved_prs[@]}"; do
  echo "  - ${item}"
done

echo "Unresolved: ${#unresolved_prs[@]}"
for item in "${unresolved_prs[@]}"; do
  echo "  - ${item}"
done
