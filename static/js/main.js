/* =========================================================
   VIKAS KUMAR — MAIN.JS
   COMPLETE FIXED VERSION
   =========================================================
   FIXES:
   1. No broken DOMContentLoaded scope
   2. Navbar hides on DOWN scroll and shows on UP scroll
   3. Mobile menu works reliably
   4. Active nav supports HOME / ABOUT / WORK / EXPERIENCE /
      CERTIFICATES / SKILLS / BLOG / CONTACT
   5. WORK covers What I Build + Projects
   6. CERTIFICATES uses #certificates and also supports
      #certifications as a compatibility fallback
   7. Smooth scrolling works even when sections are dynamic
   8. Section animations run from Hero through Footer
   9. Skills and Blog are included in active navigation
   10. No duplicate global constants or broken scope references
   11. Loader cannot leave the page permanently locked
   12. Reduced-motion support
   13. Resize/mobile safety
   14. Contact and footer interactions
   ========================================================= */

(function () {
    "use strict";

    /* =========================================================
       GLOBAL HELPERS
       ========================================================= */

    const qs = (selector, scope = document) => {
        if (!selector) {
            return null;
        }

        try {
            return scope.querySelector(selector);
        } catch (error) {
            return null;
        }
    };


    const qsa = (selector, scope = document) => {
        if (!selector) {
            return [];
        }

        try {
            return Array.from(scope.querySelectorAll(selector));
        } catch (error) {
            return [];
        }
    };


    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    const desktopQuery = window.matchMedia(
        "(min-width: 801px)"
    );


    const MOBILE_BREAKPOINT = 800;


    let header = null;
    let menuButton = null;
    let mobileMenu = null;
    let navbarLinks = [];
    let lastScrollY = 0;
    let scrollTicking = false;
    let activeNavTargets = [];


    /* =========================================================
       DOM READY
       ========================================================= */

    function boot() {

        header = qs(".site-header");

        menuButton = qs(
            ".navbar-menu-button"
        );

        mobileMenu = qs(
            ".navbar-mobile-menu"
        );

        navbarLinks = qsa(
            ".navbar-link"
        );


        initLoader();

        if (header) {
            header.style.transform =
                "translate3d(0, 0, 0)";
        }

        initNavbar();

        initSmoothScrolling();

        initActiveNavigation();

        initGlobalSectionReveal();

        initHero();

        initAbout();

        initWhatBuild();

        initProjects();

        initExperience();

        initCertificates();

        initSkills();

        initBlog();

        initContact();

        initFooter();

        initImageLoading();

        initGlobalKeyboardSupport();

        initResizeSupport();

        document.body.classList.add(
            "page-ready"
        );


        /*
         * Run once after layout has settled.
         * This is important for Django templates because
         * images and fonts can change section offsets.
         */

        window.setTimeout(() => {

            updateActiveNavigation();

            handleNavbarScroll();

        }, 150);


        window.setTimeout(() => {

            updateActiveNavigation();

        }, 800);

    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            boot,
            { once: true }
        );

    } else {

        boot();

    }


    /* =========================================================
       PAGE LOADER
       ========================================================= */

    function initLoader() {

        const loader =
            qs("#page-loader");


        if (!loader) {

            document.documentElement.classList.remove(
                "loader-active"
            );

            document.body.classList.remove(
                "loader-active"
            );

            return;
        }


        const progressBar =
            qs(
                "#loader-progress-bar",
                loader
            );


        const percentText =
            qs(
                "#loader-percent",
                loader
            );


        const statusText =
            qs(
                "#loader-status-text",
                loader
            );


        const statuses = [
            "Loading portfolio",
            "Preparing interface",
            "Loading components",
            "Initializing experience",
            "Almost ready"
        ];


        let progress = 0;

        let finished = false;


        document.documentElement.classList.add(
            "loader-active"
        );

        document.body.classList.add(
            "loader-active"
        );


        const updateLoader = () => {

            if (
                finished ||
                !loader.isConnected
            ) {

                return;

            }


            let increment = 0;


            if (progress < 30) {

                increment =
                    Math.random() * 7 + 4;

            } else if (progress < 70) {

                increment =
                    Math.random() * 5 + 2;

            } else if (progress < 90) {

                increment =
                    Math.random() * 3 + 1;

            } else {

                increment =
                    Math.random() * 1.8 + 0.5;

            }


            progress = Math.min(
                progress + increment,
                100
            );


            if (progressBar) {

                progressBar.style.width =
                    `${progress}%`;

            }


            if (percentText) {

                percentText.textContent =
                    `${Math.floor(progress)
                        .toString()
                        .padStart(2, "0")}%`;

            }


            if (statusText) {

                const index =
                    Math.min(
                        Math.floor(
                            progress / 20
                        ),
                        statuses.length - 1
                    );


                statusText.textContent =
                    statuses[index];

            }


            if (
                progress < 100
            ) {

                window.setTimeout(
                    updateLoader,
                    70 + Math.random() * 80
                );

            } else {

                finishLoader();

            }

        };


        const finishLoader = () => {

            if (finished) {

                return;

            }


            finished = true;


            window.setTimeout(
                () => {

                    loader.classList.add(
                        "loader-complete"
                    );


                    loader.classList.add(
                        "is-hidden"
                    );


                    document.documentElement.classList.remove(
                        "loader-active"
                    );


                    document.body.classList.remove(
                        "loader-active"
                    );


                    window.setTimeout(
                        () => {

                            if (
                                loader &&
                                loader.parentNode
                            ) {

                                loader.style.display =
                                    "none";

                            }

                        },
                        850
                    );

                },
                reducedMotion ? 0 : 400
            );

        };


        updateLoader();


        /*
         * If assets are already loaded, never wait forever
         * for the simulated percentage animation.
         */

        window.addEventListener(
            "load",
            () => {

                window.setTimeout(
                    () => {

                        progress = 100;

                        if (progressBar) {

                            progressBar.style.width =
                                "100%";

                        }

                        if (percentText) {

                            percentText.textContent =
                                "100%";

                        }

                        finishLoader();

                    },
                    reducedMotion ? 0 : 250
                );

            },
            { once: true }
        );


        /*
         * Absolute safety fallback.
         * A slow or broken resource should never trap
         * the visitor behind the loader.
         */

        window.setTimeout(
            () => {

                if (!finished) {

                    progress = 100;

                    finishLoader();

                }

            },
            7000
        );

    }


    /* =========================================================
       NAVBAR — MOBILE MENU
       ========================================================= */

    function initNavbar() {

        if (!header) {

            return;

        }


        if (menuButton) {

            menuButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();

                    toggleMobileMenu();

                }
            );

        }


        qsa(
            ".navbar-mobile-menu a",
            mobileMenu || document
        ).forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        closeMobileMenu();

                    }
                );

            }
        );


        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape"
                ) {

                    closeMobileMenu();

                }

            }
        );


        document.addEventListener(
            "click",
            (event) => {

                if (
                    !header.classList.contains(
                        "menu-active"
                    )
                ) {

                    return;

                }


                if (
                    mobileMenu &&
                    mobileMenu.contains(
                        event.target
                    )
                ) {

                    return;

                }


                if (
                    menuButton &&
                    menuButton.contains(
                        event.target
                    )
                ) {

                    return;

                }


                closeMobileMenu();

            }
        );


        window.addEventListener(
            "scroll",
            onScroll,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth >
                    MOBILE_BREAKPOINT
                ) {

                    closeMobileMenu();

                }

            }
        );


        handleNavbarScroll();

    }


    function toggleMobileMenu() {

        if (!header) {

            return;

        }


        const isOpen =
            header.classList.contains(
                "menu-active"
            );


        if (isOpen) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    }


    function openMobileMenu() {

        if (!header) {

            return;

        }


        header.classList.add(
            "menu-active"
        );


        header.classList.remove(
            "nav-hidden"
        );


        if (mobileMenu) {

            mobileMenu.classList.add(
                "is-open"
            );

        }


        if (menuButton) {

            menuButton.classList.add(
                "is-open"
            );


            menuButton.classList.add(
                "is-active"
            );


            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );


            menuButton.setAttribute(
                "aria-label",
                "Close navigation"
            );

        }


        document.body.classList.add(
            "menu-open"
        );

    }


    function closeMobileMenu() {

        if (header) {

            header.classList.remove(
                "menu-active"
            );

        }


        if (mobileMenu) {

            mobileMenu.classList.remove(
                "is-open"
            );

        }

        if (header) {
            header.style.transform =
                "translate3d(0, 0, 0)";
        }


        if (menuButton) {

            menuButton.classList.remove(
                "is-open"
            );


            menuButton.classList.remove(
                "is-active"
            );


            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );


            menuButton.setAttribute(
                "aria-label",
                "Open navigation"
            );

        }


        document.body.classList.remove(
            "menu-open"
        );

    }


    /* =========================================================
       NAVBAR — SCROLL UP / DOWN
       ========================================================= */

    function setNavbarVisibility(hidden) {

        if (!header) {
            return;
        }

        header.classList.toggle(
            "nav-hidden",
            hidden
        );

        /*
         * Keep the behavior reliable even if the CSS class
         * is missing or overridden by another stylesheet.
         */
        if (hidden) {

            const height =
                Math.max(
                    header.offsetHeight || 0,
                    1
                );

            header.style.transform =
                `translate3d(0, -${height + 12}px, 0)`;

        } else {

            header.style.transform =
                "translate3d(0, 0, 0)";

        }

    }


    function handleNavbarScroll() {

        if (!header) {
            return;
        }

        const currentY =
            Math.max(
                window.scrollY || 0,
                0
            );

        const difference =
            currentY - lastScrollY;


        if (currentY > 35) {

            header.classList.add(
                "nav-scrolled"
            );

        } else {

            header.classList.remove(
                "nav-scrolled"
            );

        }


        /*
         * Never hide the navbar while the mobile menu is open.
         */
        if (
            header.classList.contains(
                "menu-active"
            )
        ) {

            setNavbarVisibility(false);

            lastScrollY = currentY;

            return;

        }


        /*
         * Navbar is always visible at the top.
         */
        if (currentY <= 80) {

            setNavbarVisibility(false);

            lastScrollY = currentY;

            return;

        }


        /*
         * Ignore very small movements.
         */
        if (Math.abs(difference) < 6) {

            lastScrollY = currentY;

            return;

        }


        /*
         * Scroll DOWN -> hide.
         */
        if (
            difference > 0 &&
            currentY > 150
        ) {

            setNavbarVisibility(true);

        }


        /*
         * Scroll UP -> show.
         */
        else if (
            difference < 0
        ) {

            setNavbarVisibility(false);

        }


        lastScrollY = currentY;

    }


    function onScroll() {

        if (scrollTicking) {
            return;
        }

        scrollTicking = true;

        window.requestAnimationFrame(
            () => {

                handleNavbarScroll();

                updateActiveNavigation();

                scrollTicking = false;

            }
        );

    }

    /* =========================================================
       SMOOTH SCROLL
       ========================================================= */

    function initSmoothScrolling() {

        qsa(
            'a[href^="#"]'
        ).forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

                        const href =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !href ||
                            href === "#"
                        ) {

                            return;

                        }


                        let target = null;


                        try {

                            target =
                                document.querySelector(
                                    href
                                );

                        } catch (error) {

                            target = null;

                        }


                        if (!target) {

                            return;

                        }


                        event.preventDefault();


                        closeMobileMenu();


                        scrollToTarget(
                            target
                        );


                        /*
                         * Keep URL hash in sync without
                         * forcing the browser to jump.
                         */

                        if (
                            window.history &&
                            window.history.replaceState
                        ) {

                            window.history.replaceState(
                                null,
                                "",
                                href
                            );

                        }

                    }
                );

            }
        );

    }


    function scrollToTarget(
        target
    ) {

        if (!target) {

            return;

        }


        const headerHeight =
            header
                ? header.offsetHeight
                : 0;


        const extraGap =
            16;


        const top =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight -
            extraGap;


        window.scrollTo(
            {
                top: Math.max(
                    top,
                    0
                ),

                behavior:
                    reducedMotion
                        ? "auto"
                        : "smooth"
            }
        );

    }


    /* =========================================================
       ACTIVE NAVIGATION
       ========================================================= */

    function initActiveNavigation() {

        /*
         * WORK intentionally owns both
         * What I Build and Projects.
         *
         * Both #certificates and #certifications
         * are supported so older markup doesn't break.
         */

        const groups = [

            {
                href: "#home",

                sections: [
                    "#home"
                ]

            },


            {
                href: "#about",

                sections: [
                    "#about"
                ]

            },


            {
                href: "#projects",

                sections: [
                    "#what-i-build",
                    "#what-build",
                    ".what-build",
                    "#projects",
                    ".projects"
                ]

            },


            {
                href: "#experience",

                sections: [
                    "#experience",
                    ".experience"
                ]

            },


            {
                href: "#certificates",

                sections: [
                    "#certificates",
                    "#certifications",
                    ".certificates"
                ]

            },


            {
                href: "#skills",

                sections: [
                    "#skills",
                    ".skills"
                ]

            },


            {
                href: "#blog",

                sections: [
                    "#blog",
                    ".blog-section",
                    ".blog"
                ]

            },


            {
                href: "#contact",

                sections: [
                    "#contact",
                    ".contact"
                ]

            }

        ];


        activeNavTargets = [];


        groups.forEach(
            (group) => {

                const desktopLink =
                    qs(
                        `.navbar-link[href="${group.href}"]`
                    );


                /*
                 * If the exact href isn't present,
                 * support a legacy #certifications link.
                 */

                let fallbackLink =
                    desktopLink;


                if (
                    !fallbackLink &&
                    group.href ===
                    "#certificates"
                ) {

                    fallbackLink =
                        qs(
                            '.navbar-link[href="#certifications"]'
                        );

                }


                if (!fallbackLink) {

                    return;

                }


                const sections = [];


                group.sections.forEach(
                    (selector) => {

                        const element =
                            qs(selector);


                        if (
                            element &&
                            !sections.includes(
                                element
                            )
                        ) {

                            sections.push(
                                element
                            );

                        }

                    }
                );


                if (
                    sections.length
                ) {

                    activeNavTargets.push(
                        {
                            link:
                                fallbackLink,

                            sections
                        }
                    );

                }

            }
        );


        /*
         * Initial state.
         */

        updateActiveNavigation();


        /*
         * Update after images/fonts/layout settle.
         */

        window.setTimeout(
            updateActiveNavigation,
            250
        );

    }


    function clearActiveNavigation() {

        navbarLinks.forEach(
            (link) => {

                link.classList.remove(
                    "is-active"
                );


                link.classList.remove(
                    "active"
                );


                link.removeAttribute(
                    "aria-current"
                );

            }
        );


        qsa(
            ".navbar-mobile-menu a"
        ).forEach(
            (link) => {

                link.classList.remove(
                    "is-active"
                );


                link.classList.remove(
                    "active"
                );


                link.removeAttribute(
                    "aria-current"
                );

            }
        );

    }


    function setActiveNavigation(
        activeLink
    ) {

        if (!activeLink) {

            return;

        }


        clearActiveNavigation();


        activeLink.classList.add(
            "is-active"
        );


        activeLink.classList.add(
            "active"
        );


        activeLink.setAttribute(
            "aria-current",
            "page"
        );


        const sectionName =
            activeLink
                .getAttribute(
                    "href"
                )
                ?.replace(
                    "#",
                    ""
                );


        if (
            sectionName
        ) {

            qsa(
                ".navbar-mobile-menu a"
            ).forEach(
                (mobileLink) => {

                    const href =
                        mobileLink.getAttribute(
                            "href"
                        );


                    const dataSection =
                        mobileLink.dataset.section;


                    if (
                        href ===
                        `#${sectionName}` ||
                        dataSection ===
                        sectionName
                    ) {

                        mobileLink.classList.add(
                            "is-active"
                        );

                        mobileLink.classList.add(
                            "active"
                        );

                        mobileLink.setAttribute(
                            "aria-current",
                            "page"
                        );

                    }

                }
            );

        }

    }


    function updateActiveNavigation() {

        if (!activeNavTargets.length) {
            return;
        }


        const currentScroll =
            window.scrollY || 0;

        const viewportMarker =
            Math.min(
                window.innerHeight * 0.34,
                320
            );

        const marker =
            currentScroll +
            viewportMarker;


        let currentGroup = null;
        let latestTop = -Infinity;


        activeNavTargets.forEach(
            (group) => {

                group.sections.forEach(
                    (section) => {

                        if (!section || !section.isConnected) {
                            return;
                        }


                        const top =
                            section.getBoundingClientRect().top +
                            currentScroll;


                        if (
                            top <= marker &&
                            top > latestTop
                        ) {

                            latestTop = top;

                            currentGroup = group;

                        }

                    }
                );

            }
        );


        /*
         * HOME owns the very top of the page.
         */
        if (currentScroll < 80) {

            const homeGroup =
                activeNavTargets.find(
                    (group) =>
                        group.link &&
                        group.link.getAttribute("href") ===
                        "#home"
                );

            if (homeGroup) {
                currentGroup = homeGroup;
            }

        }


        /*
         * If nothing has crossed the marker yet,
         * keep HOME active instead of assigning a later section.
         */
        if (!currentGroup) {

            const homeGroup =
                activeNavTargets.find(
                    (group) =>
                        group.link &&
                        group.link.getAttribute("href") ===
                        "#home"
                );

            currentGroup = homeGroup || null;

        }


        if (
            currentGroup &&
            currentGroup.link
        ) {

            setActiveNavigation(
                currentGroup.link
            );

        }

    }

    /* =========================================================
       GLOBAL SECTION REVEAL
       ========================================================= */

    function initGlobalSectionReveal() {

        const selectors = [

            "#home",
            ".hero",
            ".hero-content",
            ".hero-visual",

            "#about",
            ".about",
            ".about-content",
            ".about-image",
            ".about-card",

            "#what-i-build",
            "#what-build",
            ".what-build",
            ".what-build-header",
            ".build-card",
            ".what-build-footer",

            "#projects",
            ".projects",
            ".projects-header",
            ".project-card",
            ".project-future",
            ".projects-footer",

            "#experience",
            ".experience",
            ".experience-header",
            ".experience-item",

            "#certificates",
            "#certifications",
            ".certificates",
            ".certificates-header",
            ".certificate-card",

            "#skills",
            ".skills",
            ".skills-header",
            ".skill-group",
            ".skills-category",

            "#blog",
            ".blog-section",
            ".blog",
            ".blog-header",
            ".blog-card",

            "#contact",
            ".contact",
            ".contact-header",
            ".contact-form",
            ".contact-info",

            ".site-footer",
            "footer",
            ".footer-top",
            ".footer-inner",
            ".footer-social",
            ".footer-links",
            ".footer-bottom"

        ];


        const elements =
            qsa(
                selectors.join(",")
            );


        if (!elements.length) {

            return;

        }


        /*
         * Do not force opacity using inline styles
         * because existing CSS may already define the
         * animation. Instead use compatibility classes.
         */

        elements.forEach(
            (element, index) => {

                element.classList.add(
                    "js-reveal"
                );


                element.style.setProperty(
                    "--js-reveal-delay",
                    `${Math.min(
                        index % 6 * 70,
                        350
                    )}ms`
                );

            }
        );


        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(
                (element) => {

                    element.classList.add(
                        "is-visible"
                    );

                }
            );

            return;

        }


        const observer =
            new IntersectionObserver(
                (entries, observerInstance) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;

                            }


                            entry.target.classList.add(
                                "is-visible"
                            );


                            observerInstance.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.08,

                    rootMargin:
                        "0px 0px -45px 0px"
                }
            );


        elements.forEach(
            (element) => {

                observer.observe(
                    element
                );

            }
        );

    }


    /* =========================================================
       HERO
       ========================================================= */

    function initHero() {

        const hero =
            qs(".hero");


        if (!hero) {

            return;

        }


        window.requestAnimationFrame(
            () => {

                hero.classList.add(
                    "hero-loaded"
                );

            }
        );


        if (
            reducedMotion
        ) {

            return;

        }


        const visual =
            qs(
                ".hero-visual",
                hero
            );


        if (
            !visual
        ) {

            return;

        }


        let ticking =
            false;


        window.addEventListener(
            "scroll",
            () => {

                if (
                    ticking
                ) {

                    return;

                }


                ticking =
                    true;


                window.requestAnimationFrame(
                    () => {

                        const scroll =
                            window.scrollY || 0;


                        if (
                            scroll <
                            window.innerHeight * 1.15
                        ) {

                            visual.style.setProperty(
                                "--hero-scroll-y",
                                `${scroll * 0.05}px`
                            );

                        }


                        ticking =
                            false;

                    }
                );

            },
            {
                passive: true
            }
        );


        const portrait =
            qs(
                ".hero-portrait",
                hero
            );


        if (
            portrait &&
            desktopQuery.matches
        ) {

            const image =
                qs(
                    ".hero-photo",
                    portrait
                );


            portrait.addEventListener(
                "mousemove",
                (event) => {

                    if (!image) {

                        return;

                    }


                    const rect =
                        portrait.getBoundingClientRect();


                    const x =
                        (
                            event.clientX -
                            rect.left
                        ) /
                        rect.width -
                        0.5;


                    const y =
                        (
                            event.clientY -
                            rect.top
                        ) /
                        rect.height -
                        0.5;


                    image.style.transform =
                        `translate3d(${x * 5}px, ${y * -4}px, 0) scale(1.018)`;

                }
            );


            portrait.addEventListener(
                "mouseleave",
                () => {

                    if (image) {

                        image.style.transform =
                            "";

                    }

                }
            );

        }

    }


    /* =========================================================
       ABOUT
       ========================================================= */

    function initAbout() {

        const about =
            qs(
                "#about"
            ) ||
            qs(
                ".about"
            );


        if (!about) {

            return;

        }


        const image =
            qs(
                ".about-image",
                about
            );


        const imageWrap =
            qs(
                ".about-image-wrap",
                about
            );


        if (
            image &&
            imageWrap &&
            !reducedMotion &&
            desktopQuery.matches
        ) {

            imageWrap.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        imageWrap.getBoundingClientRect();


                    const x =
                        (
                            event.clientX -
                            rect.left
                        ) /
                        rect.width -
                        0.5;


                    const y =
                        (
                            event.clientY -
                            rect.top
                        ) /
                        rect.height -
                        0.5;


                    image.style.transform =
                        `scale(1.035) translate3d(${x * 8}px, ${y * 8}px, 0)`;

                }
            );


            imageWrap.addEventListener(
                "mouseleave",
                () => {

                    image.style.transform =
                        "";

                }
            );

        }


        /*
         * Optional number counters.
         */

        const counters =
            qsa(
                "[data-count]",
                about
            );


        if (
            counters.length &&
            "IntersectionObserver" in window
        ) {

            let animated =
                false;


            const observer =
                new IntersectionObserver(
                    (entries) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    !entry.isIntersecting ||
                                    animated
                                ) {

                                    return;

                                }


                                animated =
                                    true;


                                counters.forEach(
                                    animateCounter
                                );


                                observer.disconnect();

                            }
                        );

                    },
                    {
                        threshold: 0.25
                    }
                );


            observer.observe(
                about
            );

        }

    }


    function animateCounter(
        element
    ) {

        const value =
            element.dataset.count;


        if (
            value === undefined
        ) {

            return;

        }


        const match =
            String(value).match(
                /(\d+)/
            );


        if (!match) {

            return;

        }


        const target =
            Number(
                match[1]
            );


        const suffix =
            String(value).replace(
                match[1],
                ""
            );


        if (
            reducedMotion
        ) {

            element.textContent =
                String(value);

            return;

        }


        const start =
            performance.now();


        const duration =
            1000;


        const tick =
            (now) => {

                const progress =
                    Math.min(
                        (
                            now -
                            start
                        ) /
                        duration,
                        1
                    );


                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );


                element.textContent =
                    `${Math.round(
                        target * eased
                    )}${suffix}`;


                if (
                    progress < 1
                ) {

                    window.requestAnimationFrame(
                        tick
                    );

                }

            };


        window.requestAnimationFrame(
            tick
        );

    }


    /* =========================================================
       WHAT I BUILD
       ========================================================= */

    function initWhatBuild() {

        const section =
            qs(
                "#what-i-build"
            ) ||
            qs(
                "#what-build"
            ) ||
            qs(
                ".what-build"
            );


        if (!section) {

            return;

        }


        const cards =
            qsa(
                ".build-card, .what-build-card",
                section
            );


        if (
            !cards.length ||
            reducedMotion ||
            !desktopQuery.matches
        ) {

            return;

        }


        cards.forEach(
            (card) => {

                card.addEventListener(
                    "mousemove",
                    (event) => {

                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width -
                            0.5;


                        const y =
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height -
                            0.5;


                        card.style.setProperty(
                            "--build-x",
                            `${x * 4}px`
                        );


                        card.style.setProperty(
                            "--build-y",
                            `${y * 4}px`
                        );

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.setProperty(
                            "--build-x",
                            "0px"
                        );


                        card.style.setProperty(
                            "--build-y",
                            "0px"
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       PROJECTS
       ========================================================= */

    function initProjects() {

        const section =
            qs(
                "#projects"
            ) ||
            qs(
                ".projects"
            );


        if (!section) {

            return;

        }


        const cards =
            qsa(
                ".project-card",
                section
            );


        const featuredImage =
            qs(
                ".project-featured-image .project-image",
                section
            );


        if (
            !reducedMotion &&
            featuredImage &&
            desktopQuery.matches
        ) {

            const wrapper =
                featuredImage.parentElement;


            if (wrapper) {

                wrapper.addEventListener(
                    "mousemove",
                    (event) => {

                        const rect =
                            wrapper.getBoundingClientRect();


                        const x =
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width -
                            0.5;


                        const y =
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height -
                            0.5;


                        featuredImage.style.transform =
                            `scale(1.04) translate3d(${x * 7}px, ${y * 5}px, 0)`;

                    }
                );


                wrapper.addEventListener(
                    "mouseleave",
                    () => {

                        featuredImage.style.transform =
                            "";

                    }
                );

            }

        }


        if (
            !reducedMotion &&
            desktopQuery.matches
        ) {

            cards.forEach(
                (card) => {

                    const image =
                        qs(
                            ".project-image",
                            card
                        );


                    if (!image) {

                        return;

                    }


                    card.addEventListener(
                        "mouseenter",
                        () => {

                            image.style.transform =
                                "scale(1.05) translateY(-3px)";

                        }
                    );


                    card.addEventListener(
                        "mouseleave",
                        () => {

                            image.style.transform =
                                "";

                        }
                    );

                }
            );

        }

    }


    /* =========================================================
       EXPERIENCE
       ========================================================= */

    function initExperience() {

        const section =
            qs(
                "#experience"
            ) ||
            qs(
                ".experience"
            );


        if (!section) {

            return;

        }


        const items =
            qsa(
                ".experience-item",
                section
            );


        items.forEach(
            (item) => {

                item.addEventListener(
                    "click",
                    () => {

                        item.classList.toggle(
                            "experience-active"
                        );


                        item.classList.toggle(
                            "is-expanded"
                        );

                    }
                );


                item.addEventListener(
                    "keydown",
                    (event) => {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();


                            item.classList.toggle(
                                "experience-active"
                            );


                            item.classList.toggle(
                                "is-expanded"
                            );

                        }

                    }
                );

            }
        );

    }


    /* =========================================================
       CERTIFICATES
       ========================================================= */

    function initCertificates() {

        const section =
            qs(
                "#certificates"
            ) ||
            qs(
                "#certifications"
            ) ||
            qs(
                ".certificates"
            );


        if (!section) {

            return;

        }


        const cards =
            qsa(
                ".certificate-card",
                section
            );


        const images =
            qsa(
                ".certificate-image img",
                section
            );


        cards.forEach(
            (card) => {

                card.addEventListener(
                    "mouseenter",
                    () => {

                        card.classList.add(
                            "cert-hover"
                        );

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.classList.remove(
                            "cert-hover"
                        );

                    }
                );

            }
        );


        images.forEach(
            (image) => {

                image.addEventListener(
                    "error",
                    () => {

                        image.classList.add(
                            "certificate-image-error"
                        );

                    }
                );

            }
        );


        /*
         * Do not force window.open on normal certificate
         * links. Let the HTML href behave naturally.
         * This avoids duplicate tabs.
         */

        qsa(
            ".certificate-link",
            section
        ).forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        const card =
                            link.closest(
                                ".certificate-card"
                            );


                        if (card) {

                            card.classList.add(
                                "is-opened"
                            );

                        }

                    }
                );

            }
        );

    }


    /* =========================================================
       SKILLS
       ========================================================= */

    function initSkills() {

        const section =
            qs(
                "#skills"
            ) ||
            qs(
                ".skills"
            );


        if (!section) {

            return;

        }


        const groups =
            qsa(
                ".skill-group",
                section
            );


        if (
            !reducedMotion &&
            "IntersectionObserver" in window
        ) {

            const observer =
                new IntersectionObserver(
                    (entries, observerInstance) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    !entry.isIntersecting
                                ) {

                                    return;

                                }


                                entry.target.classList.add(
                                    "skill-visible"
                                );


                                animateSkillBars(
                                    entry.target
                                );


                                observerInstance.unobserve(
                                    entry.target
                                );

                            }
                        );

                    },
                    {
                        threshold: 0.12,
                        rootMargin:
                            "0px 0px -60px 0px"
                    }
                );


            groups.forEach(
                (group) => {

                    observer.observe(
                        group
                    );

                }
            );

        } else {

            groups.forEach(
                (group) => {

                    group.classList.add(
                        "skill-visible"
                    );


                    animateSkillBars(
                        group
                    );

                }
            );

        }


        initSkillsMarquee(
            section
        );

    }


    function animateSkillBars(
        scope
    ) {

        qsa(
            "[data-progress]",
            scope
        ).forEach(
            (bar) => {

                const value =
                    bar.dataset.progress;


                if (
                    value === undefined
                ) {

                    return;

                }


                const numeric =
                    Math.max(
                        0,
                        Math.min(
                            Number(value),
                            100
                        )
                    );


                bar.style.setProperty(
                    "--progress",
                    `${numeric}%`
                );


                bar.style.setProperty(
                    "--skill-progress",
                    `${numeric}%`
                );


                bar.classList.add(
                    "is-filled"
                );

            }
        );

    }


    function initSkillsMarquee(
        section
    ) {

        const track =
            qs(
                ".skills-marquee-track",
                section
            );


        const container =
            qs(
                ".skills-marquee",
                section
            );


        if (
            !track ||
            !container ||
            reducedMotion
        ) {

            return;

        }


        let position =
            0;


        let speed =
            0.5;


        let frameId =
            null;


        let running =
            true;


        const step =
            () => {

                if (!running) {

                    return;

                }


                position -=
                    speed;


                const first =
                    track.children[0];


                if (first) {

                    const width =
                        first.getBoundingClientRect().width +
                        40;


                    if (
                        Math.abs(position) >=
                        width
                    ) {

                        track.appendChild(
                            first
                        );


                        position +=
                            width;

                    }

                }


                track.style.transform =
                    `translate3d(${position}px, 0, 0)`;


                frameId =
                    window.requestAnimationFrame(
                        step
                    );

            };


        container.addEventListener(
            "mouseenter",
            () => {

                speed =
                    0.15;

            }
        );


        container.addEventListener(
            "mouseleave",
            () => {

                speed =
                    0.5;

            }
        );


        document.addEventListener(
            "visibilitychange",
            () => {

                running =
                    !document.hidden;


                if (
                    running &&
                    !frameId
                ) {

                    step();

                }

            }
        );


        step();

    }


    /* =========================================================
       BLOG
       ========================================================= */

    function initBlog() {

        const section =
            qs(
                "#blog"
            ) ||
            qs(
                ".blog-section"
            ) ||
            qs(
                ".blog"
            );


        if (!section) {

            return;

        }


        const cards =
            qsa(
                ".blog-card",
                section
            );


        cards.forEach(
            (card) => {

                card.addEventListener(
                    "mouseenter",
                    () => {

                        card.classList.add(
                            "is-hovered"
                        );

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.classList.remove(
                            "is-hovered"
                        );

                    }
                );

            }
        );


        qsa(
            "[data-blog-action]",
            section
        ).forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    (event) => {

                        const action =
                            button.dataset.blogAction;


                        if (
                            action !==
                            "view-posts"
                        ) {

                            return;

                        }


                        const grid =
                            qs(
                                ".blog-grid",
                                section
                            );


                        if (!grid) {

                            return;

                        }


                        event.preventDefault();


                        grid.scrollIntoView(
                            {
                                behavior:
                                    reducedMotion
                                        ? "auto"
                                        : "smooth",

                                block:
                                    "start"
                            }
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       CONTACT
       ========================================================= */

    function initContact() {

        const section =
            qs(
                "#contact"
            ) ||
            qs(
                ".contact"
            );


        if (!section) {

            return;

        }


        const form =
            qs(
                ".contact-form",
                section
            );


        if (!form) {

            return;

        }


        qsa(
            "input, textarea, select",
            form
        ).forEach(
            (field) => {

                field.addEventListener(
                    "focus",
                    () => {

                        field.classList.add(
                            "is-focused"
                        );


                        field.closest(
                            ".form-group, .contact-field, .field"
                        )?.classList.add(
                            "is-focused"
                        );

                    }
                );


                field.addEventListener(
                    "blur",
                    () => {

                        field.classList.remove(
                            "is-focused"
                        );


                        field.closest(
                            ".form-group, .contact-field, .field"
                        )?.classList.remove(
                            "is-focused"
                        );

                    }
                );

            }
        );


        form.addEventListener(
            "submit",
            () => {

                form.classList.add(
                    "is-submitting"
                );

            }
        );

    }


    /* =========================================================
       FOOTER
       ========================================================= */

    function initFooter() {

        const footer =
            qs(
                ".site-footer"
            ) ||
            qs(
                "footer"
            );


        if (!footer) {

            return;

        }


        /*
         * Back-to-top links/buttons.
         * Supports several common class/data names
         * without requiring a specific footer structure.
         */

        qsa(
            [
                '[data-scroll-top]',
                ".footer-back-top",
                ".back-to-top"
            ].join(","),
            footer
        ).forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();


                        window.scrollTo(
                            {
                                top: 0,

                                behavior:
                                    reducedMotion
                                        ? "auto"
                                        : "smooth"
                            }
                        );

                    }
                );

            }
        );


        /*
         * Footer social links get keyboard/focus support
         * through the existing CSS.
         */

        qsa(
            "a",
            footer
        ).forEach(
            (link) => {

                link.addEventListener(
                    "focus",
                    () => {

                        link.classList.add(
                            "is-focused"
                        );

                    }
                );


                link.addEventListener(
                    "blur",
                    () => {

                        link.classList.remove(
                            "is-focused"
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       IMAGE LOADING
       ========================================================= */

    function initImageLoading() {

        qsa(
            "img"
        ).forEach(
            (image) => {

                const markLoaded =
                    () => {

                        image.classList.add(
                            "image-loaded"
                        );

                    };


                const markError =
                    () => {

                        image.classList.add(
                            "image-error"
                        );

                    };


                image.addEventListener(
                    "load",
                    markLoaded
                );


                image.addEventListener(
                    "error",
                    markError
                );


                if (
                    image.complete
                ) {

                    if (
                        image.naturalWidth > 0
                    ) {

                        markLoaded();

                    } else {

                        markError();

                    }

                }

            }
        );

    }


    /* =========================================================
       KEYBOARD SUPPORT
       ========================================================= */

    function initGlobalKeyboardSupport() {

        document.addEventListener(
            "keydown",
            (event) => {

                /*
                 * Escape closes the menu.
                 */

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeMobileMenu();

                }

            }
        );

    }


    /* =========================================================
       RESIZE SUPPORT
       ========================================================= */

    function initResizeSupport() {

        let timer =
            null;


        window.addEventListener(
            "resize",
            () => {

                window.clearTimeout(
                    timer
                );


                timer =
                    window.setTimeout(
                        () => {

                            updateActiveNavigation();


                            if (
                                window.innerWidth >
                                MOBILE_BREAKPOINT
                            ) {

                                closeMobileMenu();

                            }

                        },
                        150
                    );

            }
        );

    }


    /* =========================================================
       DEBUG-SAFE GLOBAL API
       =========================================================
       These are intentionally attached to window so that
       existing templates or older scripts that reference
       these names continue to work without throwing
       ReferenceError.
       ========================================================= */

    window.VikasPortfolio =
        window.VikasPortfolio ||
        {};


    window.VikasPortfolio.closeMenu =
        closeMobileMenu;


    window.VikasPortfolio.openMenu =
        openMobileMenu;


    window.VikasPortfolio.updateActiveNavigation =
        updateActiveNavigation;


    window.VikasPortfolio.scrollToTarget =
        scrollToTarget;


    /* =========================================================
       END CORE
       ========================================================= */

})();
