# homepage

个人主页和博客的源码仓库。第一版做成静态站，使用 GitHub Pages 免费托管。先用 GitHub 提供的网址验收，再绑定自己的域名。

## 当前版本

纯 HTML + CSS + JavaScript，没有构建步骤，仓库根目录就是网站根目录。所有链接都是相对路径，放在 `https://xiaoaoyaojiayou123.github.io/homepage/` 或以后 nginx 的 `/` 下都能用。

```
index.html              首页：简介、学习路线、学习动态、最新文章、链接
blog/index.html         文章列表
blog/post.html          文章页，地址形如 blog/post.html?slug=文件名
posts/posts.js          文章目录（标题、日期、摘要、标签）
posts/*.md              文章正文（Markdown）
posts/images/           文章图片
assets/css/style.css    样式，深色科技风，系统为浅色时切换浅色版
assets/js/site.js       列表和文章渲染、打字和滚动动效
assets/vendor/          Markdown 渲染库 marked 18.1.2（MIT，已放进仓库，不依赖 CDN）
.nojekyll               让 GitHub Pages 原样发布文件
```

## 本地预览

文章用 `fetch` 读取 Markdown，双击打开 HTML 文件看不到文章，需要用本地服务器。在仓库的**上一级目录**运行：

```bash
python -m http.server 8000
```

然后打开 <http://localhost:8000/homepage/>，路径和 GitHub Pages 默认地址一致。

## 发布一篇文章

1. 在 `posts/` 新建 `文件名.md`，文件名只用小写字母、数字和连字符，例如 `mistake-log-01.md`。正文开头的一级标题（`# 标题`）会被自动去掉，页面标题取自下一步。
2. 图片放 `posts/images/`，正文里写 `![说明](images/图片名.png)`。
3. 在 `posts/posts.js` 的 `window.POSTS` 里加一行：

   ```js
   { slug: "mistake-log-01", title: "错题复盘：……", date: "2026-11-20", summary: "一句话摘要", tags: ["算法"] },
   ```

4. 本地预览确认后提交推送，GitHub Pages 会自动更新（通常一两分钟）。

## 当前状态（2026-11-14 暂停）

网站结构已完成，先搁置，专心学习。之后每学完一课，整理成文章发上来；等项目（仿 muduo）开工后再回来整理内容。

已有内容：昵称 Dracatrice、「软件工程本科在读」、四个方向的章节（C++、Linux、MySQL、算法）、学习动态时间线、GitHub 链接、一篇示例文章。

还没做的事：

- 推送到 GitHub 并在 **Settings → Pages** 开启发布（见下文）。在这之前网站只在本地，线上看不到。
- 发第一篇正式文章后，删掉示例文章：`posts/demo-nullptr-vs-null.md` 和 `posts/posts.js` 里对应的那一行。
- Gitee、CSDN 链接：`index.html` 的「链接」区块里有注释掉的模板，复制到注释外面，改网址和账号名。
- 章节进度：`index.html` 学习路线里给 `<li>` 加 `class="done"` / `"doing"` / `"todo"`。
- 新里程碑：在 `index.html` 的「学习动态」里复制一个 `<li>`，放在最上面，改日期和文字。
- 较长的自我介绍：加在 `index.html` 的 `.hero-text` 里。
- 备案号：迁到已备案服务器后，取消 `index.html` 页脚里的注释。

## Claude 接手后先做什么

1. 从最新的 `main` 开始，按站主给的内容和设计要求完成个人主页、博客列表和文章页。
2. 确保可以静态发布。如果直接使用 HTML、CSS 和 JavaScript，将 `index.html` 放在仓库根目录。如果使用需要构建的框架，配置 GitHub Actions 构建并发布静态产物，并在交付时注明本地预览命令和构建输出目录。
3. 本地预览并确认首页能打开、列表能进入文章、文章能返回列表，图片和样式正常。默认发布地址带有 `/homepage/` 前缀，优先使用相对链接或框架的基础路径配置，并检查文章页直接打开和刷新是否正常。
4. 把网站提交并推送到 `main`。交付时说明采用哪种发布方式，以及仓库的 Pages 设置还需要站主操作哪一步。

## 先发布到 GitHub Pages

1. 登录 GitHub，打开仓库的 **Settings → Pages**。
2. 普通静态文件选 **Deploy from a branch**，分支选 **main**，目录选 **/(root)**，再点 **Save**。如果网站采用 GitHub Actions 构建发布，**Source** 选 **GitHub Actions**。
3. 等部署成功后，用默认地址检查首页、博客列表、文章详情和静态资源。如果读者主要在中国大陆，用实际读者常用的网络再打开一次。默认地址见 [GitHub Pages 项目站点](https://xiaoaoyaojiayou123.github.io/homepage/)。[GitHub Pages 发布设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 网站验收后再绑定 guixuntaiyi.xyz

1. 在 GitHub **账户 Settings → Pages** 添加 `guixuntaiyi.xyz`。按 GitHub 给出的名称和值，在阿里云 DNS 添加 TXT 记录，回到 GitHub 完成域名所有权验证。保留这条 TXT 记录。[GitHub 域名验证说明](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
2. 到 **仓库 Settings → Pages → Custom domain**，输入 `guixuntaiyi.xyz` 并保存。
3. 在阿里云 DNS 给主机记录 `@` 添加四条 A 记录，每条一个值。若根域名已有指向其他站点的解析，先确认用途再调整。

   | 主机记录 | 类型 | 记录值 |
   | --- | --- | --- |
   | `@` | A | `185.199.108.153` |
   | `@` | A | `185.199.109.153` |
   | `@` | A | `185.199.110.153` |
   | `@` | A | `185.199.111.153` |

4. 等 GitHub 的 DNS 检查通过且 HTTPS 可启用，再勾选 **Enforce HTTPS**。从自定义域名重新测试首页、文章和资源。如果框架为默认地址配置了固定的 `/homepage/` 前缀，绑定根域名后要调整为 `/` 并重新构建发布。[GitHub 自定义域名设置](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

第一阶段只需准备网站和 GitHub Pages 发布。腾讯云主机、ICP 备案查询和自定义域名设置都可以先搁置。
