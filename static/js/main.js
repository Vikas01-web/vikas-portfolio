/* =========================================================
   VIKAS KUMAR PORTFOLIO
   MAIN.JS
   CENTRAL / EXTENDABLE / ANIMATION FIRST
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       GLOBAL HELPERS
       ===================================================== */

    const qs = (selector, parent = document) =>
        parent.querySelector(selector);

    const qsa = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const finePointer = window.matchMedia(
        "(pointer: fine)"
    ).matches;

    const initializedSections = new Set();
    const pendingInitializers = [];

    let domReady =
        document.readyState !== "loading";


    /* =====================================================
       EXTENDABLE SECTION REGISTRY
       -----------------------------------------------------
       Future sections can be added at the END like this:

       function initCertificates() {
           const section = qs("#certificates");
           if (!section) return;

           // animation...
       }

       registerSection(
           "certificates",
           initCertificates
       );

       No need to change boot().
       ===================================================== */

    const runInitializer = (
        name,
        initializer
    ) => {
        if (
            !name ||
            typeof initializer !== "function"
        ) {
            return;
        }

        if (
            initializedSections.has(name)
        ) {
            return;
        }

        initializedSections.add(name);

        try {
            initializer();
        } catch (error) {
            console.error(
                `[Vikas Portfolio] ${name} initialization failed:`,
                error
            );
        }
    };


    const registerSection = (
        name,
        initializer
    ) => {
        if (
            !name ||
            typeof initializer !== "function"
        ) {
            return;
        }

        if (domReady) {
            runInitializer(
                name,
                initializer
            );
        } else {
            pendingInitializers.push({
                name,
                initializer
            });
        }
    };


    window.VikasPortfolio =
        window.VikasPortfolio || {};

    window.VikasPortfolio.registerSection =
        registerSection;

    window.VikasPortfolio.init =
        registerSection;

    window.VikasPortfolio.reduceMotion =
        reduceMotion;

    window.VikasPortfolio.finePointer =
        finePointer;


    /* =====================================================
       DOM READY
       ===================================================== */

    const boot = () => {
        domReady = true;

        runInitializer(
            "loader",
            initLoader
        );

        runInitializer(
            "navbar",
            initNavbar
        );

        runInitializer(
            "smooth-scroll",
            initSmoothScroll
        );

        runInitializer(
            "home",
            initHome
        );

        runInitializer(
            "about",
            initAbout
        );

        runInitializer(
            "projects",
            initProjects
        );

        runInitializer(
            "experience",
            initExperience
        );

        while (
            pendingInitializers.length
        ) {
            const item =
                pendingInitializers.shift();

            if (!item) {
                continue;
            }

            runInitializer(
                item.name,
                item.initializer
            );
        }
    };


    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            boot,
            { once: true }
        );
    } else {
        boot();
    }


    /* =====================================================
       01 — LOADER
       ===================================================== */

    function initLoader() {
        const loader =
            qs("#page-loader");

        if (!loader) {
            document.body.classList.add(
                "page-loaded"
            );
            return;
        }

        if (
            loader.dataset.vikasInitialized ===
            "true"
        ) {
            return;
        }

        loader.dataset.vikasInitialized =
            "true";


        const progressBar =
            qs(
                "#loader-progress-bar",
                loader
            );

        const progressPoint =
            qs(
                "#loader-progress-point",
                loader
            );

        const percent =
            qs(
                "#loader-percent",
                loader
            );

        const status =
            qs(
                "#loader-status-text",
                loader
            );


        let progress = 0;
        let finished = false;
        let statusIndex = 0;
        let statusTimer = null;


        const statuses = [
            "INITIALIZING DIGITAL EXPERIENCE",
            "LOADING PORTFOLIO SYSTEM",
            "CONNECTING PROJECTS",
            "PREPARING VIKAS.DEV",
            "PORTFOLIO READY"
        ];


        const setProgress = (value) => {
            progress = Math.max(
                0,
                Math.min(
                    100,
                    Number(value) || 0
                )
            );

            if (progressBar) {
                progressBar.style.width =
                    `${progress}%`;
            }

            if (progressPoint) {
                progressPoint.style.left =
                    `${progress}%`;
            }

            if (percent) {
                percent.textContent =
                    `${String(
                        Math.round(progress)
                    ).padStart(2, "0")}%`;
            }
        };


        const finishLoader = () => {
            if (finished) {
                return;
            }

            finished = true;


            if (statusTimer) {
                window.clearInterval(
                    statusTimer
                );

                statusTimer = null;
            }


            setProgress(100);


            if (status) {
                status.textContent =
                    "PORTFOLIO READY";
            }


            loader.classList.add(
                "is-logo-ready"
            );


            if (reduceMotion) {
                loader.classList.add(
                    "is-hidden"
                );

                document.body.classList.add(
                    "page-loaded"
                );

                return;
            }


            window.setTimeout(() => {
                loader.classList.add(
                    "is-exiting"
                );
            }, 280);


            window.setTimeout(() => {
                loader.classList.add(
                    "is-hidden"
                );

                document.body.classList.add(
                    "page-loaded"
                );
            }, 1050);
        };


        if (
            !reduceMotion &&
            status
        ) {
            statusTimer =
                window.setInterval(() => {
                    statusIndex =
                        Math.min(
                            statusIndex + 1,
                            statuses.length - 1
                        );

                    status.textContent =
                        statuses[
                            statusIndex
                        ];
                }, 430);
        }


        if (reduceMotion) {
            setProgress(100);
        } else {
            const start =
                performance.now();

            const duration =
                1250;


            const animate =
                (now) => {
                    const ratio =
                        Math.min(
                            (now - start) /
                                duration,
                            1
                        );

                    const eased =
                        1 -
                        Math.pow(
                            1 - ratio,
                            3
                        );

                    setProgress(
                        eased * 94
                    );


                    if (
                        ratio < 1
                    ) {
                        window.requestAnimationFrame(
                            animate
                        );
                    } else {
                        window.setTimeout(
                            () => {
                                setProgress(
                                    100
                                );
                            },
                            120
                        );
                    }
                };


            window.requestAnimationFrame(
                animate
            );
        }


        window.setTimeout(
            () => {
                loader.classList.add(
                    "is-logo-ready"
                );
            },
            reduceMotion
                ? 0
                : 650
        );


        if (
            document.readyState ===
            "complete"
        ) {
            window.setTimeout(
                finishLoader,
                reduceMotion
                    ? 0
                    : 120
            );
        } else {
            window.addEventListener(
                "load",
                finishLoader,
                { once: true }
            );
        }


        window.setTimeout(
            finishLoader,
            5000
        );
    }


    /* =====================================================
       02 — NAVBAR
       ===================================================== */

    function initNavbar() {
        const header =
            qs("#site-header");

        if (!header) {
            return;
        }

        if (
            header.dataset.vikasInitialized ===
            "true"
        ) {
            return;
        }

        header.dataset.vikasInitialized =
            "true";


        const menuButton =
            qs(
                ".navbar-menu",
                header
            );

        const mobileMenu =
            qs(
                "#navbar-mobile",
                header
            );

        const navLinks =
            qsa(
                ".navbar-link",
                header
            );

        const mobileLinks =
            qsa(
                ".navbar-mobile-link",
                header
            );


        const closeMenu = () => {
            header.classList.remove(
                "menu-active"
            );

            if (mobileMenu) {
                mobileMenu.classList.remove(
                    "is-open"
                );
            }

            if (menuButton) {
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
        };


        const openMenu = () => {
            header.classList.add(
                "menu-active"
            );

            if (mobileMenu) {
                mobileMenu.classList.add(
                    "is-open"
                );
            }

            if (menuButton) {
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
        };


        if (menuButton) {
            menuButton.addEventListener(
                "click",
                (event) => {
                    event.stopPropagation();

                    if (
                        header.classList.contains(
                            "menu-active"
                        )
                    ) {
                        closeMenu();
                    } else {
                        openMenu();
                    }
                }
            );
        }


        [
            ...navLinks,
            ...mobileLinks
        ].forEach((link) => {
            link.addEventListener(
                "click",
                (event) => {
                    const href =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !href ||
                        !href.startsWith("#")
                    ) {
                        return;
                    }

                    const target =
                        qs(href);

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    closeMenu();

                    const offset =
                        window.innerWidth <= 700
                            ? 65
                            : 95;

                    window.scrollTo({
                        top:
                            target.getBoundingClientRect()
                                .top +
                            window.scrollY -
                            offset,
                        behavior:
                            reduceMotion
                                ? "auto"
                                : "smooth"
                    });
                }
            );
        });


        document.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key ===
                    "Escape"
                ) {
                    closeMenu();
                }
            }
        );


        document.addEventListener(
            "click",
            (event) => {
                if (
                    !header.contains(
                        event.target
                    )
                ) {
                    closeMenu();
                }
            }
        );


        let previousY =
            window.scrollY;

        let ticking = false;


        const updateHeader = () => {
            const currentY =
                window.scrollY;

            const delta =
                currentY -
                previousY;


            if (
                currentY <= 20
            ) {
                header.classList.remove(
                    "header-hidden"
                );
            } else if (
                delta > 6 &&
                currentY > 100 &&
                !header.classList.contains(
                    "menu-active"
                )
            ) {
                header.classList.add(
                    "header-hidden"
                );
            } else if (
                delta < -5
            ) {
                header.classList.remove(
                    "header-hidden"
                );
            }


            header.classList.toggle(
                "is-scrolled",
                currentY > 20
            );


            previousY =
                currentY;

            ticking = false;
        };


        window.addEventListener(
            "scroll",
            () => {
                if (ticking) {
                    return;
                }

                ticking = true;

                window.requestAnimationFrame(
                    updateHeader
                );
            },
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            () => {
                if (
                    window.innerWidth >
                    900
                ) {
                    closeMenu();
                }
            }
        );


        updateHeader();


        const sections =
            qsa("section[id]");


        const getNavLink = (id) =>
            navLinks.find(
                (link) =>
                    link.getAttribute(
                        "href"
                    ) === `#${id}`
            );


        if (!sections.length) {
            return;
        }


        const sectionObserver =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach(
                        (entry) => {
                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            navLinks.forEach(
                                (link) => {
                                    link.classList.remove(
                                        "is-active"
                                    );
                                }
                            );


                            const activeLink =
                                getNavLink(
                                    entry.target.id
                                );


                            if (activeLink) {
                                activeLink.classList.add(
                                    "is-active"
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0,
                    rootMargin:
                        "-40% 0px -52% 0px"
                }
            );


        sections.forEach(
            (section) => {
                sectionObserver.observe(
                    section
                );
            }
        );
    }


    /* =====================================================
       03 — GLOBAL SMOOTH SCROLL
       ===================================================== */

    function initSmoothScroll() {
        const links =
            qsa('a[href^="#"]');

        if (!links.length) {
            return;
        }


        links.forEach((link) => {
            if (
                link.dataset.smoothBound ===
                "true"
            ) {
                return;
            }


            if (
                link.closest(".navbar")
            ) {
                return;
            }


            link.dataset.smoothBound =
                "true";


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


                    const target =
                        qs(href);

                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const offset =
                        window.innerWidth <= 700
                            ? 60
                            : 90;


                    window.scrollTo({
                        top:
                            target.getBoundingClientRect()
                                .top +
                            window.scrollY -
                            offset,
                        behavior:
                            reduceMotion
                                ? "auto"
                                : "smooth"
                    });
                }
            );
        });
    }


    /* =====================================================
       04 — HOME / HERO
       ===================================================== */

    function initHome() {
        const hero =
            qs(
                "#home.hero-section"
            );

        if (!hero) {
            return;
        }


        if (
            hero.dataset.vikasInitialized ===
            "true"
        ) {
            return;
        }


        hero.dataset.vikasInitialized =
            "true";


        const visual =
            qs(
                ".hero-visual",
                hero
            );

        const stage =
            qs(
                ".hero-image-stage",
                hero
            );

        const image =
            qs(
                ".hero-image",
                hero
            );

        const glow =
            qs(
                ".hero-background-glow",
                hero
            );

        const dot =
            qs(
                ".hero-background-dot",
                hero
            );

        const primary =
            qs(
                ".hero-primary-button",
                hero
            );


        window.requestAnimationFrame(
            () => {
                hero.classList.add(
                    "hero-ready"
                );

                window.setTimeout(
                    () => {
                        hero.classList.add(
                            "hero-visible"
                        );
                    },
                    reduceMotion
                        ? 0
                        : 80
                );
            }
        );


        if (
            finePointer &&
            !reduceMotion
        ) {
            let targetX = 0;
            let targetY = 0;

            let currentX = 0;
            let currentY = 0;

            let raf = null;


            const render = () => {
                currentX +=
                    (
                        targetX -
                        currentX
                    ) * 0.075;

                currentY +=
                    (
                        targetY -
                        currentY
                    ) * 0.075;


                if (visual) {
                    visual.style.transform =
                        `translate3d(
                            ${currentX * 4}px,
                            ${currentY * 4}px,
                            0
                        )`;
                }


                if (stage) {
                    stage.style.transform =
                        `translate3d(
                            ${currentX * 8}px,
                            ${currentY * 6}px,
                            0
                        )`;
                }


                if (glow) {
                    glow.style.transform =
                        `translate3d(
                            ${currentX * -14}px,
                            ${currentY * -10}px,
                            0
                        )`;
                }


                if (dot) {
                    dot.style.transform =
                        `translate3d(
                            ${currentX * 20}px,
                            ${currentY * 16}px,
                            0
                        )`;
                }


                raf = null;
            };


            hero.addEventListener(
                "pointermove",
                (event) => {
                    const rect =
                        hero.getBoundingClientRect();


                    targetX =
                        (
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width
                        ) -
                        0.5;


                    targetY =
                        (
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height
                        ) -
                        0.5;


                    if (!raf) {
                        raf =
                            window.requestAnimationFrame(
                                render
                            );
                    }
                }
            );


            hero.addEventListener(
                "pointerleave",
                () => {
                    targetX = 0;
                    targetY = 0;


                    if (!raf) {
                        raf =
                            window.requestAnimationFrame(
                                render
                            );
                    }
                }
            );
        }


        if (
            primary &&
            finePointer &&
            !reduceMotion
        ) {
            primary.addEventListener(
                "pointermove",
                (event) => {
                    const rect =
                        primary.getBoundingClientRect();


                    const x =
                        (
                            event.clientX -
                            rect.left -
                            rect.width / 2
                        ) * 0.08;


                    const y =
                        (
                            event.clientY -
                            rect.top -
                            rect.height / 2
                        ) * 0.08;


                    primary.style.transform =
                        `translate3d(
                            ${x}px,
                            ${y}px,
                            0
                        )`;
                }
            );


            primary.addEventListener(
                "pointerleave",
                () => {
                    primary.style.transform =
                        "";
                }
            );
        }


        if (image) {
            if (image.complete) {
                image.classList.add(
                    "is-loaded"
                );
            }


            image.addEventListener(
                "load",
                () => {
                    image.classList.add(
                        "is-loaded"
                    );
                },
                { once: true }
            );
        }
    }


    /* =====================================================
       05 — ABOUT
       ===================================================== */

    function initAbout() {
        const section =
            qs(
                "#about.about-section"
            );

        if (!section) {
            return;
        }


        if (
            section.dataset.vikasInitialized ===
            "true"
        ) {
            return;
        }


        section.dataset.vikasInitialized =
            "true";


        const revealItems =
            qsa(
                "[data-about-reveal]",
                section
            );

        const visual =
            qs(
                "[data-about-visual]",
                section
            );


        section.classList.add(
            "about-ready"
        );


        let hasEntered = false;


        const observer =
            new IntersectionObserver(
                (
                    entries,
                    observerInstance
                ) => {
                    entries.forEach(
                        (entry) => {
                            if (
                                !entry.isIntersecting ||
                                hasEntered
                            ) {
                                return;
                            }


                            hasEntered = true;


                            section.classList.add(
                                "about-visible"
                            );


                            if (visual) {
                                window.setTimeout(
                                    () => {
                                        visual.classList.add(
                                            "is-visible"
                                        );
                                    },
                                    reduceMotion
                                        ? 0
                                        : 120
                                );
                            }


                            revealItems.forEach(
                                (
                                    item,
                                    index
                                ) => {
                                    window.setTimeout(
                                        () => {
                                            item.classList.add(
                                                "is-visible"
                                            );
                                        },
                                        reduceMotion
                                            ? 0
                                            : 80 +
                                              index * 95
                                    );
                                }
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
                        "0px 0px -10% 0px"
                }
            );


        observer.observe(section);


        if (
            visual &&
            finePointer &&
            !reduceMotion
        ) {
            const mainFrame =
                qs(
                    ".about-main-frame",
                    visual
                );

            const miniOne =
                qs(
                    ".about-mini-one",
                    visual
                );

            const miniTwo =
                qs(
                    ".about-mini-two",
                    visual
                );


            visual.addEventListener(
                "pointermove",
                (event) => {
                    const rect =
                        visual.getBoundingClientRect();


                    const x =
                        (
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width
                        ) -
                        0.5;


                    const y =
                        (
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height
                        ) -
                        0.5;


                    if (mainFrame) {
                        mainFrame.style.transform =
                            `rotate(
                                ${4.5 + x * 2}deg
                            )
                            translate3d(
                                ${x * 10}px,
                                ${y * 8}px,
                                20px
                            )`;
                    }


                    if (miniOne) {
                        miniOne.style.transform =
                            `rotate(
                                ${-7 + x * 3}deg
                            )
                            translate3d(
                                ${x * -13}px,
                                ${y * -10}px,
                                60px
                            )`;
                    }


                    if (miniTwo) {
                        miniTwo.style.transform =
                            `rotate(
                                ${6 + x * 3}deg
                            )
                            translate3d(
                                ${x * 14}px,
                                ${y * 11}px,
                                90px
                            )`;
                    }
                }
            );


            visual.addEventListener(
                "pointerleave",
                () => {
                    if (mainFrame) {
                        mainFrame.style.transform =
                            "";
                    }

                    if (miniOne) {
                        miniOne.style.transform =
                            "";
                    }

                    if (miniTwo) {
                        miniTwo.style.transform =
                            "";
                    }
                }
            );
        }


        if (reduceMotion) {
            section.classList.add(
                "about-visible"
            );


            revealItems.forEach(
                (item) => {
                    item.classList.add(
                        "is-visible"
                    );
                }
            );


            if (visual) {
                visual.classList.add(
                    "is-visible"
                );
            }
        }
    }


    /* =====================================================
       06 — PROJECTS
       ===================================================== */

    function initProjects() {
        const section =
            qs(
                "#projects.project-lab"
            );

        if (!section) {
            return;
        }


        if (
            section.dataset.vikasInitialized ===
            "true"
        ) {
            return;
        }


        section.dataset.vikasInitialized =
            "true";


        const data =
            qsa(
                "[data-project-item]",
                section
            );

        const tabs =
            qsa(
                "[data-project-tab]",
                section
            );

        const image =
            qs(
                "[data-project-image]",
                section
            );

        const media =
            qs(
                "[data-project-media]",
                section
            );

        const frame =
            qs(
                ".project-lab-art-frame",
                section
            );

        const title =
            qs(
                "[data-project-title]",
                section
            );

        const description =
            qs(
                "[data-project-description]",
                section
            );

        const tech =
            qs(
                "[data-project-tech]",
                section
            );

        const typeNodes =
            qsa(
                "[data-project-type]",
                section
            );

        const year =
            qs(
                "[data-project-year]",
                section
            );

        const total =
            qs(
                "[data-project-total]",
                section
            );

        const currentNodes =
            qsa(
                "[data-project-current]",
                section
            );

        const artNumber =
            qs(
                ".project-lab-art-number",
                section
            );

        const ghost =
            qs(
                ".project-lab-ghost-number",
                section
            );

        const orbit =
            qs(
                ".project-lab-orbit",
                section
            );

        const radial =
            qs(
                ".project-lab-radial",
                section
            );

        const info =
            qs(
                ".project-lab-information",
                section
            );


        if (!data.length) {
            return;
        }


        section.classList.add(
            "project-js-ready"
        );


        let activeIndex = 0;
        let changing = false;


        const getProject = (index) => {
            const item =
                data[index];

            if (!item) {
                return null;
            }


            return {
                image:
                    item.dataset.image ||
                    "",

                alt:
                    item.dataset.alt ||
                    "",

                title:
                    item.dataset.title ||
                    "",

                type:
                    item.dataset.type ||
                    "",

                year:
                    item.dataset.year ||
                    "",

                description:
                    item.dataset.description ||
                    "",

                tech:
                    (
                        item.dataset.tech ||
                        ""
                    )
                        .split("|")
                        .map(
                            (value) =>
                                value.trim()
                        )
                        .filter(Boolean)
            };
        };


        const renderTech = (
            items
        ) => {
            if (!tech) {
                return;
            }


            tech.innerHTML = "";


            items.forEach(
                (
                    item,
                    index
                ) => {
                    const tag =
                        document.createElement(
                            "span"
                        );


                    tag.textContent =
                        item;


                    tag.style.animationDelay =
                        `${index * 45}ms`;


                    tech.appendChild(
                        tag
                    );
                }
            );
        };


        const renderProject = (
            index
        ) => {
            const project =
                getProject(index);

            if (!project) {
                return;
            }


            activeIndex =
                index;


            const number =
                String(
                    index + 1
                ).padStart(
                    2,
                    "0"
                );


            if (image) {
                image.src =
                    project.image;

                image.alt =
                    project.alt ||
                    project.title;
            }


            if (title) {
                title.textContent =
                    project.title;
            }


            if (description) {
                description.textContent =
                    project.description;
            }


            typeNodes.forEach(
                (node) => {
                    node.textContent =
                        project.type;
                }
            );


            if (year) {
                year.textContent =
                    project.year;
            }


            currentNodes.forEach(
                (node) => {
                    node.textContent =
                        number;
                }
            );


            if (total) {
                total.textContent =
                    String(
                        data.length
                    ).padStart(
                        2,
                        "0"
                    );
            }


            if (artNumber) {
                artNumber.textContent =
                    number;
            }


            renderTech(
                project.tech
            );


            tabs.forEach(
                (tab) => {
                    const tabIndex =
                        Number(
                            tab.dataset.projectTab
                        );

                    tab.classList.toggle(
                        "is-active",
                        tabIndex ===
                            index
                    );
                }
            );
        };


        const switchProject = (
            index
        ) => {
            if (
                data.length <= 1 ||
                changing
            ) {
                return;
            }


            if (index < 0) {
                index =
                    data.length - 1;
            }


            if (
                index >=
                data.length
            ) {
                index = 0;
            }


            if (
                index ===
                activeIndex
            ) {
                return;
            }


            if (reduceMotion) {
                renderProject(
                    index
                );
                return;
            }


            changing = true;


            if (media) {
                media.classList.add(
                    "is-project-changing"
                );
            }


            if (info) {
                info.classList.add(
                    "is-project-changing"
                );
            }


            window.setTimeout(
                () => {
                    renderProject(
                        index
                    );


                    if (image) {
                        image.style.opacity =
                            "0";

                        image.style.transform =
                            "scale(1.1)";
                    }
                },
                250
            );


            window.setTimeout(
                () => {
                    if (media) {
                        media.classList.remove(
                            "is-project-changing"
                        );
                    }


                    if (info) {
                        info.classList.remove(
                            "is-project-changing"
                        );
                    }


                    if (image) {
                        window.requestAnimationFrame(
                            () => {
                                image.style.opacity =
                                    "1";

                                image.style.transform =
                                    "";
                            }
                        );
                    }


                    changing = false;
                },
                520
            );
        };


        tabs.forEach(
            (tab) => {
                tab.addEventListener(
                    "click",
                    () => {
                        const index =
                            Number(
                                tab.dataset.projectTab
                            );


                        if (
                            Number.isNaN(
                                index
                            )
                        ) {
                            return;
                        }


                        switchProject(
                            index
                        );
                    }
                );
            }
        );


        section.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key !==
                        "ArrowRight" &&
                    event.key !==
                        "ArrowLeft"
                ) {
                    return;
                }


                const activeElement =
                    document.activeElement;


                if (
                    !activeElement ||
                    !activeElement.matches(
                        "[data-project-tab]"
                    )
                ) {
                    return;
                }


                event.preventDefault();


                if (
                    event.key ===
                    "ArrowRight"
                ) {
                    switchProject(
                        activeIndex + 1
                    );
                } else {
                    switchProject(
                        activeIndex - 1
                    );
                }
            }
        );


        if (
            media &&
            finePointer &&
            !reduceMotion
        ) {
            let targetX = 50;
            let targetY = 50;

            let currentX = 50;
            let currentY = 50;

            let raf = null;


            const render = () => {
                currentX +=
                    (
                        targetX -
                        currentX
                    ) * 0.08;

                currentY +=
                    (
                        targetY -
                        currentY
                    ) * 0.08;


                const offsetX =
                    currentX - 50;

                const offsetY =
                    currentY - 50;


                media.style.setProperty(
                    "--mx",
                    `${currentX}%`
                );


                media.style.setProperty(
                    "--my",
                    `${currentY}%`
                );


                if (image) {
                    image.style.transform =
                        `translate3d(
                            ${offsetX * 0.055}px,
                            ${offsetY * 0.055}px,
                            0
                        )
                        scale(1.045)`;
                }


                if (frame) {
                    frame.style.setProperty(
                        "--rx",
                        `${offsetY * -0.025}deg`
                    );

                    frame.style.setProperty(
                        "--ry",
                        `${offsetX * 0.03}deg`
                    );
                }


                raf = null;
            };


            media.addEventListener(
                "pointermove",
                (event) => {
                    const rect =
                        media.getBoundingClientRect();


                    targetX =
                        (
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width
                        ) * 100;


                    targetY =
                        (
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height
                        ) * 100;


                    targetX =
                        Math.max(
                            0,
                            Math.min(
                                100,
                                targetX
                            )
                        );


                    targetY =
                        Math.max(
                            0,
                            Math.min(
                                100,
                                targetY
                            )
                        );


                    if (!raf) {
                        raf =
                            window.requestAnimationFrame(
                                render
                            );
                    }
                }
            );


            media.addEventListener(
                "pointerleave",
                () => {
                    targetX = 50;
                    targetY = 50;


                    if (!raf) {
                        raf =
                            window.requestAnimationFrame(
                                render
                            );
                    }
                }
            );
        }


        let projectEntered =
            false;


        const observer =
            new IntersectionObserver(
                (
                    entries,
                    instance
                ) => {
                    entries.forEach(
                        (entry) => {
                            if (
                                !entry.isIntersecting ||
                                projectEntered
                            ) {
                                return;
                            }


                            projectEntered =
                                true;


                            section.classList.add(
                                "project-visible"
                            );


                            renderProject(
                                activeIndex
                            );


                            instance.unobserve(
                                entry.target
                            );
                        }
                    );
                },
                {
                    threshold: 0.1,
                    rootMargin:
                        "0px 0px -8% 0px"
                }
            );


        observer.observe(
            section
        );


        if (!reduceMotion) {
            let ticking = false;


            const updateBackground =
                () => {
                    const rect =
                        section.getBoundingClientRect();

                    const viewport =
                        window.innerHeight;


                    if (
                        rect.bottom < 0 ||
                        rect.top > viewport
                    ) {
                        ticking = false;
                        return;
                    }


                    const progress =
                        Math.max(
                            0,
                            Math.min(
                                1,
                                (
                                    viewport -
                                    rect.top
                                ) /
                                (
                                    viewport +
                                    rect.height
                                )
                            )
                        );


                    if (ghost) {
                        ghost.style.transform =
                            `translate3d(
                                ${progress * -32}px,
                                ${progress * 38}px,
                                0
                            )`;
                    }


                    if (orbit) {
                        orbit.style.transform =
                            `translate3d(
                                ${progress * -18}px,
                                ${progress * 24}px,
                                0
                            )
                            rotate(
                                ${progress * 8}deg
                            )`;
                    }


                    if (radial) {
                        radial.style.transform =
                            `translate3d(
                                ${progress * 16}px,
                                ${progress * -20}px,
                                0
                            )`;
                    }


                    ticking = false;
                };


            window.addEventListener(
                "scroll",
                () => {
                    if (ticking) {
                        return;
                    }


                    ticking = true;


                    window.requestAnimationFrame(
                        updateBackground
                    );
                },
                {
                    passive: true
                }
            );


            updateBackground();
        }


        let touchStartX = 0;
        let touchStartY = 0;


        section.addEventListener(
            "touchstart",
            (event) => {
                if (
                    !event.touches.length
                ) {
                    return;
                }


                touchStartX =
                    event.touches[0].clientX;

                touchStartY =
                    event.touches[0].clientY;
            },
            {
                passive: true
            }
        );


        section.addEventListener(
            "touchend",
            (event) => {
                if (
                    !event.changedTouches.length
                ) {
                    return;
                }


                const touch =
                    event.changedTouches[0];


                const deltaX =
                    touch.clientX -
                    touchStartX;


                const deltaY =
                    touch.clientY -
                    touchStartY;


                if (
                    Math.abs(deltaX) <
                        50 ||
                    Math.abs(deltaX) <=
                        Math.abs(deltaY)
                ) {
                    return;
                }


                if (
                    deltaX < 0
                ) {
                    switchProject(
                        activeIndex + 1
                    );
                } else {
                    switchProject(
                        activeIndex - 1
                    );
                }
            },
            {
                passive: true
            }
        );


        data.forEach(
            (item) => {
                const src =
                    item.dataset.image;

                if (!src) {
                    return;
                }


                const preload =
                    new Image();

                preload.src =
                    src;
            }
        );


        renderProject(0);
    }


    /* =====================================================
       07 — EXPERIENCE / THE PATH
       -----------------------------------------------------
       Matches latest light Experience HTML:

       #experience.experience-path
       [data-experience-station]

       Animation:
       - Intro reveal
       - Card stagger
       - Timeline draw
       - Station fade / slide
       - Card tilt
       - Background parallax
       - Current pulse
       - Hover skill interaction
       ===================================================== */

    function initExperience() {
        const section =
            qs(
                "#experience.experience-path"
            );

        if (!section) {
            return;
        }


        if (
            section.dataset.vikasInitialized ===
            "true"
        ) {
            return;
        }


        section.dataset.vikasInitialized =
            "true";


        const stations =
            qsa(
                "[data-experience-station]",
                section
            );


        if (!stations.length) {
            return;
        }


        /* ---------------------------------------------
           ELEMENTS
           --------------------------------------------- */

        const route =
            qs(
                ".experience-path-route-progress",
                section
            );

        const header =
            qs(
                ".experience-path-header",
                section
            );

        const kicker =
            qs(
                ".experience-path-kicker",
                section
            );

        const title =
            qs(
                ".experience-path-title h2",
                section
            );

        const titleLine =
            qs(
                ".experience-title-line span",
                section
            );

        const introCopy =
            qs(
                ".experience-path-intro-copy",
                section
            );

        const bottom =
            qs(
                ".experience-path-bottom",
                section
            );

        const backgroundWord =
            qs(
                ".experience-path-bg-word",
                section
            );

        const backgroundOrb =
            qs(
                ".experience-path-bg-orb",
                section
            );

        const backgroundLine =
            qs(
                ".experience-path-bg-line",
                section
            );


        /* ---------------------------------------------
           ENABLE ANIMATION MODE
           --------------------------------------------- */

        section.classList.add(
            "experience-js-ready"
        );


        let hasEntered =
            false;


        /* ---------------------------------------------
           INTRO REVEAL
           --------------------------------------------- */

        const revealIntro = () => {
            section.classList.add(
                "experience-visible"
            );


            if (header) {
                header.classList.add(
                    "is-visible"
                );
            }


            if (kicker) {
                kicker.classList.add(
                    "is-visible"
                );
            }


            if (title) {
                title.classList.add(
                    "is-visible"
                );
            }


            if (titleLine) {
                titleLine.classList.add(
                    "is-visible"
                );
            }


            if (introCopy) {
                introCopy.classList.add(
                    "is-visible"
                );
            }
        };


        /* ---------------------------------------------
           STATION REVEAL
           --------------------------------------------- */

        const revealStation = (
            station,
            index
        ) => {
            if (!station) {
                return;
            }


            const delay =
                reduceMotion
                    ? 0
                    : index * 170;


            window.setTimeout(
                () => {
                    station.classList.add(
                        "is-visible"
                    );
                },
                delay
            );
        };


        /* ---------------------------------------------
           MAIN EXPERIENCE ENTRY
           --------------------------------------------- */

        const enterExperience = () => {
            if (hasEntered) {
                return;
            }


            hasEntered = true;


            revealIntro();


            stations.forEach(
                (
                    station,
                    index
                ) => {
                    revealStation(
                        station,
                        index
                    );
                }
            );


            /* Timeline draw */

            if (route) {
                if (reduceMotion) {
                    route.style.transform =
                        "scaleY(1)";
                } else {
                    window.setTimeout(
                        () => {
                            route.style.transform =
                                "scaleY(1)";
                        },
                        250
                    );
                }
            }


            /* Bottom statement */

            if (bottom) {
                window.setTimeout(
                    () => {
                        bottom.classList.add(
                            "is-visible"
                        );
                    },
                    reduceMotion
                        ? 0
                        : 720
                );
            }
        };


        /* ---------------------------------------------
           MAIN SECTION OBSERVER
           --------------------------------------------- */

        const sectionObserver =
            new IntersectionObserver(
                (
                    entries,
                    observerInstance
                ) => {
                    entries.forEach(
                        (entry) => {
                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            enterExperience();


                            observerInstance.unobserve(
                                entry.target
                            );
                        }
                    );
                },
                {
                    threshold: 0.08,
                    rootMargin:
                        "0px 0px -5% 0px"
                }
            );


        sectionObserver.observe(
            section
        );


        /* ---------------------------------------------
           INDIVIDUAL STATION OBSERVER
           ------------------------------------------------
           This makes each card independently react as
           it gets close to the viewport.
           --------------------------------------------- */

        if (!reduceMotion) {
            const stationObserver =
                new IntersectionObserver(
                    (
                        entries
                    ) => {
                        entries.forEach(
                            (entry) => {
                                if (
                                    !entry.isIntersecting
                                ) {
                                    return;
                                }


                                const station =
                                    entry.target;


                                station.classList.add(
                                    "is-visible"
                                );


                                stationObserver.unobserve(
                                    station
                                );
                            }
                        );
                    },
                    {
                        threshold: 0.1,
                        rootMargin:
                            "0px 0px -10% 0px"
                    }
                );


            stations.forEach(
                (station) => {
                    stationObserver.observe(
                        station
                    );
                }
            );
        }


        /* ---------------------------------------------
           FALLBACK
           ------------------------------------------------
           Prevents animation from staying hidden when
           page opens directly at #experience or browser
           restores a previous scroll position.
           --------------------------------------------- */

        const checkInitialPosition = () => {
            if (hasEntered) {
                return;
            }


            const rect =
                section.getBoundingClientRect();

            const viewport =
                window.innerHeight;


            const isVisible =
                rect.top <
                    viewport * 0.9 &&
                rect.bottom >
                    viewport * 0.05;


            if (isVisible) {
                enterExperience();
            }
        };


        window.setTimeout(
            checkInitialPosition,
            120
        );


        window.addEventListener(
            "scroll",
            checkInitialPosition,
            {
                passive: true,
                once: true
            }
        );


        /* ---------------------------------------------
           REDUCED MOTION
           --------------------------------------------- */

        if (reduceMotion) {
            section.classList.add(
                "experience-visible"
            );


            stations.forEach(
                (station) => {
                    station.classList.add(
                        "is-visible"
                    );
                }
            );


            if (route) {
                route.style.transform =
                    "scaleY(1)";
            }


            if (bottom) {
                bottom.classList.add(
                    "is-visible"
                );
            }
        }


        /* ---------------------------------------------
           CARD TILT
           --------------------------------------------- */

        if (
            finePointer &&
            !reduceMotion
        ) {
            stations.forEach(
                (station) => {
                    const card =
                        qs(
                            ".experience-path-story",
                            station
                        );


                    if (!card) {
                        return;
                    }


                    let targetX = 0;
                    let targetY = 0;

                    let currentX = 0;
                    let currentY = 0;

                    let raf = null;


                    const renderTilt = () => {
                        currentX +=
                            (
                                targetX -
                                currentX
                            ) * 0.08;


                        currentY +=
                            (
                                targetY -
                                currentY
                            ) * 0.08;


                        card.style.setProperty(
                            "--experience-rx",
                            `${currentY * -0.55}deg`
                        );


                        card.style.setProperty(
                            "--experience-ry",
                            `${currentX * 0.7}deg`
                        );


                        if (
                            Math.abs(
                                targetX -
                                currentX
                            ) < 0.01 &&
                            Math.abs(
                                targetY -
                                currentY
                            ) < 0.01
                        ) {
                            raf = null;
                            return;
                        }


                        raf =
                            window.requestAnimationFrame(
                                renderTilt
                            );
                    };


                    card.addEventListener(
                        "pointermove",
                        (event) => {
                            const rect =
                                card.getBoundingClientRect();


                            targetX =
                                (
                                    (
                                        event.clientX -
                                        rect.left
                                    ) /
                                        rect.width -
                                    0.5
                                ) * 4;


                            targetY =
                                (
                                    (
                                        event.clientY -
                                        rect.top
                                    ) /
                                        rect.height -
                                    0.5
                                ) * 4;


                            if (!raf) {
                                raf =
                                    window.requestAnimationFrame(
                                        renderTilt
                                    );
                            }
                        }
                    );


                    card.addEventListener(
                        "pointerleave",
                        () => {
                            targetX = 0;
                            targetY = 0;


                            if (!raf) {
                                raf =
                                    window.requestAnimationFrame(
                                        renderTilt
                                    );
                            }
                        }
                    );
                }
            );
        }


        /* ---------------------------------------------
           SKILL TAG INTERACTION
           --------------------------------------------- */

        const skillTags =
            qsa(
                ".experience-path-story-skills span",
                section
            );


        skillTags.forEach(
            (tag) => {
                tag.addEventListener(
                    "mouseenter",
                    () => {
                        tag.classList.add(
                            "is-hovered"
                        );
                    }
                );


                tag.addEventListener(
                    "mouseleave",
                    () => {
                        tag.classList.remove(
                            "is-hovered"
                        );
                    }
                );
            }
        );


        /* ---------------------------------------------
           KEYBOARD / ACCESSIBILITY
           --------------------------------------------- */

        stations.forEach(
            (station) => {
                const card =
                    qs(
                        ".experience-path-story",
                        station
                    );


                if (!card) {
                    return;
                }


                card.setAttribute(
                    "tabindex",
                    "0"
                );


                card.addEventListener(
                    "focus",
                    () => {
                        card.classList.add(
                            "is-focused"
                        );
                    }
                );


                card.addEventListener(
                    "blur",
                    () => {
                        card.classList.remove(
                            "is-focused"
                        );
                    }
                );


                card.addEventListener(
                    "keydown",
                    (event) => {
                        if (
                            event.key ===
                                "Enter" ||
                            event.key ===
                                " "
                        ) {
                            event.preventDefault();

                            card.classList.toggle(
                                "is-focused"
                            );
                        }
                    }
                );
            }
        );


        /* ---------------------------------------------
           BACKGROUND PARALLAX
           --------------------------------------------- */

        if (!reduceMotion) {
            let ticking = false;


            const updateBackground =
                () => {
                    const rect =
                        section.getBoundingClientRect();

                    const viewport =
                        window.innerHeight;


                    if (
                        rect.bottom < 0 ||
                        rect.top > viewport
                    ) {
                        ticking = false;
                        return;
                    }


                    const progress =
                        Math.max(
                            0,
                            Math.min(
                                1,
                                (
                                    viewport -
                                    rect.top
                                ) /
                                (
                                    viewport +
                                    rect.height
                                )
                            )
                        );


                    if (backgroundWord) {
                        backgroundWord.style.transform =
                            `rotate(90deg)
                             translate3d(
                                ${progress * -28}px,
                                ${progress * 38}px,
                                0
                             )`;
                    }


                    if (backgroundOrb) {
                        backgroundOrb.style.transform =
                            `translate3d(
                                ${progress * 30}px,
                                ${progress * -22}px,
                                0
                             )`;
                    }


                    if (backgroundLine) {
                        backgroundLine.style.transform =
                            `rotate(
                                ${8 + progress * 3}deg
                             )
                             translate3d(
                                0,
                                ${progress * 24}px,
                                0
                             )`;
                    }


                    ticking = false;
                };


            window.addEventListener(
                "scroll",
                () => {
                    if (ticking) {
                        return;
                    }


                    ticking = true;


                    window.requestAnimationFrame(
                        updateBackground
                    );
                },
                {
                    passive: true
                }
            );


            updateBackground();
        }


        /* ---------------------------------------------
           LIVE STATUS MICRO INTERACTION
           --------------------------------------------- */

        const liveDot =
            qs(
                ".experience-live-dot",
                section
            );


        if (
            liveDot &&
            !reduceMotion
        ) {
            liveDot.addEventListener(
                "mouseenter",
                () => {
                    liveDot.classList.add(
                        "is-active"
                    );
                }
            );


            liveDot.addEventListener(
                "mouseleave",
                () => {
                    liveDot.classList.remove(
                        "is-active"
                    );
                }
            );
        }
    }


    /* =====================================================
       FUTURE SECTION SPACE
       -----------------------------------------------------
       Keep adding future section initializers BELOW
       this line.

       Example:

       function initCertificates() {
           const section =
               qs("#certificates");

           if (!section) {
               return;
           }

           // Your animation...
       }

       registerSection(
           "certificates",
           initCertificates
       );

       This keeps main.js extendable without repeatedly
       editing the central DOMContentLoaded / boot logic.
       ===================================================== */

})();

