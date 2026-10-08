/* =========================================================
   PERSONAJES · EXPEDIENTES Y BÚSQUEDA
   ========================================================= */
const characterCards = [...document.querySelectorAll(".character-card")];
const characterSearch = document.getElementById("search");
const characterCount = document.getElementById("count");

characterCards.forEach(card => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    const openCharacter = () => {
        const id = card.dataset.id;
        if (!id) return;
        window.location.href = `expediente.html?personaje=${encodeURIComponent(id)}`;
    };

    card.addEventListener("click", openCharacter);

    card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openCharacter();
        }
    });
});

function refreshCharacters() {
    const query = characterSearch
        ? characterSearch.value.toLowerCase().trim()
        : "";

    let visible = 0;

    characterCards.forEach(card => {
        const text = (card.dataset.search || "").toLowerCase();
        const matches = !query || text.includes(query);

        card.style.display = matches ? "" : "none";

        if (matches) visible++;
    });

    if (characterCount) {
        characterCount.textContent =
            `${visible} personaje${visible === 1 ? "" : "s"}`;
    }
}

if (characterSearch) {
    characterSearch.addEventListener("input", refreshCharacters);
}

if (characterCards.length) {
    refreshCharacters();
    animateItems(characterCards);
}