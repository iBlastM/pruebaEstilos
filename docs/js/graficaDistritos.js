// ── GRAFICA_DISTRITOS.JS ──────────────────────────────────────────────────────
// Gráfica 13: Top 10 Distrito Federal (barras horizontales)
// Gráfica 14: Top 10 Distrito Local   (barras horizontales)

document.addEventListener('datosListos', () => {
    const data = window.dashData;

    // ── Distrito Federal ───────────────────────────────────────────────────────
    const elFed = document.getElementById('chart-distrito-federal');
    elFed.classList.remove('loading');

    const cFed  = contarPor(data, 'D_FEDERAL');
    const eFed  = topN(cFed, 10);
    const yFed  = eFed.map(([k]) => `Dist. ${k}`).reverse();
    const xFed  = eFed.map(([, v]) => v).reverse();

    Plotly.newPlot(elFed, [{
        type: 'bar', orientation: 'h',
        x: xFed, y: yFed,
        marker: { color: C.naranja, line: { width: 0 } },
        text: xFed.map(v => v.toLocaleString('es-MX')),
        textposition: 'outside',
        textfont: { color: '#FFFFFF', size: 11 },
        hovertemplate: '<b>%{y}</b><br>%{x:,} beneficiarios<extra></extra>',
    }], getLayout('Top 10 — Distrito Federal', {
        showlegend: false,
        xaxis: { title: 'Beneficiarios', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        yaxis: { automargin: true, gridcolor: 'rgba(255,255,255,0.08)' },
        margin: { t: 58, r: 65, b: 58, l: 14 },
    }), plotConfig);

    // ── Distrito Local ─────────────────────────────────────────────────────────
    const elLoc = document.getElementById('chart-distrito-local');
    elLoc.classList.remove('loading');

    const cLoc  = contarPor(data, 'D_LOCAL');
    const eLoc  = topN(cLoc, 10);
    const yLoc  = eLoc.map(([k]) => `Dist. ${k}`).reverse();
    const xLoc  = eLoc.map(([, v]) => v).reverse();

    Plotly.newPlot(elLoc, [{
        type: 'bar', orientation: 'h',
        x: xLoc, y: yLoc,
        marker: { color: C.verde, line: { width: 0 } },
        text: xLoc.map(v => v.toLocaleString('es-MX')),
        textposition: 'outside',
        textfont: { color: '#FFFFFF', size: 11 },
        hovertemplate: '<b>%{y}</b><br>%{x:,} beneficiarios<extra></extra>',
    }], getLayout('Top 10 — Distrito Local', {
        showlegend: false,
        xaxis: { title: 'Beneficiarios', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        yaxis: { automargin: true, gridcolor: 'rgba(255,255,255,0.08)' },
        margin: { t: 58, r: 65, b: 58, l: 14 },
    }), plotConfig);
});
