# homepage

个人主页和博客的源码仓库。第一版做成静态站，使用 GitHub Pages 免费托管。先用 GitHub 提供的网址验收，再绑定自己的域名。

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
