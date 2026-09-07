/* =========================================================
   VIKAS KUMAR — MAIN JS
   NAVBAR + LOADER + SECTIONS + BLOG
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       HELPERS
    ===================================================== */

    const qs = (selector, scope = document) =>
        scope.querySelector(selector);

    const qsa = (selector, scope = document) =>
        Array.from(scope.querySelectorAll(selector));

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const desktopQuery = window.matchMedia(
        "(min-width: 801px)"
    );


    /* =====================================================
       PAGE LOADER
    ===================================================== */

    const loader = qs("#page-loader");
    const loaderProgress = qs("#loader-progress-bar");
    const loaderPercent = qs("#loader-percent");
    const loaderStatus = qs("#loader-status-text");

    if (
        loader &&
        loaderProgress &&
        loaderPercent
    ) {

        document.documentElement.classList.add(
            "loader-active"
        );

        document.body.classList.add(
            "loader-active"
        );


        const loaderStatuses = [
            "Loading portfolio",
            "Preparing interface",
            "Loading components",
            "Initializing experience",
            "Almost ready"
        ];


        let progress = 0;
        let statusIndex = 0;


        const updateLoaderStatus = (value) => {

            if (!loaderStatus) return;

            const nextIndex = Math.min(
                Math.floor(value / 20),
                loaderStatuses.length - 1
            );

            if (nextIndex === statusIndex) {
                return;
            }

            statusIndex = nextIndex;

            loaderStatus.style.opacity = "0";

            window.setTimeout(() => {

                loaderStatus.textContent =
                    loaderStatuses[statusIndex];

                loaderStatus.style.opacity = "1";

            }, 120);
        };


        const finishLoader = () => {

            window.setTimeout(() => {

                loader.classList.add(
                    "loader-complete"
                );

                document.documentElement.classList.remove(
                    "loader-active"
                );

                document.body.classList.remove(
                    "loader-active"
                );


                window.setTimeout(() => {

                    loader.style.display = "none";

                }, 850);

            }, 450);
        };


        const animateLoader = () => {

            let increment;


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


            progress += increment;


            if (progress >= 100) {
                progress = 100;
            }


            loaderProgress.style.width =
                `${progress}%`;


            loaderPercent.textContent =
                `${Math.floor(progress)
                    .toString()
                    .padStart(2, "0")}%`;


            updateLoaderStatus(progress);


            if (progress < 100) {

                window.setTimeout(
                    animateLoader,
                    70 + Math.random() * 80
                );

            } else {

                finishLoader();

            }
        };


        window.setTimeout(
            animateLoader,
            reducedMotion ? 0 : 100
        );
    }


    /* =====================================================
       NAVBAR
    ===================================================== */

    const header = qs(".site-header");
    const menuButton = qs(".navbar-menu-button");
    const navbarLinks = qsa(".navbar-link");

    let lastScrollY = Math.max(
        window.scrollY,
        0
    );

    let scrollTicking = false;


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const closeMenu = () => {

        if (!header || !menuButton) {
            return;
        }

        header.classList.remove(
            "menu-active"
        );

        menuButton.classList.remove(
            "is-open"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "menu-open"
        );
    };


    const openMenu = () => {

        if (!header || !menuButton) {
            return;
        }

        header.classList.add(
            "menu-active"
        );

        menuButton.classList.add(
            "is-open"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.classList.add(
            "menu-open"
        );
    };


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            () => {

                const isOpen =
                    header?.classList.contains(
                        "menu-active"
                    );

                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }

            }
        );
    }


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        }
    );


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    const scrollToTarget = (target) => {

        if (!target) return;


        const headerHeight =
            header?.offsetHeight || 0;


        const top =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight -
            20;


        window.scrollTo({
            top: Math.max(top, 0),
            behavior: reducedMotion
                ? "auto"
                : "smooth"
        });
    };


    qsa('a[href^="#"]').forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const href =
                        link.getAttribute("href");


                    if (
                        !href ||
                        href === "#"
                    ) {
                        return;
                    }


                    const targetId =
                        href.substring(1);


                    const target =
                        qs(`#${CSS.escape(targetId)}`);


                    if (!target) {
                        return;
                    }


                    event.preventDefault();

                    closeMenu();

                    scrollToTarget(target);

                }
            );
        }
    );


    /* =====================================================
       ACTIVE NAVIGATION
       
       VERY IMPORTANT:
       Blog included here.
    ===================================================== */

    const navGroups = [

        {
            link: '.navbar-link[href="#home"]',
            sections: ["#home"]
        },

        {
            link: '.navbar-link[href="#about"]',
            sections: ["#about"]
        },

        {
            link: '.navbar-link[href="#projects"]',
            sections: [
                "#what-i-build",
                "#projects"
            ]
        },

        {
            link: '.navbar-link[href="#experience"]',
            sections: [
                "#experience"
            ]
        },

        {
            link: '.navbar-link[href="#certifications"]',
            sections: [
                "#certifications"
            ]
        },

        /*
         * SECTION 07
         */
        {
            link: '.navbar-link[href="#skills"]',
            sections: [
                "#skills"
            ]
        },

        /*
         * SECTION 08
         */
        {
            link: '.navbar-link[href="#blog"]',
            sections: [
                "#blog"
            ]
        },

        {
            link: '.navbar-link[href="#contact"]',
            sections: [
                "#contact"
            ]
        }

    ];


    const navTargets = navGroups
        .map((group) => {

            const link =
                qs(group.link);


            const sections =
                group.sections
                    .map((selector) =>
                        qs(selector)
                    )
                    .filter(Boolean);


            return {
                link,
                sections
            };

        })
        .filter(
            (group) =>
                group.link &&
                group.sections.length
        );


    const clearActiveLinks = () => {

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
    };


    const setActiveLink = (activeLink) => {

        clearActiveLinks();


        if (!activeLink) {
            return;
        }


        activeLink.classList.add(
            "is-active"
        );

        activeLink.setAttribute(
            "aria-current",
            "page"
        );
    };


    /*
     * Find which section is closest to the
     * top navigation area.
     */
    const updateActiveNav = () => {

        if (!navTargets.length) {
            return;
        }


        const marker =
            window.scrollY +
            (header?.offsetHeight || 0) +
            120;


        let currentGroup = null;

        let closestDistance = Infinity;


        navTargets.forEach(
            (group) => {

                group.sections.forEach(
                    (section) => {

                        const top =
                            section.offsetTop;


                        const bottom =
                            top +
                            section.offsetHeight;


                        if (
                            marker >= top &&
                            marker < bottom
                        ) {

                            currentGroup =
                                group;

                            return;
                        }


                        /*
                         * Fallback for very large/small sections.
                         */
                        const distance =
                            Math.abs(
                                top - marker
                            );


                        if (
                            distance <
                            closestDistance &&
                            top <= marker
                        ) {

                            closestDistance =
                                distance;

                            currentGroup =
                                group;
                        }

                    }
                );

            }
        );


        /*
         * At page top, always Home.
         */
        if (window.scrollY < 80) {

            const homeGroup =
                navTargets.find(
                    (group) =>
                        group.link.getAttribute(
                            "href"
                        ) === "#home"
                );


            if (homeGroup) {
                currentGroup =
                    homeGroup;
            }
        }


        if (currentGroup) {

            setActiveLink(
                currentGroup.link
            );

        }

    };


    /* =====================================================
       INITIAL NAV DETECTION
    ===================================================== */

    updateActiveNav();


    window.setTimeout(
        updateActiveNav,
        200
    );


    /* =====================================================
       NAVBAR SCROLL BEHAVIOUR
    ===================================================== */

    const handleNavbarScroll = () => {

        if (!header) {
            return;
        }


        const currentY =
            Math.max(
                window.scrollY,
                0
            );


        /*
         * Scrolled state
         */
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
         * Hide when scrolling down.
         */
        if (
            currentY > lastScrollY &&
            currentY > 180
        ) {

            header.classList.add(
                "nav-hidden"
            );

            closeMenu();

        } else {

            header.classList.remove(
                "nav-hidden"
            );

        }


        lastScrollY = currentY;
    };


    /* =====================================================
       COMBINED SCROLL
    ===================================================== */

    const onScroll = () => {

        if (scrollTicking) {
            return;
        }


        scrollTicking = true;


        window.requestAnimationFrame(
            () => {

                handleNavbarScroll();
                updateActiveNav();

                scrollTicking = false;

            }
        );
    };


    window.addEventListener(
        "scroll",
        onScroll,
        { passive: true }
    );


    /* =====================================================
       HERO
    ===================================================== */

    const hero = qs(".hero");


    if (hero) {

        window.setTimeout(
            () => {

                hero.classList.add(
                    "hero-loaded"
                );

            },
            120
        );
    }


    /* =====================================================
       HERO PORTRAIT PARALLAX
    ===================================================== */

    const heroPortrait =
        qs(".hero-portrait");


    if (
        heroPortrait &&
        !reducedMotion
    ) {

        const photo =
            qs(
                ".hero-photo",
                heroPortrait
            );


        const photoCard =
            qs(
                ".hero-photo-card",
                heroPortrait
            );


        const photoFrame =
            qs(
                ".hero-photo-frame",
                heroPortrait
            );


        heroPortrait.addEventListener(
            "mousemove",
            (event) => {

                if (!desktopQuery.matches) {
                    return;
                }


                const rect =
                    heroPortrait.getBoundingClientRect();


                const x =
                    (
                        (event.clientX -
                            rect.left) /
                        rect.width -
                        0.5
                    ) * 2;


                const y =
                    (
                        (event.clientY -
                            rect.top) /
                        rect.height -
                        0.5
                    ) * 2;


                if (photo) {

                    photo.style.transform =
                        `translate3d(${x * 5}px, ${y * -4}px, 0) scale(1.018)`;
                }


                if (photoCard) {

                    photoCard.style.transform =
                        `translate3d(${x * 10}px, ${y * 8}px, 0) rotate(${x * 2}deg)`;
                }


                if (photoFrame) {

                    photoFrame.style.transform =
                        `translate(-50%, -45%) translate3d(${x * 4}px, ${y * 3}px, 0)`;
                }

            }
        );


        heroPortrait.addEventListener(
            "mouseleave",
            () => {

                if (photo) {
                    photo.style.transform = "";
                }

                if (photoCard) {
                    photoCard.style.transform = "";
                }

                if (photoFrame) {
                    photoFrame.style.transform =
                        "translate(-50%, -45%)";
                }

            }
        );

    }


    /* =====================================================
       ABOUT ANIMATION
    ===================================================== */

    const aboutSection =
        qs(".about");


    if (
        aboutSection &&
        !reducedMotion
    ) {

        const aboutPhoto =
            qs(
                ".about-image",
                aboutSection
            );


        const aboutTitle =
            qs(
                ".about-content h2",
                aboutSection
            );


        const aboutLead =
            qs(
                ".about-lead",
                aboutSection
            );


        const aboutTexts =
            qsa(
                ".about-text",
                aboutSection
            );


        const aboutValues =
            qsa(
                ".about-value",
                aboutSection
            );


        const aboutBottomItems =
            qsa(
                ".about-bottom-item",
                aboutSection
            );


        const aboutButton =
            qs(
                ".about-button",
                aboutSection
            );


        if (aboutPhoto) {

            aboutPhoto.style.opacity = "0";

            aboutPhoto.style.transform =
                "scale(1.08) translateY(24px)";

            aboutPhoto.style.transition =
                "opacity 1000ms ease, transform 1100ms ease";
        }


        if (aboutTitle) {

            aboutTitle.style.opacity = "0";

            aboutTitle.style.transform =
                "translateX(-30px)";

            aboutTitle.style.transition =
                "opacity 800ms ease, transform 800ms ease";
        }


        if (aboutLead) {

            aboutLead.style.opacity = "0";

            aboutLead.style.transform =
                "translateY(18px)";

            aboutLead.style.transition =
                "opacity 700ms ease, transform 700ms ease";
        }


        aboutTexts.forEach(
            (text, index) => {

                text.style.opacity = "0";

                text.style.transform =
                    "translateY(15px)";

                text.style.transition =
                    "opacity 650ms ease, transform 650ms ease";

                text.style.transitionDelay =
                    `${120 + index * 110}ms`;

            }
        );


        aboutValues.forEach(
            (value, index) => {

                value.style.opacity = "0";

                value.style.transform =
                    "translateX(25px)";

                value.style.transition =
                    "opacity 650ms ease, transform 650ms ease";

                value.style.transitionDelay =
                    `${index * 90}ms`;

            }
        );


        aboutBottomItems.forEach(
            (item, index) => {

                item.style.opacity = "0";

                item.style.transform =
                    "translateY(18px)";

                item.style.transition =
                    "opacity 600ms ease, transform 600ms ease";

                item.style.transitionDelay =
                    `${index * 90}ms`;

            }
        );


        if (aboutButton) {

            aboutButton.style.opacity = "0";

            aboutButton.style.transform =
                "translateY(15px) scale(.98)";

            aboutButton.style.transition =
                "opacity 650ms ease, transform 650ms ease";
        }


        const revealAbout = () => {

            if (aboutPhoto) {

                aboutPhoto.style.opacity = "1";

                aboutPhoto.style.transform =
                    "scale(1) translateY(0)";
            }


            if (aboutTitle) {

                aboutTitle.style.opacity = "1";

                aboutTitle.style.transform =
                    "translateX(0)";
            }


            if (aboutLead) {

                aboutLead.style.opacity = "1";

                aboutLead.style.transform =
                    "translateY(0)";
            }


            aboutTexts.forEach(
                (text) => {

                    text.style.opacity = "1";

                    text.style.transform =
                        "translateY(0)";

                }
            );


            aboutValues.forEach(
                (value) => {

                    value.style.opacity = "1";

                    value.style.transform =
                        "translateX(0)";

                }
            );


            aboutBottomItems.forEach(
                (item) => {

                    item.style.opacity = "1";

                    item.style.transform =
                        "translateY(0)";

                }
            );


            if (aboutButton) {

                aboutButton.style.opacity = "1";

                aboutButton.style.transform =
                    "translateY(0) scale(1)";
            }

        };


        if (
            "IntersectionObserver" in window
        ) {

            const aboutObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    revealAbout();

                                    observer.unobserve(
                                        aboutSection
                                    );

                                }

                            }
                        );

                    },
                    {
                        threshold: 0.15
                    }
                );


            aboutObserver.observe(
                aboutSection
            );

        } else {

            revealAbout();

        }

    }


    /* =====================================================
       WHAT I BUILD ANIMATION
    ===================================================== */

    const buildSection =
        qs(".what-build");


    if (
        buildSection &&
        !reducedMotion
    ) {

        const buildHeader =
            qs(
                ".what-build-header",
                buildSection
            );


        const buildIndex =
            qs(
                ".what-build-index",
                buildSection
            );


        const buildHeading =
            qs(
                ".what-build-heading-wrap",
                buildSection
            );


        const buildCards =
            qsa(
                ".build-card",
                buildSection
            );


        const buildFooter =
            qs(
                ".what-build-footer",
                buildSection
            );


        if (buildHeader) {

            buildHeader.style.opacity = "0";

            buildHeader.style.transform =
                "translateY(30px)";

            buildHeader.style.transition =
                "opacity 800ms ease, transform 800ms ease";
        }


        if (buildIndex) {

            buildIndex.style.opacity = "0";

            buildIndex.style.transform =
                "translateX(-20px)";

            buildIndex.style.transition =
                "opacity 650ms ease, transform 650ms ease";
        }


        if (buildHeading) {

            buildHeading.style.opacity = "0";

            buildHeading.style.transform =
                "translateY(40px)";

            buildHeading.style.transition =
                "opacity 850ms ease, transform 850ms ease";
        }


        buildCards.forEach(
            (card, index) => {

                const direction =
                    index % 2 === 0
                        ? -40
                        : 40;


                card.style.opacity = "0";

                card.style.transform =
                    `translateX(${direction}px) scale(.98)`;

                card.style.transition =
                    "opacity 750ms ease, transform 850ms ease";

                card.style.transitionDelay =
                    `${100 + index * 120}ms`;

            }
        );


        if (buildFooter) {

            buildFooter.style.opacity = "0";

            buildFooter.style.transform =
                "translateY(20px)";

            buildFooter.style.transition =
                "opacity 650ms ease, transform 650ms ease";
        }


        const revealBuild = () => {

            if (buildIndex) {

                buildIndex.style.opacity = "1";

                buildIndex.style.transform =
                    "translateX(0)";
            }


            if (buildHeader) {

                buildHeader.style.opacity = "1";

                buildHeader.style.transform =
                    "translateY(0)";
            }


            if (buildHeading) {

                buildHeading.style.opacity = "1";

                buildHeading.style.transform =
                    "translateY(0)";
            }


            buildCards.forEach(
                (card) => {

                    card.style.opacity = "1";

                    card.style.transform =
                        "translateX(0) scale(1)";

                }
            );


            if (buildFooter) {

                buildFooter.style.opacity = "1";

                buildFooter.style.transform =
                    "translateY(0)";
            }

        };


        if (
            "IntersectionObserver" in window
        ) {

            const buildObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    revealBuild();

                                    observer.unobserve(
                                        buildSection
                                    );

                                }

                            }
                        );

                    },
                    {
                        threshold: 0.12
                    }
                );


            buildObserver.observe(
                buildSection
            );

        } else {

            revealBuild();

        }


        if (desktopQuery.matches) {

            buildCards.forEach(
                (card) => {

                    card.addEventListener(
                        "mousemove",
                        (event) => {

                            const rect =
                                card.getBoundingClientRect();


                            const x =
                                (
                                    (event.clientX -
                                        rect.left) /
                                    rect.width -
                                    0.5
                                );


                            const y =
                                (
                                    (event.clientY -
                                        rect.top) /
                                    rect.height -
                                    0.5
                                );


                            card.style.transform =
                                `translate3d(${x * 5}px, ${y * 5}px, 0)`;

                        }
                    );


                    card.addEventListener(
                        "mouseleave",
                        () => {

                            card.style.transform =
                                "translate3d(0,0,0)";

                        }
                    );

                }
            );

        }

    }


    /* =====================================================
       PROJECTS ANIMATION
    ===================================================== */

    const projectsSection =
        qs(".projects");


    if (
        projectsSection &&
        !reducedMotion
    ) {

        const projectCards =
            qsa(
                ".project-card",
                projectsSection
            );


        const featured =
            qs(
                ".project-featured",
                projectsSection
            );


        const projectsHeader =
            qs(
                ".projects-header",
                projectsSection
            );


        if (projectsHeader) {

            projectsHeader.style.opacity = "0";

            projectsHeader.style.transform =
                "translateY(30px)";

            projectsHeader.style.transition =
                "opacity 800ms ease, transform 850ms ease";
        }


        if (featured) {

            featured.style.opacity = "0";

            featured.style.transform =
                "translateY(40px) scale(.985)";

            featured.style.transition =
                "opacity 850ms ease, transform 900ms ease";
        }


        projectCards.forEach(
            (card, index) => {

                card.style.opacity = "0";

                card.style.transform =
                    "translateY(45px)";

                card.style.transition =
                    "opacity 750ms ease, transform 800ms ease";

                card.style.transitionDelay =
                    `${120 + index * 100}ms`;

            }
        );


        const revealProjects = () => {

            if (projectsHeader) {

                projectsHeader.style.opacity = "1";

                projectsHeader.style.transform =
                    "translateY(0)";
            }


            if (featured) {

                featured.style.opacity = "1";

                featured.style.transform =
                    "translateY(0) scale(1)";
            }


            projectCards.forEach(
                (card) => {

                    card.style.opacity = "1";

                    card.style.transform =
                        "translateY(0)";

                }
            );

        };


        if (
            "IntersectionObserver" in window
        ) {

            const observer =
                new IntersectionObserver(
                    (entries, obs) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    revealProjects();

                                    obs.unobserve(
                                        projectsSection
                                    );

                                }

                            }
                        );

                    },
                    {
                        threshold: 0.12
                    }
                );


            observer.observe(
                projectsSection
            );

        } else {

            revealProjects();

        }

    }


    /* =====================================================
       EXPERIENCE
    ===================================================== */

    const experienceItems =
        qsa(
            ".experience-item"
        );


    if (experienceItems.length) {

        if (!reducedMotion) {

            experienceItems.forEach(
                (item) => {

                    item.style.opacity = "0";

                    item.style.transform =
                        "translateY(40px)";

                    item.style.transition =
                        "opacity 700ms ease, transform 700ms cubic-bezier(.22,1,.36,1)";

                }
            );


            const experienceObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    !entry.isIntersecting
                                ) {
                                    return;
                                }


                                const item =
                                    entry.target;


                                item.style.opacity =
                                    "1";


                                item.style.transform =
                                    "translateY(0)";


                                observer.unobserve(
                                    item
                                );

                            }
                        );

                    },
                    {
                        threshold: 0.12
                    }
                );


            experienceItems.forEach(
                (item) => {

                    experienceObserver.observe(
                        item
                    );

                }
            );

        } else {

            experienceItems.forEach(
                (item) => {

                    item.style.opacity = "1";
                    item.style.transform =
                        "none";

                }
            );
        }


        experienceItems.forEach(
            (item) => {

                item.addEventListener(
                    "mouseenter",
                    () => {

                        experienceItems.forEach(
                            (other) => {

                                if (
                                    other !== item
                                ) {

                                    other.classList.remove(
                                        "experience-active"
                                    );

                                }

                            }
                        );


                        item.classList.add(
                            "experience-active"
                        );

                    }
                );


                item.addEventListener(
                    "mouseleave",
                    () => {

                        item.classList.remove(
                            "experience-active"
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       CERTIFICATES
    ===================================================== */

    const certificatesSection =
        qs("#certificates");


    if (certificatesSection) {

        const certificateCards =
            qsa(
                ".certificate-card",
                certificatesSection
            );


        if (
            "IntersectionObserver" in window
        ) {

            const certificateObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target.classList.add(
                                        "cert-visible"
                                    );

                                    observer.unobserve(
                                        entry.target
                                    );

                                }

                            }
                        );

                    },
                    {
                        threshold: 0.12
                    }
                );


            certificateCards.forEach(
                (card) => {

                    certificateObserver.observe(
                        card
                    );

                }
            );

        } else {

            certificateCards.forEach(
                (card) => {

                    card.classList.add(
                        "cert-visible"
                    );

                }
            );


        }


        const certificateImages =
            qsa(
                ".certificate-image img",
                certificatesSection
            );


        certificateImages.forEach(
            (image) => {

                image.addEventListener(
                    "error",
                    () => {

                        image.parentElement?.classList.add(
                            "certificate-image-error"
                        );

                    }
                );

            }
        );


        const certificateLinks =
            qsa(
                ".certificate-link",
                certificatesSection
            );


        certificateLinks.forEach(
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

                            event.preventDefault();

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
       SKILLS
    ===================================================== */

    const skillGroups =
        qsa(
            ".skill-group"
        );


    if (skillGroups.length) {

        if (
            "IntersectionObserver" in window
        ) {

            const skillObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target.classList.add(
                                        "skill-visible"
                                    );

                                    observer.unobserve(
                                        entry.target
                                    );

                                }

                            }
                        );

                    },
                    {
                        threshold: 0.12
                    }
                );


            skillGroups.forEach(
                (group) => {

                    skillObserver.observe(
                        group
                    );

                }
            );

        } else {

            skillGroups.forEach(
                (group) => {

                    group.classList.add(
                        "skill-visible"
                    );

                }
            );
        }


        /*
         * Skill card hover
         */
        if (
            desktopQuery.matches &&
            !reducedMotion
        ) {

            skillGroups.forEach(
                (card) => {

                    card.addEventListener(
                        "mousemove",
                        (event) => {

                            const rect =
                                card.getBoundingClientRect();


                            const x =
                                (
                                    (event.clientX -
                                        rect.left) /
                                    rect.width -
                                    0.5
                                );


                            const y =
                                (
                                    (event.clientY -
                                        rect.top) /
                                    rect.height -
                                    0.5
                                );


                            card.style.transform =
                                `translateY(-5px) rotateX(${y * -2}deg) rotateY(${x * 2}deg)`;

                        }
                    );


                    card.addEventListener(
                        "mouseleave",
                        () => {

                            card.style.transform =
                                "";

                        }
                    );

                }
            );

        }

    }


    /* =====================================================
       SKILLS MARQUEE
    ===================================================== */

    const skillsMarquee =
        qs(
            ".skills-marquee"
        );


    const skillsTrack =
        qs(
            ".skills-marquee-track"
        );


    if (
        skillsMarquee &&
        skillsTrack
    ) {

        /*
         * Don't create another animation if CSS
         * is already handling the marquee.
         */
        if (
            !skillsTrack.classList.contains(
                "js-marquee-active"
            )
        ) {

            skillsTrack.classList.add(
                "js-marquee-active"
            );

            let position = 0;

            const speed =
                reducedMotion ? 0 : 0.45;


            const moveSkillsMarquee = () => {

                if (!reducedMotion) {

                    position -= speed;


                    /*
                     * Halfway reset.
                     * Your HTML already contains duplicate
                     * technology content.
                     */
                    const halfWidth =
                        skillsTrack.scrollWidth / 2;


                    if (
                        halfWidth > 0 &&
                        Math.abs(position) >= halfWidth
                    ) {

                        position = 0;

                    }


                    skillsTrack.style.transform =
                        `translate3d(${position}px, 0, 0)`;

                }


                window.requestAnimationFrame(
                    moveSkillsMarquee
                );

            };


            window.requestAnimationFrame(
                moveSkillsMarquee
            );

        }

    }


    /* =====================================================
       BLOG — SECTION 08
    ===================================================== */

    const blogSection =
        qs("#blog");


    if (blogSection) {

        const blogFeatured =
            qs(
                ".blog-featured",
                blogSection
            );


        const blogCards =
            qsa(
                ".blog-card",
                blogSection
            );


        const blogBottom =
            qs(
                ".blog-bottom-line",
                blogSection
            );


        /*
         * IMPORTANT:
         * Blog elements remain visible even if another
         * old CSS/JS had hidden them.
         */
        [
            blogFeatured,
            ...blogCards
        ]
        .filter(Boolean)
        .forEach(
            (element) => {

                element.classList.add(
                    "blog-visible"
                );

            }
        );


        /*
         * Reveal animation — only if the
         * new .blog-reveal class exists.
         */
        const revealItems =
            qsa(
                ".blog-reveal",
                blogSection
            );


        if (
            revealItems.length &&
            "IntersectionObserver" in window
        ) {

            const blogRevealObserver =
                new IntersectionObserver(
                    (entries, observer) => {

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


                                observer.unobserve(
                                    entry.target
                                );

                            }
                        );

                    },
                    {
                        threshold: 0.10
                    }
                );


            revealItems.forEach(
                (item) => {

                    blogRevealObserver.observe(
                        item
                    );

                }
            );

        }


        /* =================================================
           BLOG CARD HOVER
        ================================================= */

        if (
            desktopQuery.matches &&
            !reducedMotion
        ) {

            blogCards.forEach(
                (card) => {

                    const image =
                        qs(
                            ".blog-card-image img",
                            card
                        );


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


                            card.style.transform =
                                `translateY(-6px) rotateX(${y * -1.5}deg) rotateY(${x * 1.5}deg)`;


                            if (image) {

                                image.style.transform =
                                    `scale(1.045) translate3d(${x * 5}px, ${y * 4}px, 0)`;

                            }

                        }
                    );


                    card.addEventListener(
                        "mouseleave",
                        () => {

                            card.style.transform =
                                "";


                            if (image) {

                                image.style.transform =
                                    "";

                            }

                        }
                    );

                }
            );


            /*
             * Featured card
             */
            if (blogFeatured) {

                const image =
                    qs(
                        ".blog-featured-image img",
                        blogFeatured
                    );


                blogFeatured.addEventListener(
                    "mousemove",
                    (event) => {

                        const rect =
                            blogFeatured.getBoundingClientRect();


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


                        blogFeatured.style.transform =
                            "translateY(-4px)";


                        if (image) {

                            image.style.transform =
                                `scale(1.035) translate3d(${x * 6}px, ${y * 5}px, 0)`;

                        }

                    }
                );


                blogFeatured.addEventListener(
                    "mouseleave",
                    () => {

                        blogFeatured.style.transform =
                            "";


                        if (image) {

                            image.style.transform =
                                "";

                        }

                    }
                );

            }

        }


        /* =================================================
           VIEW ALL POSTS
        ================================================= */

        const viewAllButton =
            qs(
                ".blog-view-all",
                blogSection
            );


        if (viewAllButton) {

            viewAllButton.addEventListener(
                "click",
                (event) => {

                    const posts =
                        qs(
                            "#blog-posts",
                            blogSection
                        );


                    if (!posts) {
                        return;
                    }


                    event.preventDefault();


                    const headerHeight =
                        header?.offsetHeight || 0;


                    const top =
                        posts.getBoundingClientRect().top +
                        window.scrollY -
                        headerHeight -
                        20;


                    window.scrollTo({
                        top: Math.max(top, 0),
                        behavior: reducedMotion
                            ? "auto"
                            : "smooth"
                    });

                }
            );

        }


        /* =================================================
           BLOG IMAGE ERROR FALLBACK
        ================================================= */

        const blogImages =
            qsa(
                ".blog-section img"
            );


        blogImages.forEach(
            (image) => {

                image.addEventListener(
                    "error",
                    () => {

                        image.classList.add(
                            "image-error"
                        );

                    }
                );

            }
        );


        /* =================================================
           BLOG BOTTOM
        ================================================= */

        if (blogBottom) {

            blogBottom.classList.add(
                "blog-visible"
            );

        }

    }


    /* =====================================================
       CONTACT — SIMPLE REVEAL
    ===================================================== */

    const contactSection =
        qs("#contact");


    if (
        contactSection &&
        !reducedMotion
    ) {

        const contactItems =
            qsa(
                ".contact-card, .contact-item, .contact-link",
                contactSection
            );


        if (contactItems.length) {

            const contactObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target.classList.add(
                                        "contact-visible"
                                    );

                                    observer.unobserve(
                                        entry.target
                                    );

                                }

                            }
                        );

                    },
                    {
                        threshold: 0.12
                    }
                );


            contactItems.forEach(
                (item) => {

                    contactObserver.observe(
                        item
                    );

                }
            );

        }

    }


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 800
            ) {

                closeMenu();

            }

            /*
             * Recalculate nav immediately after
             * responsive layout changes.
             */
            updateActiveNav();

        },
        {
            passive: true
        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    handleNavbarScroll();
    updateActiveNav();

    document.body.classList.add(
        "page-ready"
    );

});

