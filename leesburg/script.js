const LANGUAGE_STORAGE_KEY = "tutifrutsy-language";
const currentLanguage = document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "es";
const preferredLanguage = (() => {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
})();
const deviceLanguage = (navigator.languages?.[0] || navigator.language || "es").toLowerCase();
const isCrawler = /bot|crawl|spider|slurp|bingpreview|duckduckgo|baiduspider|yandex/i.test(navigator.userAgent || "");
const resolvedLanguage = preferredLanguage === "en" || preferredLanguage === "es"
  ? preferredLanguage
  : (deviceLanguage.startsWith("en") ? "en" : "es");

if (!isCrawler && currentLanguage !== resolvedLanguage) {
  window.location.replace(resolvedLanguage === "en" ? "/en/leesburg/" : "/leesburg/");
}

document.querySelectorAll("[data-lang-switch]").forEach((link) => {
  link.addEventListener("click", () => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, link.dataset.targetLang || "es");
    } catch {
      // Language navigation still works if browser storage is unavailable.
    }
  });
});

const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const header = document.querySelector("[data-header]");
const notice = document.querySelector("[data-expiring-notice]");

const closeMenu = () => {
  if (!nav || !navToggle) return;
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", currentLanguage === "en" ? "Open menu" : "Abrir menú");
};

if (nav && navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen
      ? (currentLanguage === "en" ? "Close menu" : "Cerrar menú")
      : (currentLanguage === "en" ? "Open menu" : "Abrir menú"));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1020) closeMenu();
  });
}

const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (notice) {
  const expiration = Number(notice.dataset.expireAfter?.replaceAll("-", ""));
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const today = Number(`${values.year}${values.month}${values.day}`);

  if (Number.isFinite(expiration) && today > expiration) {
    notice.hidden = true;
  }
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});
