// ── GRAFICA_IMPORTE_TIPO.JS ───────────────────────────────────────────────────
// Importe Total invertido por Delegación — Top 15 (barras horizontales)

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-importe-tipo');
    el.classList.remove('loading');

    const sumas   = sumarPor(window.dashData, 'DELEGACION', 'IMPORTE');
    const entries = topN(sumas, 15);

    const y = entries.map(([k]) => k).reverse();
    const x = entries.map(([, v]) => v).reverse();

    Plotly.newPlot(el, [{
        type: 'bar',
        orientation: 'h',
        x, y,
        marker: {
            color: x.map((_, i) => `rgba(229, 134, 6, ${0.38 + 0.62 * (i / Math.max(x.length - 1, 1))})`),
            line: { width: 0 },
        },
        text: x.map(v => '$' + (v / 1e6).toFixed(2) + 'M'),
        textposition: 'outside',
        textfont: { color: '#FFFFFF', size: 10 },
        hovertemplate: '<b>%{y}</b><br>Total: $%{x:,.0f}<extra></extra>',
    }], getLayout('Importe Total Invertido por Delegación (Top 15)', {
        showlegend: false,
        xaxis: {
            title: 'Importe Total ($)', tickformat: '$,.0s',
            gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)',
        },
        yaxis: { automargin: true, gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        margin: { t: 58, r: 90, b: 58, l: 14 },
    }), plotConfig);
});