// =========================================================
// CERTIFICATES / CREDENTIALS
// Handles:
// - Section reveal
// - Certificate document tilt
// - Zetheta card tilt
// - Background parallax
// - Learning ticker pause
// - Reduced-motion support
// =========================================================

function initCertificates() {
    const section = document.querySelector(
        "#certificates.certificates-section"
    );

    // Stop safely when the section does not exist.
    if (!section) return;

    // -------------------------------------------------------
    // Main elements
    // -------------------------------------------------------

    const documentWrap = section.querySelector(
        ".certificate-document-wrap"
    );

    const documentCard = section.querySelector(
        ".certificate-document"
    );

    const credentialCards = section.querySelectorAll(
        "[data-certificate-card]"
    );

    const ticker = section.querySelector(
        ".certificates-learning-track"
    );

    // -------------------------------------------------------
    // Background elements
    // -------------------------------------------------------

    const backgroundWord = section.querySelector(
        ".certificates-bg-word"
    );

    const backgroundCircleOne = section.querySelector(
        ".certificates-bg-circle.circle-one"
    );

    const backgroundCircleTwo = section.querySelector(
        ".certificates-bg-circle.circle-two"
    );

    const backgroundLineOne = section.querySelector(
        ".certificates-bg-line.line-one"
    );

    const backgroundLineTwo = section.querySelector(
        ".certificates-bg-line.line-two"
    );

    // -------------------------------------------------------
    // Motion settings
    // -------------------------------------------------------

    const reduceMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const finePointer =
        window.matchMedia &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches;

    let sectionVisible = false;

    // -------------------------------------------------------
    // Mark section as JS-ready
    // -------------------------------------------------------

    section.classList.add("certificates-js-ready");

    // -------------------------------------------------------
    // Intersection Observer
    // Starts section animation when visible.
    // -------------------------------------------------------

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                sectionVisible = true;

                section.classList.add("is-visible");

                // Add a clean stagger to certificate cards.
                credentialCards.forEach((card, index) => {
                    card.style.setProperty(
                        "--certificate-delay",
                        `${index * 120}ms`
                    );
                });

                sectionObserver.unobserve(section);
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -8% 0px",
        }
    );

    sectionObserver.observe(section);

    // -------------------------------------------------------
    // Initial visibility fallback
    // Useful when browser restores previous scroll position.
    // -------------------------------------------------------

    const checkInitialVisibility = () => {
        const rect = section.getBoundingClientRect();

        const viewportHeight =
            window.innerHeight ||
            document.documentElement.clientHeight;

        const isVisible =
            rect.top < viewportHeight * 0.9 &&
            rect.bottom > viewportHeight * 0.08;

        if (isVisible) {
            sectionVisible = true;
            section.classList.add("is-visible");
        }
    };

    window.requestAnimationFrame(
        checkInitialVisibility
    );

    // -------------------------------------------------------
    // Reduced motion
    // -------------------------------------------------------

    if (reduceMotion) {
        section.classList.add(
            "certificates-reduced-motion"
        );

        if (ticker) {
            ticker.style.animationPlayState = "paused";
        }

        return;
    }

    // -------------------------------------------------------
    // Featured TCS certificate tilt
    // -------------------------------------------------------

    if (
        documentWrap &&
        documentCard &&
        finePointer
    ) {
        const updateDocumentTilt = (event) => {
            if (!sectionVisible) return;

            const rect =
                documentWrap.getBoundingClientRect();

            if (!rect.width || !rect.height) return;

            const x =
                (event.clientX - rect.left) /
                    rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                    rect.height -
                0.5;

            const rotateX = y * -5;
            const rotateY = x * 6;

            documentCard.style.setProperty(
                "--certificate-rotate-x",
                `${rotateX}deg`
            );

            documentCard.style.setProperty(
                "--certificate-rotate-y",
                `${rotateY}deg`
            );
        };

        const resetDocumentTilt = () => {
            documentCard.style.setProperty(
                "--certificate-rotate-x",
                "0deg"
            );

            documentCard.style.setProperty(
                "--certificate-rotate-y",
                "0deg"
            );
        };

        documentWrap.addEventListener(
            "pointermove",
            updateDocumentTilt,
            { passive: true }
        );

        documentWrap.addEventListener(
            "pointerleave",
            resetDocumentTilt
        );
    }

    // -------------------------------------------------------
    // Secondary certificate card tilt
    // Works for Zetheta and future certificate cards.
    // -------------------------------------------------------

    credentialCards.forEach((card) => {
        if (finePointer) {
            const updateCardTilt = (event) => {
                const rect =
                    card.getBoundingClientRect();

                if (!rect.width || !rect.height) {
                    return;
                }

                const x =
                    (event.clientX - rect.left) /
                        rect.width -
                    0.5;

                const y =
                    (event.clientY - rect.top) /
                        rect.height -
                    0.5;

                card.style.setProperty(
                    "--credential-rx",
                    `${y * -2}deg`
                );

                card.style.setProperty(
                    "--credential-ry",
                    `${x * 2}deg`
                );
            };

            const resetCardTilt = () => {
                card.style.setProperty(
                    "--credential-rx",
                    "0deg"
                );

                card.style.setProperty(
                    "--credential-ry",
                    "0deg"
                );
            };

            card.addEventListener(
                "pointermove",
                updateCardTilt,
                { passive: true }
            );

            card.addEventListener(
                "pointerleave",
                resetCardTilt
            );
        }

        // Keyboard focus state.
        card.addEventListener(
            "focusin",
            () => {
                card.classList.add("is-focused");
            }
        );

        card.addEventListener(
            "focusout",
            () => {
                card.classList.remove("is-focused");
            }
        );
    });

    // -------------------------------------------------------
    // Learning ticker
    // Pause when user hovers or focuses it.
    // -------------------------------------------------------

    if (ticker) {
        ticker.addEventListener(
            "mouseenter",
            () => {
                ticker.style.animationPlayState =
                    "paused";
            }
        );

        ticker.addEventListener(
            "mouseleave",
            () => {
                ticker.style.animationPlayState =
                    "running";
            }
        );

        ticker.addEventListener(
            "focusin",
            () => {
                ticker.style.animationPlayState =
                    "paused";
            }
        );

        ticker.addEventListener(
            "focusout",
            () => {
                ticker.style.animationPlayState =
                    "running";
            }
        );
    }

    // -------------------------------------------------------
    // Background mouse parallax
    // -------------------------------------------------------

    let pointerX = 0;
    let pointerY = 0;

    let currentX = 0;
    let currentY = 0;

    if (finePointer) {
        window.addEventListener(
            "pointermove",
            (event) => {
                pointerX =
                    event.clientX /
                        window.innerWidth -
                    0.5;

                pointerY =
                    event.clientY /
                        window.innerHeight -
                    0.5;
            },
            { passive: true }
        );

        const animateBackground = () => {
            currentX +=
                (pointerX - currentX) * 0.035;

            currentY +=
                (pointerY - currentY) * 0.035;

            if (sectionVisible) {
                if (backgroundWord) {
                    backgroundWord.style.transform =
                        `translate3d(
                            ${currentX * -16}px,
                            ${currentY * -9}px,
                            0
                        )`;
                }

                if (backgroundCircleOne) {
                    backgroundCircleOne.style.transform =
                        `translate3d(
                            ${currentX * 20}px,
                            ${currentY * 14}px,
                            0
                        )`;
                }

                if (backgroundCircleTwo) {
                    backgroundCircleTwo.style.transform =
                        `translate3d(
                            ${currentX * -14}px,
                            ${currentY * -11}px,
                            0
                        )`;
                }

                if (backgroundLineOne) {
                    backgroundLineOne.style.transform =
                        `translate3d(
                            ${currentX * -8}px,
                            ${currentY * 6}px,
                            0
                        ) rotate(-8deg)`;
                }

                if (backgroundLineTwo) {
                    backgroundLineTwo.style.transform =
                        `translate3d(
                            ${currentX * 8}px,
                            ${currentY * -6}px,
                            0
                        ) rotate(10deg)`;
                }
            }

            window.requestAnimationFrame(
                animateBackground
            );
        };

        window.requestAnimationFrame(
            animateBackground
        );
    }

    // -------------------------------------------------------
    // Scroll-based subtle movement
    // -------------------------------------------------------

    let scrollTicking = false;

    const updateScrollMotion = () => {
        scrollTicking = false;

        if (!sectionVisible) return;

        const rect =
            section.getBoundingClientRect();

        const viewportHeight =
            window.innerHeight ||
            document.documentElement.clientHeight;

        const progress =
            (viewportHeight - rect.top) /
            (viewportHeight + rect.height);

        const amount = Math.max(
            0,
            Math.min(1, progress)
        );

        if (backgroundWord) {
            backgroundWord.style.marginTop =
                `${amount * -20}px`;
        }

        if (backgroundCircleOne) {
            backgroundCircleOne.style.marginTop =
                `${amount * 15}px`;
        }

        if (backgroundCircleTwo) {
            backgroundCircleTwo.style.marginTop =
                `${amount * -12}px`;
        }
    };

    const handleScroll = () => {
        if (scrollTicking) return;

        scrollTicking = true;

        window.requestAnimationFrame(
            updateScrollMotion
        );
    };

    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    // -------------------------------------------------------
    // Refresh helper
    // Can be used later if content is dynamically replaced.
    // -------------------------------------------------------

    window.VikasPortfolio =
        window.VikasPortfolio || {};

    window.VikasPortfolio.refreshCertificates =
        () => {
            section.classList.remove(
                "is-visible"
            );

            sectionVisible = false;

            window.requestAnimationFrame(() => {
                checkInitialVisibility();
            });
        };
}


