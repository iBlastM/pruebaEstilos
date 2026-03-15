// ── GRAFICA_MODALIDAD.JS ──────────────────────────────────────────────────────
// Gráfica 18: Modalidad — campo TIPO (donut)

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-modalidad');
    el.classList.remove('loading');

    const conteo = contarPor(window.dashData, 'TIPO');
    const labels = Object.keys(conteo);
    const values = Object.values(conteo);

    Plotly.newPlot(el, [{
        type: 'pie',
        labels,
        values,
        hole: 0.52,
        marker: {
            colors: C.paleta,
            line: { color: C.paperBg, width: 2 },
        },
        textfont: { color: '#FFFFFF', size: 12, family: C.fuente },
        textinfo: 'label+percent',
        hovertemplate: '<b>%{label}</b><br>%{value:,} beneficiarios<br>%{percent}<extra></extra>',
    }], getLayout('Modalidad (TIPO)', {
        showlegend: false,
        margin: { t: 58, r: 10, b: 20, l: 10 },
    }), plotConfig);
});
