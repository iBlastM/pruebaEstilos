// ── GRAFICA_GRUPO_EDAD.JS ─────────────────────────────────────────────────────
// Gráfica 2: Distribución por Grupo de Edad (barras)

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-grupo-edad');
    el.classList.remove('loading');

    const orden  = ['<12', '12-14', '15-17', '18-20', '21-24', '25-29', '30+'];
    const conteo = contarPor(window.dashData, 'GRUPO_EDAD');
    const y      = orden.map(g => conteo[g] || 0);

    Plotly.newPlot(el, [{
        type: 'bar',
        x: orden,
        y,
        marker: {
            color: orden.map((_, i) => C.paleta[i % C.paleta.length]),
            line: { width: 0 },
        },
        text: y.map(v => v.toLocaleString('es-MX')),
        textposition: 'outside',
        textfont: { color: '#FFFFFF', size: 11 },
        hovertemplate: '<b>%{x}</b><br>%{y:,} beneficiarios<extra></extra>',
    }], getLayout('Distribución por Grupo de Edad', {
        showlegend: false,
        xaxis: { title: 'Grupo de edad', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)', tickcolor: 'rgba(255,255,255,0.6)' },
        yaxis: { title: 'Beneficiarios', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)', tickcolor: 'rgba(255,255,255,0.6)' },
        margin: { t: 58, r: 18, b: 58, l: 68 },
    }), plotConfig);
});
