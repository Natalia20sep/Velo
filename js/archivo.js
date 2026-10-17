/* VELO · ARCHIVO CENTRAL */
document.addEventListener("DOMContentLoaded", () => {
  const ACCESS_LEVEL = 2;
  const catalog = Array.isArray(window.VELO_ARCHIVE_RECORDS)
    ? window.VELO_ARCHIVE_RECORDS
    : [];
  const list = document.getElementById("archiveList");
  const searchInput = document.getElementById("archiveSearch");
  const filters = [...document.querySelectorAll(".archive-filter")];
  const resultCount = document.getElementById("archiveResultCount");
  const emptyState = document.getElementById("archiveEmpty");
  const modal = document.getElementById("archiveModal");
  const modalClose = document.getElementById("archiveClose");
  const modalCode = document.getElementById("modalCode");
  const modalLevel = document.getElementById("modalLevel");
  const modalCategory = document.getElementById("modalCategory");
  const modalMaterial = document.getElementById("modalMaterial");
  const modalTitle = document.getElementById("archiveModalTitle");
  const modalSummary = document.getElementById("archiveModalSummary");
  const modalAnalysis = document.getElementById("archiveModalAnalysis");
  const descriptionSection = document.getElementById("archiveModalDescriptionSection");
  const findingsSection = document.getElementById("archiveModalFindingsSection");
  const modalFindings = document.getElementById("archiveModalFindings");
  const hypothesisSection = document.getElementById("archiveModalHypothesisSection");
  const modalHypothesisText = document.getElementById("archiveModalHypothesisText");
  const relatedSection = document.getElementById("archiveModalRelatedSection");
  const modalRelated = document.getElementById("archiveModalRelated");
  const modalCharacters = document.getElementById("archiveModalCharacters");
  const recordsByCode = new Map(catalog.map((item) => [item.code, item]));
  const modalText = document.getElementById("archiveDocumentText");
  const modalFooterCode = document.getElementById("modalFooterCode");
  const imageViewer = document.getElementById("archiveImageViewer");
  const viewerImage = document.getElementById("viewerImage");
  const viewerFigure = document.getElementById("viewerFigure");
  const viewerCounter = document.getElementById("viewerCounter");
  const viewerTitle = document.getElementById("viewerTitle");
  const viewerDescription = document.getElementById("viewerDescription");
  const viewerClose = document.getElementById("archiveViewerClose");
  const viewerPrev = document.getElementById("viewerPrev");
  const viewerNext = document.getElementById("viewerNext");

  let currentFilter = "all";
  let activeRecord = null;
  let returnFocus = null;
  let galleryImages = [];
  let currentImage = 0;

  const roman = (n) => ({ 1: "I", 2: "II", 3: "III" })[n] || String(n);
  const pad = (n) => String(n).padStart(2, "0");
  const escapeHtml = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );

  function renderRecords() {
    if (!list) return;
    const fragment = document.createDocumentFragment();
    catalog.forEach((record, index) => {
      const article = document.createElement("article");
      article.className = "archive-record";
      article.dataset.type = record.type || "otros";
      article.dataset.access = String(record.accessLevel || 1);
      article.dataset.pending = String(Boolean(record.pending));
      const searchable = [
        record.code,
        record.category,
        record.title,
        record.summary,
        record.keywords,
        ...(Array.isArray(record.findings) ? record.findings : []),
        record.hypothesis,
        ...(Array.isArray(record.relatedRecords)
          ? record.relatedRecords.flatMap((link) => [link.code, link.note])
          : []),
        ...(Array.isArray(record.characterRefs)
          ? record.characterRefs.map((character) => character.name)
          : []),
        textFromHtml(record.contentHtml),
      ]
        .join(" ")
        .toLocaleLowerCase("es");
      article.dataset.search = searchable;
      article.innerHTML = `
                <div class="archive-record-top">
                    <span class="archive-code">${escapeHtml(record.code || "SIN CÓDIGO")}</span>
                    <span class="archive-level">ACCESO ${roman(Number(record.accessLevel) || 1)}</span>
                </div>
                <div class="archive-record-content">
                    <div class="archive-record-info">
                        <div class="archive-record-category">${escapeHtml(record.category || "OTROS")}</div>
                        <h3>${escapeHtml(record.title || "Expediente sin título")}</h3>
                        <p>${escapeHtml(record.summary || "Resumen pendiente de redactar.")}</p>
                    </div>
                    <div class="archive-record-footer">
                        <span class="archive-material">${escapeHtml(record.material || "REGISTRO DOCUMENTAL")}</span>
                        <button type="button" class="open-record" aria-label="Consultar ${escapeHtml(record.title || record.code)}">Consultar <span aria-hidden="true">→</span></button>
                    </div>
                </div>`;
      article.dataset.recordIndex = String(index);
      fragment.append(article);
    });
    list.replaceChildren(fragment);
  }

  function textFromHtml(markup) {
    const holder = document.createElement("div");
    holder.innerHTML = markup || "";
    return holder.textContent || "";
  }

  function filterRecords() {
    const query = (searchInput?.value || "").trim().toLocaleLowerCase("es");
    let visible = 0;
    list?.querySelectorAll(".archive-record").forEach((card) => {
      const show =
        (currentFilter === "all" || card.dataset.type === currentFilter) &&
        (!query || (card.dataset.search || "").includes(query));
      card.classList.toggle("is-hidden", !show);
      visible += show ? 1 : 0;
    });
    if (resultCount)
      resultCount.textContent = `${pad(visible)} ${visible === 1 ? "REGISTRO" : "REGISTROS"}`;
    if (emptyState) emptyState.hidden = visible !== 0;
  }

  filters.forEach((button) =>
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter || "all";
      filters.forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle("active", active);
        filter.setAttribute("aria-pressed", String(active));
      });
      filterRecords();
    }),
  );
  searchInput?.addEventListener("input", filterRecords);

  function openRecord(record, trigger) {
    if (!modal || !record) return;
    activeRecord = record;
    returnFocus = trigger || document.activeElement;
    const restricted = Number(record.accessLevel || 1) > ACCESS_LEVEL;
    modalCode.textContent = record.code || "SIN CÓDIGO";
    modalLevel.textContent = `ACCESO ${roman(Number(record.accessLevel) || 1)}`;
    modalCategory.textContent = record.category || "OTROS";
    modalMaterial.textContent = restricted
      ? "ACCESO RESTRINGIDO"
      : record.material || "REGISTRO DOCUMENTAL";
    modalTitle.textContent = record.title || "Expediente";
    const summary = (record.summary || "").trim();
    modalSummary.textContent = summary;
    descriptionSection.hidden = !summary;
    const findings = Array.isArray(record.findings) ? record.findings : [];
    const hypothesis = (record.hypothesis || "").trim();
    const relatedRecords = Array.isArray(record.relatedRecords)
      ? record.relatedRecords
      : [];

    modalFindings.replaceChildren(
      ...findings.map((finding) => {
        const item = document.createElement("li");
        item.textContent = finding;
        return item;
      }),
    );
    findingsSection.hidden = findings.length === 0;
    modalHypothesisText.textContent = hypothesis;
    hypothesisSection.hidden = !hypothesis;
    modalRelated.replaceChildren(
      ...relatedRecords
        .filter((link) => recordsByCode.has(link.code))
        .map((link) => {
          const target = recordsByCode.get(link.code);
          const button = document.createElement("button");
          button.type = "button";
          button.className = "archive-related-link";
          button.dataset.relatedCode = target.code;
          const title = document.createElement("span");
          title.textContent = `${target.code} · ${target.title}`;
          const note = document.createElement("small");
          note.textContent = link.note || "Abrir expediente relacionado";
          button.append(title, note);
          return button;
        }),
    );
    const characterRefs = (Array.isArray(record.characterRefs)
      ? record.characterRefs
      : []
    ).filter((character) => character.id && character.name);
    modalCharacters.replaceChildren();
    if (characterRefs.length) {
      const heading = document.createElement("h4");
      heading.textContent = "Personajes citados";
      modalCharacters.append(heading);
      characterRefs.forEach((character) => {
        const link = document.createElement("a");
        link.className = "archive-character-link";
        link.href = `../personajes/expedientes/expediente.html?personaje=${encodeURIComponent(character.id)}`;
        link.textContent = `${character.name} ↗`;
        modalCharacters.append(link);
      });
    }
    relatedSection.hidden =
      modalRelated.childElementCount === 0 && modalCharacters.childElementCount === 0;
    modalAnalysis.hidden =
      !summary &&
      findings.length === 0 &&
      !hypothesis &&
      modalRelated.childElementCount === 0 &&
      modalCharacters.childElementCount === 0;
    modalFooterCode.textContent = record.code || "AC-01";
    if (restricted) {
      modalText.innerHTML = `<div class="restricted-warning"><span>ACCESO DENEGADO</span><p>Este expediente requiere un nivel de autorización superior al disponible.</p><strong>NIVEL REQUERIDO: ${escapeHtml(modalLevel.textContent)}</strong></div>`;
    } else {
      modalText.innerHTML =
        record.contentHtml ||
        '<p class="archive-empty-text">Este expediente no contiene información digitalizada actualmente.</p>';
      modalText.querySelectorAll(".archive-image").forEach((figure, index) => {
        figure.tabIndex = 0;
        figure.setAttribute("role", "button");
        figure.setAttribute(
          "aria-label",
          `Ampliar imagen ${index + 1} de ${record.title || record.code}`,
        );
      });
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("archive-modal-open");
    modalClose?.focus();
  }

  function closeRecord() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("archive-modal-open");
    modalText.replaceChildren();
    activeRecord = null;
    returnFocus?.focus?.();
  }

  list?.addEventListener("click", (event) => {
    const button = event.target.closest(".open-record");
    if (!button) return;
    const card = button.closest(".archive-record");
    const record = catalog[Number(card?.dataset.recordIndex)];
    openRecord(record, button);
  });
  modalRelated?.addEventListener("click", (event) => {
    const button = event.target.closest(".archive-related-link");
    if (!button) return;
    const related = recordsByCode.get(button.dataset.relatedCode);
    if (related) openRecord(related, returnFocus);
  });
  modalClose?.addEventListener("click", closeRecord);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeRecord();
  });

  function openViewer(figure) {
    if (!imageViewer) return;
    galleryImages = [...modalText.querySelectorAll(".archive-image")];
    currentImage = galleryImages.indexOf(figure);
    if (currentImage < 0) return;
    updateViewer();
    imageViewer.classList.add("is-open");
    imageViewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("archive-viewer-open");
    viewerClose?.focus();
  }
  modalText?.addEventListener("click", (event) => {
    const figure = event.target.closest(".archive-image");
    if (figure) openViewer(figure);
  });
  modalText?.addEventListener("keydown", (event) => {
    const figure = event.target.closest(".archive-image");
    if (figure && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openViewer(figure);
    }
  });

  function updateViewer() {
    const figure = galleryImages[currentImage];
    const image = figure?.querySelector("img");
    if (!image || !viewerImage) return;
    viewerImage.src = image.currentSrc || image.src;
    viewerImage.alt = image.alt || "";
    viewerFigure.textContent = `FIGURA ${pad(currentImage + 1)}`;
    viewerCounter.textContent = `${pad(currentImage + 1)} / ${pad(galleryImages.length)}`;
    viewerTitle.textContent =
      figure.dataset.title ||
      image.alt ||
      activeRecord?.title ||
      "Registro fotográfico";
    viewerDescription.textContent =
      figure.dataset.description ||
      figure.querySelector("figcaption")?.textContent.trim() ||
      "";
    if (viewerPrev) viewerPrev.disabled = currentImage === 0;
    if (viewerNext)
      viewerNext.disabled = currentImage >= galleryImages.length - 1;
  }
  function closeViewer() {
    if (!imageViewer) return;
    imageViewer.classList.remove("is-open");
    imageViewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("archive-viewer-open");
    if (viewerImage) viewerImage.src = "";
    galleryImages[currentImage]?.focus?.();
  }
  viewerClose?.addEventListener("click", closeViewer);
  viewerPrev?.addEventListener("click", () => {
    if (currentImage > 0) {
      currentImage--;
      updateViewer();
    }
  });
  viewerNext?.addEventListener("click", () => {
    if (currentImage < galleryImages.length - 1) {
      currentImage++;
      updateViewer();
    }
  });
  imageViewer?.addEventListener("click", (event) => {
    if (event.target === imageViewer) closeViewer();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (imageViewer?.classList.contains("is-open")) closeViewer();
    else if (modal?.classList.contains("is-open")) closeRecord();
  });

  renderRecords();
  filterRecords();
});
