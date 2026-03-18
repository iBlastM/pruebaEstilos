// ── GRAFICA_IMPORTE_DELEGACION_PROM.JS ────────────────────────────────────────
// Importe Promedio por Delegación — Top 15 (barras horizontales)
// Complementa la gráfica de importe total: revela qué zonas reciben becas
// de mayor monto unitario, independientemente del volumen de beneficiarios.

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-importe-prom-deleg');
    if (!el) return;
    el.classList.remove('loading');

    const promedios = promediarPor(window.dashData, 'DELEGACION', 'IMPORTE');
    const entries   = topN(promedios, 15);

    const y = entries.map(([k]) => k).reverse();
    const x = entries.map(([, v]) => v).reverse();

    Plotly.newPlot(el, [{
        type: 'bar',
        orientation: 'h',
        x, y,
        marker: {
            color: x.map((_, i) => `rgba(82, 188, 163, ${0.38 + 0.62 * (i / Math.max(x.length - 1, 1))})`),
            line: { width: 0 },
        },
        text: x.map(v => '$' + v.toLocaleString('es-MX', { maximumFractionDigits: 0 })),
        textposition: 'outside',
        textfont: { color: '#FFFFFF', size: 10 },
        hovertemplate: '<b>%{y}</b><br>Promedio: $%{x:,.2f}<extra></extra>',
    }], getLayout('Importe Promedio por Delegación (Top 15)', {
        showlegend: false,
        xaxis: {
            title: 'Importe Promedio ($)', tickformat: '$,.0f',
            gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)',
        },
        yaxis: { automargin: true, gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        margin: { t: 58, r: 90, b: 58, l: 14 },
    }), plotConfig);
});
