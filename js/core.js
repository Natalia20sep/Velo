/* =========================================================
   VELO · SCRIPT GENERAL
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-ready");

    const nav = document.querySelector("body > nav");
    const navLinks = nav?.querySelector(".navlinks");
    if (!nav || !navLinks) return;

    const main = document.querySelector("main");
    if (main) {
        main.id ||= "main-content";
        const skipLink = document.createElement("a");
        skipLink.className = "skip-link";
        skipLink.href = "#main-content";
        skipLink.textContent = "Saltar al contenido";
        nav.before(skipLink);
    }

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Abrir menú de navegación");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "☰";
    nav.insertBefore(toggle, navLinks);

    const mobileQuery = window.matchMedia("(max-width: 800px)");
    const dropdowns = [...nav.querySelectorAll(".nav-dropdown")];

    dropdowns.forEach((dropdown, index) => {
        const button = dropdown.querySelector(".nav-dropdown-btn");
        const menu = dropdown.querySelector(".nav-dropdown-menu");
        if (!button || !menu) return;
        menu.id ||= `velo-nav-menu-${index + 1}`;
        button.setAttribute("aria-controls", menu.id);
        button.setAttribute("aria-haspopup", "true");
        button.setAttribute("aria-expanded", "false");
    });

    const syncNavigationAccessibility = () => {
        const isMobile = mobileQuery.matches;
        const navOpen = nav.classList.contains("nav-open");
        navLinks.inert = isMobile && !navOpen;
        navLinks.setAttribute("aria-hidden", String(isMobile && !navOpen));

        dropdowns.forEach((dropdown) => {
            const button = dropdown.querySelector(".nav-dropdown-btn");
            const menu = dropdown.querySelector(".nav-dropdown-menu");
            if (!button || !menu) return;
            const isOpen = isMobile ? navOpen && dropdown.classList.contains("is-open") : dropdown.matches(":hover") || dropdown.contains(document.activeElement);
            menu.inert = isMobile && !isOpen;
            menu.setAttribute("aria-hidden", String(isMobile && !isOpen));
            button.setAttribute("aria-expanded", String(isOpen));
        });
    };

    const closeMenu = () => {
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú de navegación");
        dropdowns.forEach((item) => item.classList.remove("is-open"));
        syncNavigationAccessibility();
    };
    toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
        syncNavigationAccessibility();
    });
    nav.querySelectorAll(".nav-dropdown-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            if (!mobileQuery.matches) return;
            event.preventDefault();
            const dropdown = button.closest(".nav-dropdown");
            const open = !dropdown.classList.contains("is-open");
            dropdowns.forEach((item) => item.classList.remove("is-open"));
            dropdown.classList.toggle("is-open", open);
            syncNavigationAccessibility();
        });
    });
    navLinks.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
    nav.addEventListener("focusin", syncNavigationAccessibility);
    nav.addEventListener("focusout", () => requestAnimationFrame(syncNavigationAccessibility));
    nav.addEventListener("mouseenter", syncNavigationAccessibility);
    nav.addEventListener("mouseleave", syncNavigationAccessibility);
    document.addEventListener("click", (event) => {
        if (mobileQuery.matches && nav.classList.contains("nav-open") && !nav.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && nav.classList.contains("nav-open")) {
            closeMenu();
            toggle.focus();
        }
    });
    mobileQuery.addEventListener("change", () => {
        if (!mobileQuery.matches) nav.classList.remove("nav-open");
        dropdowns.forEach((item) => item.classList.remove("is-open"));
        syncNavigationAccessibility();
    });
    syncNavigationAccessibility();
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
