(function () {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
  const menuRoot = document.querySelector("[data-menu]");
  if (menuRoot && window.MERIDIAN_MENU) renderMenu(menuRoot);
  const form = document.querySelector("[data-order-form]");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = form.querySelector("[name=name]").value.trim();
      const phone = form.querySelector("[name=phone]").value.trim();
      const people = form.querySelector("[name=people]").value.trim();
      const when = form.querySelector("[name=when]").value.trim();
      const note = form.querySelector("[name=note]").value.trim();
      if (!name || !phone) {
        form.querySelector("[data-form-error]").hidden = false;
        return;
      }
      form.querySelector("[data-form-error]").hidden = true;
      const text = encodeURIComponent("Заявка с сайта Меридиан\nИмя: " + name + "\nТелефон: " + phone + "\nГостей: " + (people || "не указано") + "\nКогда: " + (when || "не указано") + "\nКомментарий: " + (note || "—"));
      window.location.href = "https://t.me/meridiansushi?text=" + text;
      form.classList.add("is-sent");
    });
  }
})();
function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}
function renderMenu(root) {
  const catalog = window.MERIDIAN_MENU;
  const categories = Object.keys(catalog);
  const filters = root.querySelector("[data-filters]");
  const search = root.querySelector("[data-search]");
  const list = root.querySelector("[data-list]");
  let active = "Все";
  function drawFilters() {
    filters.innerHTML = "";
    ["Все"].concat(categories).forEach(function (name) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter";
      button.textContent = name;
      button.setAttribute("aria-pressed", String(name === active));
      button.addEventListener("click", function () {
        active = name;
        drawFilters();
        drawList();
      });
      filters.appendChild(button);
    });
  }
  function drawList() {
    const query = (search.value || "").trim().toLowerCase();
    list.innerHTML = "";
    let shown = 0;
    categories.forEach(function (category) {
      if (active !== "Все" && active !== category) return;
      catalog[category].forEach(function (item) {
        const hay = (item.name + " " + item.desc + " " + category).toLowerCase();
        if (query && hay.indexOf(query) === -1) return;
        shown += 1;
        const article = document.createElement("article");
        article.className = "dish";
        article.innerHTML = "<div class=\"dish-top\"><h3></h3><div class=\"price\"></div></div><p class=\"muted weight\"></p><p class=\"muted desc\"></p>";
        article.querySelector("h3").textContent = item.name;
        article.querySelector(".price").textContent = formatPrice(item.price);
        article.querySelector(".weight").textContent = category + " · " + item.weight;
        article.querySelector(".desc").textContent = item.desc;
        list.appendChild(article);
      });
    });
    if (!shown) list.innerHTML = "<p class=\"muted\">Ничего не нашлось.</p>";
  }
  search.addEventListener("input", drawList);
  drawFilters();
  drawList();
}
