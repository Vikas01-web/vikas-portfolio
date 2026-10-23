/* =========================================================
   VIKAS KUMAR PORTFOLIO - MAIN.JS

   FILE MAP
   CORE   Boot, loader, navigation, scroll, hero, technology, about,
          projects, and experience
   CORE   Ends at the closing IIFE before the standalone sections
   AFTER  Certificates, skills, and blog (each has a local registration)

   Each standalone section below the core IIFE owns its initializer and
   its registerSection() call. Keep each registration inside that section.
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
            "about",
            () => {
                const initializeAbout =
                    window.VikasPortfolio?.initAbout;

                if (typeof initializeAbout === "function") {
                    initializeAbout();
                }
            }
        );

        // Projects and experience own independent initializers below.
        // Keeping them out of this registry avoids references to missing
        // core functions and lets queued section initializers run normally.
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
       01 â€” LOADER
       ===================================================== */

    function initLoader() {
        const loader =
            qs("#page-loader");

        const revealHero = () => {
            if (reduceMotion) {
                return;
            }

            const hero = qs("#home");
            if (!hero) {
                return;
            }

            // Let the loader finish fading before the hero entrance begins.
            window.setTimeout(() => {
                hero.classList.add("hero-animations-ready");
                startHeroRoleTyping(hero);
            }, 180);
        };

        const startHeroRoleTyping = (hero) => {
            const roleText = qs("#hero-role-text", hero);
            if (!roleText) return;

            const roles = [
                "Backend Developer",
                "Full Stack Web Developer",
                "Python Developer"
            ];
            let roleIndex = 0;
            let deleting = false;

            const typeNextCharacter = () => {
                const currentRole = roles[roleIndex];
                const visibleText = roleText.textContent || "";

                if (!deleting) {
                    roleText.textContent = currentRole.slice(0, visibleText.length + 1);
                    if (roleText.textContent === currentRole) {
                        deleting = true;
                        window.setTimeout(typeNextCharacter, 1350);
                        return;
                    }
                    window.setTimeout(typeNextCharacter, 72);
                    return;
                }

                roleText.textContent = visibleText.slice(0, -1);
                if (!roleText.textContent) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    window.setTimeout(typeNextCharacter, 260);
                    return;
                }
                window.setTimeout(typeNextCharacter, 34);
            };

            roleText.textContent = "";
            typeNextCharacter();
        };

        if (!loader) {
            document.body.classList.add(
                "page-loaded"
            );
            revealHero();
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
        let pointerFrame = 0;
        let finishScheduled = false;
        const loaderStartedAt = performance.now();

        const moveLoaderLight = (event) => {
            if (finished || pointerFrame) {
                return;
            }

            pointerFrame = window.requestAnimationFrame(() => {
                pointerFrame = 0;
                loader.style.setProperty(
                    "--loader-light-x",
                    `${event.clientX}px`
                );
                loader.style.setProperty(
                    "--loader-light-y",
                    `${event.clientY}px`
                );
            });
        };

        if (finePointer && !reduceMotion) {
            window.addEventListener(
                "pointermove",
                moveLoaderLight,
                { passive: true }
            );
        }


        const statuses = [
            "SETTING THE STAGE",
            "COMPOSING THE DETAILS",
            "BRINGING IT TO LIFE",
            "GETTING EVERYTHING READY",
            "READY TO EXPLORE"
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

            const progressTrack = qs(
                ".signature-loader-progress-track",
                loader
            );

            if (progressTrack) {
                progressTrack.setAttribute(
                    "aria-valuenow",
                    String(Math.round(progress))
                );
            }
        };


        const finishLoader = () => {
            if (finished) {
                return;
            }

            const minimumIntroTime = 1650;
            const timeRemaining =
                minimumIntroTime -
                (performance.now() - loaderStartedAt);

            if (!reduceMotion && timeRemaining > 0) {
                if (!finishScheduled) {
                    finishScheduled = true;
                    window.setTimeout(() => {
                        finishScheduled = false;
                        finishLoader();
                    }, timeRemaining);
                }
                return;
            }

            finished = true;

            window.removeEventListener(
                "pointermove",
                moveLoaderLight
            );

            if (pointerFrame) {
                window.cancelAnimationFrame(pointerFrame);
                pointerFrame = 0;
            }


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

                loader.setAttribute("aria-hidden", "true");

                document.body.classList.add(
                    "page-loaded"
                );
                revealHero();

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

                loader.setAttribute("aria-hidden", "true");

                document.body.classList.add(
                    "page-loaded"
                );
                revealHero();
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
       02 â€” NAVBAR
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
                ".navbar-menu-toggle",
                header
            );

        const mobileMenu =
            qs(
                "#navbar-mobile-menu",
                header
            );

        const navLinks =
            qsa(
                ".navbar-link",
                header
            );

        const mobileLinks =
            qsa(
                ".navbar-mobile-links a",
                header
            );


        const closeMenu = () => {
            header.classList.remove(
                "menu-open"
            );

            if (mobileMenu) {
                mobileMenu.classList.remove(
                    "is-open"
                );
                mobileMenu.setAttribute("aria-hidden", "true");
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
                "menu-open"
            );

            if (mobileMenu) {
                mobileMenu.classList.add(
                    "is-open"
                );
                mobileMenu.setAttribute("aria-hidden", "false");
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
                        "menu-open"
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


        const heroSection = qs("#home");
        let ticking = false;


        const updateHeader = () => {
            const currentY =
                window.scrollY;

            const hasLeftHero = heroSection
                ? heroSection.getBoundingClientRect().bottom <= 110
                : currentY > 24;

            header.classList.toggle(
                "is-scrolled",
                hasLeftHero
            );

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


        const allNavigationLinks = [
            ...navLinks,
            ...mobileLinks
        ];

        const getNavLink = (id) =>
            allNavigationLinks.find(
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

                            const activeLink =
                                getNavLink(entry.target.id);

                            // Keep the last main-section marker while scrolling through helper sections.
                            if (!activeLink) return;

                            navLinks.forEach(
                                (link) => {
                                    link.classList.remove(
                                        "is-active"
                                    );
                                }
                            );

                            mobileLinks.forEach((link) => {
                                link.classList.toggle(
                                    "is-active",
                                    link.getAttribute("href") === `#${entry.target.id}`
                                );
                            });
                            activeLink.classList.add("is-active");
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
       03 â€” GLOBAL SMOOTH SCROLL
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
   HERO INTERACTIONS
   1. Mouse parallax
   2. Scroll-based portrait shrink
   3. Background typography movement
===================================================== */

(() => {
    "use strict";

    function initHeroInteractions() {
        const panel = document.querySelector("#home .hero-panel");

        if (!panel) return;

        const visual = panel.querySelector("[data-hero-visual]");
        const portrait = panel.querySelector(".hero-portrait-wrap");
        const backdrop = panel.querySelector(".hero-backdrop-type");

        if (!visual || !portrait) return;

        // Avoid duplicate listeners if initialization runs again.
        if (panel.dataset.heroMotionInitialized === "true") return;
        panel.dataset.heroMotionInitialized = "true";

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        const finePointer = window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        );

        if (reducedMotion.matches) return;

        let pointerX = 0;
        let pointerY = 0;
        let rotateX = 0;
        let rotateY = 0;
        let scrollProgress = 0;
        let frameRequested = false;

        const clamp = (value, min, max) =>
            Math.min(max, Math.max(min, value));

        function calculateScrollProgress() {
            const rect = panel.getBoundingClientRect();

            // Begin the shrink effect as the hero scrolls upward.
            const distance = Math.max(rect.height * 0.72, 1);

            scrollProgress = clamp(
                -rect.top / distance,
                0,
                1
            );
        }

        function renderMotion() {
            frameRequested = false;

            const scale = 1 - scrollProgress * 0.18;
            const moveDown = scrollProgress * 70;
            const moveBackgroundUp = scrollProgress * -35;

            // Keep mouse movement subtle and professional.
            portrait.style.transform = `
                translate3d(
                    ${pointerX}px,
                    ${moveDown + pointerY}px,
                    20px
                )
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(${scale})
            `;

            // The giant background word shifts gently on scroll.
            if (backdrop) {
                backdrop.style.transform =
                    `translate3d(0, ${moveBackgroundUp}px, 0)`;
            }
        }

        function requestRender() {
            if (frameRequested) return;

            frameRequested = true;
            window.requestAnimationFrame(renderMotion);
        }

        // Scroll: shrink the portrait gradually and move it downward.
        function onScroll() {
            calculateScrollProgress();
            requestRender();
        }

        window.addEventListener("scroll", onScroll, {
            passive: true
        });

        window.addEventListener("resize", onScroll, {
            passive: true
        });

        // Mouse: add gentle 3D depth on desktop and laptops.
        if (finePointer.matches) {
            panel.addEventListener("pointermove", (event) => {
                const rect = panel.getBoundingClientRect();

                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;

                pointerX = (x - 0.5) * 12;
                pointerY = (y - 0.5) * 8;

                rotateX = (0.5 - y) * 1.2;
                rotateY = (x - 0.5) * 1.8;

                requestRender();
            });

            panel.addEventListener("pointerleave", () => {
                pointerX = 0;
                pointerY = 0;
                rotateX = 0;
                rotateY = 0;

                requestRender();
            });
        }

        // Initial state.
        calculateScrollProgress();
        renderMotion();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initHeroInteractions,
            { once: true }
        );
    } else {
        initHeroInteractions();
    }
})();


/* =========================================================
   SECTION: TECHNOLOGY SHOWCASE
   Scroll reveal, continuous marquees, and carousel controls.
   Single initializer for .tech-showcase.
========================================================= */
(() => {
    function initTechnologyShowcase() {
        const section = document.querySelector(".tech-showcase");

        if (!section || section.dataset.animationInitialized === "true") {
            return;
        }

        section.dataset.animationInitialized = "true";

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        /* ---------- SCROLL REVEAL ---------- */
        const revealElements = [
            section.querySelector(".tech-intro"),
            ...section.querySelectorAll(".tech-row"),
            section.querySelector(".tech-feature-strip")
        ].filter(Boolean);

        if (!reduceMotion && "IntersectionObserver" in window) {
            const revealObserver = new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("tech-is-visible");
                            revealObserver.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -35px 0px"
                }
            );

            revealElements.forEach((element, index) => {
                element.classList.add("tech-reveal-ready");
                element.style.transitionDelay =
                    `${Math.min(index * 100, 300)}ms`;

                revealObserver.observe(element);
            });
        }

        /* ---------- CONTINUOUS TECHNOLOGY MARQUEES ---------- */
        const marqueeRows = section.querySelectorAll("[data-tech-marquee]");

        marqueeRows.forEach((carousel, index) => {
            const track = carousel.querySelector(".tech-track");
            const inner = carousel.querySelector(".tech-track-inner");
            if (!track || !inner || inner.dataset.marqueeReady === "true") return;

            inner.dataset.marqueeReady = "true";
            const originals = Array.from(inner.children);
            const appendCopies = cards => cards.forEach(card => {
                const clone = card.cloneNode(true);
                clone.setAttribute("aria-hidden", "true");
                clone.querySelectorAll("a, button, input, [tabindex]").forEach(item => {
                    item.setAttribute("tabindex", "-1");
                });
                inner.appendChild(clone);
            });

            // Ensure one full sequence is at least as wide as the viewport.
            while (inner.scrollWidth < track.clientWidth * 1.5) {
                appendCopies(originals);
            }
            const sequence = Array.from(inner.children);
            appendCopies(sequence);

            // Backend moves left-to-right; the other rows move right-to-left.
            carousel.classList.add(index === 1 ? "tech-marquee-reverse" : "tech-marquee-forward");
            const setDuration = () => {
                const firstCard = inner.firstElementChild;
                const lastCard = inner.children[sequence.length - 1];
                const sequenceWidth = firstCard && lastCard
                    ? lastCard.offsetLeft + lastCard.offsetWidth - firstCard.offsetLeft
                    : inner.scrollWidth / 2;
                inner.style.setProperty("--tech-marquee-distance", `${sequenceWidth}px`);
                inner.style.setProperty("--tech-marquee-duration", `${Math.max(18, sequenceWidth / 38)}s`);
            };
            setDuration();
            if ("ResizeObserver" in window) new ResizeObserver(setDuration).observe(track);
            else window.addEventListener("resize", setDuration);
        });

        /* ---------- CAROUSEL SETUP ---------- */
        const carousels = section.querySelectorAll(
            "[data-tech-carousel]:not([data-tech-marquee])"
        );

        carousels.forEach(carousel => {
            const track = carousel.querySelector(".tech-track");
            const inner = carousel.querySelector(".tech-track-inner");
            const previousButton = carousel.querySelector("[data-tech-prev]");
            const nextButton = carousel.querySelector("[data-tech-next]");
            const dotsContainer = carousel.querySelector(".tech-dots");

            if (!track || !inner || !previousButton ||
                !nextButton || !dotsContainer) {
                return;
            }

            let position = 0;
            let maxPosition = 0;
            let step = 180;
            let autoTimer = null;
            let isHovered = false;
            let isFocused = false;

            const getGap = () => {
                const style = getComputedStyle(inner);
                return parseFloat(style.columnGap || style.gap) || 12;
            };

            function calculateSizes() {
                const firstCard = inner.querySelector(".tech-card");

                if (!firstCard) return;

                step = firstCard.getBoundingClientRect().width + getGap();

                maxPosition = Math.max(
                    0,
                    inner.scrollWidth - track.clientWidth
                );

                position = Math.min(position, maxPosition);

                updateCarousel();
                buildDots();
            }

            function updateCarousel() {
                inner.style.transition = reduceMotion
                    ? "none"
                    : "transform 650ms cubic-bezier(.22,.68,0,1)";

                inner.style.transform = `translate3d(${-position}px, 0, 0)`;

                previousButton.disabled = position <= 1;
                nextButton.disabled = position >= maxPosition - 1;

                previousButton.setAttribute(
                    "aria-disabled",
                    String(previousButton.disabled)
                );

                nextButton.setAttribute(
                    "aria-disabled",
                    String(nextButton.disabled)
                );

                updateDots();
            }

            function buildDots() {
                dotsContainer.replaceChildren();

                const pageCount = Math.max(
                    1,
                    Math.ceil(maxPosition / step) + 1
                );

                for (let index = 0; index < pageCount; index++) {
                    const dot = document.createElement("span");

                    dot.className = "tech-dot";
                    dot.setAttribute("aria-hidden", "true");

                    dotsContainer.appendChild(dot);
                }

                updateDots();
            }

            function updateDots() {
                const dots = dotsContainer.querySelectorAll("span");

                const activeIndex = Math.min(
                    dots.length - 1,
                    Math.round(position / step)
                );

                dots.forEach((dot, index) => {
                    dot.classList.toggle("is-active", index === activeIndex);
                });
            }

            function move(direction) {
                if (maxPosition <= 0) return;

                if (direction > 0) {
                    position = position >= maxPosition - 2
                        ? 0
                        : Math.min(position + step, maxPosition);
                } else {
                    position = position <= 1
                        ? maxPosition
                        : Math.max(position - step, 0);
                }

                updateCarousel();
            }

            previousButton.addEventListener("click", () => move(-1));
            nextButton.addEventListener("click", () => move(1));

            /* ---------- AUTOMATIC SLIDING ---------- */
            function stopAutoSlide() {
                if (autoTimer !== null) {
                    clearInterval(autoTimer);
                    autoTimer = null;
                }
            }

            function startAutoSlide() {
                stopAutoSlide();

                if (reduceMotion || maxPosition <= 0 ||
                    isHovered || isFocused) {
                    return;
                }

                autoTimer = setInterval(() => {
                    move(1);
                }, 3200);
            }

            carousel.addEventListener("mouseenter", () => {
                isHovered = true;
                stopAutoSlide();
            });

            carousel.addEventListener("mouseleave", () => {
                isHovered = false;
                startAutoSlide();
            });

            carousel.addEventListener("focusin", () => {
                isFocused = true;
                stopAutoSlide();
            });

            carousel.addEventListener("focusout", event => {
                if (!carousel.contains(event.relatedTarget)) {
                    isFocused = false;
                    startAutoSlide();
                }
            });

            /* ---------- TOUCH / TRACKPAD SUPPORT ---------- */
            let touchStartX = 0;

            track.addEventListener("touchstart", event => {
                touchStartX = event.changedTouches[0].clientX;
            }, { passive: true });

            track.addEventListener("touchend", event => {
                const difference =
                    event.changedTouches[0].clientX - touchStartX;

                if (Math.abs(difference) > 40) {
                    move(difference < 0 ? 1 : -1);
                }
            }, { passive: true });

            /* ---------- PAUSE WHEN SECTION IS OFF-SCREEN ---------- */
            let sectionIsVisible = true;

            if ("IntersectionObserver" in window) {
                const carouselObserver = new IntersectionObserver(entries => {
                    sectionIsVisible = entries[0].isIntersecting;

                    if (sectionIsVisible) {
                        startAutoSlide();
                    } else {
                        stopAutoSlide();
                    }
                });

                carouselObserver.observe(carousel);
            }

            const originalStartAutoSlide = startAutoSlide;

            function refreshAutoSlide() {
                stopAutoSlide();

                if (!sectionIsVisible || isHovered || isFocused ||
                    reduceMotion || maxPosition <= 0) {
                    return;
                }

                originalStartAutoSlide();
            }

            /* Recalculate card sizes on layout changes */
            calculateSizes();
            startAutoSlide();

            if ("ResizeObserver" in window) {
                const resizeObserver = new ResizeObserver(() => {
                    calculateSizes();
                    refreshAutoSlide();
                });

                resizeObserver.observe(track);
            } else {
                window.addEventListener("resize", () => {
                    calculateSizes();
                    refreshAutoSlide();
                });
            }

            window.addEventListener("load", calculateSizes, { once: true });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initTechnologyShowcase,
            { once: true }
        );
    } else {
        initTechnologyShowcase();
    }
})();

/* END SECTION: TECHNOLOGY SHOWCASE */


/* =========================================================
   VIKAS KUMAR â€” ABOUT SECTION INTERACTIONS
   Counters + Scroll Reveal + Portrait Motion
========================================================= */

(() => {
    "use strict";

    function initAboutSection() {
        const section = document.querySelector("#about");
        if (!section || section.dataset.aboutInitialized === "true") {
            return;
        }

        section.dataset.aboutInitialized = "true";

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        /* -----------------------------------------
           1. ANIMATED COUNTERS
        ----------------------------------------- */

        const counters = section.querySelectorAll(
            ".about-counter[data-count]"
        );

        function setCounterFinal(counter) {
            const target = Number(counter.dataset.count) || 0;
            const suffix = counter.dataset.suffix || "";

            counter.textContent = `${target}${suffix}`;
        }

        function animateCounter(counter) {
            if (counter.dataset.counted === "true") return;

            counter.dataset.counted = "true";

            const target = Math.max(
                0,
                Number(counter.dataset.count) || 0
            );

            const suffix = counter.dataset.suffix || "";

            if (reducedMotion) {
                setCounterFinal(counter);
                return;
            }

            const duration = 1300;
            let startTime = null;

            function update(timestamp) {
                if (startTime === null) {
                    startTime = timestamp;
                }

                const progress = Math.min(
                    (timestamp - startTime) / duration,
                    1
                );

                const eased = 1 - Math.pow(1 - progress, 4);
                const value = Math.round(target * eased);

                counter.textContent = `${value}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    setCounterFinal(counter);
                }
            }

            requestAnimationFrame(update);
        }

        if ("IntersectionObserver" in window) {
            const counterObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    });
                },
                { threshold: 0.2 }
            );

            counters.forEach((counter) => {
                counterObserver.observe(counter);
            });
        } else {
            counters.forEach(setCounterFinal);
        }


        /* -----------------------------------------
           2. REVEAL ABOUT CARDS ON SCROLL
        ----------------------------------------- */

        const revealItems = section.querySelectorAll(
            ".about-profile, .about-journey, .about-side, .about-approach"
        );

        if (!reducedMotion && "IntersectionObserver" in window) {
            const revealObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        const target = entry.target;
                        requestAnimationFrame(() => {
                            target.classList.add("about-is-visible");
                        });
                        observer.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: "0px 0px -8% 0px"
                }
            );

            revealItems.forEach((item) => {
                item.classList.add("about-reveal-ready");
                revealObserver.observe(item);
            });
        } else {
            revealItems.forEach((item) => {
                item.classList.add("about-reveal-ready");
                item.classList.add("about-is-visible");
            });
        }


        /* -----------------------------------------
           3. SUBTLE PORTRAIT PARALLAX
        ----------------------------------------- */

        const workspace = section.querySelector(".about-workspace");
        const portrait = workspace?.querySelector("img");

        const supportsHover = window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;

        if (
            !workspace ||
            !portrait ||
            reducedMotion ||
            !supportsHover
        ) {
            return;
        }

        let frame = null;
        let moveX = 0;
        let moveY = 0;

        workspace.addEventListener("pointermove", (event) => {
            const rect = workspace.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            moveX = x * 7;
            moveY = y * 5;

            if (frame !== null) return;

            frame = requestAnimationFrame(() => {
                portrait.style.setProperty(
                    "--about-photo-x",
                    `${moveX}px`
                );

                portrait.style.setProperty(
                    "--about-photo-y",
                    `${moveY}px`
                );

                frame = null;
            });
        });

        workspace.addEventListener("pointerleave", () => {
            moveX = 0;
            moveY = 0;

            portrait.style.setProperty("--about-photo-x", "0px");
            portrait.style.setProperty("--about-photo-y", "0px");
        });
    }

    window.VikasPortfolio = window.VikasPortfolio || {};
    window.VikasPortfolio.initAbout = initAboutSection;

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initAboutSection,
            { once: true }
        );
    } else {
        initAboutSection();
    }
})();

/* END SECTION: ABOUT */


    /* =====================================================
       06 â€” PROJECTS
       ===================================================== */

    
/* ==========================================================
   OCARIUS TECHNOLOGIES â€” PROJECTS
   Django | Category Filters | Scroll Reveal | Card Animations
   File: static/js/projects.js
========================================================== */

(function () {
    "use strict";

    function initializeProjects() {
        const section = document.querySelector("#projects");

        if (!section || section.dataset.projectsInitialized === "true") {
            return;
        }

        const buttons = Array.from(
            section.querySelectorAll(".project-filter")
        );

        const cards = Array.from(
            section.querySelectorAll(".project-card[data-category]")
        );

        const visibleCount = section.querySelector(
            "#visible-project-count"
        );

        const totalCount = section.querySelector(
            "#total-project-count"
        );

        if (!buttons.length || !cards.length) {
            console.error(
                "[Ocarius Projects] Filter buttons or project cards not found."
            );
            return;
        }

        section.dataset.projectsInitialized = "true";

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Only explicitly published projects appear on the website.
        const publishedCards = cards.filter(function (card) {
            return card.dataset.published === "true";
        });

        // Read each card's category tags.
        function getCategories(card) {
            return (card.dataset.category || "")
                .toLowerCase()
                .trim()
                .split(/\s+/)
                .filter(Boolean);
        }

        // Calculate the count for every category button.
        function updateCategoryCounts() {
            buttons.forEach(function (button) {
                const filter = button.dataset.filter;
                const countElement = button.querySelector(".filter-count");

                if (!countElement) return;

                const count = publishedCards.filter(function (card) {
                    return filter === "all" ||
                        getCategories(card).includes(filter);
                }).length;

                countElement.textContent = String(count).padStart(2, "0");
            });
        }

        // Animate cards when the user changes a category.
        function animateVisibleCards(visibleCards) {
            if (reducedMotion || typeof Element.prototype.animate !== "function") {
                return;
            }

            visibleCards.forEach(function (card, index) {
                card.animate(
                    [
                        {
                            opacity: 0,
                            transform: "translateY(12px) scale(0.99)"
                        },
                        {
                            opacity: 1,
                            transform: "translateY(0) scale(1)"
                        }
                    ],
                    {
                        duration: 380,
                        delay: Math.min(index * 45, 220),
                        easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
                        fill: "none"
                    }
                );
            });
        }

        // Apply the selected filter.
        function applyFilter(filter, animate) {
            const supportedFilter = buttons.some(function (button) {
                return button.dataset.filter === filter;
            });

            if (!supportedFilter) {
                filter = "all";
            }

            let visible = 0;
            const visibleCards = [];

            cards.forEach(function (card) {
                const isPublished = publishedCards.includes(card);
                const matchesCategory =
                    filter === "all" ||
                    getCategories(card).includes(filter);

                const shouldShow = isPublished && matchesCategory;

                card.hidden = !shouldShow;

                if (shouldShow) {
                    visible++;
                    visibleCards.push(card);
                }
            });

            // Active state and accessibility.
            buttons.forEach(function (button) {
                const active = button.dataset.filter === filter;

                button.classList.toggle("active", active);
                button.setAttribute("aria-pressed", String(active));
            });

            // Update visible/total counters.
            if (visibleCount) {
                visibleCount.textContent =
                    String(visible).padStart(2, "0");
            }

            if (totalCount) {
                totalCount.textContent =
                    String(publishedCards.length).padStart(2, "0");
            }

            section.dataset.activeFilter = filter;

            if (animate) {
                animateVisibleCards(visibleCards);
            }
        }

        // Event delegation: works when the user clicks button text,
        // count badges, icons, or the button itself.
        section.addEventListener("click", function (event) {
            const target = event.target;

            if (!(target instanceof Element)) return;

            const button = target.closest(".project-filter");

            if (!button || !section.contains(button)) return;

            event.preventDefault();

            const filter = button.dataset.filter || "all";
            applyFilter(filter, true);
        });

        // Initial filter and correct category totals.
        updateCategoryCounts();
        applyFilter("all", false);

        // Scroll-triggered section reveal.
        function setupScrollReveal() {
            if (
                reducedMotion ||
                !("IntersectionObserver" in window)
            ) {
                section.classList.add("is-visible");
                return;
            }

            const observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (!entry.isIntersecting) return;

                        section.classList.add("is-visible");
                        observer.unobserve(section);
                    });
                },
                {
                    threshold: 0.08,
                    rootMargin: "0px 0px -35px 0px"
                }
            );

            // CSS will enable the initial hidden states only after
            // the observer is ready.
            section.classList.add("reveal-enabled");
            observer.observe(section);
        }

        setupScrollReveal();

        console.info(
            "[Ocarius Projects] Ready.",
            publishedCards.length,
            "published projects."
        );
    }

    // Works with both defer-loaded scripts and late-loaded scripts.
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeProjects,
            { once: true }
        );
    } else {
        initializeProjects();
    }
})();

    /* SECTION: PROJECTS - END */


    
/* ============================================
   HOW I WORK â€” SCROLL REVEAL ANIMATION
============================================ */

(function initHowIWork() {
    "use strict";

    function setupHowIWorkAnimation() {
        const section = document.querySelector("#how-i-work");

        if (!section || section.dataset.revealInitialized === "true") {
            return;
        }

        section.dataset.revealInitialized = "true";

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Show content immediately if animations are unavailable.
        if (
            prefersReducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            section.classList.add("is-visible");
            return;
        }

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;

                    section.classList.add("is-visible");

                    // Animate only once when the section enters view.
                    observer.unobserve(section);
                });
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        // Enable the CSS reveal states before observing.
        section.classList.add("reveal-enabled");
        observer.observe(section);
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            setupHowIWorkAnimation,
            { once: true }
        );
    } else {
        setupHowIWorkAnimation();
    }
})();

    /* =====================================================
       CORE IIFE END / STANDALONE SECTIONS FOLLOW
       -----------------------------------------------------
       Standalone section modules start below this line.

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



document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".case-studies-section");

    if (!section) return;

    const revealElements = section.querySelectorAll(
        ".cs-reveal, .cs-reveal-right"
    );

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
        return;
    }

    document.documentElement.classList.add("js-enabled");

    const observer = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    revealElements.forEach(function (element, index) {
        element.style.transitionDelay = (index % 3) * 100 + "ms";
        observer.observe(element);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".testimonials-section");
    const toggle = document.getElementById("testimonialThemeToggle");
    const motionToggle = document.getElementById("testimonialMotionToggle");
    const heading = document.querySelector(
        ".testimonials-heading[data-reveal]"
    );

    if (!section) return;

    // Use clean, accessible glyphs even if older template text has a legacy encoding.
    const eyebrowIcon = section.querySelector(".testimonial-eyebrow > span");
    if (eyebrowIcon) eyebrowIcon.textContent = String.fromCharCode(10077);
    section.querySelectorAll(".testimonial-quote").forEach(function (quote) {
        quote.textContent = String.fromCharCode(8220);
    });
    const sunIcon = section.querySelector(".theme-sun");
    const moonIcon = section.querySelector(".theme-moon");
    if (sunIcon) sunIcon.textContent = String.fromCharCode(9728);
    if (moonIcon) moonIcon.textContent = String.fromCharCode(9790);

    // Light / dark theme toggle
    if (toggle) {
        toggle.addEventListener("click", function () {
            const isDark = section.classList.toggle("testimonials-dark");

            toggle.setAttribute("aria-pressed", String(isDark));
            toggle.setAttribute(
                "aria-label",
                isDark ? "Switch to light theme" : "Switch to dark theme"
            );
        });
    }

    if (motionToggle) {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        motionToggle.hidden = reduceMotion;

        motionToggle.addEventListener("click", function () {
            const isPaused = section.classList.toggle("testimonials-paused");
            motionToggle.setAttribute("aria-pressed", String(isPaused));
            motionToggle.setAttribute(
                "aria-label",
                isPaused ? "Resume testimonial movement" : "Pause testimonial movement"
            );
            const label = motionToggle.querySelector(".testimonial-control-label");
            const icon = motionToggle.querySelector("[aria-hidden='true']");
            if (label) label.textContent = isPaused ? "Play" : "Pause";
            if (icon) icon.textContent = isPaused ? String.fromCharCode(9654) : String.fromCharCode(8214);
        });
    }

    // Reveal heading when it enters the viewport
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (heading && "IntersectionObserver" in window && !prefersReducedMotion) {
        section.classList.add("testimonial-reveal-ready");
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        heading.classList.add("is-visible");
                        observer.unobserve(heading);
                    }
                });
            },
            { threshold: 0.15 }
        );

        observer.observe(heading);
    } else if (heading) {
        heading.classList.add("is-visible");
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".services-showcase");
    if (!section) return;

    const rows = section.querySelectorAll("[data-service-index]");
    const preview = section.querySelector("[data-showcase-preview]");
    const art = section.querySelector("[data-showcase-art]");

    if (!preview || !art || !rows.length) return;

    const services = [
        {
            title: "Django Web Development",
            className: "showcase-art--django",
            imageUrl: "https://images.unsplash.com/photo-1555066931-bf19f8fd1085?auto=format&fit=crop&w=1200&q=80",
            code: [
                "class Project:",
                "  def __init__(self):",
                '    self.status =',
                '    "building"'
            ],
            caption: "PYTHON + DJANGO"
        },
        {
            title: "REST API Development",
            className: "showcase-art--api",
            imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
            code: [
                "@api_view(['GET'])",
                "def projects(request):",
                "  return Response(",
                "    project_data)"
            ],
            caption: "REST API / JSON"
        },
        {
            title: "WordPress Development",
            className: "showcase-art--wordpress",
            imageUrl: "https://images.unsplash.com/photo-1502882705085-fd1fd2ecefd0?auto=format&fit=crop&w=1200&q=80",
            code: [
                "function theme_setup() {",
                "  add_theme_support(",
                "    'custom-logo'",
                "  );"
            ],
            caption: "WORDPRESS / CMS"
        },
        {
            title: "Debugging & Maintenance",
            className: "showcase-art--maintenance",
            imageUrl: "https://images.unsplash.com/photo-1760670399462-f5e479452c27?auto=format&fit=crop&w=1200&q=80",
            code: [
                "def fix_issue():",
                "  inspect_logs()",
                "  find_root_cause()",
                "  test_solution()"
            ],
            caption: "DEBUG / IMPROVE"
        }
    ];

    const sectionIcon = section.querySelector(".services-showcase__eyebrow-icon");
    if (sectionIcon) sectionIcon.textContent = String.fromCharCode(10022);
    section.querySelectorAll(".showcase-service__arrow, .services-showcase__cta span")
        .forEach(function (icon) {
            icon.textContent = String.fromCharCode(8599);
            icon.setAttribute("aria-hidden", "true");
        });

    function renderPreview(index) {
        rows.forEach(function (row, rowIndex) {
            const active = rowIndex === index;
            row.classList.toggle("is-active", active);
            row.setAttribute("aria-pressed", String(active));
        });

        const service = services[index];
        if (!service) return;

        art.classList.remove(
            "showcase-art--django",
            "showcase-art--api",
            "showcase-art--wordpress",
            "showcase-art--maintenance"
        );
        art.classList.add(service.className);
        const image = art.querySelector("[data-showcase-image]");
        if (image && image.src !== service.imageUrl) {
            image.classList.add("is-changing");
            image.onload = function () {
                image.classList.remove("is-changing");
            };
            image.onerror = function () {
                image.classList.remove("is-changing");
            };
            image.src = service.imageUrl;
        }

        const codeBox = art.querySelector(".showcase-art__code");
        const caption = art.querySelector(".showcase-art__caption");
        const toolbar = art.querySelector(".showcase-art__toolbar");

        if (codeBox) {
            codeBox.replaceChildren();

            service.code.forEach(function (line, lineIndex) {
                const span = document.createElement("span");
                span.textContent = line;

                if (lineIndex === 0) {
                    const strong = document.createElement("b");
                    strong.textContent = line;
                    span.replaceChildren(strong);
                }

                codeBox.appendChild(span);
            });

            const accent = document.createElement("span");
            accent.className = "showcase-art__code-accent";
            accent.textContent = "</> " + service.caption;
            codeBox.appendChild(accent);
        }

        if (caption) caption.textContent = service.caption;

        if (toolbar) {
            const title = toolbar.querySelector("span");
            if (title) {
                title.textContent = [
                    "project.py",
                    "api.py",
                    "theme.php",
                    "maintenance.py"
                ][index];
            }
        }
    }

    let activeIndex = -1;

    function showPreview(index) {
        if (!Number.isInteger(index) || index < 0 || index >= services.length) return;
        if (index === activeIndex) return;
        activeIndex = index;
        renderPreview(index);
        preview.classList.add("is-visible");
        preview.setAttribute("aria-hidden", "true");
    }

    // Delegate pointer events so hovering any child inside a service row works.
    section.addEventListener("pointerover", function (event) {
        const row = event.target.closest("[data-service-index]");
        if (!row || !section.contains(row)) return;
        showPreview(Number(row.dataset.serviceIndex));
    });

    section.addEventListener("focusin", function (event) {
        const row = event.target.closest("[data-service-index]");
        if (row) showPreview(Number(row.dataset.serviceIndex));
    });

    section.addEventListener("click", function (event) {
        const row = event.target.closest("[data-service-index]");
        if (row) showPreview(Number(row.dataset.serviceIndex));
    });

    renderPreview(0);
    activeIndex = 0;
});

// =========================================================
// SECTION: CERTIFICATES / CREDENTIALS - START
// Handles:
// - Section reveal
// - Certificate document tilt
// - Zetheta card tilt
// - Background parallax
// - Learning ticker pause
// - Reduced-motion support
// =========================================================


/* =====================================================
   CREDENTIALS: FILTERS + HOVER PDF + CLICK MODAL
===================================================== */
(function () {
    "use strict";

    function initCredentials() {
        const section = document.querySelector("#credentials");
        if (!section || section.dataset.credentialsInit === "true") return;

        const cards = Array.from(section.querySelectorAll(".credential-card"));
        const filters = Array.from(section.querySelectorAll(".credential-filter"));
        const modal = section.querySelector("#credentialModal");
        const modalFrame = section.querySelector("#credentialFrame");
        const hoverPreview = document.querySelector("#credentialHoverPreview");
        const hoverFrame = document.querySelector("#credentialHoverFrame");
        const hoverTitle = document.querySelector("#credentialHoverTitle");

        // The floating PDF must live outside the section's overflow clipping.
        if (hoverPreview && hoverPreview.parentElement !== document.body) {
            document.body.appendChild(hoverPreview);
        }

        if (!cards.length || !filters.length) {
            console.error("Credentials: cards or filters are missing.");
            return;
        }

        section.dataset.credentialsInit = "true";

        const modalTitle = section.querySelector("#credentialModalTitle");
        const modalDescription = section.querySelector("#credentialModalDescription");
        const modalDate = section.querySelector("#credentialModalDate");
        const modalCategory = section.querySelector("#credentialModalCategory");
        const originalLink = section.querySelector("#credentialOriginal");
        const closeButtons = section.querySelectorAll("[data-modal-close]");
        const prevButton = section.querySelector(".credential-prev");
        const nextButton = section.querySelector(".credential-next");

        let visibleCards = cards.slice();
        let activeIndex = 0;
        let lastFocus = null;
        let hoveredCard = null;

        const categoryLabels = {
            certification: "Certification",
            internship: "Internship",
            project: "Project",
            achievement: "Achievement"
        };

        function getPDF(card) {
            const url = card.dataset.file;
            if (!url) {
                console.error("Missing data-file on certificate card:", card);
                return "";
            }
            return url;
        }

        /* FILTERS */
        function applyFilter(filter) {
            filters.forEach(function (button) {
                const active = button.dataset.filter === filter;
                button.classList.toggle("is-active", active);
                button.setAttribute("aria-pressed", String(active));
            });

            cards.forEach(function (card, index) {
                const isVisible =
                    filter === "all" || card.dataset.category === filter;
                card.hidden = !isVisible;

                if (isVisible) {
                    card.style.setProperty(
                        "--credential-stagger",
                        (index * 45) + "ms"
                    );
                    card.classList.remove("is-filter-entering");
                    void card.offsetWidth;
                    card.classList.add("is-filter-entering");
                    window.setTimeout(function () {
                        card.classList.remove("is-filter-entering");
                    }, 520 + index * 45);
                }
            });

            visibleCards = cards.filter(function (card) {
                return !card.hidden;
            });

            hideHoverPreview();
        }

        filters.forEach(function (button) {
            button.addEventListener("click", function () {
                applyFilter(button.dataset.filter);
            });
        });

        /* HOVER PREVIEW */
        function positionHoverPreview(event) {
            if (!hoverPreview || !event) return;

            const width = hoverPreview.offsetWidth || 390;
            const height = hoverPreview.offsetHeight || 320;
            const gap = 20;

            let x = event.clientX + gap;
            let y = event.clientY + gap;

            if (x + width > window.innerWidth - 12) {
                x = event.clientX - width - gap;
            }
            if (y + height > window.innerHeight - 12) {
                y = window.innerHeight - height - 12;
            }

            x = Math.max(12, x);
            y = Math.max(12, y);

            hoverPreview.style.left = x + "px";
            hoverPreview.style.top = y + "px";
        }

        function showHoverPreview(card, event) {
            if (!hoverPreview || !hoverFrame || !hoverTitle) return;
            if (window.matchMedia("(hover: none)").matches) return;
            if (modal && modal.classList.contains("is-open")) return;

            const pdf = getPDF(card);
            if (!pdf) return;

            hoveredCard = card;
            hoverTitle.textContent = card.dataset.title || "Certificate Preview";

            // Load only when the hovered certificate changes.
            if (hoverFrame.dataset.currentPdf !== pdf) {
                hoverFrame.dataset.currentPdf = pdf;
                hoverFrame.src = pdf + "#toolbar=0&navpanes=0&view=FitH";
            }

            hoverPreview.classList.add("is-visible");
            hoverPreview.setAttribute("aria-hidden", "false");
            positionHoverPreview(event);
        }

        function hideHoverPreview() {
            if (!hoverPreview) return;

            hoverPreview.classList.remove("is-visible");
            hoverPreview.setAttribute("aria-hidden", "true");
            hoveredCard = null;

            // Leave the PDF loaded briefly; next hover can reuse it.
        }

        cards.forEach(function (card) {
            card.addEventListener("mouseenter", function (event) {
                showHoverPreview(card, event);
            });

            card.addEventListener("mousemove", function (event) {
                if (hoveredCard === card) {
                    positionHoverPreview(event);
                }
            });

            card.addEventListener("mouseleave", hideHoverPreview);

            const openButton = card.querySelector(".credential-open");
            if (openButton) {
                openButton.addEventListener("focus", function () {
                    // Keyboard users can still open the modal with Enter.
                });

                openButton.addEventListener("click", function () {
                    hideHoverPreview();
                    openModal(card);
                });
            }
        });

        /* MODAL */
        function renderModal() {
            const card = visibleCards[activeIndex];
            if (!card) return;

            const pdf = getPDF(card);
            if (!pdf) return;

            if (modalTitle) {
                modalTitle.textContent = card.dataset.title || "Certificate";
            }
            if (modalDescription) {
                modalDescription.textContent = card.dataset.description || "";
            }
            if (modalDate) {
                modalDate.textContent = card.dataset.date || "";
            }
            if (modalCategory) {
                modalCategory.textContent =
                    categoryLabels[card.dataset.category] || "Credential";
            }

            modalFrame.src = pdf + "#toolbar=1&navpanes=0&view=FitH";
            if (originalLink) originalLink.href = pdf;

            const canMove = visibleCards.length > 1;
            if (prevButton) prevButton.disabled = !canMove;
            if (nextButton) nextButton.disabled = !canMove;
        }

        function openModal(card) {
            if (!modal || !modalFrame) return;

            const index = visibleCards.indexOf(card);
            if (index < 0) return;

            activeIndex = index;
            lastFocus = document.activeElement;
            renderModal();

            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("credentials-modal-open");

            const closeButton = modal.querySelector(".credential-close");
            if (closeButton) closeButton.focus();
        }

        function closeModal() {
            if (!modal || !modal.classList.contains("is-open")) return;

            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("credentials-modal-open");

            if (modalFrame) modalFrame.src = "about:blank";

            if (lastFocus && typeof lastFocus.focus === "function") {
                lastFocus.focus();
            }
        }

        function navigate(direction) {
            if (visibleCards.length < 2) return;

            activeIndex =
                (activeIndex + direction + visibleCards.length) %
                visibleCards.length;

            renderModal();
        }

        closeButtons.forEach(function (button) {
            button.addEventListener("click", closeModal);
        });

        if (prevButton) {
            prevButton.addEventListener("click", function () {
                navigate(-1);
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                navigate(1);
            });
        }

        document.addEventListener("keydown", function (event) {
            if (!modal || !modal.classList.contains("is-open")) return;

            if (event.key === "Escape") closeModal();
            if (event.key === "ArrowLeft") navigate(-1);
            if (event.key === "ArrowRight") navigate(1);
        });

        window.addEventListener("resize", hideHoverPreview);
        window.addEventListener("scroll", hideHoverPreview, { passive: true });

        applyFilter("all");
        console.info("Credentials: filters and preview initialized.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCredentials, { once: true });
    } else {
        initCredentials();
    }
})();


// SECTION: CERTIFICATES / CREDENTIALS - END


/* =========================================================
   SECTION 08 — BLOG INTERACTIONS
   File: static/js/main.js
   Works with the existing Blog HTML
   ========================================================= */

(() => {
    "use strict";

    function initBlogSection() {
        const blog = document.querySelector("#blog");

        if (!blog || blog.dataset.blogInitialized === "true") {
            return;
        }

        blog.dataset.blogInitialized = "true";

        const cards = [
            ...blog.querySelectorAll(
                ".blog-featured, .blog-card"
            )
        ];

        /* -----------------------------------------
           1. Reveal animation
           ----------------------------------------- */

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (!reducedMotion && "IntersectionObserver" in window) {
            const revealItems = [
                ...blog.querySelectorAll(
                    ".blog-hero-copy, .blog-hero-visual, .blog-toolbar, .blog-card, .blog-stats"
                )
            ];
            const observer = new IntersectionObserver(
                (entries, currentObserver) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        entry.target.classList.add("is-revealed");
                        currentObserver.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.08,
                    rootMargin: "0px 0px -35px 0px"
                }
            );

            revealItems.forEach((item, index) => {
                item.classList.add("blog-reveal");
                if (item.classList.contains("blog-card")) {
                    item.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
                }
                observer.observe(item);
            });
        }

        /* -----------------------------------------
           2. Image fallback
           ----------------------------------------- */

        const images = blog.querySelectorAll(
            ".blog-featured-image img, .blog-card-image img"
        );

        images.forEach((img) => {
            const showFallback = () => {
                img.classList.add("blog-image-error");
                img.style.display = "none";

                const container = img.closest(
                    ".blog-featured-image, .blog-card-image"
                );

                if (!container) return;

                container.classList.add("blog-image-fallback");

                if (!container.querySelector(".blog-image-placeholder")) {
                    const placeholder = document.createElement("span");

                    placeholder.className = "blog-image-placeholder";
                    placeholder.textContent = "ARTICLE";

                    Object.assign(placeholder.style, {
                        position: "absolute",
                        inset: "0",
                        display: "grid",
                        placeItems: "center",
                        color: "#7b3f1d",
                        background: "#f3e5d6",
                        fontSize: "12px",
                        fontWeight: "800",
                        letterSpacing: "0.18em"
                    });

                    container.appendChild(placeholder);
                }
            };

            img.addEventListener("error", showFallback, {
                once: true
            });

            // Handle images that failed before this script ran.
            if (img.complete && img.naturalWidth === 0) {
                showFallback();
            }
        });

        /* Search filters cards by their visible text. */

        const searchInput = blog.querySelector("[data-blog-search], #blogSearch");
        const searchClear = blog.querySelector("#blogSearchClear");

        const searchStatus = blog.querySelector(
            "[data-blog-search-status], #blog-posts"
        );

        let activeFilter = "all";

        function getCardCategory(card) {
            return (
                card.dataset.category ||
                card.querySelector("[data-category]")?.dataset.category ||
                ""
            ).trim().toLowerCase();
        }

        function applyBlogFilters() {
            const query = (searchInput?.value || "")
                .trim()
                .toLowerCase();

            let visibleCount = 0;

            cards.forEach((card) => {
                const category = getCardCategory(card).split(/\s+/).filter(Boolean);

                const matchesCategory =
                    activeFilter === "all" ||
                    category.includes(activeFilter);

                const matchesSearch =
                    !query ||
                    card.textContent.toLowerCase().includes(query);

                const visible = matchesCategory && matchesSearch;

                card.hidden = !visible;

                if (visible) visibleCount++;
            });

            if (searchStatus) {
                searchStatus.textContent = query || activeFilter !== "all"
                    ? `${visibleCount} article${visibleCount === 1 ? "" : "s"} found`
                    : "";
            }

            updateCarousel();
        }

        if (searchInput) {
            searchInput.addEventListener("input", applyBlogFilters);
        }

        searchClear?.addEventListener("click", () => {
            if (!searchInput) return;
            searchInput.value = "";
            searchInput.focus();
            applyBlogFilters();
        });

        /* Category filters can match multiple category tokens per article. */

        const filterButtons = blog.querySelectorAll(
            "[data-blog-filter]"
        );

        filterButtons.forEach((button) => {
            button.setAttribute(
                "aria-pressed",
                button.dataset.blogFilter === "all" ? "true" : "false"
            );

            button.addEventListener("click", () => {
                activeFilter = (
                    button.dataset.blogFilter || "all"
                ).trim().toLowerCase();

                filterButtons.forEach((item) => {
                    const active =
                        item.dataset.blogFilter.trim().toLowerCase() ===
                        activeFilter;

                    item.classList.toggle("is-active", active);
                    item.setAttribute(
                        "aria-pressed",
                        String(active)
                    );
                });

                applyBlogFilters();
            });
        });

        /* -----------------------------------------
           5. Responsive carousel controls
           ----------------------------------------- */

        const track = blog.querySelector("#blogTrack");
        const trackWindow = blog.querySelector(".blog-track-window");
        const prevButton = blog.querySelector(".blog-prev");
        const nextButton = blog.querySelector(".blog-next");
        let carouselPage = 0;
        let carouselPages = 1;

        function updateCarousel() {
            if (!track || !trackWindow) return;

            const visibleCards = [...track.querySelectorAll(".blog-card")]
                .filter((card) => !card.hidden);
            const perPage = window.matchMedia("(max-width: 650px)").matches
                ? 1
                : window.matchMedia("(max-width: 1100px)").matches ? 2 : 3;
            carouselPages = Math.max(1, Math.ceil(visibleCards.length / perPage));
            carouselPage = Math.min(carouselPage, carouselPages - 1);

            const pageDots = blog.querySelector("#blogDots");
            if (pageDots) {
                pageDots.innerHTML = "";
                for (let page = 0; page < carouselPages; page++) {
                    const dot = document.createElement("button");
                    dot.type = "button";
                    dot.setAttribute("aria-label", `Go to article page ${page + 1}`);
                    dot.setAttribute("aria-current", page === carouselPage ? "true" : "false");
                    dot.classList.toggle("is-active", page === carouselPage);
                    dot.addEventListener("click", () => {
                        carouselPage = page;
                        updateCarousel();
                    });
                    pageDots.appendChild(dot);
                }
            }

            if (visibleCards.length) {
                const first = visibleCards[0];
                const step = first.getBoundingClientRect().width +
                    (parseFloat(getComputedStyle(track).columnGap) || 0);
                track.style.transform = `translate3d(${-carouselPage * perPage * step}px, 0, 0)`;
            } else {
                track.style.transform = "translate3d(0, 0, 0)";
            }

            if (prevButton) prevButton.disabled = carouselPage === 0;
            if (nextButton) nextButton.disabled = carouselPage >= carouselPages - 1;
            if (prevButton) prevButton.hidden = carouselPages <= 1;
            if (nextButton) nextButton.hidden = carouselPages <= 1;
        }

        prevButton?.addEventListener("click", () => {
            carouselPage = Math.max(0, carouselPage - 1);
            updateCarousel();
        });
        nextButton?.addEventListener("click", () => {
            carouselPage = Math.min(carouselPages - 1, carouselPage + 1);
            updateCarousel();
        });
        window.addEventListener("resize", updateCarousel, { passive: true });
        updateCarousel();

        /* -----------------------------------------
           5. External links safety

           Only applies to links that open new tabs.
           ----------------------------------------- */

        blog.querySelectorAll('a[target="_blank"]').forEach((link) => {
            const relTokens = new Set(
                (link.getAttribute("rel") || "")
                    .split(/\s+/)
                    .filter(Boolean)
            );

            relTokens.add("noopener");
            relTokens.add("noreferrer");

            link.setAttribute("rel", [...relTokens].join(" "));
        });

        /* -----------------------------------------
           6. Optional back-to-top link

           Add: data-blog-top
           ----------------------------------------- */

        blog.querySelectorAll("[data-blog-top]").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();

                blog.scrollIntoView({
                    behavior: reducedMotion ? "auto" : "smooth",
                    block: "start"
                });
            });
        });

        console.info("Blog section initialized.");
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initBlogSection,
            { once: true }
        );
    } else {
        initBlogSection();
    }
})();

// SECTION 08: BLOG - END

// SECTION 09: CONTACT REVEAL
(() => {
    "use strict";

    const section = document.querySelector("#contact");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!section || reduceMotion || !("IntersectionObserver" in window)) return;

    const items = [...section.querySelectorAll(
        ".contact-top, .contact-left, .contact-right, .contact-bottom"
    )];

    section.classList.add("contact-reveal-enabled");

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            currentObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

    items.forEach((item) => {
        item.classList.add("contact-reveal-item");
        observer.observe(item);
    });
})();

