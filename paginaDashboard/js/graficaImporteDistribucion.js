// ── GRAFICA_IMPORTE_DISTRIBUCION.JS ──────────────────────────────────────────
// Gráfica 9: Distribución del Importe de Beca (histograma)

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-importe-dist');
    el.classList.remove('loading');

    const importes = window.dashData.map(d => d.IMPORTE).filter(v => v > 0);

    Plotly.newPlot(el, [{
        type: 'histogram',
        x: importes,
        nbinsx: 28,
        marker: {
            color: C.naranja,
            line: { color: 'rgba(255,255,255,0.08)', width: 0.5 },
        },
        hovertemplate: 'Rango: $%{x:,.0f}<br>Frecuencia: %{y:,}<extra></extra>',
    }], getLayout('Distribución del Importe de Beca', {
        showlegend: false,
        bargap: 0.04,
        xaxis: { title: 'Importe ($)', tickformat: '$,', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        yaxis: { title: 'Frecuencia', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        margin: { t: 58, r: 18, b: 68, l: 68 },
    }), plotConfig);
});
