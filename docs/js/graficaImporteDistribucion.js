// ── GRAFICA_IMPORTE_DISTRIBUCION.JS ──────────────────────────────────────────
// Importe Promedio por Género × Nivel Educativo — análisis de equidad

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-importe-dist');
    el.classList.remove('loading');

    const data    = window.dashData;
    const generos = [...new Set(data.map(d => d.GENERO).filter(Boolean))].sort();
    const niveles = [...new Set(data.map(d => d.NIVEL_EDUCATIVO).filter(Boolean))].sort();

    const traces = generos.map((g, i) => {
        const sub  = data.filter(d => d.GENERO === g);
        const prom = promediarPor(sub, 'NIVEL_EDUCATIVO', 'IMPORTE');
        const yVals = niveles.map(n => +(prom[n] || 0).toFixed(2));
        return {
            type: 'bar',
            name: `<b>${g}</b>`,
            x: niveles,
            y: yVals,
            marker: { color: C.paleta[i] || C.naranja, line: { width: 0 } },
            text: yVals.map(v => v ? '$' + v.toLocaleString('es-MX', { maximumFractionDigits: 0 }) : ''),
            textposition: 'outside',
            textfont: { size: 9, color: '#FFFFFF' },
            hovertemplate: `<b>${g}</b><br>%{x}<br>Promedio: $%{y:,.2f}<extra></extra>`,
        };
    });

    Plotly.newPlot(el, traces, getLayout('Importe Promedio por Género y Nivel Educativo', {
        barmode: 'group',
        showlegend: true,
        legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.28 },
        xaxis: {
            automargin: true, tickangle: -30,
            gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)',
        },
        yaxis: {
            title: 'Importe Promedio ($)', tickformat: '$,.0f',
            gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)',
        },
        margin: { t: 58, r: 18, b: 95, l: 80 },
    }), plotConfig);
});
