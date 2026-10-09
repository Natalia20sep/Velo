/* =========================================================
   VELO · GALERÍA
   ========================================================= */

const galleryImages = [
    "../imagenes/ships/Alara y Amara (1).png",
    "../imagenes/ships/Bastión (1).png",
    "../imagenes/ships/Bastión (2).png",
    "../imagenes/ships/Conchi y Concho (1).png",
    "../imagenes/ships/Elías y Livya (1).webp",
    "../imagenes/ships/Elías y Livya (2).webp",
    "../imagenes/ships/Elías y Livya (3).webp",
    "../imagenes/ships/Elías y Livya (4).webp",
    "../imagenes/ships/Elías y Lysara (1).png",
    "../imagenes/ships/Elías y Lysara (2).png",
    "../imagenes/ships/Elías y Natasha (1).png",
    "../imagenes/ships/Elías y Vera (1).png",
    "../imagenes/ships/Elías, Kassian y Bella (1).png",
    "../imagenes/ships/Familia Vael (1).png",
    "../imagenes/ships/Garret y Bella (1).webp",
    "../imagenes/ships/Garret y Elías (1).png",
    "../imagenes/ships/Garret y Lysara (1).png",
    "../imagenes/ships/Garret y Lysara (2).png",
    "../imagenes/ships/Hera y Garret (1).png",
    "../imagenes/ships/Hera y Garret (2).png",
    "../imagenes/ships/Hera y Garret (3).png",
    "../imagenes/ships/Hera y Lysara (1).webp",
    "../imagenes/ships/Hera y Lysara (2).webp",
    "../imagenes/ships/Hera y Lysara (3).webp",
    "../imagenes/ships/Hera y Lysara (4).webp",
    "../imagenes/ships/Hera y Lysara (5).webp",
    "../imagenes/ships/Kael y Garret (1).png",
    "../imagenes/ships/Kael y Vera (1).png",
    "../imagenes/ships/Kael y Vera (2).png",
    "../imagenes/ships/Kael y Vera (3).png",
    "../imagenes/ships/Kael y Vera (4).png",
    "../imagenes/ships/Kael y Vera (5).png",
    "../imagenes/ships/Kael y Vera (6).png",
    "../imagenes/ships/Kael y Vera (7).png",
    "../imagenes/ships/Kael y Vera (8).png",
    "../imagenes/ships/Kassian y Simone (1).png",
    "../imagenes/ships/Natasha y Garret (1).png",
    "../imagenes/ships/Natasha y Garret (1).webp",
    "../imagenes/ships/Natasha y Garret (2).webp",
    "../imagenes/ships/Selene y Garret (1).png",
    "../imagenes/ships/Selene y Garret (2).png",
    "../imagenes/ships/Selene y Garret (3).png",
    "../imagenes/ships/Selene y Garret (4).png",
    "../imagenes/ships/Selene y Kael (1).jpeg",
    "../imagenes/ships/Selene y Kael (2).png",
    "../imagenes/ships/Selene y Nyra (1).jpeg",
    "../imagenes/ships/Simone y Lysara (1).png",
    "../imagenes/ships/Simone y Lysara (2).png",
    "../imagenes/ships/Simone y Lysara (3).png",
    "../imagenes/ships/Simone y Lysara (4).png",
    "../imagenes/ships/Syra y Darian (1).jpeg",
    "../imagenes/ships/Syra y Elías (1).jpeg",
    "../imagenes/ships/Syra y Elías (1).png",
    "../imagenes/ships/Syra y Elías (2).jpeg",
    "../imagenes/ships/Syra y Elías (2).png",
    "../imagenes/ships/Syra y Elías (3).png",
    "../imagenes/ships/Syra y Elías (4).jpeg",
    "../imagenes/ships/Syra y Elías (4).png",
    "../imagenes/ships/Syra y Elías (5).jpeg",
    "../imagenes/ships/Syra y Elías (5).png",
    "../imagenes/ships/Syra y Elías (6).png",
    "../imagenes/ships/Syra y Elías (7).png",
    "../imagenes/ships/Syra y Elías (8).png",
    "../imagenes/ships/Syra y Elías (9).png",
    "../imagenes/ships/Syra y Elías (10).png",
    "../imagenes/ships/Syra y Elías (11).png",
    "../imagenes/ships/Syra y Elías (12).png",
    "../imagenes/ships/Syra y Elías (13).png",
    "../imagenes/ships/Syra y Elías (14).png",
    "../imagenes/ships/Syra y Elías (15).png",
    "../imagenes/ships/Syra y Elías (16).png",
    "../imagenes/ships/Syra y Elías (17).png",
    "../imagenes/ships/Syra y Elías (18).png",
    "../imagenes/ships/Syra y Elías (19).png",
    "../imagenes/ships/Syra y Garret (1).jpeg",
    "../imagenes/ships/Syra y Hera (1).webp",
    "../imagenes/ships/Syra y Hera (2).webp",
    "../imagenes/ships/Syra y Kael (1).png",
    "../imagenes/ships/Syra y Kael (2).png",
    "../imagenes/ships/Syra y Kael (3).png",
    "../imagenes/ships/Syra y Nyra (1).png",
    "../imagenes/ships/Syra y Nyx (1).png",
    "../imagenes/ships/Syra y Selene (1).png",
    "../imagenes/ships/Syra y Selene (2).png",
    "../imagenes/ships/Syra y Selene (3).png",
    "../imagenes/ships/Syra y Vera (1).png",
    "../imagenes/ships/Syra y Vera (2).png",
    "../imagenes/ships/Syra y Vera (3).png",
    "../imagenes/ships/Syra y Vera (4).png",
    "../imagenes/ships/Syra y Vera (5).png",
    "../imagenes/ships/Syra y Zarek (1).png",
    "../imagenes/ships/Syra, Garret y Elías (1).png",
    "../imagenes/ships/Syra, Garret y Elías (2).png",
    "../imagenes/ships/Syra, Selene y Elías (1).png",
    "../imagenes/ships/Syra, Selene y Elías (2).png",
    "../imagenes/ships/Syra, Selene y Garret (1).png",
    "../imagenes/ships/Syra, Selene y Garret (2).png",
    "../imagenes/ships/ThalZyra y Bella (1).webp",
    "../imagenes/ships/Zarek y Elara.png"
];