/* =========================================================
   SINGLE BLOG PAGE
   Reveal + Share + Copy Link
========================================================= */

(function () {
    "use strict";

    /* -------------------------------------------------------
       CHECK SINGLE BLOG PAGE
    ------------------------------------------------------- */

    const singleBlogPage = document.querySelector(".single-blog-page");

    if (!singleBlogPage) {
        return;
    }


    /* -------------------------------------------------------
       ARTICLE REVEAL
    ------------------------------------------------------- */

    const revealItems = [
        ".single-blog-header",
        ".single-blog-hero",
        ".single-blog-sidebar",
        ".single-blog-content",
        ".single-blog-share",
        ".single-blog-bottom"
    ];


    const addRevealStyles = () => {

        if (document.getElementById("single-blog-js-styles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "single-blog-js-styles";

        style.textContent = `
            .single-blog-js-reveal {
                opacity: 0;
                transform: translateY(35px);
                transition:
                    opacity 0.8s ease,
                    transform 0.8s cubic-bezier(0.2, 0.7, 0, 1);
            }

            .single-blog-js-visible {
                opacity: 1;
                transform: translateY(0);
            }

            .single-blog-content .single-blog-body p {
                opacity: 0;
                transform: translateY(20px);
                transition:
                    opacity 0.65s ease,
                    transform 0.65s cubic-bezier(0.2, 0.7, 0, 1);
            }

            .single-blog-content .single-blog-body p.blog-paragraph-visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;

        document.head.appendChild(style);
    };


    addRevealStyles();


    /* -------------------------------------------------------
       SECTION REVEAL
    ------------------------------------------------------- */

    const revealElements = [];

    revealItems.forEach((selector) => {

        document.querySelectorAll(selector).forEach((element) => {

            element.classList.add("single-blog-js-reveal");

            revealElements.push(element);

        });

    });


    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add(
                    "single-blog-js-visible"
                );

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }
    );


    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });


    /* -------------------------------------------------------
       ARTICLE PARAGRAPH REVEAL
    ------------------------------------------------------- */

    const paragraphs = document.querySelectorAll(
        ".single-blog-content .single-blog-body p"
    );


    const paragraphObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add(
                    "blog-paragraph-visible"
                );

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -35px 0px"
        }
    );


    paragraphs.forEach((paragraph, index) => {

        paragraph.style.transitionDelay =
            `${Math.min(index * 0.04, 0.18)}s`;

        paragraphObserver.observe(paragraph);

    });


    /* -------------------------------------------------------
       HERO IMAGE PARALLAX
    ------------------------------------------------------- */

    const heroImage = document.querySelector(
        ".single-blog-hero img"
    );


    if (heroImage) {

        let ticking = false;


        const updateHero = () => {

            const rect =
                heroImage.getBoundingClientRect();

            const viewportHeight =
                window.innerHeight;

            const center =
                viewportHeight / 2;

            const imageCenter =
                rect.top + rect.height / 2;

            const distance =
                imageCenter - center;

            const movement =
                Math.max(
                    -18,
                    Math.min(18, distance * -0.025)
                );


            heroImage.style.transform =
                `scale(1.03) translateY(${movement}px)`;

            ticking = false;
        };


        const onScroll = () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateHero
                );

                ticking = true;
            }

        };


        window.addEventListener(
            "scroll",
            onScroll,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            updateHero
        );

    }


    /* -------------------------------------------------------
       SHARE — LINKEDIN
    ------------------------------------------------------- */

    const linkedinButton =
        document.querySelector(
            '[data-share="linkedin"]'
        );


    if (linkedinButton) {

        linkedinButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                const currentUrl =
                    encodeURIComponent(
                        window.location.href
                    );

                const shareUrl =
                    `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;

                window.open(
                    shareUrl,
                    "_blank",
                    "noopener,noreferrer,width=700,height=600"
                );

            }
        );

    }


    /* -------------------------------------------------------
       SHARE — X
    ------------------------------------------------------- */

    const xButton =
        document.querySelector(
            '[data-share="x"]'
        );


    if (xButton) {

        xButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                const currentUrl =
                    encodeURIComponent(
                        window.location.href
                    );


                const title =
                    encodeURIComponent(
                        document.title
                    );


                const shareUrl =
                    `https://twitter.com/intent/tweet?url=${currentUrl}&text=${title}`;


                window.open(
                    shareUrl,
                    "_blank",
                    "noopener,noreferrer,width=700,height=600"
                );

            }
        );

    }


    /* -------------------------------------------------------
       COPY ARTICLE LINK
    ------------------------------------------------------- */

    const copyButton =
        document.querySelector(
            ".copy-blog-link"
        );


    if (copyButton) {

        copyButton.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();


                const url =
                    window.location.href;


                try {

                    await navigator.clipboard.writeText(
                        url
                    );


                    const originalText =
                        copyButton.textContent;


                    copyButton.textContent =
                        "✓";


                    copyButton.classList.add(
                        "copied"
                    );


                    setTimeout(() => {

                        copyButton.textContent =
                            originalText;

                        copyButton.classList.remove(
                            "copied"
                        );

                    }, 1800);


                } catch (error) {

                    /* Fallback */

                    const tempInput =
                        document.createElement("input");


                    tempInput.value = url;

                    document.body.appendChild(
                        tempInput
                    );

                    tempInput.select();

                    document.execCommand(
                        "copy"
                    );

                    tempInput.remove();


                    copyButton.textContent =
                        "✓";


                    setTimeout(() => {

                        copyButton.textContent =
                            "↗";

                    }, 1800);

                }

            }
        );

    }


    /* -------------------------------------------------------
       BACK TO TOP ON PAGE LOAD
       Prevent browser restoring old scroll position
    ------------------------------------------------------- */

    if ("scrollRestoration" in history) {

        history.scrollRestoration = "manual";

    }


    window.addEventListener(
        "pageshow",
        () => {

            if (
                window.location.hash === ""
            ) {

                window.scrollTo(
                    0,
                    0
                );

            }

        }
    );

})();

