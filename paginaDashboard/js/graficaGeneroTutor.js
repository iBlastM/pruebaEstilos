// ── GRAFICA_GENERO_TUTOR.JS ───────────────────────────────────────────────────
// Gráfica 16: Género del Tutor (donut)

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-genero-tutor');
    el.classList.remove('loading');

    const conteo = contarPor(window.dashData, 'GENERO_TUTOR');
    const labels = Object.keys(conteo);
    const values = Object.values(conteo);

    Plotly.newPlot(el, [{
        type: 'pie',
        labels,
        values,
        hole: 0.52,
        marker: {
            colors: [C.verde, C.naranja, '#A855F7', '#EC4899'],
            line: { color: C.paperBg, width: 2 },
        },
        textfont: { color: '#FFFFFF', size: 13, family: C.fuente },
        textinfo: 'label+percent',
        hovertemplate: '<b>%{label}</b><br>%{value:,} tutores<br>%{percent}<extra></extra>',
    }], getLayout('Género del Tutor', {
        showlegend: false,
        margin: { t: 58, r: 10, b: 20, l: 10 },
    }), plotConfig);
});