/* =========================================================
   ELEMENTOS
   ========================================================= */

const galleryGrid = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const imageCounter = document.getElementById("imageCounter");
const closeLightbox = document.getElementById("closeLightbox");
const prevImage = document.getElementById("prevImage");
const nextImage = document.getElementById("nextImage");

let currentImage = 0;

/* =========================================================
   CREAR GALERÍA
   ========================================================= */

galleryImages.forEach((src, index) => {
    const item = document.createElement("article");
    item.className = "gallery-item";
    item.setAttribute("tabindex", "0");

    const image = document.createElement("img");
    image.src = src;
    image.alt = `Imagen de VELO ${index + 1}`;
    image.loading = "lazy";

    item.appendChild(image);
    galleryGrid.appendChild(item);

    item.addEventListener("click", () => {
        openLightbox(index);
    });

    item.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLightbox(index);
        }
    });
});

/* =========================================================
   ABRIR VISOR
   ========================================================= */

function openLightbox(index) {
    currentImage = index;
    updateLightbox();

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    closeLightbox.focus();
}

/* =========================================================
   ACTUALIZAR IMAGEN
   ========================================================= */

function updateLightbox() {
    lightboxImage.src = galleryImages[currentImage];
    lightboxImage.alt = `Imagen de VELO ${currentImage + 1}`;

    imageCounter.textContent =
        `${String(currentImage + 1).padStart(2, "0")} / ${String(galleryImages.length).padStart(2, "0")}`;
}

/* =========================================================
   CERRAR VISOR
   ========================================================= */

function closeViewer() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

/* =========================================================
   NAVEGACIÓN
   ========================================================= */

function showPrevious() {
    currentImage =
        (currentImage - 1 + galleryImages.length) %
        galleryImages.length;

    updateLightbox();
}

function showNext() {
    currentImage =
        (currentImage + 1) %
        galleryImages.length;

    updateLightbox();
}

prevImage.addEventListener("click", showPrevious);
nextImage.addEventListener("click", showNext);
closeLightbox.addEventListener("click", closeViewer);

/* =========================================================
   TECLADO
   ========================================================= */

document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) {
        return;
    }

    if (event.key === "ArrowLeft") {
        showPrevious();
    }

    if (event.key === "ArrowRight") {
        showNext();
    }

    if (event.key === "Escape") {
        closeViewer();
    }
});

/* =========================================================
   CERRAR AL PULSAR FUERA
   ========================================================= */

lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeViewer();
    }
});