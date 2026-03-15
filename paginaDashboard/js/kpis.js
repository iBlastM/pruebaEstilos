// ── KPIS.JS ───────────────────────────────────────────────────────────────────
// Rellena las tarjetas de KPI globales en cuanto los datos están listos.

document.addEventListener('datosListos', () => {
    const data  = window.dashData;
    const total = data.length;

    const importeTotal = data.reduce((s, d) => s + d.IMPORTE, 0);
    const importeProm  = importeTotal / total;
    const edadProm     = data.reduce((s, d) => s + d.EDAD, 0) / total;
    const s1           = data.filter(d => d.SEMESTRE === '1').length;
    const s2           = data.filter(d => d.SEMESTRE === '2').length;

    const fmt = (v, opts) => v.toLocaleString('es-MX', opts || {});

    document.getElementById('kpi-total-val').textContent        = fmt(total);
    document.getElementById('kpi-importe-total-val').textContent = '$' + fmt(importeTotal, { maximumFractionDigits: 0 });
    document.getElementById('kpi-importe-prom-val').textContent  = '$' + fmt(importeProm, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('kpi-edad-prom-val').textContent     = fmt(edadProm, { maximumFractionDigits: 1 }) + ' años';
    document.getElementById('kpi-s1-val').textContent           = fmt(s1) + ' becarios';
    document.getElementById('kpi-s2-val').textContent           = fmt(s2) + ' becarios';
});
