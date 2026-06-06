# 热门英文 Prompt 1388：Claude Code Skill (Slash Command): push-and-pull-request.md

## 分类
热门英文 / STRUCTURED / awesome-chatgpt-prompts / DoguD

## Prompt
```text
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git push:*), Bash(gh pr create:*)
description: Commit and push everything then open a PR request to main
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

1. Review the existing changes and then create a git commit following the conventional commit format. If you think there are more than one distinct change you can create multiple commits. If there are no outstanding changes proceed to 2.
2. Push all commits.
3. Open a PR to main following the conventional formats.
```

## 资源链接
- [GitHub 仓库](https://github.com/f/awesome-chatgpt-prompts)
- [prompts.csv](https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv)

## 网站内链接
http://127.0.0.1:3000/#prompts?item=hot-prompt-1388-claude-code-skill-slash-command-push-and-pull-request-md
