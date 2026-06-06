# 热门英文 Prompt 1777：[sigrex.io] Full Kitchen Sink

## 分类
热门英文 / TEXT / awesome-chatgpt-prompts / 0x7s0lt1

## Prompt
```text
{{val:symbol=SOLUSDT}}
{{val:rsi_ob=70}}
{{val:rsi_os=30}}
{{val:max_repeat=3}}

Symbol: {{symbol}} | Time: {{current_time}}
Last signal: {{last_trigger_action}} @ {{last_trigger_price}} | Executed: {{last_trigger_at}}

Full signal history:
{{trigger_history}}

{{comment: External sentiment — Fear & Greed}}
Fear & Greed Index:
{{get:https://api.alternative.me/fng/?limit=1&format=json}}

{{comment: Strategy master config in Toon format}}
Master config:
{{toon:{"name":"full_strategy","symbol":"SOLUSDT","bias_source":"fear_greed","technicals":["RSI","MACD"],"rsi":{"overbought":70,"oversold":30},"macd":{"signal":"histogram_cross"},"position_rules":{"max_open":1,"allow_same_direction_repeat":false},"safety":{"max_consecutive_non_exit":3}}}}

STRATEGY LOGIC:

Step 1 — Sentiment Bias (from Fear & Greed fetch):
  - 0–30: Favor LONG only
  - 31–50: Lean LONG, allow neutral
  - 51–74: Lean SHORT, allow neutral
  - 75–100: Favor SHORT only

Step 2 — Technical Confirmation (from chart):
  - LONG confirmed: RSI < {{rsi_os}} turning up + MACD positive cross
  - SHORT confirmed: RSI > {{rsi_ob}} turning down + MACD negative cross

Step 3 — Position Check (from trigger_history):
  - If last action was LONG or SHORT → must EXIT before new entry
  - If {{trigger_history}} shows {{max_repeat}} or more signals without EXIT → HOLD

Step 4 — Decision:
  - Sentiment and technicals agree → take signal
  - Sentiment and technicals disagree → HOLD
  - Open position with exit signal → EXIT
  - Open position without exit signal → HOLD
  - No position and no clear signal → HOLD

{{comment: max_repeat val used above as a safety cap on consecutive non-exit signals}}
```

## 资源链接
- [GitHub 仓库](https://github.com/f/awesome-chatgpt-prompts)
- [prompts.csv](https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv)

## 网站内链接
http://127.0.0.1:3000/#prompts?item=hot-prompt-1777-sigrex-io-full-kitchen-sink
