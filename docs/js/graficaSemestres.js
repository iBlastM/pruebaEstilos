// ── GRAFICA_SEMESTRES.JS ──────────────────────────────────────────────────────
// Gráfica 10: Beneficiarios por Semestre × Nivel Educativo (barras agrupadas)
// Gráfica 11: Importe Total por Semestre × Tipo de Beca (barras agrupadas)

document.addEventListener('datosListos', () => {
    const data = window.dashData;
    const sem1 = data.filter(d => d.SEMESTRE === '1');
    const sem2 = data.filter(d => d.SEMESTRE === '2');

    // ── Gráfica 10: Beneficiarios por nivel educativo ─────────────────────────
    const elBen = document.getElementById('chart-semestre-beneficiarios');
    elBen.classList.remove('loading');

    const niveles = [...new Set(data.map(d => d.NIVEL_EDUCATIVO))].sort();
    const c1 = contarPor(sem1, 'NIVEL_EDUCATIVO');
    const c2 = contarPor(sem2, 'NIVEL_EDUCATIVO');

    Plotly.newPlot(elBen, [
        {
            type: 'bar', name: '<b>Semestre 1</b>',
            x: niveles, y: niveles.map(n => c1[n] || 0),
            marker: { color: C.naranja, line: { width: 0 } },
            hovertemplate: '<b>%{x}</b><br>Sem 1: %{y:,} becarios<extra></extra>',
        },
        {
            type: 'bar', name: '<b>Semestre 2</b>',
            x: niveles, y: niveles.map(n => c2[n] || 0),
            marker: { color: C.verde, line: { width: 0 } },
            hovertemplate: '<b>%{x}</b><br>Sem 2: %{y:,} becarios<extra></extra>',
        },
    ], getLayout('Beneficiarios por Semestre y Nivel Educativo', {
        barmode: 'group',
        showlegend: true,
        legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.32 },
        xaxis: { automargin: true, tickangle: -32, gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        yaxis: { title: 'Beneficiarios', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        margin: { t: 58, r: 18, b: 95, l: 68 },
    }), plotConfig);

    // ── Gráfica 11: Importe total por tipo de beca ────────────────────────────
    const elImp = document.getElementById('chart-semestre-importe');
    elImp.classList.remove('loading');

    const tipos = [...new Set(data.map(d => d.TIPO_BECA))].sort();
    const s1Imp = sumarPor(sem1, 'TIPO_BECA', 'IMPORTE');
    const s2Imp = sumarPor(sem2, 'TIPO_BECA', 'IMPORTE');

    Plotly.newPlot(elImp, [
        {
            type: 'bar', name: '<b>Semestre 1</b>',
            x: tipos, y: tipos.map(t => s1Imp[t] || 0),
            marker: { color: C.naranja, line: { width: 0 } },
            hovertemplate: '<b>%{x}</b><br>Sem 1: $%{y:,.0f}<extra></extra>',
        },
        {
            type: 'bar', name: '<b>Semestre 2</b>',
            x: tipos, y: tipos.map(t => s2Imp[t] || 0),
            marker: { color: C.verde, line: { width: 0 } },
            hovertemplate: '<b>%{x}</b><br>Sem 2: $%{y:,.0f}<extra></extra>',
        },
    ], getLayout('Importe Total por Semestre y Tipo de Beca', {
        barmode: 'group',
        showlegend: true,
        legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.32 },
        xaxis: { automargin: true, tickangle: -32, gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        yaxis: { title: 'Importe ($)', tickformat: '$,.0s', gridcolor: 'rgba(255,255,255,0.08)', linecolor: 'rgba(255,255,255,0.2)' },
        margin: { t: 58, r: 18, b: 95, l: 72 },
    }), plotConfig);
});
