// ── GRAFICA_GENERO.JS ─────────────────────────────────────────────────────────
// Gráfica 1: Distribución por Género (donut)

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-genero');
    el.classList.remove('loading');

    const conteo = contarPor(window.dashData, 'GENERO');
    const labels = Object.keys(conteo);
    const values = Object.values(conteo);

    Plotly.newPlot(el, [{
        type: 'pie',
        labels,
        values,
        hole: 0.52,
        marker: {
            colors: [C.naranja, C.verde, '#A855F7', '#EC4899'],
            line: { color: C.paperBg, width: 2 },
        },
        textfont: { color: '#FFFFFF', size: 13, family: C.fuente },
        textinfo: 'label+percent',
        hovertemplate: '<b>%{label}</b><br>%{value:,} becarios<br>%{percent}<extra></extra>',
    }], getLayout('Distribución por Género', {
        showlegend: false,
        margin: { t: 58, r: 10, b: 20, l: 10 },
    }), plotConfig);
});
