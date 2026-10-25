// Language switch: text is stored in data-zh and data-en attributes in index.html.
const languageButtons = document.querySelectorAll(".lang-button");

function setLanguage(language) {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-zh][data-en]").forEach((element) => {
    element.textContent = element.dataset[language];
  });

  languageButtons.forEach((button) => {
    const isSelected = button.dataset.lang === language;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  document.title = language === "zh"
    ? "袁心仪 · 个人主页"
    : "Yuan Xinyi · Personal Website";

  // Remember the language during this browser session only.
  try {
    sessionStorage.setItem("portfolio-language", language);
  } catch (_) {
    // The page still works if browser storage is unavailable.
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

document.getElementById("year").textContent = new Date().getFullYear();

try {
  const savedLanguage = sessionStorage.getItem("portfolio-language");
  if (savedLanguage === "en" || savedLanguage === "zh") setLanguage(savedLanguage);
} catch (_) {
  // Keep the default Chinese version.
}

// Highlight the navigation item for the section currently in view.
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-25% 0px -65% 0px" });

  sections.forEach((section) => observer.observe(section));
}
