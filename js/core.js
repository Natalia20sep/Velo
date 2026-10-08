/* =========================================================
   VELO · SCRIPT GENERAL
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-ready");
});
/* =========================================================
   UTILIDADES GENERALES
   ========================================================= */
function lockScroll() {
    document.body.classList.add("modal-open");
}
function unlockScroll() {
    document.body.classList.remove("modal-open");
}
function animateItems(items, className = "js-visible") {
    items.forEach((item, index) => {
        item.style.setProperty("--item-delay", `${index * 60}ms`);
        item.classList.add(className);
    });
}
function closeModalElement(modal) {
    if (!modal) return;
    modal.classList.remove("visible");
    unlockScroll();
    setTimeout(() => modal.remove(), 300);
}
/* =========================================================
   ATAJOS DE TECLADO
   ========================================================= */
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        const archiveModal = document.querySelector(".archive-modal");
        if (archiveModal) closeModalElement(archiveModal);
        const organizationModal = document.querySelector(".organizacion-detalle.visible");
        if (organizationModal) cerrarOrganizacion();
    }
    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        const search =
            document.getElementById("archiveSearch") ||
            document.getElementById("search");
        if (search) {
            event.preventDefault();
            search.focus();
        }
    }
});
