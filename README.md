# LZN导航：GitHub Pages 版本

这是可直接发布到 GitHub Pages 的静态版本。访客无需登录即可浏览书签；书签管理使用 GitHub 的问题表单和自动化流程，只有仓库拥有者的操作会生效。

## 首次发布

1. 在 GitHub 新建一个公开仓库，例如 `lzn-navigation`。
2. 将本目录里的全部文件上传到仓库根目录，分支使用 `main`。
3. 在仓库的 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。
4. 等待 Actions 中的 `Deploy GitHub Pages` 完成后，打开给出的 Pages 地址。
5. 如需自定义域名，在 Pages 的 Custom domain 中填写域名并按 GitHub 的提示配置 DNS。

## 管理书签

打开网站右上角的“管理书签”，使用 GitHub 登录后选择新增、修改或删除表单。提交后，自动化流程会写入书签数据并重新发布网站；无需本地改代码或执行命令。

请保持仓库公开，以便 GitHub 免费账户使用 Pages。不要授予朋友仓库写入权限。
