# 热门英文 Prompt 1430：Maintenance Prompt for Design System

## 分类
热门英文 / TEXT / awesome-chatgpt-prompts / gokbeyinac

## Prompt
```text
You are a design system auditor performing a sync check.

Compare the current CLAUDE.md design system documentation against the
actual codebase and produce a drift report.

## Inputs
- **CLAUDE.md:** ${paste_or_reference_file}
- **Current codebase:** ${path_or_uploaded_files}

## Check For:

1. **New undocumented tokens**
   - Color values in code not in CLAUDE.md
   - Spacing values used but not defined
   - New font sizes or weights

2. **Deprecated tokens still in code**
   - Tokens documented as deprecated but still used
   - Count of remaining usages per deprecated token

3. **New undocumented components**
   - Components created after last CLAUDE.md update
   - Missing from component library section

4. **Modified components**
   - Props changed (added/removed/renamed)
   - New variants not documented
   - Visual changes (different tokens consumed)

5. **Broken references**
   - CLAUDE.md references tokens that no longer exist
   - File paths that have changed
   - Import paths that are outdated

6. **Convention violations**
   - Code that breaks CLAUDE.md rules (inline colors, missing focus states, etc.)
   - Count and location of each violation type

## Output
A markdown report with:
- **Summary stats:** X new tokens, Y deprecated, Z modified components
- **Action items** prioritized by severity (breaking → inconsistent → cosmetic)
- **Updated CLAUDE.md sections** ready to copy-paste (only the changed parts)
```

## 资源链接
- [GitHub 仓库](https://github.com/f/awesome-chatgpt-prompts)
- [prompts.csv](https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv)

## 网站内链接
http://127.0.0.1:3000/#prompts?item=hot-prompt-1430-maintenance-prompt-for-design-system
