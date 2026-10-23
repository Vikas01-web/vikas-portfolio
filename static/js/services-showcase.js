/* Service image selection. Kept separate so unrelated page scripts cannot
   prevent the hover, focus, and click interactions from being registered. */
document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".services-showcase");
    if (!section) return;

    const rows = Array.from(section.querySelectorAll(".showcase-service[data-service-index]"));
    const preview = section.querySelector("[data-showcase-preview]");
    const art = section.querySelector("[data-showcase-art]");
    const image = section.querySelector("[data-showcase-image]");
    if (!rows.length || !preview || !art || !image) return;

    let activeRow = null;
    let animationTimer = 0;

    function selectService(row, animate) {
        const thumb = row.querySelector(".showcase-service__thumb");
        if (!thumb) return;

        rows.forEach(function (item) {
            const selected = item === row;
            item.classList.toggle("is-active", selected);
            item.setAttribute("aria-pressed", String(selected));
        });

        preview.classList.add("is-visible");
        preview.setAttribute("aria-hidden", "true");

        const changed = activeRow !== row;
        if (!changed && !animate) return;
        activeRow = row;

        // Reuse the row's own image so the preview always matches the hovered item.
        const nextImage = new URL(thumb.currentSrc || thumb.src, window.location.href);
        if (nextImage.hostname === "images.unsplash.com") {
            nextImage.searchParams.set("w", "1200");
            nextImage.searchParams.delete("h");
        }

        const nextUrl = nextImage.href;
        if (image.src !== nextUrl) image.src = nextUrl;

        art.classList.remove("is-switching");
        window.clearTimeout(animationTimer);
        // Restart the reveal for each new service, including a repeated click.
        void art.offsetWidth;
        if (animate || changed) {
            art.classList.add("is-switching");
            animationTimer = window.setTimeout(function () {
                art.classList.remove("is-switching");
            }, 520);
        }
    }

    rows.forEach(function (row) {
        row.addEventListener("pointerenter", function () {
            selectService(row, true);
        });
        row.addEventListener("focus", function () {
            selectService(row, true);
        });
        row.addEventListener("click", function () {
            selectService(row, true);
        });
    });

    const initiallyActive = rows.find(function (row) {
        return row.classList.contains("is-active");
    }) || rows[0];
    selectService(initiallyActive, false);
});
