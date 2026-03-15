// ── GRAFICA_TIPO_BECA.JS ──────────────────────────────────────────────────────
// Gráfica 4: Beneficiarios por Tipo de Beca (donut)

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-tipo-beca');
    el.classList.remove('loading');

    const conteo  = contarPor(window.dashData, 'TIPO_BECA');
    const entries = topN(conteo, 12);
    const labels  = entries.map(([k]) => k);
    const values  = entries.map(([, v]) => v);

    Plotly.newPlot(el, [{
        type: 'pie',
        labels,
        values,
        hole: 0.46,
        marker: {
            colors: C.paleta,
            line: { color: C.paperBg, width: 2 },
        },
        textfont: { color: '#FFFFFF', size: 11, family: C.fuente },
        textinfo: 'percent',
        hovertemplate: '<b>%{label}</b><br>%{value:,} becarios (%{percent})<extra></extra>',
    }], getLayout('Beneficiarios por Tipo de Beca', {
        showlegend: true,
        legend: {
            orientation: 'v',
            x: 1.02, xanchor: 'left',
            y: 0.5,  yanchor: 'middle',
            font: { size: 10, color: '#FFFFFF' },
            bgcolor: 'rgba(0,0,0,0.2)',
            bordercolor: 'rgba(255,255,255,0.12)',
            borderwidth: 1,
        },
        margin: { t: 58, r: 160, b: 24, l: 10 },
    }), plotConfig);
});
