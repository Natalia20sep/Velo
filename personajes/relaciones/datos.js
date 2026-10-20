/* Registro editorial de relaciones. Mantener un solo vínculo por pareja. */
window.VELO_RELATIONS_DATA = (() => {
  const people = [
    ["adramalick", "Adramalick", "", "origen"], ["alara", "Alara", "", "independiente"],
    ["amara", "Amara", "", "independiente"], ["angel", "Ángel", "", "bastion"],
    ["aster", "Aster", "", "bastion"], ["bella", "Bella Duvall", "", "bastion"],
    ["conchi", "Conchi", "", "bastion"], ["concho", "Concho", "", "bastion"],
    ["darian", "Darian", "", "independiente"], ["eiden", "Eiden", "", "bastion"],
    ["elara", "Elara Vael", "", "bastion"], ["eleanor", "Eleanor Eynard", "Elisa", "independiente"],
    ["elias", "Elías Rivas", "", "bastion"], ["erys", "Erys Salazar", "", "bastion"],
    ["garret", "Garret Cross", "", "bastion"], ["gideon", "Gideon", "", "bastion"],
    ["hera", "Hera Orsini", "Eliana Orsini Rossi", "bastion"], ["jassper", "Jassper", "", "bastion"],
    ["kael", "Kael Vael", "", "bastion"], ["kassian", "Kassian Vorler", "", "bastion"],
    ["livya", "Livya Vesper", "", "bastion", "fallecida"], ["lysara", "Lysara Voss", "", "bastion"],
    ["natasha", "Natasha", "", "bastion"], ["nyx", "Nhara", "Nyx", "bastion"],
    ["riccardo", "Riccardo", "", "bastion"], ["nyra", "Nyra Cast", "", "bastion"],
    ["rosaline", "Rosaline Valmont", "", "origen"], ["selene", "Selene Valmont", "", "bastion", "fallecida"],
    ["simone", "Simone Deames", "", "bastion"], ["soben", "Soben", "", "bastion", "fallecido"],
    ["sylas", "Sylas Cross", "", "bastion"], ["syra", "Syra Vael", "", "bastion"],
    ["vera", "Vera Tyrrel", "", "bastion"], ["yareth", "Yareth", "", "desconocido"],
    ["zarek", "Zarek Vael", "", "bastion"]
  ].map(([id, name, alias, affiliation, life = "desconocido"]) => ({
    id, name, alias, affiliation, life,
    portrait: `../../imagenes/foto_perfil/foto_perfil_${id === "nyx" ? "nhara" : id === "eiden" ? "eliden" : id}.png`,
    dossier: `../expedientes/expediente.html?personaje=${id}`
  }));

  const relationships = [];
  const add = (a, b, category, type, description, state = "sin-cierre", extra = {}) => {
    const [first, second] = [a, b].sort();
    const id = `${first}--${second}`;
    const existing = relationships.find((item) => item.id === id);
    const categories = Array.isArray(category) ? category : [category];
    if (existing) {
      existing.categories = [...new Set([...existing.categories, ...categories])];
      if (!existing.type.includes(type)) existing.type += ` · ${type}`;
      if (description && !existing.description.includes(description)) existing.description += ` ${description}`;
      if (existing.state !== state && state !== "sin-cierre") existing.state = existing.state === "sin-cierre" ? state : "mixto";
      existing.events = [...new Set([...(existing.events || []), ...(extra.events || [])])];
      if (extra.pactId) existing.pactId = extra.pactId;
      if (extra.direction) existing.direction = extra.direction;
      if (extra.reciprocity) existing.reciprocity = extra.reciprocity;
      return;
    }
    relationships.push({ id, a: first, b: second, categories, type, description, state, ...extra });
  };

  // Familia, matrimonio y familia elegida.
  add("alara", "amara", "Familia", "Hermanas", "Son hermanas.");
  add("bella", "garret", ["Personal", "Familia"], "Familia elegida", "Mantienen un vínculo afectivo muy fuerte y se consideran familia, prácticamente hermanos. No existe adopción legal ni vínculo sanguíneo.");
  add("conchi", "concho", "Familia", "Matrimonio", "Son marido y mujer.");
  add("elara", "zarek", ["Familia", "Profesional"], "Matrimonio y compañeros de investigación", "Son marido y mujer y trabajaron juntos en el Proyecto Edén.");
  add("elara", "syra", "Familia", "Madre e hija", "Elara es la madre de Syra.");
  add("elara", "kael", "Familia", "Madre e hijo", "Elara es la madre de Kael.");
  add("zarek", "syra", "Familia", "Padre e hija", "Zarek es el padre de Syra.");
  add("zarek", "kael", "Familia", "Padre e hijo", "Zarek es el padre de Kael.");
  add("kael", "syra", "Familia", "Hermanos", "Son hermanos. Kael acogió a Syra cuando abandonó su hogar; vivieron juntos durante dos años.");
  add("hera", "syra", "Personal", "Amistad", "Son amigas.");
  add("livya", "elias", ["Familia", "Personal"], "Matrimonio", "Fue la esposa de Elías. Livya está fallecida.", "historico");
  add("rosaline", "selene", "Familia", "Madre e hija", "Rosaline es la madre de Selene. Selene está fallecida.", "historico");
  add("rosaline", "zarek", "Profesional", "Colaboración en Proyecto Edén", "Rosaline colaboró con Zarek en el Proyecto Edén.", "historico");

  // Relaciones personales, confianza y vínculos románticos.
  add("amara", "angel", ["Personal", "Profesional"], "Amistad surgida de una colaboración", "Ángel contrató a Amara como cámara y fotógrafa para el club de periodismo. Amara era personal externo, no miembro del club. Se llevaban bien y terminaron haciéndose amigas.");
  add("amara", "selene", "Estratégica", "Intercambio de información", "Colaboraron puntualmente e intercambiaron información mediante un trato. No consta que fueran amigas.", "historico");
  add("amara", "syra", ["Estratégica", "Conflicto"], "Pacto de sangre y tensión", "Tienen un pacto de sangre y cierta tensión entre ellas. Se desconoce la causa de la tensión.", "incompleto", { pactId: "pacto-sangre-amara-syra" });
  add("angel", "darian", "Personal", "Cercanía y posible atracción unilateral", "Son personas muy cercanas. Ángel sintió atracción por Darian; se desconoce si él correspondía a esos sentimientos o si los conocía.", "sin-cierre", { direction: "a-to-b", reciprocity: "no-confirmada" });
  add("aster", "eiden", ["Profesional", "Personal"], "Compañeros y amigos", "Son compañeros de departamento y de estudios, además de amigos.");
  add("aster", "syra", ["Profesional", "Personal"], "Superior y subordinado; admiración", "Aster es superior de Syra en Investigación. Se llevan bien y Aster la admira.");
  add("bella", "elias", ["Personal", "Familia"], "Figura paterna", "Elías es una figura paterna para Bella.");
  add("bella", "kassian", "Personal", "Amor platónico no correspondido", "Bella siente por Kassian un amor platónico que, según la información disponible, no es correspondido. Se desconoce si él lo sabe.", "sin-cierre", { direction: "a-to-b", reciprocity: "no-correspondido-segun-registro" });
  add("bella", "selene", "Personal", "Buena relación personal", "Se llevaban bien. El secuestro de Bella estuvo relacionado con el sacrificio de Selene para salvar al grupo.", "historico", { events: ["secuestro-bella-sacrificio-selene"] });
  add("conchi", "garret", "Personal", "Buena relación personal", "Se llevaban bien. Los cumplidos de Garret hacían que Conchi se sintiera apreciada.");
  add("conchi", "syra", "Personal", "Buena relación personal", "Se llevaban bien. Syra la animaba y contribuía a mejorar su autoestima.");
  add("conchi", "selene", "Personal", "Buena relación personal", "Selene ayudaba a reforzar la autoestima de Conchi. Se llevaban bien, aunque no eran especialmente cercanas.", "historico");
  add("darian", "syra", "Personal", "Amistad y atracción pasada", "Fueron amigos durante varios años y comenzaron a sentir algo el uno por el otro. Antes de que la relación pudiera formarse, Syra entró en Bastión y se alejó por completo. Darian desconoce lo que Syra llegó a sentir.", "historico", { reciprocity: "no-confirmada" });
  add("elara", "elias", "Personal", "Amistad y confianza", "Son amigos. Elara confiaba en Elías hasta el punto de dejar a sus hijos bajo su cuidado.");
  add("eleanor", "elias", "Estratégica", "Pacto incompleto relacionado con la lágrima", "Elías y Lysara debían entregar la lágrima a Eleanor a cambio de su ayuda. El pacto sigue incompleto y no implica necesariamente una relación personal.", "incompleto", { pactId: "pacto-lagrima" });
  add("eleanor", "lysara", "Estratégica", "Pacto incompleto relacionado con la lágrima", "Lysara y Elías debían entregar la lágrima a Eleanor a cambio de su ayuda. El pacto sigue incompleto y no implica necesariamente una relación personal.", "incompleto", { pactId: "pacto-lagrima" });
  add("elias", "natasha", ["Familia", "Profesional", "Personal"], "Hermanos y binomio", "Son hermanos y binomio. Mantienen una relación muy estrecha, basada en la confianza y la protección mutua.");
  add("elias", "vera", ["Personal", "Profesional"], "Figura paterna y mentor", "Elías es una figura paterna para Vera y también su mentor.");
  add("elias", "garret", ["Personal", "Profesional"], "Confianza y referencia personal", "Se llevan muy bien. Garret considera a Elías una figura de referencia y confía en él. No consta que Elías sea una figura paterna para Garret.");
  add("elias", "zarek", "Personal", "Amistad y confidencia", "Son buenos amigos y confidentes.");
  add("elias", "kael", ["Personal", "Profesional"], "Figura paterna y mentor", "Elías es mentor de Kael y una figura paterna para él.");
  add("elias", "syra", "Personal", "Vínculo en desarrollo con dimensión romántica", "Existe una cercanía emocional creciente. Ninguno ha expresado abiertamente lo que siente y no mantienen una relación formal.", "desarrollo", { reciprocity: "sentimientos-no-expresados-por-ambos" });
  add("elias", "lysara", ["Profesional", "Personal"], "Colaboración, amistad y tensión romántica pasada", "Han trabajado juntos durante años y se entienden bien. Existió cierta tensión romántica, pero nunca fueron pareja; esa tensión está superada.", "superado");
  add("elias", "simone", ["Profesional", "Personal"], "Buena relación profesional y personal", "Llevan años trabajando juntos y mantienen una buena relación y entendimiento mutuo.");
  add("elias", "kassian", ["Profesional", "Personal"], "Buena relación profesional y personal", "Comparten años de trabajo y mantienen una relación especialmente buena, tanto personal como profesional.");
  add("erys", "nyra", ["Personal", "Profesional"], "Amistad", "Son amigas.");
  add("erys", "sylas", "Personal", "Amistad cercana", "Son amigos cercanos.");
  add("erys", "simone", "Profesional", "Superior y sucesora", "Simone es superior de Erys y Erys su sucesora. Se llevan bien, aunque la relación es principalmente profesional.");
  add("garret", "sylas", ["Familia", "Conflicto"], "Hermanos gemelos y rivalidad", "Son hermanos gemelos. La relación está deteriorada y marcada por los celos, las comparaciones y una rivalidad activa.", "actual");
  add("garret", "syra", "Personal", "Amistad íntima", "Son mejores amigos. Un problema del pasado afectó a la relación, pero ya está superado.");
  add("garret", "selene", "Personal", "Amistad y atracción mutua no desarrollada", "Fueron amigos y existió una atracción mutua, aunque pequeña. Nunca desarrollaron una relación romántica. Selene falleció.", "historico", { events: ["secuestro-bella-sacrificio-selene"] });
  add("garret", "kassian", "Conflicto", "Antipatía", "Se caen mal y prefieren no compartir espacio. Se toleran; se desconoce la causa.");
  add("garret", "lysara", ["Profesional", "Personal"], "Sucesión y confianza", "Garret es sucesor de Lysara. Ella confía en él.");
  add("garret", "vera", "Personal", "Amistad cercana", "Son amigos cercanos.");
  add("garret", "kael", "Personal", "Amistad cercana", "Son amigos y mantienen una relación cercana.");
  add("hera", "nyx", ["Personal", "Profesional"], "Amistad con intimidad y confianza", "Mantienen una relación de amigas con derecho a roce, basada también en la confianza.");
  add("hera", "riccardo", "Personal", "Amistad íntima", "Son mejores amigos. Fueron binomio cuando Hera trabajaba en Italia.");
  add("kael", "vera", "Personal", "Vínculo romántico profundo sin etiqueta", "Ambos se consideran el amor de sus vidas, pero evitan definir la relación por miedo a estropearla.", "desarrollo", { reciprocity: "mutua-sin-etiqueta" });
  add("kael", "selene", "Personal", "Relación romántica pasada y amistad posterior", "Fueron pareja y, tras romper, se hicieron amigos. Selene falleció mientras mantenían esa amistad.", "historico");
  add("kael", "kassian", "Profesional", "Jefe y sucesor; respeto mutuo", "Kassian dirige Inteligencia y Kael es su sucesor. Se respetan y se llevan bien, pero no son amigos. Kael admira a Kassian.");
  add("kael", "soben", ["Personal", "Profesional"], "Amistad íntima y compañeros", "Fueron mejores amigos y compañeros. Soben falleció.", "historico");
  add("kassian", "soben", ["Profesional", "Personal"], "Antiguo superior y confianza profesional", "Soben fue subordinado de Kassian y una persona en quien confiaba profesionalmente. No está confirmado que fueran amigos fuera del trabajo.", "historico");
  add("kassian", "sylas", "Personal", "Confianza y referencia personal", "Mantienen un vínculo estrecho basado en una confianza especial. Sylas considera a Kassian una figura de referencia.");
  add("kassian", "simone", ["Profesional", "Personal"], "Amistad profesional y confianza", "Mantienen una relación cercana y de confianza, sin dimensión romántica confirmada.");
  add("kassian", "lysara", ["Profesional", "Personal"], "Buena relación profesional y personal", "Mantienen una buena relación profesional y personal.");
  add("lysara", "simone", ["Personal", "Profesional"], "Binomio y amistad de juventud", "Son binomio y amigas desde la juventud. Hubo tensión y fricción, pero nunca una relación romántica; la tensión está superada.", "superado");
  add("lysara", "nyx", "Profesional", "Superior y subordinada", "Lysara es superior de Nhara en Operaciones Especiales. Mantienen una buena relación profesional.");
  add("lysara", "vera", "Personal", "Aprecio y vínculo histórico", "Se conocen desde hace años y se aprecian mutuamente. Ambas participaron en las circunstancias relacionadas con el rescate y la acogida de Bella.", "historico");
  add("nyx", "syra", "Personal", "Amistad", "Fueron amigas muy cercanas durante la adolescencia. Actualmente mantienen una relación de amistad.");
  add("nyra", "sylas", ["Personal", "Profesional"], "Binomio y amistad cercana", "Son binomio y amigos cercanos.");
  add("nyra", "vera", "Personal", "Relación romántica pasada y amistad posterior", "Fueron pareja y, tras la ruptura, siguieron siendo amigas.", "historico");
  add("riccardo", "elias", "Profesional", "Jefe y admiración profesional", "Elías es actualmente su jefe durante su estancia en Lunaterra. Riccardo siente admiración por él.");
  add("selene", "syra", "Personal", "Amistad íntima", "Fueron mejores amigas. La muerte de Selene afectó profundamente a Syra.", "historico");
  add("selene", "vera", "Personal", "Amistad", "Eran amigas; no consta una cercanía especial más allá de esa amistad.", "historico");
  add("soben", "adramalick", "Conflicto", "Asesinato, fusión de almas y uso del cuerpo como recipiente", "Adramalick asesinó a Soben. Posteriormente, sus almas se fusionaron y Adramalick utilizó el cuerpo de Soben como recipiente. Se desconocen las circunstancias exactas y cuándo ocurrió la fusión.", "historico", { events: ["asesinato-soben-fusion"] });
  add("syra", "vera", ["Familia", "Personal"], "Cuñadas y relación personal", "Vera es cuñada de Syra por su vínculo con Kael. También mantienen una relación personal.");

  const events = [
    { id: "secuestro-bella-sacrificio-selene", title: "Secuestro de Bella y sacrificio de Selene", description: "El secuestro de Bella estuvo relacionado con la decisión de Selene de sacrificarse para que el grupo pudiera volver a salvo.", people: ["bella", "selene"], time: "Sin fecha registrada", type: "Rescate y sacrificio" },
    { id: "asesinato-soben-fusion", title: "Asesinato de Soben y fusión de almas", description: "Adramalick asesinó a Soben. Más tarde se produjo una fusión de almas y el cuerpo de Soben fue utilizado como recipiente; las circunstancias y el momento exactos se desconocen.", people: ["adramalick", "soben"], time: "Sin fecha registrada", type: "Conflicto" }
  ];

  const pacts = [
    { id: "pacto-sangre-amara-syra", title: "Pacto de sangre", participants: ["amara", "syra"], conditions: "Pacto confirmado; condiciones no detalladas en este registro.", status: "Condiciones incompletas" },
    { id: "pacto-lagrima", title: "Pacto relacionado con la lágrima", participants: ["eleanor", "elias", "lysara"], conditions: "Elías y Lysara entregarían la lágrima a Eleanor a cambio de su ayuda.", status: "Incompleto" }
  ];

  const externalReferences = {
    eleanor: [{ name: "Kristine", type: "Vínculo personal profundo", text: "La relación comenzó como amistad y se volvió mucho más profunda. Fueron separadas y Eleanor nunca supo qué ocurrió con Kristine. La naturaleza exacta del vínculo no está confirmada; no se afirma que fueran pareja." }],
    gideon: [{ name: "Hija de Gideon (identidad desconocida)", type: "Vínculo familiar", text: "Gideon tiene una hija, pero se desconoce su identidad. No se crea una ficha individual para ella." }],
    hera: [{ name: "Alessandro Orsini", type: "Vínculo familiar", text: "Es el padre de Eliana Orsini Rossi (Hera Orsini). No tiene expediente en el registro de personajes." }, { name: "Bianca Rossi", type: "Vínculo familiar", text: "Es la madre de Eliana Orsini Rossi (Hera Orsini). No tiene expediente en el registro de personajes." }],
    rosaline: [{ name: "Cassian", type: "Vínculo familiar", text: "Es el marido de Rosaline y padre de Selene. Es distinto de Kassian Vorler; no existe expediente de Cassian en el registro de personajes." }, { name: "Camille Valmont", type: "Vínculo familiar", text: "Hija fallecida de Rosaline y hermana de Selene; no tiene expediente en el registro de personajes." }, { name: "Anabella", type: "Vínculo familiar", text: "Madre de Rosaline y abuela de Selene; no tiene expediente en el registro de personajes." }, { name: "Adorian", type: "Vínculo familiar", text: "Padre de Rosaline y abuelo de Selene; no tiene expediente en el registro de personajes." }],
    selene: [{ name: "Cassian", type: "Vínculo familiar", text: "Padre de Selene y marido de Rosaline; no tiene expediente en el registro de personajes. No confundir con Kassian Vorler." }, { name: "Camille Valmont", type: "Vínculo familiar", text: "Hermana fallecida de Selene; no tiene expediente en el registro de personajes." }, { name: "Anabella", type: "Vínculo familiar y afectivo", text: "Abuela de Selene y su principal apoyo emocional; no tiene expediente en el registro de personajes." }, { name: "Adorian", type: "Vínculo familiar", text: "Abuelo de Selene; no consta una relación especialmente cercana. No tiene expediente en el registro de personajes." }],
    jassper: [{ name: "Bastión", type: "Vínculo institucional", text: "Jassper es psiquiatra de Bastión. El registro no lo considera enemigo ni afirma una relación personal con todos los miembros." }]
  };

  return { people, relationships, events, pacts, externalReferences };
})();
