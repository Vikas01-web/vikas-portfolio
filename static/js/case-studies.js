(function () {
    "use strict";

    function initializeCaseStudyReveals() {
        const pageSelectors = [
            ".case-studies-section",
            ".case-index-page",
            ".single-case-page"
        ];
        const pages = document.querySelectorAll(pageSelectors.join(","));
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion || !("IntersectionObserver" in window)) return;

        pages.forEach(function (page) {
            const targets = page.querySelectorAll("[data-case-reveal]");
            if (!targets.length) return;

            page.classList.add("case-reveal-ready");

            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("case-is-visible");
                    observer.unobserve(entry.target);
                });
            }, {
                threshold: 0.12,
                rootMargin: "0px 0px -36px 0px"
            });

            targets.forEach(function (target, index) {
                target.style.setProperty(
                    "--case-reveal-delay",
                    Math.min(index % 5, 4) * 90 + "ms"
                );
                observer.observe(target);
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeCaseStudyReveals, { once: true });
    } else {
        initializeCaseStudyReveals();
    }
})();
