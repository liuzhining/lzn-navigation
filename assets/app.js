(() => {
  const config = window.LZN_CONFIG || {};
  const repo = config.repository;
  const admin = document.getElementById("admin-link");
  const footerAdmin = document.getElementById("footer-admin");
  if (repo) {
    const url = `https://github.com/${repo}/issues/new/choose`;
    admin.href = url;
    footerAdmin.href = url;
  }
  const grid = document.getElementById("link-grid");
  const empty = document.getElementById("empty-state");
  const filters = document.getElementById("filters");
  const input = document.getElementById("site-search");
  let links = [], active = "全部";
  const first = title => (title || "?").trim().slice(0, 1).toLocaleUpperCase("zh-CN");
  const escape = value => String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[char]));
  const render = () => {
    const keyword = input.value.trim().toLocaleLowerCase();
    const shown = links.filter(link => (active === "全部" || link.category === active) && (!keyword || `${link.title} ${link.description} ${link.category}`.toLocaleLowerCase().includes(keyword)));
    grid.innerHTML = shown.map(link => `<a class="link-card" href="${escape(link.url)}" target="_blank" rel="noreferrer"><span class="link-icon" data-letter="${escape(first(link.title))}">${link.faviconUrl ? `<img src="${escape(link.faviconUrl)}" alt="" onerror="this.parentElement.classList.add('missing')">` : escape(first(link.title))}</span><span class="link-text"><strong>${escape(link.title)}</strong><small>${escape(link.description || "")}</small></span><span class="card-arrow" aria-hidden="true">↗</span></a>`).join("");
    empty.hidden = shown.length !== 0;
  };
  const renderFilters = () => {
    const categories = ["全部", ...new Set(links.map(link => link.category))];
    filters.innerHTML = categories.map(category => `<button type="button" class="${category === active ? "active" : ""}" aria-pressed="${category === active}" data-category="${escape(category)}">${escape(category)}</button>`).join("");
    filters.querySelectorAll("button").forEach(button => button.addEventListener("click", () => { active = button.dataset.category; renderFilters(); render(); }));
  };
  input.addEventListener("input", render);
  document.addEventListener("keydown", event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); input.focus(); } });
  fetch("data/bookmarks.json").then(response => response.json()).then(data => { links = data.links; renderFilters(); render(); }).catch(() => { empty.hidden = false; empty.innerHTML = "<strong>书签数据暂时无法加载</strong>"; });
})();
