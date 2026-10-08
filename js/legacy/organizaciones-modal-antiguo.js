/* =========================================================
   ORGANIZACIONES
   ========================================================= */
const organizaciones = {
    bastion: {
        nombre: "Bastión",
        subtitulo: "Organización de prodigios",
        descripcion: "Una organización de prodigios cuyo origen y propósito continúan siendo desconocidos.",
        estado: "Activa",
        tipo: "Organización de prodigios",
        lema: "Protegemos lo que el velo oculta",
        secciones: [
            {
                titulo: "Origen",
                contenido: "Todavía se desconoce cuándo fue creada Bastión y cuál fue su propósito original. Actualmente, su principal conflicto conocido es el enfrentamiento con Origen."
            },
            {
                titulo: "Universidad SOMA",
                contenido: "Bastión es la organización fundadora de SOMA, la Sociedad Organizada de Memorias Arcanas. La universidad está relacionada con el Observatorio Ánima."
            },
            {
                titulo: "Departamentos",
                tipo: "departamentos",
                datos: [
                    ["Operaciones Especiales", "Lysara"],
                    ["Militar", "Elías"],
                    ["Inteligencia", "Kassian"],
                    ["Diplomacia", "Simone"],
                    ["Investigación", "Syra"]
                ]
            },
            {
                titulo: "Los tres dirigentes",
                contenido: "Por encima de los líderes de departamento existen tres dirigentes cuya identidad se desconoce. Tampoco se conoce exactamente cuál es su función. La única persona con capacidad conocida para comunicarse con ellos es Lysara, líder de Operaciones Especiales."
            },
            {
                titulo: "Altos cargos",
                contenido: "Bastión cuenta con tres altos cargos que dirigen la organización. Se sabe que estos tres dirigentes no son humanos."
            },
            {
                titulo: "Prisión de máxima seguridad",
                contenido: "Bastión dispone de una prisión de máxima seguridad. Entre los individuos recluidos se encuentran Lucifer (Alara), Yareth y el Camello. Los motivos de sus encarcelamientos todavía no están completamente esclarecidos. En el caso del Camello, existe la posibilidad de que esté relacionado con Origen."
            },
            {
                titulo: "Acceso",
                tipo: "dato",
                etiqueta: "Contraseña",
                contenido: "Bastión☉△◐✶"
            }
        ]
    },
    origen: {
        nombre: "Origen",
        subtitulo: "Organización enfrentada a Bastión",
        descripcion: "Una organización vinculada a la Universidad REAH y a una misteriosa hermandad religiosa.",
        estado: "Activa",
        tipo: "Organización",
        lema: "Primordial es lo que el velo cubrió",
        secciones: [
            {
                titulo: "Universidad REAH",
                contenido: "Origen está vinculada a la Universidad REAH. Por el momento se desconoce qué significan exactamente las siglas REAH y cuál es la función concreta de la universidad dentro de la organización."
            },
            {
                titulo: "La Hermandad",
                contenido: "Dentro de la información relacionada con Origen aparece una hermandad de carácter religioso. Sus miembros veneran alienígenas y seres extraterrenales camuflados y buscan otorgar poder a determinados humanos."
            },
            {
                titulo: "Creencias y vínculos",
                contenido: "La hermandad aparece relacionada con el Mochuelo de Atenea y con los llamados Iluminados de Baviera. La naturaleza exacta de estas conexiones todavía no está esclarecida."
            },
            {
                titulo: "Círculos de sal",
                contenido: "Los círculos de sal con tentáculos funcionan como rituales de acceso al Velo. Hasta el momento, Origen es la única organización conocida capaz de crearlos."
            },
            {
                titulo: "Espejos",
                contenido: "Origen utiliza espejos como medio de transporte. Pueden permitir desplazamientos entre distintos lugares, dentro del Velo, fuera de él e incluso entre ambas realidades. La distancia alcanzable depende del tamaño del espejo. Estos tienden a romperse, aunque pueden ser reparados o adquiridos."
            },
            {
                titulo: "Rituales",
                tipo: "lista",
                datos: [
                    "Ritual de Resurrección",
                    "Ritual de Localización",
                    "Ritual de Encadenamiento"
                ]
            },
            {
                titulo: "Proyecto Edén",
                contenido: "Existe una lista de personas que han interactuado directa o indirectamente con el Proyecto Edén. Algunos nombres aparecen tachados o marcados de distintas formas. También existe constancia de que hay un topo relacionado con el proyecto.",
                tipo: "eden"
            }
        ]
    }
};
const organizacionesGrid = document.getElementById("organizaciones-grid");
const organizacionDetalle = document.getElementById("organizacion-detalle");
const organizacionContenido = document.getElementById("organizacion-contenido");
const organizacionCerrar = document.getElementById("organizacion-cerrar");
function crearTarjetas() {
    if (!organizacionesGrid) return;
    organizacionesGrid.innerHTML = Object.entries(organizaciones).map(([id, org], index) => `
        <article class="organizacion-card" data-organizacion="${id}" tabindex="0">
            <span class="organizacion-card-number">REG. ${id === "bastion" ? "01" : "02"}</span>
            <div>
                <span class="organizacion-card-type">${org.tipo}</span>
                <h3>${org.nombre}</h3>
                <p>${org.descripcion}</p>
            </div>
            <span class="organizacion-card-link">Consultar archivo →</span>
        </article>
    `).join("");
    animateItems([...organizacionesGrid.querySelectorAll(".organizacion-card")]);
}
function generarSeccion(seccion) {
    if (seccion.tipo === "departamentos") {
        return `
            <div class="organizacion-bloque">
                <h3>${seccion.titulo}</h3>
                <div class="organizacion-departamentos">
                    ${seccion.datos.map(([departamento, lider]) => `
                        <div class="departamento">
                            <span>${departamento}</span>
                            <strong>${lider}</strong>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }
    if (seccion.tipo === "lista") {
        return `
            <div class="organizacion-bloque">
                <h3>${seccion.titulo}</h3>
                <ul class="organizacion-lista">
                    ${seccion.datos.map(item => `<li>${item}</li>`).join("")}
                </ul>
            </div>
        `;
    }
    if (seccion.tipo === "dato") {
        return `
            <div class="organizacion-bloque organizacion-dato">
                <h3>${seccion.titulo}</h3>
                <span class="dato-label">${seccion.etiqueta}</span>
                <p>${seccion.contenido}</p>
            </div>
        `;
    }
    if (seccion.tipo === "eden") {
        return `
            <div class="organizacion-bloque">
                <h3>${seccion.titulo}</h3>
                <p>${seccion.contenido}</p>
                <div class="eden-alerta">INFORMACIÓN PARCIAL · EXISTE UN TOPO</div>
            </div>
        `;
    }
    return `
        <div class="organizacion-bloque">
            <h3>${seccion.titulo}</h3>
            <p>${seccion.contenido}</p>
        </div>
    `;
}
function abrirOrganizacion(id) {
    if (!organizacionDetalle || !organizacionContenido) return;
    const org = organizaciones[id];
    if (!org) return;
    organizacionContenido.innerHTML = `
        <header class="organizacion-header">
            <span class="section-number">${org.tipo}</span>
            <h2>${org.nombre}</h2>
            <p>${org.subtitulo}</p>
            <span class="organizacion-lema">${org.lema}</span>
        </header>
        <div class="organizacion-info">
            ${org.secciones.map(generarSeccion).join("")}
        </div>
    `;
    organizacionDetalle.classList.add("visible");
    lockScroll();
    organizacionDetalle.scrollTop = 0;
}
function cerrarOrganizacion() {
    if (!organizacionDetalle) return;
    organizacionDetalle.classList.remove("visible");
    unlockScroll();
}
if (organizacionesGrid && organizacionDetalle && organizacionContenido) {
    organizacionesGrid.addEventListener("click", event => {
        const tarjeta = event.target.closest(".organizacion-card");
        if (!tarjeta) return;
        abrirOrganizacion(tarjeta.dataset.organizacion);
    });
    organizacionesGrid.addEventListener("keydown", event => {
        const tarjeta = event.target.closest(".organizacion-card");
        if (!tarjeta) return;
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            abrirOrganizacion(tarjeta.dataset.organizacion);
        }
    });
    organizacionDetalle.addEventListener("click", event => {
        if (event.target === organizacionDetalle) {
            cerrarOrganizacion();
        }
    });
}
if (organizacionCerrar) {
    organizacionCerrar.addEventListener("click", cerrarOrganizacion);
}
crearTarjetas();
