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

if (!isCrawler && currentLanguage === "es" && !preferredLanguage && deviceLanguage.startsWith("en")) {
  window.location.replace("/en/");
}

document.querySelectorAll("[data-lang-switch]").forEach((link) => {
  link.addEventListener("click", () => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, link.dataset.targetLang || "es");
    } catch {
      // Navigation still works when localStorage is unavailable.
    }
  });
});

const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? (currentLanguage === "en" ? "Close menu" : "Cerrar menu") : (currentLanguage === "en" ? "Open menu" : "Abrir menu"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", currentLanguage === "en" ? "Open menu" : "Abrir menu");
    });
  });
}

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

let headerTicking = false;
const requestHeaderUpdate = () => {
  if (headerTicking) return;
  headerTicking = true;
  window.requestAnimationFrame(() => {
    updateHeader();
    headerTicking = false;
  });
};

updateHeader();
window.addEventListener("scroll", requestHeaderUpdate, { passive: true });

window.addEventListener("resize", () => {
  if (!nav || !navToggle) return;
  if (window.innerWidth >= 900) {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const userAgent = navigator.userAgent || "";
const isAndroid = /Android/i.test(userAgent);
const isIOS = /iPad|iPhone|iPod/i.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isSafari = /^((?!chrome|android|crios|fxios|edg|opr).)*safari/i.test(userAgent);

document.querySelectorAll("[data-map-link]").forEach((link) => {
  const googleMapsUrl = link.dataset.googleMaps;
  const appleMapsUrl = link.dataset.appleMaps;
  if (!googleMapsUrl || !appleMapsUrl) return;

  link.href = !isAndroid && (isIOS || isSafari) ? appleMapsUrl : googleMapsUrl;
});

const tiktokSection = document.querySelector("[data-tiktok-lazy]");
let tiktokLoadStarted = false;

const processTikTokEmbeds = () => {
  const load = () => {
    if (window.tiktokEmbed && typeof window.tiktokEmbed.load === "function") {
      window.tiktokEmbed.load();
    }
  };

  load();
  window.setTimeout(load, 450);
  window.setTimeout(load, 1200);
  window.setTimeout(load, 2500);
};

const loadTikTokEmbeds = () => {
  if (!tiktokSection) return;

  if (tiktokLoadStarted) {
    processTikTokEmbeds();
    return;
  }

  tiktokLoadStarted = true;

  const existingScript = document.querySelector('script[src*="tiktok.com/embed.js"]');
  if (existingScript) {
    existingScript.addEventListener("load", processTikTokEmbeds, { once: true });
    processTikTokEmbeds();
    return;
  }

  const script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js";
  script.async = true;
  script.addEventListener("load", processTikTokEmbeds, { once: true });
  document.body.appendChild(script);
};

if (tiktokSection) {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadTikTokEmbeds();
        observer.disconnect();
      }
    }, { rootMargin: "900px 0px" });

    observer.observe(tiktokSection);
  } else {
    const checkTikTokDistance = () => {
      const distance = tiktokSection.getBoundingClientRect().top - window.innerHeight;
      if (distance < 900) {
        loadTikTokEmbeds();
        window.removeEventListener("scroll", checkTikTokDistance);
        window.removeEventListener("resize", checkTikTokDistance);
      }
    };

    window.addEventListener("scroll", checkTikTokDistance, { passive: true });
    window.addEventListener("resize", checkTikTokDistance);
    checkTikTokDistance();
  }

  document.querySelectorAll('a[href="#tiktok"]').forEach((link) => {
    link.addEventListener("click", loadTikTokEmbeds, { once: true });
    link.addEventListener("focus", loadTikTokEmbeds, { once: true });
    link.addEventListener("pointerenter", loadTikTokEmbeds, { once: true });
  });

  window.addEventListener("pageshow", processTikTokEmbeds);
}

const featuredCarousel = document.querySelector("[data-featured-carousel]");

if (featuredCarousel) {
  const viewport = featuredCarousel.querySelector("[data-carousel-viewport]");
  const track = featuredCarousel.querySelector("[data-carousel-track]");
  const cards = Array.from(featuredCarousel.querySelectorAll(".feature-card"));
  const prev = featuredCarousel.querySelector("[data-carousel-prev]");
  const next = featuredCarousel.querySelector("[data-carousel-next]");
  const dotsContainer = featuredCarousel.querySelector("[data-carousel-dots]");
  let activeIndex = 0;
  let autoplayId;
  let userInterrupted = false;

  const visibleCount = () => {
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const maxIndex = () => Math.max(cards.length - visibleCount(), 0);

  const cardStep = () => {
    if (cards.length < 2) return cards[0]?.getBoundingClientRect().width || 0;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  };

  const normalizeIndex = (index, shouldLoop = false) => {
    const lastIndex = maxIndex();

    if (!shouldLoop) {
      return Math.max(0, Math.min(index, lastIndex));
    }

    if (index < 0) return lastIndex;
    if (index > lastIndex) return 0;
    return index;
  };

  const goTo = (index, shouldLoop = false) => {
    activeIndex = normalizeIndex(index, shouldLoop);
    viewport.scrollTo({ left: activeIndex * cardStep(), behavior: "smooth" });
    updateDots();
  };

  const stopAutoplay = () => {
    userInterrupted = true;
    window.clearInterval(autoplayId);
  };

  const updateDots = () => {
    dotsContainer.querySelectorAll(".carousel-dot").forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const buildDots = () => {
    dotsContainer.textContent = "";
    for (let index = 0; index <= maxIndex(); index += 1) {
      const first = index + 1;
      const last = Math.min(index + visibleCount(), cards.length);
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", currentLanguage === "en" ? `View products ${first} to ${last}` : `Ver productos ${first} a ${last}`);
      dot.addEventListener("click", () => {
        stopAutoplay();
        goTo(index);
      });
      dotsContainer.appendChild(dot);
    }
    updateDots();
  };

  const startAutoplay = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    autoplayId = window.setInterval(() => {
      if (userInterrupted) return;
      goTo(activeIndex + 1, true);
    }, 3000);
  };

  prev.addEventListener("click", () => {
    stopAutoplay();
    goTo(activeIndex - 1, true);
  });

  next.addEventListener("click", () => {
    stopAutoplay();
    goTo(activeIndex + 1, true);
  });

  [viewport, track].forEach((element) => {
    element.addEventListener("pointerdown", stopAutoplay, { once: true });
    element.addEventListener("touchstart", stopAutoplay, { once: true, passive: true });
    element.addEventListener("wheel", stopAutoplay, { once: true, passive: true });
  });

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      stopAutoplay();
      event.preventDefault();
      goTo(activeIndex + (event.key === "ArrowRight" ? 1 : -1), true);
    }
  });

  let carouselTicking = false;
  viewport.addEventListener("scroll", () => {
    if (carouselTicking) return;
    carouselTicking = true;
    window.requestAnimationFrame(() => {
      const step = cardStep();
      if (step) {
        activeIndex = Math.max(0, Math.min(Math.round(viewport.scrollLeft / step), maxIndex()));
        updateDots();
      }
      carouselTicking = false;
    });
  }, { passive: true });

  window.addEventListener("resize", () => {
    buildDots();
    goTo(activeIndex);
  });

  buildDots();
  startAutoplay();
}
