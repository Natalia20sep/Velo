/* VELO · Renderizador común de expedientes */
(() => {
    const params = new URLSearchParams(window.location.search);
    const personajeId = params.get("personaje");

    if (!personajeId) {
        console.error("VELO: No se ha indicado ningún personaje.");
        return;
    }

    const script = document.createElement("script");
    script.src = `./${personajeId}/datos.js`;
    script.onload = init;
    script.onerror = () => {
        console.error(`VELO: No se ha podido cargar el expediente de "${personajeId}".`);
        const name = document.getElementById("characterName");
        if (name) name.textContent = "REGISTRO NO ENCONTRADO";
    };
    document.head.appendChild(script);

    function getData() {
        return window.personaje || {};
    }

    function value(key, fallback = "Desconocido") {
        const data = getData();
        const val = data[key];
        if (val === undefined || val === null || String(val).trim() === "") return fallback;
        return Array.isArray(val) ? val.join(" · ") : String(val);
    }

    function set(id, key, fallback = "Desconocido") {
        const el = document.getElementById(id);
        if (el) el.textContent = value(key, fallback);
    }

    function createField(label, key) {
        const field = document.createElement("div");
        field.className = "identity-field";

        const labelEl = document.createElement("span");
        labelEl.textContent = label;

        const valueEl = document.createElement("strong");
        valueEl.textContent = value(key);

        field.append(labelEl, valueEl);
        return field;
    }
    function renderIdentity() {
        const grid = document.getElementById("identityGrid");
        if (!grid) return;

        const fields = [
            ["NOMBRE", "nombre"],
            ["ALIAS", "alias"],
            ["EDAD", "edad"],
            ["LUGAR DE NACIMIENTO", "lugarDeNacimiento"],
            ["ALTURA", "altura"],
            ["FAMILIA", "familia"],
            ["LINAJE", "linaje"],
            ["PODER", "poder"],
            ["PRODIGIO", "prodigio"],
            ["DEPARTAMENTO", "departamento"],
            ["CARGO", "cargo"],
            ["OCUPACIÓN", "trabajo"]
        ];

        fields.forEach(([label, key]) => {
            grid.appendChild(createField(label, key));
        });
    }

    function renderRelations() {
        const container = document.getElementById("relations");
        if (!container) return;

        const relations = getData().relaciones;

        if (!relations || String(relations).trim() === "") {
            container.innerHTML = '<span class="file-unknown">No constan relaciones registradas.</span>';
            return;
        }

        if (Array.isArray(relations)) {
            relations.forEach(relation => {
                const item = document.createElement("div");
                item.className = "relation-entry";
                item.textContent = relation;
                container.appendChild(item);
            });
        } else {
            container.textContent = String(relations);
        }
    }

    function renderQuotes() {
        const container = document.getElementById("quotes");
        if (!container) return;

        const quotes = getData().frasesCelebres;

        if (!quotes || String(quotes).trim() === "") {
            container.innerHTML = '<span class="file-unknown">No constan declaraciones registradas.</span>';
            return;
        }

        const list = Array.isArray(quotes) ? quotes : [quotes];

        list.forEach(quote => {
            const block = document.createElement("blockquote");
            block.textContent = `“${quote}”`;
            container.appendChild(block);
        });
    }

    function renderHistory() {
        const container = document.getElementById("history");
        if (!container) return;

        const history = getData().historia;

        if (!history) {
            container.innerHTML = '<span class="file-unknown">No constan antecedentes registrados.</span>';
            return;
        }

        const paragraphs = String(history).split(/\n\s*\n/);

        const preview = document.createElement("p");
        preview.textContent = paragraphs[0];

        const button = document.createElement("button");
        button.type = "button";
        button.className = "history-open";

        const icon = document.createElement("span");
        icon.className = "history-icon";
        icon.textContent = "01";

        const info = document.createElement("span");
        info.className = "history-info";

        const title = document.createElement("strong");
        title.textContent = "HISTORIA";

        const subtitle = document.createElement("small");
        subtitle.textContent = "Consultar registro histórico completo";

        info.append(title, subtitle);

        const arrow = document.createElement("span");
        arrow.className = "history-arrow";
        arrow.textContent = "→";

        button.append(icon, info, arrow);
        button.addEventListener("click", openHistory);

        container.append(preview, button);
    }

    function openHistory() {
        const data = getData();
        if (!data.historia) return;

        let modal = document.getElementById("historyModal");

        if (!modal) {
            modal = document.createElement("div");
            modal.id = "historyModal";
            modal.className = "history-modal";

            modal.innerHTML = `
                <div class="history-modal-backdrop"></div>
                <div class="history-modal-window" role="dialog" aria-modal="true">
                    <button type="button" class="history-modal-close" aria-label="Cerrar historia">×</button>
                    <header class="history-modal-header">
                        <div>
                            <span>VELO · ARCHIVO CENTRAL</span>
                            <strong>ANTECEDENTES DEL INDIVIDUO</strong>
                        </div>
                        <div class="history-modal-classification">
                            <span>CLASIFICACIÓN</span>
                            <strong>RESERVADO</strong>
                        </div>
                    </header>
                    <div class="history-modal-body">
                        <div class="history-modal-label">HISTORIA REGISTRADA</div>
                        <div class="history-modal-text" id="historyModalText"></div>
                    </div>
                    <footer class="history-modal-footer">
                        <span>VELO · REGISTRO HISTÓRICO</span>
                        <button type="button" class="history-modal-close-button">CERRAR HISTORIA</button>
                    </footer>
                </div>
            `;

            document.body.appendChild(modal);

            const close = () => {
                modal.classList.remove("is-open");
                document.body.classList.remove("modal-open");
            };

            modal.querySelector(".history-modal-close").addEventListener("click", close);
            modal.querySelector(".history-modal-close-button").addEventListener("click", close);
            modal.querySelector(".history-modal-backdrop").addEventListener("click", close);
        }

        const text = modal.querySelector("#historyModalText");
        text.innerHTML = "";

        String(data.historia).split(/\n\s*\n/).forEach(paragraph => {
            const p = document.createElement("p");
            p.textContent = paragraph;
            text.appendChild(p);
        });

        modal.classList.add("is-open");
        document.body.classList.add("modal-open");
    }

    function renderGallery() {
        const container = document.getElementById("personalAlbum");
        if (!container) return;

        const gallery = Array.isArray(getData().galeria) ? getData().galeria : [];

        if (!gallery.length) {
            container.innerHTML = '<span class="file-unknown">No existe material visual adicional asociado.</span>';
            return;
        }

        gallery.forEach((src, index) => {
            const figure = document.createElement("figure");
            figure.className = "record-photo";

            const img = document.createElement("img");
            img.src = `./${personajeId}/${src}`;
            img.alt = `${getData().nombre || "Individuo"} · registro visual ${index + 1}`;

            const caption = document.createElement("figcaption");
            caption.textContent = `REGISTRO VISUAL ${String(index + 1).padStart(2, "0")}`;

            img.addEventListener("click", () => openImage(img.src, index));
            img.addEventListener("error", () => figure.remove(), { once: true });

            figure.append(img, caption);
            container.appendChild(figure);
        });
    }

    function openImage(src, index) {
        let modal = document.getElementById("imageModal");

        if (!modal) {
            modal = document.createElement("div");
            modal.id = "imageModal";
            modal.className = "image-modal";

            modal.innerHTML = `
                <div class="image-modal-backdrop"></div>
                <div class="image-modal-window" role="dialog" aria-modal="true">
                    <button type="button" class="image-modal-close" aria-label="Cerrar imagen">×</button>
                    <header class="image-modal-header">
                        <span>VELO · ARCHIVO CENTRAL</span>
                        <strong id="imageModalTitle">REGISTRO VISUAL</strong>
                    </header>
                    <div class="image-modal-body">
                        <img id="imageModalImage" src="" alt="">
                    </div>
                    <footer class="image-modal-footer">
                        <span id="imageModalNumber">REGISTRO VISUAL 01</span>
                        <button type="button" class="image-modal-close-button">CERRAR</button>
                    </footer>
                </div>
            `;

            document.body.appendChild(modal);

            const close = () => {
                modal.classList.remove("is-open");
                document.body.classList.remove("modal-open");
            };

            modal.querySelector(".image-modal-close").addEventListener("click", close);
            modal.querySelector(".image-modal-close-button").addEventListener("click", close);
            modal.querySelector(".image-modal-backdrop").addEventListener("click", close);
        }

        const data = getData();
        const image = modal.querySelector("#imageModalImage");

        image.src = src;
        image.alt = `${data.nombre || "Individuo"} · registro visual ${index + 1}`;

        modal.querySelector("#imageModalTitle").textContent = data.nombre || "REGISTRO VISUAL";
        modal.querySelector("#imageModalNumber").textContent = `REGISTRO VISUAL ${String(index + 1).padStart(2, "0")}`;

        modal.classList.add("is-open");
        document.body.classList.add("modal-open");
    }

    function renderDocuments() {
        const container = document.getElementById("characterDocuments");
        if (!container) return;

        const documents = Array.isArray(getData().documentos) ? getData().documentos : [];

        if (!documents.length) {
            container.innerHTML = '<span class="file-unknown">No consta documentación adicional asociada a este expediente.</span>';
            return;
        }

        documents.forEach((doc, index) => {
            const article = document.createElement("article");
            article.className = "document-record";

            const number = document.createElement("span");
            number.className = "document-number";
            number.textContent = doc.numero || String(index + 1).padStart(2, "0");

            const content = document.createElement("div");
            content.className = "document-content";

            const title = document.createElement("h3");
            title.textContent = doc.nombre || "Documento sin identificar";

            const meta = document.createElement("p");
            meta.className = "document-meta";
            meta.textContent = [
                doc.tipo || "TIPO DESCONOCIDO",
                doc.fecha || "FECHA DESCONOCIDA"
            ].join(" · ");

            const description = document.createElement("p");
            description.textContent = doc.descripcion || "Sin descripción disponible.";

            const button = document.createElement("button");
            button.type = "button";
            button.className = "document-open";
            button.textContent = "ABRIR DOCUMENTO →";
            button.addEventListener("click", () => openDocument(doc, index));

            content.append(title, meta, description, button);
            article.append(number, content);
            container.appendChild(article);
        });
    }

    function openDocument(doc, index) {
        let modal = document.getElementById("documentModal");

        if (!modal) {
            modal = document.createElement("div");
            modal.id = "documentModal";
            modal.className = "document-modal";

            modal.innerHTML = `
                <div class="document-modal-backdrop"></div>
                <div class="document-modal-window" role="dialog" aria-modal="true">
                    <button type="button" class="document-modal-close" aria-label="Cerrar documento">×</button>
                    <header class="document-modal-header">
                        <div>
                            <span>VELO · ARCHIVO CENTRAL</span>
                            <strong id="documentModalTitle">DOCUMENTO</strong>
                        </div>
                        <div class="document-modal-classification">
                            <span>CLASIFICACIÓN</span>
                            <strong>RESERVADO</strong>
                        </div>
                    </header>
                    <div class="document-modal-body">
                        <div class="document-modal-meta" id="documentModalMeta"></div>
                        <div class="document-modal-text" id="documentModalText"></div>
                    </div>
                    <footer class="document-modal-footer">
                        <span id="documentModalNumber">DOCUMENTO 01</span>
                        <button type="button" class="document-modal-close-button">CERRAR DOCUMENTO</button>
                    </footer>
                </div>
            `;

            document.body.appendChild(modal);

            const close = () => {
                modal.classList.remove("is-open");
                document.body.classList.remove("modal-open");
            };

            modal.querySelector(".document-modal-close").addEventListener("click", close);
            modal.querySelector(".document-modal-close-button").addEventListener("click", close);
            modal.querySelector(".document-modal-backdrop").addEventListener("click", close);
        }

        modal.querySelector("#documentModalTitle").textContent = doc.nombre || "Documento sin identificar";
        modal.querySelector("#documentModalMeta").textContent = [
            doc.tipo || "TIPO DESCONOCIDO",
            doc.fecha || "FECHA DESCONOCIDA"
        ].join(" · ");
        modal.querySelector("#documentModalText").textContent = doc.contenido || doc.descripcion || "Sin contenido disponible.";
        modal.querySelector("#documentModalNumber").textContent = `DOCUMENTO ${doc.numero || String(index + 1).padStart(2, "0")}`;

        modal.classList.add("is-open");
        document.body.classList.add("modal-open");
    }

    function renderAdditionalData() {
        const container = document.getElementById("additionalData");
        if (!container) return;

        const reserved = new Set([
            "nombre", "alias", "edad", "lugarDeNacimiento", "altura", "familia", "linaje",
            "poder", "prodigio", "departamento", "cargo", "trabajo", "estado", "afiliacion",
            "descripcion", "descripción", "historia", "relaciones", "frasesCelebres",
            "expediente", "clasificacion", "busqueda", "resumenes", "tituloListado",
            "galeria", "documentos"
        ]);

        const extras = Object.entries(getData()).filter(([key, val]) =>
            !reserved.has(key) &&
            val !== undefined &&
            val !== null &&
            String(val).trim() !== ""
        );

        if (!extras.length) {
            container.remove();
            return;
        }

        extras.forEach(([key, val]) => {
            const field = document.createElement("div");
            field.className = "identity-field";

            const label = document.createElement("span");
            label.textContent = key.replace(/([A-Z])/g, " $1").replace(/^./, char => char.toUpperCase());

            const content = document.createElement("strong");
            content.textContent = Array.isArray(val) ? val.join(" · ") : String(val);

            field.append(label, content);
            container.appendChild(field);
        });
    }

    function init() {
        const data = getData();

        if (!Object.keys(data).length) {
            console.error(`VELO: "${personajeId}/datos.js" no contiene window.personaje.`);
            return;
        }

        set("recordNumber", "expediente", "REGISTRO");
        set("characterName", "nombre", "Registro desconocido");
        set("status", "estado");

        const photo = document.getElementById("characterPhoto");

        if (photo) {
            if (data.foto) {
                photo.src = `./${personajeId}/${data.foto}`;
            } else if (Array.isArray(data.galeria) && data.galeria.length) {
                photo.src = `./${personajeId}/${data.galeria[0]}`;
            }

            photo.alt = data.nombre || "Individuo registrado";

            photo.addEventListener("error", () => {
                photo.style.display = "none";
                photo.parentElement.classList.add("photo-missing");
            }, { once: true });
        }

        const description = document.getElementById("description");

        if (description) {
            description.textContent = data.descripcion || "Desconocido";
        }

        renderIdentity();
        renderRelations();
        renderQuotes();
        renderHistory();
        renderGallery();
        renderDocuments();
        renderAdditionalData();
    }

    document.addEventListener("DOMContentLoaded", () => {
        const cards = document.querySelectorAll(".character-card");

        cards.forEach(card => {
            card.addEventListener("click", () => {
                const id = card.dataset.id;
                if (!id) return;

                window.location.href = `expediente.html?personaje=${encodeURIComponent(id)}`;
            });
        });
    });
})();