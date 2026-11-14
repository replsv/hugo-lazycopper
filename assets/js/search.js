const input = document.getElementById("search-input");
const results = document.getElementById("search-results");
const status = document.getElementById("search-status");

const escapeHTML = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function highlight(text, terms) {
  const safe = escapeHTML(text);
  if (!terms.length) return safe;
  const re = new RegExp(`(${terms.map((t) => escapeRegExp(escapeHTML(t))).join("|")})`, "gi");
  return safe.replace(re, "<mark>$1</mark>");
}

function excerpt(item, terms) {
  const lower = item.content.toLowerCase();
  for (const t of terms) {
    const i = lower.indexOf(t);
    if (i !== -1) {
      const start = Math.max(0, i - 80);
      return (start > 0 ? "…" : "") + item.content.slice(start, start + 220).replace(/\s+/g, " ") + "…";
    }
  }
  return item.summary;
}

function score(item, terms) {
  let total = 0;
  for (const t of terms) {
    let s = 0;
    if (item._title.includes(t)) s += 10;
    if (item._tags.some((tag) => tag.includes(t))) s += 5;
    if (item._content.includes(t)) s += 1;
    if (s === 0) return 0; // every term must match somewhere
    total += s;
  }
  return total;
}

async function init() {
  if (!input || !results) return;

  let index = [];
  try {
    const res = await fetch(results.dataset.index);
    index = (await res.json()).map((item) => ({
      ...item,
      _title: item.title.toLowerCase(),
      _tags: (item.tags || []).map((t) => t.toLowerCase()),
      _content: item.content.toLowerCase(),
    }));
  } catch (e) {
    status.textContent = "Search index could not be loaded.";
    return;
  }

  const run = () => {
    const query = input.value.trim().toLowerCase();
    const url = new URL(window.location);
    if (query) url.searchParams.set("q", input.value.trim());
    else url.searchParams.delete("q");
    history.replaceState(null, "", url);

    if (!query) {
      results.innerHTML = "";
      status.textContent = "";
      return;
    }

    const terms = query.split(/\s+/).filter(Boolean);
    const hits = index
      .map((item) => ({ item, s: score(item, terms) }))
      .filter((h) => h.s > 0)
      .sort((a, b) => b.s - a.s || b.item.date.localeCompare(a.item.date));

    status.textContent = hits.length ? results.dataset.count.replace("%d", hits.length) : results.dataset.none;
    results.innerHTML = hits
      .map(
        ({ item }) => `<a class="search-result" href="${item.permalink}">
  <h3>${highlight(item.title, terms)}</h3>
  <p>${highlight(excerpt(item, terms), terms)}</p>
</a>`,
      )
      .join("");
  };

  input.addEventListener("input", run);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const first = results.querySelector("a");
      if (first) first.click();
    }
  });

  const initial = new URL(window.location).searchParams.get("q");
  if (initial) {
    input.value = initial;
    run();
  }
}

init();
