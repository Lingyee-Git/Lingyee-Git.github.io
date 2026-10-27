(function () {
    "use strict";

    /* ===== DOM 引用 ===== */
    const root = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");
    const languageButtons = document.querySelectorAll(".lang-button");

    /* ===== 主题按钮提示文字 ===== */
    function updateThemeToggleLabel() {
        if (!themeToggle) return;

        const isDark = root.dataset.theme === "dark";
        const isEnglish = root.lang.toLowerCase().startsWith("en");

        const label = isEnglish
            ? (isDark ? "Switch to light mode" : "Switch to dark mode")
            : (isDark ? "切换浅色模式" : "切换深色模式");

        themeToggle.setAttribute("aria-label", label);
        themeToggle.setAttribute("title", label);
    }

    /* ===== 主题切换 ===== */
    function setTheme(theme) {
        const isDark = theme === "dark";
        root.dataset.theme = isDark ? "dark" : "light";

        if (themeToggle) {
            themeToggle.setAttribute("aria-pressed", String(isDark));
        }

        updateThemeToggleLabel();

        try {
            localStorage.setItem("portfolio-theme", root.dataset.theme);
        } catch (_) {}
    }

    /* ===== 中英文切换 ===== */
    function setLanguage(language) {
        root.lang = language === "zh" ? "zh-CN" : "en";

        document.querySelectorAll("[data-zh][data-en]").forEach(element => {
            element.textContent = element.dataset[language];
        });

        document.querySelectorAll("[data-aria-zh][data-aria-en]").forEach(element => {
            const key = language === "zh" ? "ariaZh" : "ariaEn";
            element.setAttribute("aria-label", element.dataset[key]);
        });

        languageButtons.forEach(button => {
            const isSelected = button.dataset.lang === language;
            button.classList.toggle("selected", isSelected);
            button.setAttribute("aria-pressed", String(isSelected));
        });

        document.title = language === "zh"
            ? "袁心仪 | 个人主页"
            : "Yuan Xinyi | Personal Website";

        updateThemeToggleLabel();

        try {
            sessionStorage.setItem("portfolio-language", language);
        } catch (_) {}
    }

    /* ===== 初始化：先主题，后语言 ===== */
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem("portfolio-theme");
    } catch (_) {}
    setTheme(savedTheme === "dark" ? "dark" : "light");

    let savedLanguage = null;
    try {
        savedLanguage = sessionStorage.getItem("portfolio-language");
    } catch (_) {}
    setLanguage(
        savedLanguage === "en" || savedLanguage === "zh" ? savedLanguage : "zh"
    );

    /* ===== 事件绑定 ===== */
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            setTheme(root.dataset.theme === "dark" ? "light" : "dark");
        });
    }

    languageButtons.forEach(button => {
        button.addEventListener("click", () => {
            setLanguage(button.dataset.lang);
        });
    });

    /* ===== 滚动时高亮对应导航项 ===== */
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const id = `#${entry.target.id}`;

                navLinks.forEach(link => {
                    const isActive = link.getAttribute("href") === id;
                    link.classList.toggle("active", isActive);

                    if (isActive) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        }, { rootMargin: "-25% 0px -65% 0px" });

        sections.forEach(section => observer.observe(section));
    }

    /* ===== 自动更新页脚年份 ===== */
    document.querySelectorAll(".year").forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    /* ===== 动态列表：按时间排序、限量、分页 ===== */
    const NEWS_PER_PAGE = 5;
    const newsTimeline = document.querySelector(".news-timeline");

    if (newsTimeline) {
        const newsItems = Array.from(newsTimeline.querySelectorAll(".news-item"));

        newsItems.sort((a, b) => {
            const ta = a.querySelector("time")?.getAttribute("datetime") || "";
            const tb = b.querySelector("time")?.getAttribute("datetime") || "";
            return tb.localeCompare(ta);
        });

        newsItems.forEach(item => newsTimeline.appendChild(item));

        const pagination = document.createElement("div");
        pagination.className = "news-pagination";
        newsTimeline.after(pagination);

        let currentPage = 1;
        const totalPages = Math.max(1, Math.ceil(newsItems.length / NEWS_PER_PAGE));

        function renderNewsPage(page) {
            currentPage = Math.min(Math.max(page, 1), totalPages);
            const start = (currentPage - 1) * NEWS_PER_PAGE;
            const end = start + NEWS_PER_PAGE;

            newsItems.forEach((item, index) => {
                item.style.display = (index >= start && index < end) ? "" : "none";
                item.classList.remove("is-last-visible");
            });

            const visibleItems = newsItems.slice(start, end);
            if (visibleItems.length > 0) {
                visibleItems[visibleItems.length - 1].classList.add("is-last-visible");
            }

            renderPagination();

            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }

        function renderPagination() {
            pagination.innerHTML = "";
            if (totalPages <= 1) return;

            const isEnglish = root.lang.toLowerCase().startsWith("en");
            const lang = isEnglish ? "en" : "zh";

            const prev = document.createElement("button");
            prev.type = "button";
            prev.className = "page-button";
            prev.dataset.zh = "上一页";
            prev.dataset.en = "Previous";
            prev.textContent = lang === "en" ? "Previous" : "上一页";
            prev.disabled = currentPage === 1;
            prev.addEventListener("click", () => renderNewsPage(currentPage - 1));
            pagination.appendChild(prev);

            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "page-button";
                if (i === currentPage) {
                    btn.classList.add("active");
                    btn.setAttribute("aria-current", "page");
                }
                btn.textContent = i;
                btn.dataset.ariaZh = `第 ${i} 页`;
                btn.dataset.ariaEn = `Page ${i}`;
                btn.setAttribute("aria-label", lang === "en" ? `Page ${i}` : `第 ${i} 页`);
                btn.addEventListener("click", () => renderNewsPage(i));
                pagination.appendChild(btn);
            }

            const next = document.createElement("button");
            next.type = "button";
            next.className = "page-button";
            next.dataset.zh = "下一页";
            next.dataset.en = "Next";
            next.textContent = lang === "en" ? "Next" : "下一页";
            next.disabled = currentPage === totalPages;
            next.addEventListener("click", () => renderNewsPage(currentPage + 1));
            pagination.appendChild(next);
        }

        renderNewsPage(1);
    }
})();