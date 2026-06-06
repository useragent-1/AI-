# 热门英文 Prompt 1263：Test-First Bug Fixing Approach

## 分类
热门英文 / TEXT / awesome-chatgpt-prompts / ilkerulusoy

## Prompt
```text
I have a bug: ${bug}. Take a test-first approach: 1) Read the relevant source files and existing tests. 2) Write a failing test that reproduces the exact bug. 3) Run the test suite to confirm it fails. 4) Implement the minimal fix. 5) Re-run the full test suite. 6) If any test fails, analyze the failure, adjust the code, and re-run—repeat until ALL tests pass. 7) Then grep the codebase for related code paths that might have the same issue and add tests for those too. 8) Summarize every change made and why. Do not ask me questions—make reasonable assumptions and document them.
```

## 资源链接
- [GitHub 仓库](https://github.com/f/awesome-chatgpt-prompts)
- [prompts.csv](https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv)

## 网站内链接
http://127.0.0.1:3000/#prompts?item=hot-prompt-1263-test-first-bug-fixing-approach
