(() => {
    const footer = document.querySelector("#footer");
    if (!footer) return;

    const sections = footer.querySelectorAll("[data-footer-reveal]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
        sections.forEach((section) => section.classList.add("is-in-view"));
        return;
    }

    footer.classList.add("footer-motion-ready");

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in-view");
            currentObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -36px 0px",
    });

    sections.forEach((section, index) => {
        section.style.setProperty("--footer-reveal-delay", `${Math.min(index * 90, 270)}ms`);
        observer.observe(section);
    });
})();
