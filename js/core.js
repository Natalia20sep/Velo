/* =========================================================
   VELO · SCRIPT GENERAL
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-ready");

    const nav = document.querySelector("body > nav");
    const navLinks = nav?.querySelector(".navlinks");
    if (!nav || !navLinks) return;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Abrir menú de navegación");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "☰";
    nav.insertBefore(toggle, navLinks);

    const closeMenu = () => {
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú de navegación");
        nav.querySelectorAll(".nav-dropdown").forEach((item) => item.classList.remove("is-open"));
        nav.querySelectorAll(".nav-dropdown-btn").forEach((button) => button.setAttribute("aria-expanded", "false"));
    };
    toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    });
    nav.querySelectorAll(".nav-dropdown-btn").forEach((button) => {
        button.setAttribute("aria-expanded", "false");
        button.addEventListener("click", (event) => {
            if (!window.matchMedia("(max-width: 800px)").matches) return;
            event.preventDefault();
            const dropdown = button.closest(".nav-dropdown");
            const open = !dropdown.classList.contains("is-open");
            nav.querySelectorAll(".nav-dropdown").forEach((item) => item.classList.remove("is-open"));
            nav.querySelectorAll(".nav-dropdown-btn").forEach((other) => other.setAttribute("aria-expanded", "false"));
            dropdown.classList.toggle("is-open", open);
            button.setAttribute("aria-expanded", String(open));
        });
    });
    navLinks.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
    window.addEventListener("resize", () => { if (!window.matchMedia("(max-width: 800px)").matches) closeMenu(); });
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
