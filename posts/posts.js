// 文章目录。发布一篇文章 = 在 posts/ 放一个 Markdown 文件 + 在下面加一行。
//
// slug    文件名（不含 .md），只用小写字母、数字和连字符，例如 "mistake-log-01"
// title   标题
// date    日期，格式 YYYY-MM-DD
// summary 列表里显示的一句话摘要（可省略）
// tags    标签（可省略）
//
// 示例（去掉开头的 // 即可生效）：
// { slug: "mistake-log-01", title: "错题复盘：……", date: "2026-11-20", summary: "……", tags: ["算法"] },

window.POSTS = [
  // 示例文章，测试用；发正式文章后可以删掉这一行和 posts/demo-nullptr-vs-null.md
  { slug: "demo-nullptr-vs-null", title: "示例文章：nullptr 和 NULL 到底差在哪", date: "2026-11-14", summary: "测试用的示例文章，取自错题本里的一条记录。", tags: ["C++", "示例"] },
];
