(() => {
  const entries = [...document.querySelectorAll(".lugar-ficha")];
  if (!entries.length) return;

  const slugify = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const places = new Map();
  entries.forEach((entry) => {
    const title = entry.querySelector(".ficha-titulo")?.textContent.trim();
    if (!title) return;
    const slug = slugify(title);
    entry.dataset.placeSlug = slug;
    places.set(slug, entry);
  });

  const modal = document.createElement("section");
  modal.className = "geo-record";
  modal.id = "geoRecord";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <article class="geo-record-window" role="dialog" aria-modal="true" aria-labelledby="geoRecordTitle" tabindex="-1">
      <button class="geo-record-close" type="button" aria-label="Cerrar registro">×</button>
      <header class="geo-record-heading">
        <span class="geo-record-kicker">REGISTRO TERRITORIAL · LUNATERRA</span>
        <h2 id="geoRecordTitle"></h2>
        <p class="geo-record-type"></p>
      </header>
      <div class="geo-record-body"></div>
      <footer class="geo-record-footer">
        <span class="geo-record-count"></span>
        <a class="geo-record-link" href="#">Enlace permanente ↗</a>
      </footer>
    </article>
  `;

  const viewer = document.createElement("section");
  viewer.className = "geo-viewer";
  viewer.id = "geoViewer";
  viewer.setAttribute("aria-hidden", "true");
  viewer.innerHTML = `
    <div class="geo-viewer-window" role="dialog" aria-modal="true" aria-label="Galería de imágenes" tabindex="-1">
      <button class="geo-viewer-close" type="button" aria-label="Cerrar imagen">×</button>
      <div class="geo-viewer-image-area">
        <button class="geo-viewer-nav geo-viewer-prev" type="button" aria-label="Imagen anterior">‹</button>
        <img class="geo-viewer-image" alt="">
        <button class="geo-viewer-nav geo-viewer-next" type="button" aria-label="Imagen siguiente">›</button>
      </div>
      <footer class="geo-viewer-caption"><span></span><span></span></footer>
    </div>
  `;

  document.body.append(modal, viewer);

  const pageLayers = () => [...document.body.children].filter((element) => element !== modal && element !== viewer);
  const syncOverlayAccessibility = () => {
    const hasOverlay = modal.classList.contains("is-open") || viewer.classList.contains("is-open");
    pageLayers().forEach((element) => {
      element.inert = hasOverlay;
      element.setAttribute("aria-hidden", String(hasOverlay));
    });
  };
  const trapFocus = (event, container) => {
    if (event.key !== "Tab") return;
    const focusable = [...container.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.hidden && element.getClientRects().length);
    if (!focusable.length) {
      event.preventDefault();
      container.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const titleNode = modal.querySelector("#geoRecordTitle");
  const typeNode = modal.querySelector(".geo-record-type");
  const bodyNode = modal.querySelector(".geo-record-body");
  const countNode = modal.querySelector(".geo-record-count");
  const permalink = modal.querySelector(".geo-record-link");
  const modalWindow = modal.querySelector(".geo-record-window");
  const viewerWindow = viewer.querySelector(".geo-viewer-window");
  const viewerImage = viewer.querySelector(".geo-viewer-image");
  const viewerCaption = viewer.querySelector(".geo-viewer-caption");
  const previousButton = viewer.querySelector(".geo-viewer-prev");
  const nextButton = viewer.querySelector(".geo-viewer-next");
  let activeEntry = null;
  let activeImages = [];
  let activeImageIndex = 0;
  let previousFocus = null;
  let returnToModal = false;

  const currentUrlFor = (slug) => {
    const url = new URL(window.location.href);
    url.searchParams.set("lugar", slug);
    return url.href;
  };

  function navigateHistory(url, state = {}) {
    try {
      window.history.pushState(state, "", url);
      return true;
    } catch {
      // En algunos navegadores, file:// no permite modificar el historial.
      window.location.assign(url);
      return false;
    }
  }

  function openPlace(entry, { updateHistory = true, trigger = null } = {}) {
    if (!entry) return;
    activeEntry = entry;
    previousFocus = trigger || document.activeElement;
    const title = entry.querySelector(".ficha-titulo")?.textContent.trim() || "Lugar";
    titleNode.textContent = title;
    typeNode.textContent = entry.querySelector(".ficha-tipo")?.textContent.trim() || "Registro de Lunaterra";
    bodyNode.replaceChildren(entry.querySelector(".ficha-contenido")?.cloneNode(true) || document.createElement("div"));
    activeImages = [...bodyNode.querySelectorAll("img")];
    activeImages.forEach((image, index) => {
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", `Ampliar imagen ${index + 1} de ${title}`);
      image.closest(".lugar-imagen, .lugar-galeria")?.classList.add("geo-record-image-group");
    });
    countNode.textContent = activeImages.length
      ? `${String(activeImages.length).padStart(2, "0")} IMÁGENES REGISTRADAS`
      : "SIN MATERIAL VISUAL REGISTRADO";
    const slug = entry.dataset.placeSlug;
    permalink.href = currentUrlFor(slug);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("geo-record-open");
    syncOverlayAccessibility();
    if (updateHistory) navigateHistory(permalink.href, { geoPlace: slug });
    modalWindow.focus();
  }

  function closePlace({ updateHistory = true, restoreFocus = true } = {}) {
    if (!modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("geo-record-open");
    syncOverlayAccessibility();
    bodyNode.replaceChildren();
    activeEntry = null;
    activeImages = [];
    if (updateHistory && new URLSearchParams(location.search).has("lugar")) {
      const url = new URL(location.href);
      url.searchParams.delete("lugar");
      navigateHistory(url.href);
    }
    if (restoreFocus) previousFocus?.focus?.();
  }

  function showImage(index) {
    if (!activeImages.length) return;
    activeImageIndex = (index + activeImages.length) % activeImages.length;
    const source = activeImages[activeImageIndex];
    viewerImage.src = source.currentSrc || source.src;
    viewerImage.alt = source.alt || titleNode.textContent;
    viewerCaption.firstElementChild.textContent = source.alt || titleNode.textContent;
    viewerCaption.lastElementChild.textContent = `${String(activeImageIndex + 1).padStart(2, "0")} / ${String(activeImages.length).padStart(2, "0")}`;
    previousButton.disabled = activeImages.length < 2;
    nextButton.disabled = activeImages.length < 2;
  }

  function openViewer(index) {
    if (!activeImages.length) return;
    returnToModal = true;
    showImage(index);
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("geo-viewer-open");
    syncOverlayAccessibility();
    viewer.querySelector(".geo-viewer-close").focus();
  }

  function closeViewer() {
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("geo-viewer-open");
    viewerImage.removeAttribute("src");
    syncOverlayAccessibility();
    if (returnToModal) modalWindow.focus();
  }

  entries.forEach((entry) => {
    entry.open = false;
    entry.querySelector("summary")?.addEventListener("click", (event) => {
      event.preventDefault();
      openPlace(entry, { trigger: event.currentTarget });
    });
  });

  modal.querySelector(".geo-record-close").addEventListener("click", () => closePlace());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closePlace();
  });
  bodyNode.addEventListener("click", (event) => {
    const image = event.target.closest("img[role='button']");
    if (image) openViewer(activeImages.indexOf(image));
  });
  bodyNode.addEventListener("keydown", (event) => {
    const image = event.target.closest("img[role='button']");
    if (image && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openViewer(activeImages.indexOf(image));
    }
  });

  viewer.querySelector(".geo-viewer-close").addEventListener("click", closeViewer);
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) closeViewer();
  });
  previousButton.addEventListener("click", () => showImage(activeImageIndex - 1));
  nextButton.addEventListener("click", () => showImage(activeImageIndex + 1));

  window.addEventListener("keydown", (event) => {
    if (viewer.classList.contains("is-open")) {
      trapFocus(event, viewerWindow);
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") showImage(activeImageIndex - 1);
      if (event.key === "ArrowRight") showImage(activeImageIndex + 1);
      return;
    }
    if (modal.classList.contains("is-open")) {
      trapFocus(event, modalWindow);
      if (event.key === "Escape") closePlace();
    }
  });

  window.addEventListener("popstate", () => {
    const slug = new URLSearchParams(location.search).get("lugar");
    if (slug && places.has(slug)) openPlace(places.get(slug), { updateHistory: false, trigger: null });
    else {
      if (viewer.classList.contains("is-open")) closeViewer();
      closePlace({ updateHistory: false, restoreFocus: false });
    }
  });

  const requestedSlug = new URLSearchParams(location.search).get("lugar");
  if (requestedSlug && places.has(requestedSlug)) {
    openPlace(places.get(requestedSlug), { updateHistory: false, trigger: null });
  }
})();
