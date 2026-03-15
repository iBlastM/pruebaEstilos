// ── GRAFICA_ESCUELAS.JS ───────────────────────────────────────────────────────
// Gráfica 15: Top 10 Escuelas con más Beneficiarios (barras horizontales)

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-escuelas');
    el.classList.remove('loading');

    const conteo  = contarPor(window.dashData, 'ESCUELA');
    const entries = topN(conteo, 10);

    const y = entries.map(([k]) => k).reverse();
    const x = entries.map(([, v]) => v).reverse();

    Plotly.newPlot(el, [{
        type: 'bar',
        orientation: 'h',
        x,
        y,
        marker: {
            color: x.map((_, i) => `rgba(229, 134, 6, ${0.45 + 0.55 * (i / Math.max(x.length - 1, 1))})`),
            line: { width: 0 },
        },
        text: x.map(v => v.toLocaleString('es-MX')),
        textposition: 'outside',
        textfont: { color: '#FFFFFF', size: 11 },
        hovertemplate: '<b>%{y}</b><br>%{x:,} beneficiarios<extra></extra>',
    }], getLayout('Top 10 Escuelas con más Beneficiarios', {
        showlegend: false,
        xaxis: { title: 'Beneficiarios', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        yaxis: { automargin: true, gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        margin: { t: 58, r: 65, b: 58, l: 14 },
    }), plotConfig);
});
