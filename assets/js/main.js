/* =========================
FILE: assets/js/main.js
========================= */

(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  }

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", current);
    localStorage.setItem("theme", current);
  });
})();


/* =========================
SUBTLE SCROLL PARALLAX
========================= */

(function () {
  const bg = document.querySelector(".parallax-bg");
  const cards = document.querySelectorAll(".parallax-card");
  const founder = document.querySelector(".parallax-founder");

  if (window.innerWidth < 768) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;

    // Hero background
    if (bg) {
      bg.style.transform = `translate3d(0, ${scrolled * 0.15}px, 0)`;
    }

    // Cards depth
    cards.forEach((card, i) => {
      const offset = scrolled * 0.03;
      card.style.transform = `translate3d(0, ${offset}px, 0)`;
    });

    // Founder cinematic drift
    if (founder) {
      founder.style.transform = `translate3d(0, ${scrolled * 0.08}px, 0)`;
    }
  });
})();
