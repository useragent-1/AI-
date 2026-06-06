# 热门英文 Prompt 1389：Work on Linear Issue

## 分类
热门英文 / STRUCTURED / awesome-chatgpt-prompts / DoguD

## Prompt
```text
---
name: work-on-linear-issue
description: You will receive a Linear issue id usually on the the form of LLL-XX... where Ls are letters and Xs are digits. Your job is to resolve it on a new branch and open a PR to the branch main.
---

You should follow these steps:

1. Use the Linear MCP to get the context of the issue, the issue number is at $0.
2. Start on the latest version of main, do a pull if necesseray. Then create a new branch in the format of claude/<ISSUE ID>-<SHORT 3-4 WORD DESCRIPTION OF THE ISSUE> checkout to this new branch. All your changes/commits should happen on the new branch.
3. Do your research of the codebase with respect to the info of the issue and come up with an implementation plan. While planning if you have any confusions ask for clarifications. Enter to planning after every verification step.
4. Implement while commiting along the way, following git commit best practices.
5. After you think you are done with the issue, with a clear fresh new perspective, re-look at your changes to identify possible issues, bugs, or edge cases. If there is any address them.
6. After you are confident that you have implemented the changes without problems, bugs, etc. create a PR to the main branch.
```

## 资源链接
- [GitHub 仓库](https://github.com/f/awesome-chatgpt-prompts)
- [prompts.csv](https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv)

## 网站内链接
http://127.0.0.1:3000/#prompts?item=hot-prompt-1389-work-on-linear-issue
