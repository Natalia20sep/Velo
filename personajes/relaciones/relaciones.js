(() => {
  "use strict";

  const data = window.VELO_RELATIONS_DATA;
  if (!data) return;

  const people = new Map(data.people.map((person) => [person.id, person]));
  const svg = document.getElementById("relations-graph");
  const graphCanvas = document.getElementById("graph-canvas");
  const detailPanel = document.getElementById("relations-detail");
  const detailEmpty = document.getElementById("detail-empty");
  const detailContent = document.getElementById("detail-content");
  const searchInput = document.getElementById("relations-search");
  const categoryFilter = document.getElementById("filter-category");
  const stateFilter = document.getElementById("filter-state");
  const deceasedFilter = document.getElementById("filter-deceased");
  const filterDetails = document.querySelector(".relations-filters");
  const activeFilterCount = document.getElementById("active-filter-count");
  const selectionStatus = document.getElementById("selection-status");
  const clearSelectionButton = document.getElementById("clear-selection");
  const graphEmpty = document.getElementById("graph-empty");
  const ns = "http://www.w3.org/2000/svg";
  const categoryColors = {
    Familia: "#caa96e", Personal: "#a998d6", Profesional: "#8bb1c4",
    Estratégica: "#c88467", Conflicto: "#ba7278"
  };
  const stateLabels = {
    "sin-cierre": "Sin cierre registrado", historico: "Vínculo histórico",
    desarrollo: "En desarrollo", incompleto: "Incompleto", superado: "Superado",
    actual: "Vínculo actual", mixto: "Información de estado mixta"
  };
  let currentView = "graph";
  let selectedPerson = null;
  let selectedRelationship = null;
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let dragStart = null;

  const normalize = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const personName = (id) => people.get(id)?.name || id;
  const node = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const svgNode = (tag, attrs = {}) => {
    const el = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
    return el;
  };
  const matchesCategory = (relationship) => !categoryFilter.value || relationship.categories.includes(categoryFilter.value);
  const matchesState = (relationship) => !stateFilter.value || relationship.state === stateFilter.value;
  const mentionsDeceased = (relationship) => [relationship.a, relationship.b].some((id) => people.get(id)?.life.startsWith("fallecid"));

  function currentResults() {
    const query = normalize(searchInput.value);
    const matchingPeople = new Set(data.people.filter((person) => normalize(`${person.name} ${person.alias}`).includes(query)).map((person) => person.id));
    const relationships = data.relationships.filter((relationship) => {
      const a = people.get(relationship.a);
      const b = people.get(relationship.b);
      const searchable = normalize(`${a?.name} ${a?.alias} ${b?.name} ${b?.alias} ${relationship.type} ${relationship.description} ${relationship.categories.join(" ")}`);
      const queryMatches = !query || searchable.includes(query) || matchingPeople.has(relationship.a) || matchingPeople.has(relationship.b);
      const deceasedMatches = deceasedFilter.checked || !mentionsDeceased(relationship);
      return queryMatches && matchesCategory(relationship) && matchesState(relationship) && deceasedMatches;
    });
    const visibleIds = new Set(relationships.flatMap((relationship) => [relationship.a, relationship.b]));
    let filteredPeople = data.people.filter((person) => {
      if (query) return matchingPeople.has(person.id) || visibleIds.has(person.id);
      if (categoryFilter.value || stateFilter.value || !deceasedFilter.checked) return visibleIds.has(person.id);
      return true;
    });
    if (query && matchingPeople.size && !relationships.length) filteredPeople = data.people.filter((person) => matchingPeople.has(person.id));
    return { relationships, people: filteredPeople, matchingPeople, query };
  }

  function setStats() {
    document.getElementById("stat-people").textContent = String(data.people.length);
    document.getElementById("stat-links").textContent = String(data.relationships.length);
    document.getElementById("stat-events").textContent = String(data.events.length);
  }

  function layoutGraph() {
    const list = data.people;
    const pos = new Map();
    const center = { x: 600, y: 380 };
    list.forEach((person, index) => {
      const angle = index * 2.399963 + .2;
      const radius = 70 + Math.sqrt(index / list.length) * 260;
      pos.set(person.id, { personId: person.id, x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius, fx: 0, fy: 0 });
    });

    for (let iteration = 0; iteration < 320; iteration += 1) {
      const cooling = 1 - iteration / 380;
      const values = [...pos.values()];
      for (let i = 0; i < values.length; i += 1) {
        for (let j = i + 1; j < values.length; j += 1) {
          const a = values[i]; const b = values[j];
          let dx = a.x - b.x; let dy = a.y - b.y;
          const distanceSquared = Math.max(dx * dx + dy * dy, 30);
          const distance = Math.sqrt(distanceSquared);
          const labelClearance = 116 + Math.min(42, Math.max(0, Math.max(people.get(a.personId).name.length, people.get(b.personId).name.length) - 8) * 3.2);
          const collisionForce = Math.max(0, labelClearance - distance) * .045;
          const force = Math.min(3.2, 5200 / distanceSquared) + collisionForce;
          dx = (dx / distance) * force; dy = (dy / distance) * force;
          a.fx += dx; a.fy += dy; b.fx -= dx; b.fy -= dy;
        }
      }
      for (const relationship of data.relationships) {
        const a = pos.get(relationship.a); const b = pos.get(relationship.b);
        if (!a || !b) continue;
        const dx = b.x - a.x; const dy = b.y - a.y;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        const force = Math.max(-1.8, Math.min(1.8, (distance - 190) * .003));
        a.fx += (dx / distance) * force; a.fy += (dy / distance) * force;
        b.fx -= (dx / distance) * force; b.fy -= (dy / distance) * force;
      }
      for (const point of pos.values()) {
        point.fx += (center.x - point.x) * .002;
        point.fy += (center.y - point.y) * .002;
        const step = Math.min(4, cooling * 4);
        point.x += Math.max(-step, Math.min(step, point.fx));
        point.y += Math.max(-step, Math.min(step, point.fy));
        point.x = Math.max(52, Math.min(1148, point.x));
        point.y = Math.max(55, Math.min(705, point.y));
        point.fx = 0; point.fy = 0;
      }
    }
    return pos;
  }

  const positions = layoutGraph();

  function personProfileLink(person) {
    const link = node("a", "detail-dossier", "Ver personaje →");
    link.href = person.dossier;
    return link;
  }

  function setDetailHeading(container, person, eyebrow) {
    const head = node("div", "detail-person-head");
    const portrait = node("img", "detail-portrait");
    portrait.src = person.portrait;
    portrait.alt = `Retrato de ${person.name}`;
    portrait.onerror = () => { portrait.hidden = true; };
    head.append(portrait);
    const title = node("div", "detail-title");
    title.append(node("span", "detail-eyebrow", eyebrow), node("h2", "", person.name));
    if (person.alias) title.append(node("p", "detail-alias", `También conocido/a como ${person.alias}`));
    if (person.life.startsWith("fallecid")) title.append(node("span", "life-state", person.life === "fallecida" ? "Fallecida" : "Fallecido"));
    head.append(title);
    container.append(head);
    container.append(personProfileLink(person));
  }

  function addSectionTitle(container, text) {
    container.append(node("h3", "detail-section-title", text));
  }

  function makeRelationshipCard(relationship, otherId) {
    const other = people.get(otherId);
    const card = node("article", "detail-link-card");
    const top = node("div", "detail-link-top");
    const identity = node("div", "detail-related-person");
    if (other) {
      const portrait = node("img", "detail-related-portrait");
      portrait.src = other.portrait;
      portrait.alt = `Retrato de ${other.name}`;
      portrait.loading = "lazy";
      portrait.onerror = () => { portrait.hidden = true; };
      identity.append(portrait);
    }
    identity.append(node("strong", "", other?.name || otherId));
    top.append(identity);
    if (other) {
      const profile = node("a", "mini-profile-link", "Ver personaje →");
      profile.href = other.dossier;
      profile.setAttribute("aria-label", `Ver personaje: ${other.name}`);
      top.append(profile);
    }
    card.append(top);
    const tags = node("div", "detail-tags");
    relationship.categories.forEach((category) => tags.append(node("span", `relation-tag tag-${normalize(category)}`, category)));
    card.append(tags, node("p", "detail-link-type", relationship.type), node("p", "detail-link-description", relationship.description));
    card.append(node("span", "detail-status", stateLabels[relationship.state] || "Estado no especificado"));
    if (relationship.reciprocity) card.append(node("p", "detail-reciprocity", `Reciprocidad: ${relationship.reciprocity.replaceAll("-", " ")}.`));
    return card;
  }

  function showPerson(personId) {
    const person = people.get(personId);
    if (!person) return;
    selectedPerson = personId;
    selectedRelationship = null;
    detailEmpty.hidden = true;
    detailContent.hidden = false;
    detailPanel.scrollTop = 0;
    detailPanel.setAttribute("aria-modal", "true");
    detailContent.replaceChildren();
    const close = node("button", "detail-close", "×");
    close.type = "button"; close.setAttribute("aria-label", "Cerrar detalles"); close.addEventListener("click", clearSelection);
    detailContent.append(close);
    setDetailHeading(detailContent, person, "EXPEDIENTE RELACIONAL");

    const links = data.relationships.filter((relationship) => relationship.a === personId || relationship.b === personId);
    detailContent.append(node("p", "detail-summary", `${links.length} ${links.length === 1 ? "vínculo registrado" : "vínculos registrados"}.`));
    if (links.length) {
      addSectionTitle(detailContent, "Vínculos");
      const grid = node("div", "detail-relationship-grid");
      links.forEach((relationship) => {
        const otherId = relationship.a === personId ? relationship.b : relationship.a;
        grid.append(makeRelationshipCard(relationship, otherId));
      });
      detailContent.append(grid);
    } else {
      detailContent.append(node("p", "detail-no-results", "No hay vínculos confirmados en el registro disponible."));
    }

    const mentions = data.externalReferences[personId] || [];
    if (mentions.length) {
      addSectionTitle(detailContent, "Referencias sin expediente");
      mentions.forEach((mention) => {
        const note = node("article", "detail-external-note");
        note.append(node("strong", "", mention.name), node("span", "", mention.type), node("p", "", mention.text));
        detailContent.append(note);
      });
    }
    renderGraph();
  }

  function showRelationship(relationship) {
    if (!relationship) return;
    selectedPerson = null;
    selectedRelationship = relationship.id;
    detailEmpty.hidden = true;
    detailContent.hidden = false;
    detailPanel.scrollTop = 0;
    detailPanel.setAttribute("aria-modal", "true");
    detailContent.replaceChildren();
    const close = node("button", "detail-close", "×");
    close.type = "button"; close.setAttribute("aria-label", "Cerrar detalles"); close.addEventListener("click", clearSelection);
    detailContent.append(close, node("span", "detail-eyebrow", "VÍNCULO REGISTRADO"));
    const duo = node("div", "relationship-duo");
    [relationship.a, relationship.b].forEach((id, index) => {
      const person = people.get(id);
      const personCard = node("div", "relationship-person-card");
      const button = node("button", "relationship-person");
      button.type = "button";
      if (person) {
        const portrait = node("img", "detail-related-portrait");
        portrait.src = person.portrait;
        portrait.alt = `Retrato de ${person.name}`;
        portrait.onerror = () => { portrait.hidden = true; };
        button.append(portrait);
      }
      button.append(node("span", "", person?.name || id));
      button.addEventListener("click", () => showPerson(id));
      personCard.append(button);
      if (person) {
        const profile = node("a", "mini-profile-link", "Ver personaje →");
        profile.href = person.dossier;
        personCard.append(profile);
      }
      duo.append(personCard);
      if (index === 0) duo.append(node("span", "relationship-connector", "—"));
    });
    detailContent.append(duo);
    const tags = node("div", "detail-tags");
    relationship.categories.forEach((category) => tags.append(node("span", `relation-tag tag-${normalize(category)}`, category)));
    detailContent.append(tags, node("h2", "relationship-title", relationship.type), node("p", "relationship-description", relationship.description));
    detailContent.append(node("span", "detail-status", stateLabels[relationship.state] || "Estado no especificado"));
    if (relationship.reciprocity) detailContent.append(node("p", "detail-reciprocity", `Reciprocidad: ${relationship.reciprocity.replaceAll("-", " ")}.`));

    if (relationship.pactId) {
      const pact = data.pacts.find((item) => item.id === relationship.pactId);
      if (pact) {
        addSectionTitle(detailContent, "Pacto asociado");
        const card = node("article", "detail-event-card");
        card.append(node("strong", "", pact.title), node("p", "", pact.conditions), node("span", "detail-status", pact.status));
        detailContent.append(card);
      }
    }
    const events = (relationship.events || []).map((id) => data.events.find((event) => event.id === id)).filter(Boolean);
    if (events.length) {
      addSectionTitle(detailContent, "Acontecimientos asociados");
      events.forEach((event) => {
        const card = node("article", "detail-event-card");
        card.append(node("strong", "", event.title), node("p", "", event.description), node("span", "detail-event-meta", `${event.type} · ${event.time}`));
        detailContent.append(card);
      });
    }
    renderGraph();
  }

  function clearSelection() {
    selectedPerson = null;
    selectedRelationship = null;
    detailContent.hidden = true;
    detailEmpty.hidden = false;
    detailPanel.removeAttribute("aria-modal");
    renderGraph();
  }

  function focusPersonOnGraph(personId) {
    selectedPerson = selectedPerson === personId ? null : personId;
    selectedRelationship = null;
    detailContent.hidden = true;
    detailEmpty.hidden = false;
    detailPanel.removeAttribute("aria-modal");
    renderGraph();
  }

  function focusRelationshipOnGraph(relationship) {
    const alreadyFocused = selectedRelationship === relationship.id;
    selectedPerson = null;
    selectedRelationship = alreadyFocused ? null : relationship.id;
    detailContent.hidden = true;
    detailEmpty.hidden = false;
    detailPanel.removeAttribute("aria-modal");
    renderGraph();
  }

  function filteredStateForPeople(result) {
    return result.people;
  }

  function renderPeople(result) {
    const container = document.getElementById("people-results");
    container.replaceChildren();
    const peopleList = filteredStateForPeople(result);
    if (!peopleList.length) {
      container.append(node("p", "relations-empty", "No hay personajes que coincidan con esta búsqueda y estos filtros."));
      return;
    }
    peopleList.forEach((person) => {
      const card = node("button", "person-result");
      card.type = "button";
      const portrait = node("img", "person-result-portrait"); portrait.src = person.portrait; portrait.alt = ""; portrait.loading = "lazy";
      portrait.onerror = () => { portrait.hidden = true; };
      const copy = node("span", "person-result-copy");
      copy.append(node("strong", "", person.name));
      const count = data.relationships.filter((relationship) => relationship.a === person.id || relationship.b === person.id).length;
      copy.append(node("small", "", `${count} ${count === 1 ? "vínculo" : "vínculos"}${person.life.startsWith("fallecid") ? " · Fallecido/a" : ""}`));
      card.append(portrait, copy, node("span", "person-result-arrow", "↗"));
      card.addEventListener("click", () => showPerson(person.id));
      container.append(card);
    });
  }

  function renderLinks(result) {
    const container = document.getElementById("link-results");
    container.replaceChildren();
    if (!result.relationships.length) {
      container.append(node("p", "relations-empty", "No hay vínculos que coincidan con esta búsqueda y estos filtros."));
      return;
    }
    result.relationships.forEach((relationship) => {
      const button = node("button", "link-result"); button.type = "button";
      const names = node("span", "link-result-names", `${personName(relationship.a)}  —  ${personName(relationship.b)}`);
      const meta = node("span", "link-result-meta");
      relationship.categories.forEach((category) => meta.append(node("span", `relation-tag tag-${normalize(category)}`, category)));
      const type = node("span", "link-result-type", relationship.type);
      const description = node("span", "link-result-description", relationship.description);
      button.append(names, meta, type, description, node("span", "link-result-arrow", "↗"));
      button.addEventListener("click", () => showRelationship(relationship));
      container.append(button);
    });
  }

  function updateFeedback(result) {
    const count = [categoryFilter.value, stateFilter.value, !deceasedFilter.checked].filter(Boolean).length;
    activeFilterCount.textContent = String(count);
    filterDetails.classList.toggle("has-active-filters", count > 0);

    const resultCount = document.getElementById("result-count");
    if (!result.people.length && !result.relationships.length) {
      resultCount.textContent = result.query ? `Sin resultados para «${searchInput.value.trim()}»` : "No hay resultados con estos filtros";
    } else {
      resultCount.textContent = `${result.people.length} ${result.people.length === 1 ? "personaje" : "personajes"} · ${result.relationships.length} ${result.relationships.length === 1 ? "vínculo" : "vínculos"}`;
    }

    const selectedLink = selectedRelationship ? data.relationships.find((item) => item.id === selectedRelationship) : null;
    const selection = selectedPerson
      ? `Conexiones resaltadas: ${personName(selectedPerson)}`
      : selectedLink
        ? `Vínculo resaltado: ${personName(selectedLink.a)} — ${personName(selectedLink.b)}`
        : "";
    selectionStatus.textContent = selection;
    selectionStatus.hidden = !selection;
    clearSelectionButton.hidden = !selection;
    graphEmpty.hidden = result.people.length > 0 || result.relationships.length > 0;
  }

  function renderGraph() {
    if (!svg) return;
    const result = currentResults();
    if (selectedPerson && !result.people.some((person) => person.id === selectedPerson)) selectedPerson = null;
    if (selectedRelationship && !result.relationships.some((relationship) => relationship.id === selectedRelationship)) selectedRelationship = null;
    svg.replaceChildren();
    const edgesGroup = svgNode("g", { class: "graph-edges" });
    const nodesGroup = svgNode("g", { class: "graph-nodes" });
    const defs = svgNode("defs");
    const visibleIds = new Set(result.people.map((person) => person.id));
    const activeRelationships = result.relationships.filter((relationship) => visibleIds.has(relationship.a) && visibleIds.has(relationship.b));
    const neighborIds = new Set();
    if (selectedPerson) {
      activeRelationships.forEach((relationship) => {
        if (relationship.a === selectedPerson) neighborIds.add(relationship.b);
        if (relationship.b === selectedPerson) neighborIds.add(relationship.a);
      });
    }

    activeRelationships.forEach((relationship) => {
      const a = positions.get(relationship.a); const b = positions.get(relationship.b);
      if (!a || !b) return;
      let stroke = categoryColors[relationship.categories[0]] || "#9e91b9";
      if (relationship.categories.length > 1) {
        const gradientId = `relation-colors-${relationship.id}`;
        const gradient = svgNode("linearGradient", {
          id: gradientId, gradientUnits: "userSpaceOnUse",
          x1: a.x, y1: a.y, x2: b.x, y2: b.y
        });
        const categories = relationship.categories;
        categories.forEach((category, index) => {
          const color = categoryColors[category] || "#9e91b9";
          gradient.append(
            svgNode("stop", { offset: `${index / categories.length * 100}%`, "stop-color": color }),
            svgNode("stop", { offset: `${(index + 1) / categories.length * 100}%`, "stop-color": color })
          );
        });
        defs.append(gradient);
        stroke = `url(#${gradientId})`;
      }
      const line = svgNode("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: "graph-edge", stroke });
      line.append(svgNode("title", {}, `${relationship.categories.join(" · ")} — ${relationship.type}`));
      const focused = selectedRelationship === relationship.id || (selectedPerson && (relationship.a === selectedPerson || relationship.b === selectedPerson));
      line.setAttribute("opacity", selectedRelationship || selectedPerson ? (focused ? "1" : ".035") : ".32");
      line.setAttribute("stroke-width", focused ? "3.2" : "1.25");
      line.setAttribute("tabindex", "0"); line.setAttribute("role", "button");
      line.setAttribute("aria-label", `${personName(relationship.a)} y ${personName(relationship.b)}: ${relationship.categories.join(", ")}. ${relationship.type}`);
      line.addEventListener("click", () => focusRelationshipOnGraph(relationship));
      line.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); focusRelationshipOnGraph(relationship); } });
      edgesGroup.append(line);
    });

    result.people.forEach((person) => {
      const point = positions.get(person.id);
      if (!point) return;
      const group = svgNode("g", { class: `graph-node${selectedPerson === person.id ? " is-selected" : ""}`, transform: `translate(${point.x} ${point.y})`, tabindex: "0", role: "button", "aria-label": `${person.name}, ${data.relationships.filter((r) => r.a === person.id || r.b === person.id).length} vínculos` });
      let opacity = ".94";
      if (result.query && !result.matchingPeople.has(person.id) && !activeRelationships.some((relationship) => relationship.a === person.id || relationship.b === person.id)) opacity = ".28";
      if (selectedPerson && person.id !== selectedPerson && !neighborIds.has(person.id)) opacity = ".2";
      if (selectedRelationship && person.id !== data.relationships.find((relationship) => relationship.id === selectedRelationship)?.a && person.id !== data.relationships.find((relationship) => relationship.id === selectedRelationship)?.b) opacity = ".2";
      group.setAttribute("opacity", opacity);
      group.append(svgNode("circle", { class: "graph-node-ring", r: "24" }));
      group.append(svgNode("circle", { class: "graph-node-fill", r: "21" }));
      const portrait = svgNode("image", { href: person.portrait, x: "-20", y: "-20", width: "40", height: "40", preserveAspectRatio: "xMidYMid slice", class: "graph-portrait" });
      portrait.setAttribute("clip-path", "circle(20px at 20px 20px)");
      portrait.addEventListener("error", () => { portrait.style.display = "none"; });
      group.append(portrait);
      const fallback = svgNode("text", { class: "graph-avatar-fallback", x: "0", y: "5", "text-anchor": "middle" });
      fallback.textContent = person.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
      group.append(fallback);
      const label = svgNode("text", { class: "graph-node-label", x: "0", y: "38", "text-anchor": "middle" });
      label.textContent = person.name;
      group.append(label);
      if (person.life.startsWith("fallecid")) group.append(svgNode("circle", { class: "graph-deceased-mark", cx: "17", cy: "-17", r: "4" }));
      group.addEventListener("click", () => focusPersonOnGraph(person.id));
      group.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); focusPersonOnGraph(person.id); } });
      nodesGroup.append(group);
    });

    const world = svgNode("g", { class: "graph-world" });
    world.append(edgesGroup, nodesGroup);
    svg.append(defs, world);
    applyZoom();
    updateFeedback(result);
    renderPeople(result);
    renderLinks(result);
  }

  function applyZoom() {
    const width = 1200 / zoom;
    const height = 760 / zoom;
    const x = 600 - width / 2 - panX;
    const y = 380 - height / 2 - panY;
    svg?.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
  }

  function fitGraph() {
    const visiblePeople = currentResults().people;
    const points = visiblePeople.map((person) => positions.get(person.id)).filter(Boolean);
    if (!points.length) {
      zoom = 1;
      panX = 0;
      panY = 0;
      applyZoom();
      return;
    }
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    const padding = 100;
    const width = Math.max(200, Math.max(...xs) - Math.min(...xs) + padding * 2);
    const height = Math.max(180, Math.max(...ys) - Math.min(...ys) + padding * 2);
    zoom = Math.max(.65, Math.min(2.2, Math.min(1200 / width, 760 / height)));
    panX = 600 - (Math.min(...xs) + Math.max(...xs)) / 2;
    panY = 380 - (Math.min(...ys) + Math.max(...ys)) / 2;
    applyZoom();
  }

  function setView(view) {
    currentView = view;
    document.querySelectorAll(".relations-view").forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll(".relations-view-panel").forEach((panel) => {
      const active = panel.id === `panel-${view}`;
      panel.hidden = !active;
      panel.classList.toggle("is-visible", active);
    });
    renderGraph();
  }

  function reset() {
    searchInput.value = "";
    categoryFilter.value = "";
    stateFilter.value = "";
    deceasedFilter.checked = true;
    zoom = 1; panX = 0; panY = 0;
    if (filterDetails) filterDetails.open = false;
    clearSelection();
  }

  function bindControls() {
    document.querySelectorAll(".relations-view").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
    searchInput.addEventListener("input", renderGraph);
    [categoryFilter, stateFilter, deceasedFilter].forEach((control) => control.addEventListener("change", renderGraph));
    document.getElementById("reset-filters").addEventListener("click", reset);
    clearSelectionButton.addEventListener("click", clearSelection);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !detailContent.hidden) clearSelection();
    });
    document.getElementById("zoom-in").addEventListener("click", () => { zoom = Math.min(2.2, zoom * 1.2); applyZoom(); });
    document.getElementById("zoom-out").addEventListener("click", () => { zoom = Math.max(.65, zoom / 1.2); applyZoom(); });
    document.getElementById("zoom-fit").addEventListener("click", fitGraph);
    svg.addEventListener("wheel", (event) => {
      event.preventDefault(); zoom = Math.max(.65, Math.min(2.2, zoom * (event.deltaY < 0 ? 1.08 : .92))); applyZoom();
    }, { passive: false });
    graphCanvas.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".graph-node, .graph-edge")) return;
      dragStart = { x: event.clientX, y: event.clientY, panX, panY };
      graphCanvas.setPointerCapture(event.pointerId);
    });
    graphCanvas.addEventListener("pointermove", (event) => {
      if (!dragStart) return;
      const rect = svg.getBoundingClientRect();
      panX = dragStart.panX - ((event.clientX - dragStart.x) / rect.width) * (1200 / zoom);
      panY = dragStart.panY - ((event.clientY - dragStart.y) / rect.height) * (760 / zoom);
      applyZoom();
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => graphCanvas.addEventListener(eventName, () => { dragStart = null; }));
  }

  setStats();
  bindControls();
  renderGraph();
})();
