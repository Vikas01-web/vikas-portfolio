/* Isolated certificate filters, hover PDF preview, and full-screen viewer. */
(function () {
    "use strict";

    function initCredentials() {
        const section = document.querySelector("#credentials");
        if (!section || section.dataset.credentialsInit === "true") return;

        const cards = Array.from(section.querySelectorAll(".credential-card"));
        const filters = Array.from(section.querySelectorAll(".credential-filter"));
        const grid = section.querySelector(".credentials-grid");
        const modal = section.querySelector("#credentialModal");
        const modalFrame = section.querySelector("#credentialFrame");
        const hoverPreview = document.querySelector("#credentialHoverPreview");
        const hoverFrame = document.querySelector("#credentialHoverFrame");
        const hoverTitle = document.querySelector("#credentialHoverTitle");

        if (!cards.length || !filters.length || !grid) return;

        // The old initializer in main.js checks this flag and safely skips.
        section.dataset.credentialsInit = "true";

        // This preview is fixed to the viewport; portal it out of section clipping.
        if (hoverPreview && hoverPreview.parentElement !== document.body) {
            document.body.appendChild(hoverPreview);
        }

        const modalTitle = section.querySelector("#credentialModalTitle");
        const modalDescription = section.querySelector("#credentialModalDescription");
        const modalDate = section.querySelector("#credentialModalDate");
        const modalCategory = section.querySelector("#credentialModalCategory");
        const originalLink = section.querySelector("#credentialOriginal");
        const closeButtons = section.querySelectorAll("[data-modal-close]");
        const previousButton = section.querySelector(".credential-prev");
        const nextButton = section.querySelector(".credential-next");
        const categoryLabels = {
            certification: "Certification",
            internship: "Internship",
            project: "Project",
            achievement: "Achievement"
        };

        let visibleCards = cards.slice();
        let activeIndex = 0;
        let hoveredCard = null;
        let returnFocus = null;
        let filterTimers = [];

        function pdfFor(card) {
            return (card.dataset.file || "").trim();
        }

        function hideHoverPreview() {
            if (!hoverPreview) return;
            hoverPreview.classList.remove("is-visible");
            hoverPreview.setAttribute("aria-hidden", "true");
            hoveredCard = null;
        }

        function applyFilter(category) {
            const validCategory = filters.some(function (button) {
                return button.dataset.filter === category;
            }) ? category : "all";

            filters.forEach(function (button) {
                const active = button.dataset.filter === validCategory;
                button.classList.toggle("is-active", active);
                button.setAttribute("aria-pressed", String(active));
            });

            filterTimers.forEach(window.clearTimeout);
            filterTimers = [];

            cards.forEach(function (card, index) {
                const visible = validCategory === "all" || card.dataset.category === validCategory;
                card.hidden = !visible;
                if (!visible) {
                    card.classList.remove("is-filter-entering");
                    return;
                }

                card.style.setProperty("--credential-stagger", (index * 45) + "ms");
                card.classList.remove("is-filter-entering");
                void card.offsetWidth;
                card.classList.add("is-filter-entering");
                filterTimers.push(window.setTimeout(function () {
                    card.classList.remove("is-filter-entering");
                }, 520 + index * 45));
            });

            visibleCards = cards.filter(function (card) { return !card.hidden; });
            activeIndex = 0;
            hideHoverPreview();
        }

        filters.forEach(function (button) {
            button.addEventListener("click", function () {
                applyFilter(button.dataset.filter);
            });
        });

        function placePreview(event) {
            if (!hoverPreview || !event) return;
            const width = hoverPreview.offsetWidth || 390;
            const height = hoverPreview.offsetHeight || 320;
            const gap = 18;
            let left = event.clientX + gap;
            let top = event.clientY + gap;
            if (left + width > window.innerWidth - 10) left = event.clientX - width - gap;
            if (top + height > window.innerHeight - 10) top = window.innerHeight - height - 10;
            hoverPreview.style.left = Math.max(10, left) + "px";
            hoverPreview.style.top = Math.max(10, top) + "px";
        }

        function showPreview(card, event) {
            if (!hoverPreview || !hoverFrame || !hoverTitle) return;
            if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
            if (modal && modal.classList.contains("is-open")) return;

            const pdf = pdfFor(card);
            if (!pdf) return;
            hoveredCard = card;
            hoverTitle.textContent = card.dataset.title || "Certificate preview";

            if (hoverFrame.dataset.currentPdf !== pdf) {
                hoverFrame.dataset.currentPdf = pdf;
                hoverFrame.src = pdf + "#toolbar=0&navpanes=0&view=FitH";
            }
            hoverPreview.classList.add("is-visible");
            hoverPreview.setAttribute("aria-hidden", "false");
            placePreview(event);
        }

        cards.forEach(function (card) {
            card.addEventListener("pointerenter", function (event) {
                showPreview(card, event);
            });
            card.addEventListener("pointermove", function (event) {
                if (hoveredCard === card) placePreview(event);
            });
            card.addEventListener("pointerleave", function () {
                if (hoveredCard === card) hideHoverPreview();
            });

            const openButton = card.querySelector(".credential-open");
            if (openButton) {
                openButton.addEventListener("click", function () {
                    hideHoverPreview();
                    openModal(card);
                });
            }
        });

        function renderModal() {
            const card = visibleCards[activeIndex];
            if (!card || !modalFrame) return;
            const pdf = pdfFor(card);
            if (!pdf) return;

            if (modalTitle) modalTitle.textContent = card.dataset.title || "Certificate";
            if (modalDescription) modalDescription.textContent = card.dataset.description || "";
            if (modalDate) modalDate.textContent = card.dataset.date || "";
            if (modalCategory) {
                modalCategory.textContent = categoryLabels[card.dataset.category] || "Credential";
            }
            modalFrame.src = pdf + "#toolbar=1&navpanes=0&view=FitH";
            if (originalLink) originalLink.href = pdf;

            const canNavigate = visibleCards.length > 1;
            if (previousButton) previousButton.disabled = !canNavigate;
            if (nextButton) nextButton.disabled = !canNavigate;
        }

        function openModal(card) {
            if (!modal || !modalFrame) return;
            const index = visibleCards.indexOf(card);
            if (index < 0) return;

            activeIndex = index;
            returnFocus = document.activeElement;
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
            if (returnFocus && typeof returnFocus.focus === "function") returnFocus.focus();
        }

        function navigate(direction) {
            if (visibleCards.length < 2) return;
            activeIndex = (activeIndex + direction + visibleCards.length) % visibleCards.length;
            renderModal();
        }

        closeButtons.forEach(function (button) {
            button.addEventListener("click", closeModal);
        });
        if (previousButton) previousButton.addEventListener("click", function () { navigate(-1); });
        if (nextButton) nextButton.addEventListener("click", function () { navigate(1); });

        document.addEventListener("keydown", function (event) {
            if (!modal || !modal.classList.contains("is-open")) return;
            if (event.key === "Escape") closeModal();
            if (event.key === "ArrowLeft") navigate(-1);
            if (event.key === "ArrowRight") navigate(1);
        });
        window.addEventListener("resize", hideHoverPreview);
        window.addEventListener("scroll", hideHoverPreview, { passive: true });

        applyFilter("all");
        console.info("Credentials UI initialized", { cards: cards.length, filters: filters.length });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCredentials, { once: true });
    } else {
        initCredentials();
    }
})();
