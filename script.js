// =========================================================
// Footer year
// =========================================================
document.getElementById("year").textContent = new Date().getFullYear();

// =========================================================
// Sticky nav background + scroll progress bar
// =========================================================
const nav = document.getElementById("nav");
const progress = document.getElementById("scroll-progress");

const updateScroll = () => {
  const doc = document.documentElement;
  nav.classList.toggle("is-scrolled", window.scrollY > 20);
  const scrollable = doc.scrollHeight - doc.clientHeight;
  const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = pct + "%";
};
updateScroll();
window.addEventListener("scroll", updateScroll, { passive: true });

// =========================================================
// Mobile nav toggle
// =========================================================
const toggle = document.querySelector(".nav__toggle");
const mobileMenu = document.getElementById("mobile-menu");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
  mobileMenu.hidden = !open;
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  });
});

// =========================================================
// Reveal on scroll
// =========================================================
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);
revealEls.forEach((el) => revealObserver.observe(el));

// =========================================================
// Active section highlight in nav
// =========================================================
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav__links a");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((section) => sectionObserver.observe(section));

// =========================================================
// Hero word rotator
// =========================================================
const rotatorEl = document.getElementById("rotator-word");
const words = ["embedded systems", "ML models", "FPGA designs", "firmware"];
let rotatorIdx = 0;

const cycleRotator = () => {
  if (!rotatorEl) return;
  rotatorEl.classList.add("is-leaving");
  setTimeout(() => {
    rotatorIdx = (rotatorIdx + 1) % words.length;
    rotatorEl.textContent = words[rotatorIdx];
    rotatorEl.classList.remove("is-leaving");
    rotatorEl.classList.add("is-entering");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => rotatorEl.classList.remove("is-entering"));
    });
  }, 420);
};

if (rotatorEl && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setInterval(cycleRotator, 2600);
}

// =========================================================
// Cursor-follow spotlight on cards
// =========================================================
const spotlightCards = document.querySelectorAll(
  ".project, .exp, .contact__card, .meta-card, .skills__group"
);
spotlightCards.forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });
});

// =========================================================
// Magnetic buttons (pointer devices only)
// =========================================================
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".btn, .hero__socials a").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
}

// =========================================================
// Animated stats counters
// =========================================================
const animateCount = (el) => {
  const target = parseFloat(el.dataset.target);
  if (Number.isNaN(target)) return;
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (target * eased).toFixed(decimals);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals);
  };
  requestAnimationFrame(tick);
};

const statValues = document.querySelectorAll(".stat__value[data-target]");
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
statValues.forEach((el) => statsObserver.observe(el));

// =========================================================
// Toast
// =========================================================
const toastEl = document.getElementById("toast");
let toastTimer;
const showToast = (msg) => {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  requestAnimationFrame(() => toastEl.classList.add("is-visible"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("is-visible");
    setTimeout(() => (toastEl.hidden = true), 250);
  }, 2200);
};

// =========================================================
// Command palette (⌘K)
// =========================================================
const palette = document.getElementById("palette");
const paletteInput = document.getElementById("palette-input");
const paletteList = document.getElementById("palette-list");
const paletteTrigger = document.getElementById("palette-trigger");