/* =========================================================
   SECTION 09 — CONTACT
   Scroll Reveal + Hover Interaction
========================================================= */

(function () {
    "use strict";

    const contactSection =
        document.querySelector("#contact");

    if (!contactSection) {
        return;
    }


    /* -------------------------------------------------------
       ELEMENTS
    ------------------------------------------------------- */

    const contactItems = [
        ".contact-top",
        ".contact-divider",
        ".contact-heading-wrap",
        ".contact-action-wrap",
        ".contact-strip",
        ".contact-bottom"
    ];


    /* -------------------------------------------------------
       DYNAMIC REVEAL STYLES
    ------------------------------------------------------- */

    if (!document.getElementById("contact-js-styles")) {

        const style = document.createElement("style");

        style.id = "contact-js-styles";

        style.textContent = `
            .contact-js-reveal {
                opacity: 0;
                transform: translateY(35px);
                transition:
                    opacity 0.8s ease,
                    transform 0.8s cubic-bezier(0.2, 0.7, 0, 1);
            }

            .contact-js-visible {
                opacity: 1;
                transform: translateY(0);
            }

            .contact-heading-js {
                opacity: 0;
                transform: translateX(-45px);
                transition:
                    opacity 0.9s ease,
                    transform 0.9s cubic-bezier(0.2, 0.7, 0, 1);
            }

            .contact-heading-js-visible {
                opacity: 1;
                transform: translateX(0);
            }

            .contact-action-js {
                opacity: 0;
                transform: translateX(45px);
                transition:
                    opacity 0.9s ease,
                    transform 0.9s cubic-bezier(0.2, 0.7, 0, 1);
            }

            .contact-action-js-visible {
                opacity: 1;
                transform: translateX(0);
            }

            .contact-strip-js {
                opacity: 0;
                transform: translateY(25px);
                transition:
                    opacity 0.7s ease,
                    transform 0.7s ease;
            }

            .contact-strip-js-visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;

        document.head.appendChild(style);
    }


    /* -------------------------------------------------------
       BASIC REVEAL
    ------------------------------------------------------- */

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "contact-js-visible"
                    );

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );


    contactItems.forEach((selector, index) => {

        document
            .querySelectorAll(
                `#contact ${selector}`
            )
            .forEach((element) => {

                element.classList.add(
                    "contact-js-reveal"
                );

                element.style.transitionDelay =
                    `${index * 0.08}s`;

                revealObserver.observe(element);

            });

    });


    /* -------------------------------------------------------
       HEADING — LEFT REVEAL
    ------------------------------------------------------- */

    const headingWrap =
        contactSection.querySelector(
            ".contact-heading-wrap"
        );


    if (headingWrap) {

        headingWrap.classList.add(
            "contact-heading-js"
        );


        const headingObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "contact-heading-js-visible"
                        );

                        observer.unobserve(entry.target);

                    });

                },
                {
                    threshold: 0.18
                }
            );


        headingObserver.observe(headingWrap);

    }


    /* -------------------------------------------------------
       ACTION — RIGHT REVEAL
    ------------------------------------------------------- */

    const actionWrap =
        contactSection.querySelector(
            ".contact-action-wrap"
        );


    if (actionWrap) {

        actionWrap.classList.add(
            "contact-action-js"
        );


        const actionObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "contact-action-js-visible"
                        );

                        observer.unobserve(entry.target);

                    });

                },
                {
                    threshold: 0.18
                }
            );


        actionObserver.observe(actionWrap);

    }


    /* -------------------------------------------------------
       STRIP STAGGER
    ------------------------------------------------------- */

    const stripItems =
        contactSection.querySelectorAll(
            ".contact-strip div"
        );


    if (stripItems.length) {

        const stripObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "contact-strip-js-visible"
                        );

                        observer.unobserve(entry.target);

                    });

                },
                {
                    threshold: 0.2
                }
            );


        stripItems.forEach((item, index) => {

            item.classList.add(
                "contact-strip-js"
            );

            item.style.transitionDelay =
                `${index * 0.08}s`;

            stripObserver.observe(item);

        });

    }


    /* -------------------------------------------------------
       EMAIL CARD POINTER EFFECT
    ------------------------------------------------------- */

    const emailCard =
        contactSection.querySelector(
            ".contact-email"
        );


    if (emailCard) {

        emailCard.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    emailCard.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const rotateX =
                    ((y / rect.height) - 0.5) * -2;

                const rotateY =
                    ((x / rect.width) - 0.5) * 2;


                emailCard.style.transform =
                    `translateY(-5px)
                     perspective(900px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)`;
            }
        );


        emailCard.addEventListener(
            "mouseleave",
            () => {

                emailCard.style.transform =
                    "translateY(0)";

            }
        );

    }


    /* -------------------------------------------------------
       COPY EMAIL
       Double click email address to copy
    ------------------------------------------------------- */

    const emailAddress =
        contactSection.querySelector(
            ".contact-email-address"
        );


    if (emailAddress) {

        emailAddress.style.cursor = "copy";


        emailAddress.addEventListener(
            "dblclick",
            async () => {

                const email =
                    emailAddress.textContent.trim();


                if (
                    !email ||
                    email.includes("@example.com")
                ) {
                    return;
                }


                try {

                    await navigator.clipboard.writeText(
                        email
                    );


                    const original =
                        emailAddress.textContent;


                    emailAddress.textContent =
                        "EMAIL COPIED ✓";


                    emailAddress.style.color =
                        "var(--contact-orange)";


                    setTimeout(() => {

                        emailAddress.textContent =
                            original;

                        emailAddress.style.color =
                            "";

                    }, 1500);

                } catch (error) {

                    console.warn(
                        "Unable to copy email.",
                        error
                    );

                }

            }
        );

    }


    /* -------------------------------------------------------
       CONTACT STATUS DOT
       Very subtle pulse
    ------------------------------------------------------- */

    const statusDot =
        contactSection.querySelector(
            ".contact-status-dot"
        );


    if (statusDot) {

        let growing = true;
        let scale = 1;


        const pulseStatusDot = () => {

            scale += growing ? 0.003 : -0.003;


            if (scale >= 1.15) {
                growing = false;
            }


            if (scale <= 1) {
                growing = true;
            }


            statusDot.style.transform =
                `scale(${scale})`;


            requestAnimationFrame(
                pulseStatusDot
            );

        };


        requestAnimationFrame(
            pulseStatusDot
        );

    }

})();