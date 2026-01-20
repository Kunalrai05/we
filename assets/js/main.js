/* =========================
FILE: assets/js/main.js
========================= */

/* =========================
THEME TOGGLE
========================= */
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const current =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", current);
      localStorage.setItem("theme", current);
    });
  }
})();

/* =========================
GLOBAL TOAST
========================= */
function showToast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2200);
}

/* =========================
IMAGE FADE IN
========================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach(img => {
    if (img.complete) img.classList.add("loaded");
    else img.onload = () => img.classList.add("loaded");
  });
});

/* =========================
SCROLL REVEAL (DYNAMIC SAFE)
========================= */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

function observeReveals(scope = document) {
  scope.querySelectorAll(".reveal:not(.visible)").forEach(el => {
    revealObserver.observe(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  observeReveals();
});

/* =========================
SUBTLE SCROLL PARALLAX
========================= */
(function () {
  if (window.innerWidth < 768) return;

  const bg = document.querySelector(".parallax-bg");
  const cards = document.querySelectorAll(".parallax-card");
  const founder = document.querySelector(".parallax-founder");

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;

    if (bg) {
      bg.style.transform = `translate3d(0, ${scrolled * 0.12}px, 0)`;
    }

    cards.forEach(card => {
      card.style.transform = `translate3d(0, ${scrolled * 0.03}px, 0)`;
    });

    if (founder) {
      founder.style.transform = `translate3d(0, ${scrolled * 0.08}px, 0)`;
    }
  });
})();
/* ===============================
 HERO + CATEGORY REVEAL SYSTEM
 =============================== */

document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");
  const heroVisual = document.querySelector(".hero-visual");

  // Hero immediate reveal
  setTimeout(() => {
    reveals.forEach((el, i) => {
      if (el.closest(".hero")) {
        setTimeout(() => el.classList.add("show"), i * 120);
      }
    });

    if (heroVisual) heroVisual.classList.add("show");
  }, 100);

  // Scroll reveal
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach(el => observer.observe(el));
});