// =========================================================
// REGISTER CERTIFICATES
// Uses the central portfolio section system.
// =========================================================

if (
    window.VikasPortfolio &&
    typeof window.VikasPortfolio.registerSection ===
        "function"
) {
    window.VikasPortfolio.registerSection(
        "certificates",
        initCertificates
    );
} else {
    // Development fallback if main.js boot system
    // has not been loaded yet.
    document.addEventListener(
        "DOMContentLoaded",
        initCertificates
    );
}

// =========================================================
// SKILLS / DEVELOPER ARSENAL
// Premium Light Brand System
//
// Handles:
// - Section reveal
// - Skill category switching
// - Keyboard navigation
// - Active skill panel animation
// - VK logo / core interaction
// - Background parallax
// - Scroll-based ambient motion
// - Technology strip interactions
// - Reduced-motion support
// =========================================================

function initSkills() {
    const section = document.querySelector(
        "#skills.skills-section"
    );

    // -------------------------------------------------------
    // Safety check
    // -------------------------------------------------------

    if (!section) return;

    // -------------------------------------------------------
    // Main elements
    // -------------------------------------------------------

    const categories = section.querySelectorAll(
        "[data-skill-category]"
    );

    const panels = section.querySelectorAll(
        "[data-skill-panel]"
    );

    const core = section.querySelector(
        ".skills-brand-core"
    );

    const coreLogo = section.querySelector(
        ".skills-logo-box"
    );

    const coreRings = section.querySelectorAll(
        ".skills-core-ring"
    );

    const floatingTags = section.querySelectorAll(
        ".skills-floating-tag"
    );

    // -------------------------------------------------------
    // Background elements
    // -------------------------------------------------------

    const backgroundWord = section.querySelector(
        ".skills-bg-word"
    );

    const backgroundGlow = section.querySelector(
        ".skills-bg-glow"
    );

    const backgroundCircleOne = section.querySelector(
        ".skills-bg-circle.circle-one"
    );

    const backgroundCircleTwo = section.querySelector(
        ".skills-bg-circle.circle-two"
    );

    const backgroundLineOne = section.querySelector(
        ".skills-bg-line.line-one"
    );

    const backgroundLineTwo = section.querySelector(
        ".skills-bg-line.line-two"
    );

    // -------------------------------------------------------
    // Other elements
    // -------------------------------------------------------

    const techItems = section.querySelectorAll(
        ".skills-tech-list span"
    );

    const techStrip = section.querySelector(
        ".skills-tech-list"
    );

    // -------------------------------------------------------
    // Motion preferences
    // -------------------------------------------------------

    const reduceMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const finePointer =
        window.matchMedia &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches;

    let sectionVisible = false;
    let activeCategory = "backend";

    // -------------------------------------------------------
    // Mark section as initialized
    // -------------------------------------------------------

    section.classList.add(
        "skills-js-ready"
    );

    // -------------------------------------------------------
    // Helper: activate skill category
    // -------------------------------------------------------

    const activateCategory = (
        category,
        restartAnimation = true
    ) => {
        if (!category) return;

        const targetButton =
            Array.from(categories).find(
                (button) =>
                    button.dataset.skillCategory ===
                    category
            );

        const targetPanel =
            Array.from(panels).find(
                (panel) =>
                    panel.dataset.skillPanel ===
                    category
            );

        if (!targetButton || !targetPanel) {
            return;
        }

        activeCategory = category;

        // ---------------------------------------------------
        // Update navigation buttons
        // ---------------------------------------------------

        categories.forEach((button) => {
            const isActive =
                button.dataset.skillCategory ===
                category;

            button.classList.toggle(
                "is-active",
                isActive
            );

            button.setAttribute(
                "aria-selected",
                isActive
                    ? "true"
                    : "false"
            );
        });

        // ---------------------------------------------------
        // Update information panels
        // ---------------------------------------------------

        panels.forEach((panel) => {
            const isActive =
                panel.dataset.skillPanel ===
                category;

            panel.classList.toggle(
                "is-active",
                isActive
            );

            panel.setAttribute(
                "aria-hidden",
                isActive
                    ? "false"
                    : "true"
            );
        });

        // ---------------------------------------------------
        // Tell the core which system is active
        // ---------------------------------------------------

        if (core) {
            core.dataset.activeSkill =
                category;
        }

        // ---------------------------------------------------
        // Give floating system markers a small response
        // ---------------------------------------------------

        floatingTags.forEach(
            (tag, index) => {
                tag.style.setProperty(
                    "--skill-tag-delay",
                    `${index * 40}ms`
                );
            }
        );

        // ---------------------------------------------------
        // Restart panel entrance animation
        // ---------------------------------------------------

        if (
            restartAnimation &&
            targetPanel &&
            !reduceMotion
        ) {
            targetPanel.style.animation =
                "none";

            // Force reflow.
            void targetPanel.offsetWidth;

            targetPanel.style.animation = "";
        }
    };

    // -------------------------------------------------------
    // Initial state
    // -------------------------------------------------------

    activateCategory(
        activeCategory,
        false
    );

    // -------------------------------------------------------
    // Section reveal observer
    // -------------------------------------------------------

    const sectionObserver =
        new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    sectionVisible = true;

                    section.classList.add(
                        "is-visible"
                    );

                    sectionObserver.unobserve(
                        section
                    );
                });
            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -8% 0px",
            }
        );

    sectionObserver.observe(section);

    // -------------------------------------------------------
    // Initial visibility fallback
    // -------------------------------------------------------

    const checkInitialVisibility = () => {
        const rect =
            section.getBoundingClientRect();

        const viewportHeight =
            window.innerHeight ||
            document.documentElement.clientHeight;

        const visible =
            rect.top <
                viewportHeight * 0.9 &&
            rect.bottom >
                viewportHeight * 0.08;

        if (visible) {
            sectionVisible = true;

            section.classList.add(
                "is-visible"
            );
        }
    };

    window.requestAnimationFrame(
        checkInitialVisibility
    );

    // -------------------------------------------------------
    // Category interaction
    // -------------------------------------------------------

    categories.forEach(
        (button, index) => {
            const category =
                button.dataset.skillCategory;

            if (!category) return;

            // Click.
            button.addEventListener(
                "click",
                () => {
                    activateCategory(
                        category,
                        true
                    );
                }
            );

            // ------------------------------------------------
            // Desktop hover
            // ------------------------------------------------

            if (finePointer) {
                button.addEventListener(
                    "mouseenter",
                    () => {
                        activateCategory(
                            category,
                            true
                        );
                    }
                );
            }

            // ------------------------------------------------
            // Keyboard navigation
            // ------------------------------------------------

            button.addEventListener(
                "keydown",
                (event) => {
                    const allowedKeys = [
                        "ArrowDown",
                        "ArrowUp",
                        "ArrowRight",
                        "ArrowLeft",
                    ];

                    if (
                        !allowedKeys.includes(
                            event.key
                        )
                    ) {
                        return;
                    }

                    event.preventDefault();

                    let nextIndex =
                        index;

                    if (
                        event.key ===
                            "ArrowDown" ||
                        event.key ===
                            "ArrowRight"
                    ) {
                        nextIndex =
                            (index + 1) %
                            categories.length;
                    } else {
                        nextIndex =
                            (index -
                                1 +
                                categories.length) %
                            categories.length;
                    }

                    const nextButton =
                        categories[nextIndex];

                    if (!nextButton) {
                        return;
                    }

                    nextButton.focus();

                    activateCategory(
                        nextButton.dataset
                            .skillCategory,
                        true
                    );
                }
            );
        }
    );

    // -------------------------------------------------------
    // Core logo interaction
    // -------------------------------------------------------

    if (
        core &&
        coreLogo &&
        finePointer &&
        !reduceMotion
    ) {
        const moveCore = (event) => {
            const rect =
                core.getBoundingClientRect();

            if (
                !rect.width ||
                !rect.height
            ) {
                return;
            }

            const x =
                (event.clientX -
                    rect.left) /
                    rect.width -
                0.5;

            const y =
                (event.clientY -
                    rect.top) /
                    rect.height -
                0.5;

            core.style.setProperty(
                "--core-rx",
                `${y * -2.5}deg`
            );

            core.style.setProperty(
                "--core-ry",
                `${x * 3.5}deg`
            );

            coreLogo.style.transform =
                `translate(
                    ${x * 4}px,
                    ${y * 4}px
                ) scale(1.035)`;
        };

        const resetCore = () => {
            core.style.setProperty(
                "--core-rx",
                "0deg"
            );

            core.style.setProperty(
                "--core-ry",
                "0deg"
            );

            coreLogo.style.transform =
                "";
        };

        core.addEventListener(
            "pointermove",
            moveCore,
            { passive: true }
        );

        core.addEventListener(
            "pointerleave",
            resetCore
        );
    }

    // -------------------------------------------------------
    // Ring response
    // Gives the core slightly different movement
    // depending on the active category.
    // -------------------------------------------------------

    const categoryAngles = {
        backend: 0,
        frontend: 45,
        database: 90,
        tools: 135,
        ai: 180,
    };

    const updateRingState = (category) => {
        const angle =
            categoryAngles[category] ?? 0;

        coreRings.forEach(
            (ring, index) => {
                ring.style.setProperty(
                    "--skill-category-angle",
                    `${angle +
                        index * 18}deg`
                );
            }
        );
    };

    const originalActivateCategory =
        activateCategory;

    // Keep ring state synced with the active panel.
    const setCategoryWithRings = (
        category,
        restartAnimation = true
    ) => {
        originalActivateCategory(
            category,
            restartAnimation
        );

        updateRingState(category);
    };

    setCategoryWithRings(
        activeCategory,
        false
    );

    // -------------------------------------------------------
    // Replace category handlers with ring-aware version
    // -------------------------------------------------------

    categories.forEach(
        (button, index) => {
            const category =
                button.dataset.skillCategory;

            if (!category) return;

            button.onclick = () => {
                setCategoryWithRings(
                    category,
                    true
                );
            };

            if (finePointer) {
                button.onmouseenter = () => {
                    setCategoryWithRings(
                        category,
                        true
                    );
                };
            }

            button.onkeydown = (event) => {
                const allowedKeys = [
                    "ArrowDown",
                    "ArrowUp",
                    "ArrowRight",
                    "ArrowLeft",
                ];

                if (
                    !allowedKeys.includes(
                        event.key
                    )
                ) {
                    return;
                }

                event.preventDefault();

                let nextIndex =
                    index;

                if (
                    event.key ===
                        "ArrowDown" ||
                    event.key ===
                        "ArrowRight"
                ) {
                    nextIndex =
                        (index + 1) %
                        categories.length;
                } else {
                    nextIndex =
                        (index -
                            1 +
                            categories.length) %
                        categories.length;
                }

                const nextButton =
                    categories[nextIndex];

                if (!nextButton) {
                    return;
                }

                nextButton.focus();

                setCategoryWithRings(
                    nextButton.dataset
                        .skillCategory,
                    true
                );
            };
        }
    );

    // -------------------------------------------------------
    // Technology strip interaction
    // -------------------------------------------------------

    techItems.forEach((item) => {
        item.addEventListener(
            "mouseenter",
            () => {
                techItems.forEach(
                    (other) => {
                        if (
                            other !== item
                        ) {
                            other.classList.remove(
                                "is-highlighted"
                            );
                        }
                    }
                );

                item.classList.add(
                    "is-highlighted"
                );
            }
        );

        item.addEventListener(
            "mouseleave",
            () => {
                item.classList.remove(
                    "is-highlighted"
                );
            }
        );

        item.addEventListener(
            "focusin",
            () => {
                item.classList.add(
                    "is-highlighted"
                );
            }
        );

        item.addEventListener(
            "focusout",
            () => {
                item.classList.remove(
                    "is-highlighted"
                );
            }
        );
    });

    // -------------------------------------------------------
    // Pause decorative animation while technology
    // strip is being interacted with.
    // -------------------------------------------------------

    if (techStrip && !reduceMotion) {
        techStrip.addEventListener(
            "mouseenter",
            () => {
                section.classList.add(
                    "skills-tech-hover"
                );
            }
        );

        techStrip.addEventListener(
            "mouseleave",
            () => {
                section.classList.remove(
                    "skills-tech-hover"
                );
            }
        );
    }

    // -------------------------------------------------------
    // Reduced motion
    // -------------------------------------------------------

    if (reduceMotion) {
        section.classList.add(
            "skills-reduced-motion"
        );

        return;
    }

    // -------------------------------------------------------
    // Background mouse parallax
    // -------------------------------------------------------

    let pointerX = 0;
    let pointerY = 0;

    let currentX = 0;
    let currentY = 0;

    if (finePointer) {
        window.addEventListener(
            "pointermove",
            (event) => {
                pointerX =
                    event.clientX /
                        window.innerWidth -
                    0.5;

                pointerY =
                    event.clientY /
                        window.innerHeight -
                    0.5;
            },
            { passive: true }
        );

        const animateBackground =
            () => {
                currentX +=
                    (pointerX -
                        currentX) *
                    0.035;

                currentY +=
                    (pointerY -
                        currentY) *
                    0.035;

                if (sectionVisible) {
                    if (
                        backgroundWord
                    ) {
                        backgroundWord.style.transform =
                            `translate3d(
                                ${currentX * -18}px,
                                ${currentY * -10}px,
                                0
                            )`;
                    }

                    if (
                        backgroundCircleOne
                    ) {
                        backgroundCircleOne.style.marginTop =
                            `${currentY * 18}px`;

                        backgroundCircleOne.style.marginLeft =
                            `${currentX * 20}px`;
                    }

                    if (
                        backgroundCircleTwo
                    ) {
                        backgroundCircleTwo.style.marginTop =
                            `${currentY * -12}px`;

                        backgroundCircleTwo.style.marginLeft =
                            `${currentX * -14}px`;
                    }

                    if (
                        backgroundLineOne
                    ) {
                        backgroundLineOne.style.translate =
                            `${currentX * -7}px ${currentY * 5}px`;
                    }

                    if (
                        backgroundLineTwo
                    ) {
                        backgroundLineTwo.style.translate =
                            `${currentX * 7}px ${currentY * -5}px`;
                    }

                    if (
                        backgroundGlow
                    ) {
                        backgroundGlow.style.transform =
                            `translate(
                                calc(-50% + ${currentX * 24}px),
                                calc(-50% + ${currentY * 18}px)
                            )`;
                    }
                }

                window.requestAnimationFrame(
                    animateBackground
                );
            };

        window.requestAnimationFrame(
            animateBackground
        );
    }

    // -------------------------------------------------------
    // Scroll ambient movement
    // -------------------------------------------------------

    let scrollTicking = false;

    const updateScrollMotion = () => {
        scrollTicking = false;

        if (!sectionVisible) return;

        const rect =
            section.getBoundingClientRect();

        const viewportHeight =
            window.innerHeight ||
            document.documentElement.clientHeight;

        const progress =
            (viewportHeight - rect.top) /
            (viewportHeight +
                rect.height);

        const amount = Math.max(
            0,
            Math.min(1, progress)
        );

        if (backgroundWord) {
            backgroundWord.style.marginTop =
                `${amount * -20}px`;
        }

        if (backgroundGlow) {
            backgroundGlow.style.marginTop =
                `${amount * 13}px`;
        }
    };

    const handleScroll = () => {
        if (scrollTicking) return;

        scrollTicking = true;

        window.requestAnimationFrame(
            updateScrollMotion
        );
    };

    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    // -------------------------------------------------------
    // Public API
    // -------------------------------------------------------

    window.VikasPortfolio =
        window.VikasPortfolio || {};

    window.VikasPortfolio.setSkillCategory =
        (category) => {
            setCategoryWithRings(
                category,
                true
            );
        };

    // -------------------------------------------------------
    // Refresh helper
    // -------------------------------------------------------

    window.VikasPortfolio.refreshSkills =
        () => {
            sectionVisible = false;

            section.classList.remove(
                "is-visible"
            );

            window.requestAnimationFrame(
                checkInitialVisibility
            );
        };
}


