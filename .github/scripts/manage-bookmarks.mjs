import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const body = process.env.ISSUE_BODY ?? "";
const title = process.env.ISSUE_TITLE ?? "";
const number = process.env.ISSUE_NUMBER;
const repo = process.env.REPOSITORY;
const token = process.env.GITHUB_TOKEN;

function field(name, required = true) {
  const pattern = new RegExp(`### ${name}\\s*\\n\\s*([^\\n]+)`, "u");
  const value = body.match(pattern)?.[1]?.trim();
  if (required && !value) throw new Error(`缺少“${name}”`);
  return value ?? "";
}
function comment(message) {
  execFileSync("gh", ["api", `repos/${repo}/issues/${number}/comments`, "-f", `body=${message}`], { stdio: "inherit", env: { ...process.env, GH_TOKEN: token } });
}
function close() {
  execFileSync("gh", ["api", `repos/${repo}/issues/${number}`, "-X", "PATCH", "-f", "state=closed"], { stdio: "inherit", env: { ...process.env, GH_TOKEN: token } });
}
if (process.env.ISSUE_AUTHOR_ASSOCIATION !== "OWNER") {
  comment("此管理入口仅允许仓库拥有者操作，本次请求未执行。");
  close();
  process.exit(0);
}
try {
  const file = "data/bookmarks.json";
  const data = JSON.parse(readFileSync(file, "utf8"));
  const bookmarkTitle = field("网站名称");
  const index = data.links.findIndex(link => link.title === bookmarkTitle);
  if (title.includes("新增")) {
    if (index >= 0) throw new Error("已存在同名书签，请改用修改书签。");
    const url = new URL(field("网址")).toString();
    data.links.push({ title: bookmarkTitle, url, description: field("一句描述", false), category: field("分类"), faviconUrl: await favicon(url) });
  } else if (title.includes("修改")) {
    if (index < 0) throw new Error("未找到该书签，请检查网站名称。");
    const url = new URL(field("网址")).toString();
    data.links[index] = { title: bookmarkTitle, url, description: field("一句描述", false), category: field("分类"), faviconUrl: await favicon(url) };
  } else if (title.includes("删除")) {
    if (index < 0) throw new Error("未找到该书签，请检查网站名称。");
    data.links.splice(index, 1);
  } else process.exit(0);
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  execFileSync("git", ["config", "user.name", "LZN Bookmark Bot"]);
  execFileSync("git", ["config", "user.email", "actions@github.com"]);
  execFileSync("git", ["add", file]);
  execFileSync("git", ["commit", "-m", "chore: update bookmarks"]);
  execFileSync("git", ["push"]);
  comment("书签已更新，网站将在 GitHub Pages 发布完成后自动显示。");
  close();
} catch (error) {
  comment(`未能处理本次请求：${error.message}`);
}
async function favicon(siteUrl) {
  const fallback = new URL("/favicon.ico", siteUrl).toString();
  try {
    const response = await fetch(siteUrl, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(6000) });
    const html = await response.text();
    const tag = (html.match(/<link\\b[^>]*>/gi) ?? []).find(item => /\\brel\\s*=\\s*["'][^"']*(?:shortcut\\s+)?icon/i.test(item));
    const href = tag?.match(/\\bhref\\s*=\\s*["']([^"']+)["']/i)?.[1];
    return href ? new URL(href, response.url || siteUrl).toString() : fallback;
  } catch { return fallback; }
}
