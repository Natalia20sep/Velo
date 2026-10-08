/* ============================================================
   VELO · ARCHIVO CENTRAL
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       CONFIGURACIÓN
    ======================================================== */

    const ACCESS_LEVEL = 2;


    /* ========================================================
       ELEMENTOS
    ======================================================== */

    const records = [
        ...document.querySelectorAll(".archive-record")
    ];

    const searchInput =
        document.getElementById("archiveSearch");

    const filters = [
        ...document.querySelectorAll(".archive-filter")
    ];

    const resultCount =
        document.getElementById("archiveResultCount");

    const emptyState =
        document.getElementById("archiveEmpty");


    /* ========================================================
       CONTADORES
    ======================================================== */

    const countRecords =
        document.getElementById("countRecords");

    const countDocuments =
        document.getElementById("countDocuments");

    const countRestricted =
        document.getElementById("countRestricted");

    const countPending =
        document.getElementById("countPending");

    const accessLevel =
        document.getElementById("accessLevel");


    /* ========================================================
       MODAL
    ======================================================== */

    const modal =
        document.getElementById("archiveModal");

    const modalClose =
        document.getElementById("archiveClose");

    const modalCode =
        document.getElementById("modalCode");

    const modalLevel =
        document.getElementById("modalLevel");

    const modalCategory =
        document.getElementById("modalCategory");

    const modalMaterial =
        document.getElementById("modalMaterial");

    const modalTitle =
        document.getElementById("archiveModalTitle");

    const modalText =
        document.getElementById("archiveDocumentText");

    const modalFooterCode =
        document.getElementById("modalFooterCode");


    /* ========================================================
       ESTADO
    ======================================================== */

    let currentFilter = "all";


    /* ========================================================
       ACCESO
    ======================================================== */

    if (accessLevel) {
        accessLevel.textContent =
            `ACCESO ${toRoman(ACCESS_LEVEL)}`;
    }


    /* ========================================================
       CONTADORES
    ======================================================== */

    function updateCounters() {

        const total =
            records.length;

        const documents =
            records.filter(record => {
                return !record.dataset.pending;
            }).length;

        const restricted =
            records.filter(record => {
                return Number(record.dataset.access) > ACCESS_LEVEL;
            }).length;

        const pending =
            records.filter(record => {
                return record.dataset.pending === "true";
            }).length;


        if (countRecords) {
            countRecords.textContent =
                formatNumber(total);
        }

        if (countDocuments) {
            countDocuments.textContent =
                formatNumber(documents);
        }

        if (countRestricted) {
            countRestricted.textContent =
                formatNumber(restricted);
        }

        if (countPending) {
            countPending.textContent =
                formatNumber(pending);
        }

    }


    /* ========================================================
       FILTRAR
    ======================================================== */

    function filterRecords() {

        const query =
            searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";


        let visible = 0;


        records.forEach(record => {

            const type =
                record.dataset.type || "otros";

            const search =
                record.dataset.search
                    ? record.dataset.search.toLowerCase()
                    : record.textContent.toLowerCase();


            const matchesFilter =
                currentFilter === "all" ||
                type === currentFilter;


            const matchesSearch =
                !query ||
                search.includes(query);


            const visibleRecord =
                matchesFilter &&
                matchesSearch;


            record.classList.toggle(
                "is-hidden",
                !visibleRecord
            );


            if (visibleRecord) {
                visible++;
            }

        });


        if (resultCount) {

            resultCount.textContent =
                `${formatNumber(visible)} ${
                    visible === 1
                        ? "REGISTRO"
                        : "REGISTROS"
                }`;

        }


        if (emptyState) {

            emptyState.classList.toggle(
                "is-visible",
                visible === 0
            );

        }

    }


    /* ========================================================
       BOTONES DE FILTRO
    ======================================================== */

    filters.forEach(button => {

        button.addEventListener("click", () => {

            currentFilter =
                button.dataset.filter || "all";


            filters.forEach(filter => {

                filter.classList.toggle(
                    "active",
                    filter === button
                );

            });


            filterRecords();

        });

    });


    /* ========================================================
       BUSCADOR
    ======================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterRecords
        );

    }


    /* ========================================================
       ABRIR EXPEDIENTE
    ======================================================== */

    document
        .querySelectorAll(".open-record")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const record =
                        button.closest(".archive-record");

                    if (!record) {
                        return;
                    }


                    openRecord(record);

                }
            );

        });


    function openRecord(record) {

        const code =
            record.querySelector(".archive-code")
                ?.textContent
                .trim() || "SIN CÓDIGO";


        const level =
            record.querySelector(".archive-level")
                ?.textContent
                .trim() || "SIN CLASIFICAR";


        const category =
            record.querySelector(".archive-record-category")
                ?.textContent
                .trim() || "OTROS";


        const title =
            record.querySelector("h3")
                ?.textContent
                .trim() || "Expediente";


        const material =
            record.querySelector(".archive-material")
                ?.textContent
                .trim() || "REGISTRO DOCUMENTAL";


        const fullContent =
            record.querySelector(".archive-full-content");


        /* ================================================
           CONTROL DE ACCESO
        ================================================= */

        const recordAccess =
            Number(record.dataset.access || 1);


        const restricted =
            recordAccess > ACCESS_LEVEL;


        modalCode.textContent =
            code;


        modalLevel.textContent =
            level;


        modalCategory.textContent =
            category;


        modalMaterial.textContent =
            restricted
                ? "ACCESO RESTRINGIDO"
                : material;


        modalTitle.textContent =
            title;


        modalFooterCode.textContent =
            code;


        if (restricted) {

            modalText.innerHTML = `
                <div class="restricted-warning">
                    <span>ACCESO DENEGADO</span>

                    <p>
                        Este expediente requiere un nivel de
                        autorización superior al disponible.
                    </p>

                    <strong>
                        NIVEL REQUERIDO: ${level}
                    </strong>
                </div>
            `;

        } else if (fullContent) {

            modalText.innerHTML =
                fullContent.innerHTML;

        } else {

            modalText.innerHTML = `
                <p class="archive-empty-text">
                    Este expediente no contiene información
                    digitalizada actualmente.
                </p>
            `;

        }


        modal.classList.add("is-open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "archive-modal-open"
        );

    }


    /* ========================================================
       CERRAR EXPEDIENTE
    ======================================================== */

    function closeRecord() {

        modal.classList.remove("is-open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "archive-modal-open"
        );

    }


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeRecord
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (event.target === modal) {
                    closeRecord();
                }

            }
        );

    }


    /* ========================================================
       ESC
    ======================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (
                imageViewer &&
                imageViewer.classList.contains("is-open")
            ) {

                closeViewer();

                return;

            }


            if (
                modal &&
                modal.classList.contains("is-open")
            ) {

                closeRecord();

            }

        }
    );


    /* ========================================================
       VISOR DE IMÁGENES
       ======================================================== */

    const imageViewer =
        document.getElementById("archiveImageViewer");

    const viewerImage =
        document.getElementById("viewerImage");

    const viewerFigure =
        document.getElementById("viewerFigure");

    const viewerCounter =
        document.getElementById("viewerCounter");

    const viewerTitle =
        document.getElementById("viewerTitle");

    const viewerDescription =
        document.getElementById("viewerDescription");

    const viewerClose =
        document.getElementById("archiveViewerClose");

    const viewerPrev =
        document.getElementById("viewerPrev");

    const viewerNext =
        document.getElementById("viewerNext");


    let galleryImages = [];
    let currentImage = 0;


    function setupImageGallery() {

        const images =
            document.querySelectorAll(
                ".archive-image"
            );


        images.forEach(image => {

            image.addEventListener(
                "click",
                () => {

                    galleryImages =
                        [...document.querySelectorAll(
                            ".archive-image"
                        )];

                    currentImage =
                        galleryImages.indexOf(image);

                    openViewer();

                }
            );

        });

    }


    function openViewer() {

        if (!imageViewer || !galleryImages.length) {
            return;
        }


        updateViewer();


        imageViewer.classList.add(
            "is-open"
        );


        imageViewer.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "archive-viewer-open"
        );

    }


    function updateViewer() {

        const figure =
            galleryImages[currentImage];


        if (!figure) {
            return;
        }


        const image =
            figure.querySelector("img");


        if (!image) {
            return;
        }


        viewerImage.src =
            image.currentSrc ||
            image.src;


        viewerImage.alt =
            image.alt || "";


        const title =
            figure.dataset.title ||
            `Figura ${String(currentImage + 1).padStart(2, "0")}`;


        const description =
            figure.dataset.description ||
            figure.querySelector("figcaption")
                ?.textContent
                .trim() ||
            "";


        viewerFigure.textContent =
            `FIGURA ${String(currentImage + 1).padStart(2, "0")}`;


        viewerCounter.textContent =
            `${String(currentImage + 1).padStart(2, "0")} / ${String(galleryImages.length).padStart(2, "0")}`;


        viewerTitle.textContent =
            title;


        viewerDescription.textContent =
            description;


        viewerPrev.disabled =
            currentImage === 0;


        viewerNext.disabled =
            currentImage === galleryImages.length - 1;

    }


    function closeViewer() {

        if (!imageViewer) {
            return;
        }


        imageViewer.classList.remove(
            "is-open"
        );


        imageViewer.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "archive-viewer-open"
        );


        viewerImage.src = "";

    }


    if (viewerClose) {

        viewerClose.addEventListener(
            "click",
            closeViewer
        );

    }


    if (viewerPrev) {

        viewerPrev.addEventListener(
            "click",
            () => {

                if (currentImage > 0) {

                    currentImage--;

                    updateViewer();

                }

            }
        );

    }


    if (viewerNext) {

        viewerNext.addEventListener(
            "click",
            () => {

                if (
                    currentImage <
                    galleryImages.length - 1
                ) {

                    currentImage++;

                    updateViewer();

                }

            }
        );

    }


    if (imageViewer) {

        imageViewer.addEventListener(
            "click",
            event => {

                if (event.target === imageViewer) {
                    closeViewer();
                }

            }
        );

    }


    /* ========================================================
       INICIALIZACIÓN
    ======================================================== */

    updateCounters();

    filterRecords();

    setupImageGallery();


    /* ========================================================
       UTILIDADES
    ======================================================== */

    function formatNumber(number) {

        return String(number)
            .padStart(2, "0");

    }


    function toRoman(number) {

        const values = [
            [3, "III"],
            [2, "II"],
            [1, "I"]
        ];


        for (const [value, roman] of values) {

            if (number === value) {
                return roman;
            }

        }


        return String(number);

    }

    

});