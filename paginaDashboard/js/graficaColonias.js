// ── GRAFICA_COLONIAS.JS ───────────────────────────────────────────────────────
// Gráfica 6: Top 20 Colonias con más Beneficiarios (barras horizontales)

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-colonias');
    el.classList.remove('loading');

    const conteo  = contarPor(window.dashData, 'COLONIA');
    const entries = topN(conteo, 20);

    const y = entries.map(([k]) => k).reverse();
    const x = entries.map(([, v]) => v).reverse();

    Plotly.newPlot(el, [{
        type: 'bar',
        orientation: 'h',
        x,
        y,
        marker: {
            color: x.map((_, i) => `rgba(82, 188, 163, ${0.38 + 0.62 * (i / Math.max(x.length - 1, 1))})`),
            line: { width: 0 },
        },
        text: x.map(v => v.toLocaleString('es-MX')),
        textposition: 'outside',
        textfont: { color: '#FFFFFF', size: 10 },
        hovertemplate: '<b>%{y}</b><br>%{x:,} beneficiarios<extra></extra>',
    }], getLayout('Top 20 Colonias', {
        showlegend: false,
        xaxis: { title: 'Beneficiarios', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        yaxis: { automargin: true, gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        margin: { t: 58, r: 65, b: 58, l: 14 },
    }), plotConfig);
});
