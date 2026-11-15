const script = document.currentScript;

const toggle = document.getElementById("theme-toggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("pref-theme", dark ? "dark" : "light");
    } catch (e) {}
  });
}

const header = document.getElementById("site-header");
if (header) {
  const update = () => header.toggleAttribute("data-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", update, { passive: true });
  update();
}

const topLink = document.getElementById("top-link");
if (topLink) {
  const update = () => {
    const show = window.scrollY > 800;
    topLink.classList.toggle("invisible", !show);
    topLink.classList.toggle("opacity-0", !show);
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

const progress = document.getElementById("reading-progress");
const article = document.querySelector("article .content");
if (progress && article) {
  let queued = false;
  const update = () => {
    queued = false;
    const { top, height } = article.getBoundingClientRect();
    const scrollable = height - window.innerHeight;
    const ratio = scrollable > 0 ? -top / scrollable : top <= 0 ? 1 : 0;
    progress.style.scale = `${Math.min(1, Math.max(0, ratio))} 1`;
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  update();
}

const toc = document.getElementById("toc-sidebar");
if (toc) {
  const links = [...toc.querySelectorAll('a[href^="#"]')];
  const targets = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))));
  let current = null;
  let queued = false;
  const update = () => {
    queued = false;
    let index = 0;
    targets.forEach((target, i) => {
      if (target && target.getBoundingClientRect().top <= 112) index = i;
    });
    const active = links[index];
    if (active === current) return;
    current?.removeAttribute("aria-current");
    active.setAttribute("aria-current", "location");
    current = active;
    const { top, bottom } = active.getBoundingClientRect();
    const box = toc.getBoundingClientRect();
    if (top < box.top || bottom > box.bottom) active.scrollIntoView({ block: "nearest" });
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", schedule, { passive: true });
  if (links.length) update();
}

if (script && script.hasAttribute("data-code-copy")) {
  const label = script.dataset.copy || "copy";
  const done = script.dataset.copied || "copied!";

  document.querySelectorAll(".content .highlight").forEach((block) => {
    const code = block.querySelector("td:last-child code") || block.querySelector("code");
    if (!code) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code";
    button.textContent = label;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.innerText);
        button.textContent = done;
        setTimeout(() => (button.textContent = label), 2000);
      } catch (e) {}
    });
    block.appendChild(button);
  });
}
