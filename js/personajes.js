/* =========================================================
   PERSONAJES · EXPEDIENTES, BÚSQUEDA Y FILTROS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // 1. ELEMENTOS
    // =====================================================

    const characterCards = [
        ...document.querySelectorAll(".character-card")
    ];

    const characterSearch = document.getElementById("search");
    const characterCount = document.getElementById("count");

    const filterButtons = [
        ...document.querySelectorAll(".archive-filter")
    ];

    const characterGrid = document.getElementById("characters");

    if (!characterCards.length) {
        return;
    }

    let activeFilter = "all";


    // =====================================================
    // 2. NORMALIZAR TEXTO
    // =====================================================
    // Ignora mayúsculas y tildes.

    function normalizeText(text) {
        return (text || "")
            .toLocaleLowerCase("es")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }


    // =====================================================
    // 3. PREPARAR LAS TARJETAS
    // =====================================================

    characterCards.forEach(card => {

        const name =
            card.querySelector("h3")?.textContent.trim()
            || card.dataset.id
            || "Personaje";

        const description =
            card.querySelector(".character-description")
                ?.textContent || "";

        // Obtener todas las categorías de data-type.
        // Ejemplo: "bastion soma".
        const types = normalizeText(card.dataset.type)
            .split(/\s+/)
            .filter(Boolean);

        card.dataset.types = types.join(" ");

        // Preparar el contenido que utilizará la búsqueda.
        card.dataset.searchIndex = normalizeText([
            card.dataset.search || "",
            name,
            description,
            card.dataset.id || "",
            types.join(" ")
        ].join(" "));

        // Hacer que la tarjeta pueda usarse con teclado.
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "link");
        card.setAttribute("aria-label", `Abrir expediente de ${name}`);

        // Abrir el expediente al hacer clic.
        card.addEventListener("click", event => {

            // No interceptar enlaces ni controles internos.
            if (
                event.target.closest(
                    "a, button, input, select, textarea"
                )
            ) {
                return;
            }

            openCharacter(card);
        });

        // Abrir el expediente con Enter o Espacio.
        card.addEventListener("keydown", event => {

            if (event.target !== card) {
                return;
            }

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openCharacter(card);
            }
        });

    });


    // =====================================================
    // 4. ABRIR EXPEDIENTES
    // =====================================================

    function openCharacter(card) {

        const id = card.dataset.id;

        if (!id) {
            return;
        }

        window.location.href =
            `expediente.html?personaje=${encodeURIComponent(id)}`;
    }


    // =====================================================
    // 5. MENSAJE CUANDO NO HAY RESULTADOS
    // =====================================================

    let emptyMessage = document.getElementById(
        "characterEmptyMessage"
    );

    if (!emptyMessage && characterGrid) {

        emptyMessage = document.createElement("p");

        emptyMessage.id = "characterEmptyMessage";
        emptyMessage.className = "character-empty";
        emptyMessage.setAttribute("role", "status");
        emptyMessage.textContent =
            "No se han encontrado personajes con esos criterios.";

        emptyMessage.hidden = true;

        characterGrid.appendChild(emptyMessage);
    }


    // =====================================================
    // 6. ACTUALIZAR FILTROS Y BÚSQUEDA
    // =====================================================

    function refreshCharacters() {

        const query = normalizeText(
            characterSearch?.value || ""
        );

        // Separar la búsqueda en palabras.
        // Todas deben aparecer en los datos del personaje.
        const searchTerms = query
            .split(/\s+/)
            .filter(Boolean);

        let visible = 0;

        characterCards.forEach(card => {

            const searchIndex = card.dataset.searchIndex || "";

            const types = (card.dataset.types || "")
                .split(/\s+/)
                .filter(Boolean);

            // Comprobar la organización seleccionada.
            const matchesFilter =
                activeFilter === "all"
                || types.includes(activeFilter);

            // Comprobar todas las palabras buscadas.
            const matchesSearch = searchTerms.every(term =>
                searchIndex.includes(term)
            );

            const matches = matchesFilter && matchesSearch;

            // Usar hidden y display para evitar conflictos
            // con posibles estilos generales de las tarjetas.
            card.hidden = !matches;
            card.style.display = matches ? "" : "none";

            if (matches) {
                visible++;
            }
        });

        // Actualizar contador.
        if (characterCount) {
            characterCount.textContent =
                `${visible} personaje${visible === 1 ? "" : "s"}`;
        }

        // Mostrar u ocultar el mensaje de resultados vacíos.
        if (emptyMessage) {
            emptyMessage.hidden = visible !== 0;
        }
    }


    // =====================================================
    // 7. EVENTOS DE LOS FILTROS
    // =====================================================

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            activeFilter = normalizeText(
                button.dataset.filter || "all"
            );

            // Actualizar apariencia y accesibilidad.
            filterButtons.forEach(filterButton => {

                const isActive = filterButton === button;

                filterButton.classList.toggle("active", isActive);

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            refreshCharacters();
        });
    });


    // =====================================================
    // 8. EVENTO DE BÚSQUEDA
    // =====================================================

    if (characterSearch) {
        characterSearch.addEventListener(
            "input",
            refreshCharacters
        );
    }


    // =====================================================
    // 9. INICIALIZACIÓN
    // =====================================================

    refreshCharacters();

    // Ejecutar la animación solo si está disponible.
    if (typeof animateItems === "function") {
        animateItems(characterCards);
    }

});
