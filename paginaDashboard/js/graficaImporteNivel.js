// ── GRAFICA_IMPORTE_NIVEL.JS ──────────────────────────────────────────────────
// Gráfica 7: Importe Total por Nivel Educativo, agrupado por semestre (barras)

document.addEventListener('datosListos', () => {
    const el   = document.getElementById('chart-importe-nivel');
    el.classList.remove('loading');

    const data    = window.dashData;
    const sem1    = data.filter(d => d.SEMESTRE === '1');
    const sem2    = data.filter(d => d.SEMESTRE === '2');
    const niveles = [...new Set(data.map(d => d.NIVEL_EDUCATIVO))].sort();

    const sumas1 = sumarPor(sem1, 'NIVEL_EDUCATIVO', 'IMPORTE');
    const sumas2 = sumarPor(sem2, 'NIVEL_EDUCATIVO', 'IMPORTE');

    const fmt = v => '$' + (v / 1e6).toFixed(1) + 'M';

    Plotly.newPlot(el, [
        {
            type: 'bar', name: '<b>Semestre 1</b>',
            x: niveles, y: niveles.map(n => sumas1[n] || 0),
            marker: { color: C.naranja, line: { width: 0 } },
            text: niveles.map(n => fmt(sumas1[n] || 0)),
            textposition: 'outside',
            textfont: { size: 9, color: '#FFFFFF' },
            hovertemplate: '<b>%{x}</b><br>Sem 1: $%{y:,.0f}<extra></extra>',
        },
        {
            type: 'bar', name: '<b>Semestre 2</b>',
            x: niveles, y: niveles.map(n => sumas2[n] || 0),
            marker: { color: C.verde, line: { width: 0 } },
            text: niveles.map(n => fmt(sumas2[n] || 0)),
            textposition: 'outside',
            textfont: { size: 9, color: '#FFFFFF' },
            hovertemplate: '<b>%{x}</b><br>Sem 2: $%{y:,.0f}<extra></extra>',
        },
    ], getLayout('Importe Total por Nivel Educativo', {
        barmode: 'group',
        showlegend: true,
        legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.28 },
        xaxis: {
            automargin: true, tickangle: -35,
            gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)',
        },
        yaxis: {
            title: 'Importe ($)', tickformat: '$,.0s',
            gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)',
        },
        margin: { t: 58, r: 18, b: 90, l: 72 },
    }), plotConfig);
});
