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
