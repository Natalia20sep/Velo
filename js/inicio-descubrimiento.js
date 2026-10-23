document.addEventListener("DOMContentLoaded", () => {
  const records = Array.isArray(window.VELO_ARCHIVE_RECORDS)
    ? window.VELO_ARCHIVE_RECORDS.filter((record) => Number(record.accessLevel || 1) <= 2)
    : [];
  const code = document.getElementById("discovery-code");
  const title = document.getElementById("discovery-record-title");
  const summary = document.getElementById("discovery-summary");
  const link = document.getElementById("discovery-link");
  const refresh = document.getElementById("discovery-refresh");
  let previousIndex = -1;

  function showRecord() {
    if (!records.length || !code || !title || !summary || !link) return;
    let index = Math.floor(Math.random() * records.length);
    if (records.length > 1 && index === previousIndex) index = (index + 1) % records.length;
    previousIndex = index;
    const record = records[index];
    code.textContent = `${record.code || "REGISTRO"} · ${record.category || "ARCHIVO"}`;
    title.textContent = record.title || "Registro sin título";
    summary.textContent = record.summary || "La descripción de este registro aún no está disponible.";
    const recordCode = record.code || record.title || "";
    link.href = `archivo/archivo.html?q=${encodeURIComponent(recordCode)}&open=${encodeURIComponent(record.code || "")}`;
    link.setAttribute("aria-label", `Buscar ${record.title || record.code} en el Archivo Central`);
  }

  refresh?.addEventListener("click", showRecord);
  showRecord();
});
