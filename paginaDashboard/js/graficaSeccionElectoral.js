// ── GRAFICA_SECCION_ELECTORAL.JS ──────────────────────────────────────────────
// Gráfica 12: Top 15 Secciones Electorales 2025 (barras)

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-seccion-electoral');
    el.classList.remove('loading');

    const conteo  = contarPor(window.dashData, 'SEC_ELEC_2025');
    const entries = topN(conteo, 15);

    const x = entries.map(([k]) => String(k));
    const y = entries.map(([, v]) => v);

    Plotly.newPlot(el, [{
        type: 'bar',
        x,
        y,
        marker: { color: C.verde, line: { width: 0 } },
        text: y.map(v => v.toLocaleString('es-MX')),
        textposition: 'outside',
        textfont: { color: '#FFFFFF', size: 10 },
        hovertemplate: 'Sección <b>%{x}</b><br>%{y:,} beneficiarios<extra></extra>',
    }], getLayout('Top 15 — Secciones Electorales 2025', {
        showlegend: false,
        xaxis: {
            title: 'Sección Electoral',
            type: 'category',
            tickangle: -45,
            gridcolor: 'rgba(255,255,255,0.08)',
            linecolor: 'rgba(255,255,255,0.2)',
        },
        yaxis: { title: 'Beneficiarios', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        margin: { t: 58, r: 18, b: 80, l: 68 },
    }), plotConfig);
});