const goTo = (hash) => {
  closePalette();
  setTimeout(() => {
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
};

const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
};

const ICONS = {
  arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  mail: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  github: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.57.1.78-.25.78-.55v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.27-5.24-5.67 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.37-5.26 5.66.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>',
  linkedin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z"/></svg>',
  trophy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
};

const COMMANDS = [
  { group: "Sections", label: "About", sub: "A quick introduction", icon: ICONS.arrow, keywords: "about intro me", action: () => goTo("#about") },
  { group: "Sections", label: "Experience", sub: "Lumentum · DND", icon: ICONS.arrow, keywords: "experience work jobs lumentum dnd", action: () => goTo("#experience") },
  { group: "Sections", label: "Projects", sub: "Hackathon, ML, Embedded, FPGA", icon: ICONS.arrow, keywords: "projects work portfolio", action: () => goTo("#projects") },
  { group: "Sections", label: "Skills", sub: "Languages, ML, hardware, tools", icon: ICONS.arrow, keywords: "skills tech stack tools", action: () => goTo("#skills") },
  { group: "Sections", label: "Contact", sub: "Get in touch", icon: ICONS.arrow, keywords: "contact reach hire email", action: () => goTo("#contact") },

  { group: "Actions", label: "Download CV", sub: "Resume PDF", icon: ICONS.download, keywords: "cv resume download pdf", action: () => window.open("./assets/Resume-2.pdf", "_blank") },
  { group: "Actions", label: "Copy email", sub: "e.coumine@gmail.com", icon: ICONS.copy, keywords: "email copy contact gmail", action: () => { copyToClipboard("e.coumine@gmail.com"); showToast("Email copied to clipboard ✓"); } },
  { group: "Actions", label: "Send email", sub: "Open mail client", icon: ICONS.mail, keywords: "email send write contact", action: () => { window.location.href = "mailto:e.coumine@gmail.com"; } },

  { group: "Links", label: "GitHub", sub: "@EliasCoumine", icon: ICONS.github, keywords: "github code repo", action: () => window.open("https://github.com/EliasCoumine", "_blank") },
  { group: "Links", label: "LinkedIn", sub: "/in/elias-coumine", icon: ICONS.linkedin, keywords: "linkedin profile", action: () => window.open("https://www.linkedin.com/in/elias-coumine-725582297/", "_blank") },

  { group: "Highlights", label: "MakeMIT × Harvard — 2nd Place", sub: "Autonomous AI Drone", icon: ICONS.trophy, keywords: "hackathon drone makemit harvard award", action: () => goTo("#projects") },
];

let activeIdx = 0;
let currentResults = [];

const renderPalette = (query = "") => {
  const q = query.trim().toLowerCase();
  const filtered = q
    ? COMMANDS.filter((c) => (c.label + " " + (c.sub || "") + " " + (c.keywords || "")).toLowerCase().includes(q))
    : COMMANDS;

  currentResults = filtered;
  activeIdx = 0;
  paletteList.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "palette__empty";
    empty.textContent = "No results found.";
    paletteList.appendChild(empty);
    return;
  }

  let lastGroup = null;
  filtered.forEach((cmd, i) => {
    if (cmd.group !== lastGroup) {
      const g = document.createElement("li");
      g.className = "palette__group-label";
      g.textContent = cmd.group;
      paletteList.appendChild(g);
      lastGroup = cmd.group;
    }
    const li = document.createElement("li");
    li.className = "palette__item" + (i === activeIdx ? " is-active" : "");
    li.setAttribute("role", "option");
    li.dataset.index = i;
    li.innerHTML = `
      <span class="palette__item-icon">${cmd.icon}</span>
      <span class="palette__item-text">
        <span class="palette__item-label">${cmd.label}</span>
        ${cmd.sub ? `<span class="palette__item-sub">${cmd.sub}</span>` : ""}
      </span>
      <span class="palette__item-shortcut">${cmd.group}</span>
    `;
    li.addEventListener("click", () => cmd.action());
    li.addEventListener("mousemove", () => setActive(i));
    paletteList.appendChild(li);
  });
};

const setActive = (i) => {
  activeIdx = i;
  paletteList.querySelectorAll(".palette__item").forEach((el) => {
    const idx = parseInt(el.dataset.index, 10);
    el.classList.toggle("is-active", idx === activeIdx);
    if (idx === activeIdx) el.scrollIntoView({ block: "nearest" });
  });
};

const openPalette = () => {
  palette.hidden = false;
  paletteInput.value = "";
  renderPalette();
  setTimeout(() => paletteInput.focus(), 10);
  document.body.style.overflow = "hidden";
};

const closePalette = () => {
  palette.hidden = true;
  document.body.style.overflow = "";
};

paletteTrigger.addEventListener("click", openPalette);
palette.querySelectorAll("[data-palette-close]").forEach((el) => {
  el.addEventListener("click", closePalette);
});

paletteInput.addEventListener("input", (e) => renderPalette(e.target.value));

paletteInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    setActive(Math.min(currentResults.length - 1, activeIdx + 1));
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    setActive(Math.max(0, activeIdx - 1));
  } else if (e.key === "Enter") {
    e.preventDefault();
    const cmd = currentResults[activeIdx];
    if (cmd) cmd.action();
  } else if (e.key === "Escape") {
    closePalette();
  }
});

// Global ⌘K / Ctrl+K shortcut
window.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (palette.hidden) openPalette();
    else closePalette();
  } else if (e.key === "Escape" && !palette.hidden) {
    closePalette();
  }
});