// =========================================================
// REGISTER SKILLS
// Uses the central portfolio boot system.
// =========================================================

if (
    window.VikasPortfolio &&
    typeof window.VikasPortfolio
        .registerSection ===
        "function"
) {
    window.VikasPortfolio.registerSection(
        "skills",
        initSkills
    );
} else {
    // Fallback for direct development/loading.
    document.addEventListener(
        "DOMContentLoaded",
        initSkills
    );
}

// =========================================================
// SECTION 08 — BLOG
// Premium Editorial Journal System
//
// Handles:
// - Section reveal
// - Featured article interaction
// - Blog card hover depth
// - Mouse parallax
// - Image movement
// - Background motion
// - Keyboard accessibility
// - Reduced-motion support
// =========================================================

function initBlog() {
    const section = document.querySelector(
        "#blog.blog-section"
    );

    // -------------------------------------------------------
    // Safety check
    // -------------------------------------------------------

    if (!section) return;

    // -------------------------------------------------------
    // Main elements
    // -------------------------------------------------------

    const featuredArticle = section.querySelector(
        ".blog-featured"
    );

    const featuredImage = section.querySelector(
        ".blog-featured-image"
    );

    const featuredImageInner = featuredImage
        ? featuredImage.querySelector("img")
        : null;

    const featuredScan = section.querySelector(
        ".featured-image-scan"
    );

    const cards = section.querySelectorAll(
        ".blog-card"
    );

    const cardImages = section.querySelectorAll(
        ".blog-card-image"
    );

    const readLinks = section.querySelectorAll(
        ".blog-read-link, .blog-small-arrow, .blog-view-all"
    );

    // -------------------------------------------------------
    // Background elements
    // -------------------------------------------------------

    const backgroundWord = section.querySelector(
        ".blog-bg-word"
    );

    const backgroundOrbOne = section.querySelector(
        ".blog-bg-orb-one"
    );

    const backgroundOrbTwo = section.querySelector(
        ".blog-bg-orb-two"
    );

    const backgroundLineOne = section.querySelector(
        ".blog-bg-line-one"
    );

    const backgroundLineTwo = section.querySelector(
        ".blog-bg-line-two"
    );

    // -------------------------------------------------------
    // Motion preferences
    // -------------------------------------------------------

    const reduceMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const finePointer =
        window.matchMedia &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches;

    let sectionVisible = false;

    // -------------------------------------------------------
    // JS ready state
    // -------------------------------------------------------

    section.classList.add(
        "blog-js-ready"
    );

    // -------------------------------------------------------
    // Section reveal observer
    // -------------------------------------------------------

    const sectionObserver =
        new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    sectionVisible = true;

                    section.classList.add(
                        "is-visible"
                    );

                    sectionObserver.unobserve(
                        section
                    );
                });
            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -7% 0px",
            }
        );

    sectionObserver.observe(section);

    // -------------------------------------------------------
    // Initial visibility fallback
    // -------------------------------------------------------

    const checkInitialVisibility = () => {
        const rect =
            section.getBoundingClientRect();

        const viewportHeight =
            window.innerHeight ||
            document.documentElement.clientHeight;

        if (
            rect.top <
                viewportHeight * 0.9 &&
            rect.bottom >
                viewportHeight * 0.08
        ) {
            sectionVisible = true;

            section.classList.add(
                "is-visible"
            );
        }
    };

    window.requestAnimationFrame(
        checkInitialVisibility
    );

    // -------------------------------------------------------
    // Featured article depth effect
    // -------------------------------------------------------

    if (
        featuredArticle &&
        finePointer &&
        !reduceMotion
    ) {
        const handleFeaturedMove = (event) => {
            if (!sectionVisible) return;

            const rect =
                featuredArticle.getBoundingClientRect();

            if (
                !rect.width ||
                !rect.height
            ) {
                return;
            }

            const x =
                (event.clientX - rect.left) /
                    rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                    rect.height -
                0.5;

            featuredArticle.style.setProperty(
                "--blog-feature-rx",
                `${y * -1.2}deg`
            );

            featuredArticle.style.setProperty(
                "--blog-feature-ry",
                `${x * 1.7}deg`
            );

            if (featuredImageInner) {
                featuredImageInner.style.transform =
                    `scale(1.045)
                     translate(
                        ${x * -4}px,
                        ${y * -4}px
                     )`;
            }

            if (featuredScan) {
                featuredScan.style.transform =
                    `translateY(
                        ${y * 12}px
                    ) skewX(-14deg)`;
            }
        };

        const resetFeatured = () => {
            featuredArticle.style.setProperty(
                "--blog-feature-rx",
                "0deg"
            );

            featuredArticle.style.setProperty(
                "--blog-feature-ry",
                "0deg"
            );

            if (featuredImageInner) {
                featuredImageInner.style.transform =
                    "";
            }

            if (featuredScan) {
                featuredScan.style.transform =
                    "skewX(-14deg)";
            }
        };

        featuredArticle.addEventListener(
            "pointermove",
            handleFeaturedMove,
            { passive: true }
        );

        featuredArticle.addEventListener(
            "pointerleave",
            resetFeatured
        );
    }

    // -------------------------------------------------------
    // Secondary card depth interaction
    // -------------------------------------------------------

    cards.forEach((card) => {
        if (finePointer && !reduceMotion) {
            const handleCardMove = (
                event
            ) => {
                const rect =
                    card.getBoundingClientRect();

                if (
                    !rect.width ||
                    !rect.height
                ) {
                    return;
                }

                const x =
                    (event.clientX -
                        rect.left) /
                        rect.width -
                    0.5;

                const y =
                    (event.clientY -
                        rect.top) /
                        rect.height -
                    0.5;

                card.style.setProperty(
                    "--blog-card-rx",
                    `${y * -1.5}deg`
                );

                card.style.setProperty(
                    "--blog-card-ry",
                    `${x * 2}deg`
                );

                const image =
                    card.querySelector(
                        ".blog-card-image img"
                    );

                if (image) {
                    image.style.transform =
                        `scale(1.055)
                         translate(
                            ${x * -3}px,
                            ${y * -3}px
                         )`;
                }
            };

            const resetCard = () => {
                card.style.setProperty(
                    "--blog-card-rx",
                    "0deg"
                );

                card.style.setProperty(
                    "--blog-card-ry",
                    "0deg"
                );

                const image =
                    card.querySelector(
                        ".blog-card-image img"
                    );

                if (image) {
                    image.style.transform =
                        "";
                }
            };

            card.addEventListener(
                "pointermove",
                handleCardMove,
                { passive: true }
            );

            card.addEventListener(
                "pointerleave",
                resetCard
            );
        }

        // ---------------------------------------------------
        // Keyboard accessibility
        // ---------------------------------------------------

        card.addEventListener(
            "focusin",
            () => {
                card.classList.add(
                    "is-focused"
                );
            }
        );

        card.addEventListener(
            "focusout",
            () => {
                card.classList.remove(
                    "is-focused"
                );
            }
        );
    });

    // -------------------------------------------------------
    // Image hover preparation
    // -------------------------------------------------------

    cardImages.forEach((imageLink) => {
        imageLink.addEventListener(
            "mouseenter",
            () => {
                imageLink.classList.add(
                    "is-hovered"
                );
            }
        );

        imageLink.addEventListener(
            "mouseleave",
            () => {
                imageLink.classList.remove(
                    "is-hovered"
                );
            }
        );
    });

    // -------------------------------------------------------
    // Read-link interaction
    // -------------------------------------------------------

    readLinks.forEach((link) => {
        link.addEventListener(
            "focusin",
            () => {
                link.classList.add(
                    "is-focused"
                );
            }
        );

        link.addEventListener(
            "focusout",
            () => {
                link.classList.remove(
                    "is-focused"
                );
            }
        );
    });

    // -------------------------------------------------------
    // Mouse position for background parallax
    // -------------------------------------------------------

    let pointerX = 0;
    let pointerY = 0;

    let currentX = 0;
    let currentY = 0;

    if (
        finePointer &&
        !reduceMotion
    ) {
        window.addEventListener(
            "pointermove",
            (event) => {
                pointerX =
                    event.clientX /
                        window.innerWidth -
                    0.5;

                pointerY =
                    event.clientY /
                        window.innerHeight -
                    0.5;
            },
            { passive: true }
        );

        const animateBackground =
            () => {
                currentX +=
                    (pointerX -
                        currentX) *
                    0.035;

                currentY +=
                    (pointerY -
                        currentY) *
                    0.035;

                if (sectionVisible) {
                    // Large JOURNAL word.
                    if (backgroundWord) {
                        backgroundWord.style.transform =
                            `translate3d(
                                ${currentX * -24}px,
                                ${currentY * -12}px,
                                0
                            )`;
                    }

                    // Background circles.
                    if (
                        backgroundOrbOne
                    ) {
                        backgroundOrbOne.style.marginLeft =
                            `${currentX * 18}px`;

                        backgroundOrbOne.style.marginTop =
                            `${currentY * 16}px`;
                    }

                    if (
                        backgroundOrbTwo
                    ) {
                        backgroundOrbTwo.style.marginLeft =
                            `${currentX * -13}px`;

                        backgroundOrbTwo.style.marginTop =
                            `${currentY * -10}px`;
                    }

                    // Editorial lines.
                    if (
                        backgroundLineOne
                    ) {
                        backgroundLineOne.style.translate =
                            `${currentX * -10}px ${currentY * 5}px`;
                    }

                    if (
                        backgroundLineTwo
                    ) {
                        backgroundLineTwo.style.translate =
                            `${currentX * 8}px ${currentY * -5}px`;
                    }
                }

                window.requestAnimationFrame(
                    animateBackground
                );
            };

        window.requestAnimationFrame(
            animateBackground
        );
    }

    // -------------------------------------------------------
    // Scroll-based ambient movement
    // -------------------------------------------------------

    let scrollTicking = false;

    const updateScrollMotion = () => {
        scrollTicking = false;

        if (!sectionVisible) return;

        const rect =
            section.getBoundingClientRect();

        const viewportHeight =
            window.innerHeight ||
            document.documentElement.clientHeight;

        const progress =
            (viewportHeight - rect.top) /
            (viewportHeight +
                rect.height);

        const amount = Math.max(
            0,
            Math.min(1, progress)
        );

        if (backgroundWord) {
            backgroundWord.style.marginTop =
                `${amount * -22}px`;
        }

        if (backgroundOrbOne) {
            backgroundOrbOne.style.marginTop =
                `${amount * 13}px`;
        }

        if (backgroundOrbTwo) {
            backgroundOrbTwo.style.marginTop =
                `${amount * -10}px`;
        }
    };

    const handleScroll = () => {
        if (scrollTicking) return;

        scrollTicking = true;

        window.requestAnimationFrame(
            updateScrollMotion
        );
    };

    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    // -------------------------------------------------------
    // Reduced motion
    // -------------------------------------------------------

    if (reduceMotion) {
        section.classList.add(
            "blog-reduced-motion"
        );

        return;
    }

    // -------------------------------------------------------
    // Public refresh helper
    // -------------------------------------------------------

    window.VikasPortfolio =
        window.VikasPortfolio || {};

    window.VikasPortfolio.refreshBlog =
        () => {
            sectionVisible = false;

            section.classList.remove(
                "is-visible"
            );

            window.requestAnimationFrame(
                checkInitialVisibility
            );
        };
}


// =========================================================
// REGISTER BLOG
// Uses the central portfolio section boot system.
// =========================================================

if (
    window.VikasPortfolio &&
    typeof window.VikasPortfolio
        .registerSection ===
        "function"
) {
    window.VikasPortfolio.registerSection(
        "blog",
        initBlog
    );
} else {
    // Fallback when the main boot system
    // is not loaded yet.
    document.addEventListener(
        "DOMContentLoaded",
        initBlog
    );
}