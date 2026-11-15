(function () {
  "use strict";

  var SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
  var EMPTY_TEXT = "第一篇文章准备中。";

  function getPosts() {
    var list = Array.isArray(window.POSTS) ? window.POSTS.slice() : [];
    list = list.filter(function (p) {
      return p && typeof p.slug === "string" && SLUG_RE.test(p.slug) && p.title;
    });
    // 新文章在前；日期相同时保持 posts.js 里的顺序
    return list
      .map(function (p, i) { return { p: p, i: i }; })
      .sort(function (a, b) {
        var da = a.p.date || "";
        var db = b.p.date || "";
        if (da !== db) return da < db ? 1 : -1;
        return a.i - b.i;
      })
      .map(function (x) { return x.p; });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function buildMeta(post) {
    var meta = el("span", "post-meta");
    if (post.date) {
      var t = el("time", null, post.date);
      t.setAttribute("datetime", post.date);
      meta.appendChild(t);
    }
    (post.tags || []).forEach(function (tag) {
      meta.appendChild(el("span", "tag", tag));
    });
    return meta;
  }

  // 文章列表：<div data-post-list data-base="blog/" data-limit="5"></div>
  function renderPostList(container) {
    var base = container.getAttribute("data-base") || "";
    var limit = parseInt(container.getAttribute("data-limit"), 10);
    var posts = getPosts();
    if (limit > 0) posts = posts.slice(0, limit);

    container.textContent = "";
    if (!posts.length) {
      var empty = el("p", "empty reveal");
      empty.appendChild(el("span", "prompt", ">"));
      empty.appendChild(document.createTextNode(EMPTY_TEXT));
      empty.appendChild(el("span", "caret"));
      container.appendChild(empty);
      return;
    }

    var ul = el("ul", "post-list");
    posts.forEach(function (post, i) {
      var li = el("li", "reveal");
      li.style.setProperty("--delay", Math.min(i, 6) * 0.06 + "s");
      var a = el("a", "card");
      a.href = base + "post.html?slug=" + encodeURIComponent(post.slug);
      a.appendChild(el("span", "post-title", post.title));
      if (post.summary) a.appendChild(el("span", "post-summary", post.summary));
      a.appendChild(buildMeta(post));
      li.appendChild(a);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  function siteName() {
    var brand = document.querySelector(".brand");
    return brand ? brand.textContent.trim() : "";
  }

  function isRelative(url) {
    return !!url && !/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(url);
  }

  // 文章页：blog/post.html?slug=xxx，读取 posts/xxx.md
  function renderPost(root) {
    var titleEl = root.querySelector("[data-post-title]");
    var metaEl = root.querySelector("[data-post-meta]");
    var bodyEl = root.querySelector("[data-post-body]");

    function fail(title, message) {
      titleEl.textContent = title;
      metaEl.textContent = "";
      bodyEl.textContent = "";
      bodyEl.appendChild(el("p", "status-msg", message));
      document.title = title + " · " + siteName();
    }

    var slug = new URLSearchParams(window.location.search).get("slug") || "";
    var post = null;
    if (SLUG_RE.test(slug)) {
      post = getPosts().filter(function (p) { return p.slug === slug; })[0] || null;
    }
    if (!post) {
      fail("文章不存在", "没有找到这篇文章，可以返回文章列表看看。");
      return;
    }

    titleEl.textContent = post.title;
    document.title = post.title + " · " + siteName();
    metaEl.replaceWith(buildMeta(post));

    if (!window.marked) {
      fail(post.title, "Markdown 渲染库加载失败，请刷新重试。");
      return;
    }

    var mdBase = new URL("../posts/", window.location.href);
    fetch(new URL(slug + ".md", mdBase).href, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function (md) {
        bodyEl.innerHTML = window.marked.parse(md);

        // 正文开头若有一级标题，与页面标题重复，去掉
        var first = bodyEl.firstElementChild;
        if (first && first.tagName === "H1") first.remove();

        // Markdown 里的相对路径按 posts/ 目录解析，例如 images/foo.png
        bodyEl.querySelectorAll("img[src]").forEach(function (img) {
          var src = img.getAttribute("src");
          if (isRelative(src)) img.src = new URL(src, mdBase).href;
          img.loading = "lazy";
        });
        bodyEl.querySelectorAll("a[href]").forEach(function (a) {
          var href = a.getAttribute("href");
          if (/^https?:\/\//i.test(href)) {
            a.target = "_blank";
            a.rel = "noopener";
          }
        });
      })
      .catch(function () {
        fail(post.title, "文章加载失败。如果是直接双击打开的本地文件，请改用本地服务器预览（见 README）。");
      });
  }

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 首页终端里的“最新文章”
  function renderLatest() {
    var node = document.querySelector("[data-latest]");
    var latest = getPosts()[0];
    if (node && latest) node.textContent = latest.title;
  }

  // 打字效果：文字本来就在 HTML 里，脚本只负责逐字重放
  function typeText(node) {
    var text = node.textContent;
    if (reduceMotion || !text) return;
    node.textContent = "";
    var i = 0;
    setTimeout(function step() {
      i += 1;
      node.textContent = text.slice(0, i);
      if (i < text.length) setTimeout(step, 55 + Math.random() * 60);
    }, 650);
  }

  // 滚动进入视口时淡入
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (n) { io.observe(n); });
  }

  // 卡片上跟随鼠标的光斑
  function setupSpotlight() {
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".card");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    }, { passive: true });
  }

  // 文章页顶部阅读进度条
  function setupReadProgress() {
    var bar = document.querySelector(".read-progress");
    if (!bar) return;
    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      bar.style.setProperty("--p", max > 0 ? Math.min(1, doc.scrollTop / max) : 0);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  document.querySelectorAll("[data-post-list]").forEach(renderPostList);
  var postRoot = document.querySelector("[data-post]");
  if (postRoot) renderPost(postRoot);

  renderLatest();
  document.querySelectorAll("[data-typed]").forEach(typeText);
  setupReveal();
  setupSpotlight();
  setupReadProgress();

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });
})();
