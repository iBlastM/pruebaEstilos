// ── GRAFICA_IMPORTE_TIPO.JS ───────────────────────────────────────────────────
// Gráfica 8: Importe Promedio por Tipo de Beca (barras horizontales)

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-importe-tipo');
    el.classList.remove('loading');

    const promedios = promediarPor(window.dashData, 'TIPO_BECA', 'IMPORTE');
    const entries   = topN(promedios, 12);

    const y = entries.map(([k]) => k).reverse();
    const x = entries.map(([, v]) => v).reverse();

    Plotly.newPlot(el, [{
        type: 'bar',
        orientation: 'h',
        x,
        y,
        marker: { color: C.verde, line: { width: 0 } },
        text: x.map(v => '$' + v.toLocaleString('es-MX', { maximumFractionDigits: 0 })),
        textposition: 'outside',
        textfont: { color: '#FFFFFF', size: 10 },
        hovertemplate: '<b>%{y}</b><br>Promedio: $%{x:,.2f}<extra></extra>',
    }], getLayout('Importe Promedio por Tipo de Beca', {
        showlegend: false,
        xaxis: { title: 'Importe Promedio ($)', tickformat: '$,.0f', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        yaxis: { automargin: true, gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        margin: { t: 58, r: 85, b: 58, l: 14 },
    }), plotConfig);
});
