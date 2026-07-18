(() => {
  const repo = window.LZN_CONFIG?.repository;
  const note = document.getElementById("manage-note");
  if (!repo) return;
  const forms = { add: "bookmark-add.yml", edit: "bookmark-edit.yml", delete: "bookmark-delete.yml" };
  document.querySelectorAll("[data-form]").forEach(link => link.href = `https://github.com/${repo}/issues/new?template=${forms[link.dataset.form]}`);
  note.textContent = "请使用 GitHub 登录后提交表单。系统仅接受仓库拥有者的请求，并会在完成后自动更新本站。";
})();
