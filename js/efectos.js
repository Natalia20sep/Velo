/* =========================================================
   EFECTOS GENERALES · VELO
   ========================================================= */
document.querySelectorAll("a").forEach(link => {
    const initialHref = link.getAttribute("href");
    if (!initialHref || initialHref.startsWith("#") || initialHref.startsWith("http")) {
        return;
    }
    link.addEventListener("click", event => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("http")) {
            return;
        }
        if (
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.metaKey
        ) {
            return;
        }
        event.preventDefault();
        document.body.classList.add("page-leaving");
        setTimeout(() => {
            window.location.href = href;
        }, 180);
    });
});
/* =========================================================
   IMÁGENES · CARGA SUAVE
   ========================================================= */
document.querySelectorAll("img").forEach(img => {
    img.addEventListener("load", () => {
        img.classList.add("image-loaded");
    });
});
