/* 轻量 Markdown 渲染（助手消息），输出已转义的安全 HTML */
(() => {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, "&#39;");
  }

  function renderInline(text) {
    let out = escapeHtml(text);
    out = out.replace(/`([^`\n]+)`/g, (_, code) => `<code class="lab-md-code">${code}</code>`);
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (_, label, url) =>
        `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`
    );
    return out;
  }

  function renderTextBlock(text) {
    if (!text.trim()) return "";
    const lines = text.split("\n");
    const blocks = [];
    let para = [];
    let list = null;

    const flushPara = () => {
      if (!para.length) return;
      blocks.push(`<p class="lab-md-p">${renderInline(para.join("\n")).replace(/\n/g, "<br>")}</p>`);
      para = [];
    };

    const flushList = () => {
      if (!list) return;
      blocks.push(
        `<ul class="lab-md-ul">${list.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`
      );
      list = null;
    };

    for (const line of lines) {
      if (/^[-*]\s+/.test(line)) {
        flushPara();
        if (!list) list = [];
        list.push(line.replace(/^[-*]\s+/, ""));
        continue;
      }
      flushList();
      if (!line.trim()) {
        flushPara();
        continue;
      }
      para.push(line);
    }
    flushList();
    flushPara();
    return blocks.join("");
  }

  function renderMarkdown(source) {
    if (!source) return "";
    const parts = String(source).split(/```([\w-]*)\n?([\s\S]*?)```/);
    let html = "";
    for (let i = 0; i < parts.length; i += 1) {
      if (i % 3 === 0) {
        html += renderTextBlock(parts[i]);
      } else if (i % 3 === 2) {
        const lang = parts[i - 1] || "";
        const langAttr = lang ? ` data-lang="${escapeAttr(lang)}"` : "";
        html += `<pre class="lab-md-pre"${langAttr}><code>${escapeHtml(parts[i].replace(/\n$/, ""))}</code></pre>`;
      }
    }
    return html;
  }

  window.NeuxLabMarkdown = { render: renderMarkdown, escapeHtml };
})();
