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
    const NEWS_PER_PAGE = 3;
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
            // 只有一页时不显示分页
            if (totalPages <= 1) {
                pagination.style.display = "none";
                return;
            }
            pagination.style.display = "flex";

            const isEnglish = root.lang.toLowerCase().startsWith("en");
            
            // 创建左右箭头
            const createArrowBtn = (isPrev) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "page-button arrow-button";
                btn.disabled = isPrev ? currentPage === 1 : currentPage === totalPages;
                btn.setAttribute("aria-label", isPrev ? (isEnglish ? "Previous" : "上一页") : (isEnglish ? "Next" : "下一页"));
                btn.innerHTML = isPrev ? "&lt;" : "&gt;";
                btn.addEventListener("click", () => renderNewsPage(isPrev ? currentPage - 1 : currentPage + 1));
                return btn;
            };

            // 创建数字按钮
            const createNumBtn = (num) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "page-button num-button";
                if (num === currentPage) {
                    btn.classList.add("current");
                    btn.setAttribute("aria-current", "page");
                }
                btn.textContent = num;
                btn.addEventListener("click", () => renderNewsPage(num));
                return btn;
            };

            // 创建省略号
            const createEllipsis = () => {
                const span = document.createElement("span");
                span.className = "page-ellipsis";
                span.textContent = "...";
                return span;
            };

            const fragment = document.createDocumentFragment();
            
            // 渲染左箭头
            fragment.appendChild(createArrowBtn(true));

            // 渲染页码逻辑
            if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) {
                    fragment.appendChild(createNumBtn(i));
                }
            } else {
                if (currentPage <= 4) {
                    for (let i = 1; i <= 5; i++) {
                        fragment.appendChild(createNumBtn(i));
                    }
                    fragment.appendChild(createEllipsis());
                    fragment.appendChild(createNumBtn(totalPages));
                } else if (currentPage >= totalPages - 3) {
                    fragment.appendChild(createNumBtn(1));
                    fragment.appendChild(createEllipsis());
                    for (let i = totalPages - 4; i <= totalPages; i++) {
                        fragment.appendChild(createNumBtn(i));
                    }
                } else {
                    fragment.appendChild(createNumBtn(1));
                    fragment.appendChild(createEllipsis());
                    fragment.appendChild(createNumBtn(currentPage - 1));
                    fragment.appendChild(createNumBtn(currentPage));
                    fragment.appendChild(createNumBtn(currentPage + 1));
                    fragment.appendChild(createEllipsis());
                    fragment.appendChild(createNumBtn(totalPages));
                }
            }

            // 渲染右箭头
            fragment.appendChild(createArrowBtn(false));

            pagination.appendChild(fragment);
        }

        renderNewsPage(1);
    }
})();