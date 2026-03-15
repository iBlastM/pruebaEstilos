// ── GRAFICA_GRADO.JS ──────────────────────────────────────────────────────────
// Gráfica 17: Distribución por Grado Escolar (barras)

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-grado');
    el.classList.remove('loading');

    const conteo  = contarPor(window.dashData, 'GRADO');
    const entries = Object.entries(conteo).sort(([a], [b]) => Number(a) - Number(b));
    const x       = entries.map(([k]) => String(k));
    const y       = entries.map(([, v]) => v);

    Plotly.newPlot(el, [{
        type: 'bar',
        x,
        y,
        marker: { color: C.naranja, line: { width: 0 } },
        text: y.map(v => v.toLocaleString('es-MX')),
        textposition: 'outside',
        textfont: { color: '#FFFFFF', size: 11 },
        hovertemplate: '<b>Grado %{x}</b><br>%{y:,} beneficiarios<extra></extra>',
    }], getLayout('Distribución por Grado Escolar', {
        showlegend: false,
        xaxis: { title: 'Grado', type: 'category', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)', tickcolor: 'rgba(255,255,255,0.6)' },
        yaxis: { title: 'Beneficiarios', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)', tickcolor: 'rgba(255,255,255,0.6)' },
        margin: { t: 58, r: 18, b: 58, l: 68 },
    }), plotConfig);
});
