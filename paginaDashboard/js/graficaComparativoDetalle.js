// ── GRAFICA_COMPARATIVO_DETALLE.JS ────────────────────────────────────────────
// Análisis profundo S1 vs S2 — 5 gráficas del notebook:
//   A. Barras agrupadas: beneficiarios por tipo de beca con Δ anotado
//   B. Barras horizontales 100% apiladas: composición del mix (%)
//   C. Variación en puntos porcentuales del mix (Δpp)
//   D. Waterfall: descomposición del cambio en importe promedio
//   E. Importe total erogado por tipo de beca

document.addEventListener('datosListos', () => {
    const data = window.dashData;
    const s1 = data.filter(d => d.SEMESTRE === '1');
    const s2 = data.filter(d => d.SEMESTRE === '2');

    const ORDER = ['PRIMARIA', 'PRIMARIA EXCELENCIA', 'SECUNDARIA', 'SECUNDARIA EXCELENCIA'];
    const TIPO_COLORS = {
        'PRIMARIA':              '#5B8AF5',
        'PRIMARIA EXCELENCIA':   '#F5A623',
        'SECUNDARIA':            '#50C878',
        'SECUNDARIA EXCELENCIA': '#FF6B6B',
    };
    // Importe fijo por categoría (extraído del análisis del notebook)
    const IMPORTES_CAT = {
        'PRIMARIA': 910,
        'PRIMARIA EXCELENCIA': 1820,
        'SECUNDARIA': 1040,
        'SECUNDARIA EXCELENCIA': 2080,
    };

    // ── datos base ──────────────────────────────────────────────────────────
    const c1 = contarPor(s1, 'TIPO_BECA');
    const c2 = contarPor(s2, 'TIPO_BECA');
    const n1 = s1.length;
    const n2 = s2.length;

    const mix1 = {};
    const mix2 = {};
    ORDER.forEach(t => {
        mix1[t] = (c1[t] || 0) / n1 * 100;
        mix2[t] = (c2[t] || 0) / n2 * 100;
    });

    const promS1 = s1.reduce((a, d) => a + d.IMPORTE, 0) / n1;
    const promS2 = s2.reduce((a, d) => a + d.IMPORTE, 0) / n2;
    const tipoImp = promediarPor(data, 'TIPO_BECA', 'IMPORTE');
    const promS2ConMixS1 = ORDER.reduce((a, t) => a + (mix1[t] / 100) * (tipoImp[t] || 0), 0);
    const efectoComposicion = parseFloat((promS2ConMixS1 - promS1).toFixed(2));
    const efectoMix = parseFloat((promS2 - promS1).toFixed(2));

    // ════════════════════════════════════════════════════════════════════════
    // GRÁFICA A — Barras agrupadas: beneficiarios por tipo con Δ anotado
    // ════════════════════════════════════════════════════════════════════════
    const elA = document.getElementById('chart-sem-tipo-beneficiarios');
    if (elA) {
        elA.classList.remove('loading');
        const deltas = ORDER.map(t => (c2[t] || 0) - (c1[t] || 0));
        const maxBarA = Math.max(...ORDER.map(t => Math.max(c1[t] || 0, c2[t] || 0)));

        Plotly.newPlot(elA, [
            {
                type: 'bar', name: '<b>Semestre 1</b>',
                x: ORDER, y: ORDER.map(t => c1[t] || 0),
                marker: { color: C.naranja },
                text: ORDER.map(t => (c1[t] || 0).toLocaleString()),
                textposition: 'outside',
                textfont: { color: '#FFFFFF', size: 11 },
                cliponaxis: false,
                hovertemplate: '<b>%{x}</b><br>Sem 1: %{y:,}<extra></extra>',
            },
            {
                type: 'bar', name: '<b>Semestre 2</b>',
                x: ORDER, y: ORDER.map(t => c2[t] || 0),
                marker: { color: C.verde },
                text: ORDER.map(t => (c2[t] || 0).toLocaleString()),
                textposition: 'outside',
                textfont: { color: '#FFFFFF', size: 11 },
                cliponaxis: false,
                hovertemplate: '<b>%{x}</b><br>Sem 2: %{y:,}<extra></extra>',
            },
        ], getLayout('Beneficiarios por Tipo de Beca — S1 vs S2', {
            barmode: 'group',
            annotations: ORDER.map((t, i) => ({
                x: t,
                y: Math.max(c1[t] || 0, c2[t] || 0) * 1.12,
                text: `<b>${deltas[i] >= 0 ? '+' : ''}${deltas[i].toLocaleString()}</b>`,
                font: { color: deltas[i] >= 0 ? '#50C878' : '#FF6B6B', size: 13 },
                showarrow: false,
                xanchor: 'center',
            })),
            showlegend: true,
            legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.3 },
            xaxis: { automargin: true, tickangle: -18, gridcolor: 'rgba(255,255,255,0.08)' },
            yaxis: { title: 'Beneficiarios', gridcolor: 'rgba(255,255,255,0.08)', range: [0, maxBarA * 1.40] },
            margin: { t: 68, r: 20, b: 95, l: 68 },
        }), plotConfig);
    }

    // ════════════════════════════════════════════════════════════════════════
    // GRÁFICA B — Barras horizontales 100% apiladas: composición del mix
    // ════════════════════════════════════════════════════════════════════════
    const elB = document.getElementById('chart-sem-mix-100');
    if (elB) {
        elB.classList.remove('loading');

        Plotly.newPlot(elB, ORDER.map(t => ({
            type: 'bar',
            name: t,
            y: ['Semestre 1', 'Semestre 2'],
            x: [+mix1[t].toFixed(1), +mix2[t].toFixed(1)],
            orientation: 'h',
            marker: { color: TIPO_COLORS[t] },
            text: [`${mix1[t].toFixed(1)}%`, `${mix2[t].toFixed(1)}%`],
            textposition: 'inside',
            textfont: { size: 12, color: 'white' },
            hovertemplate: `<b>${t}</b><br>%{y}: %{x:.1f}%<extra></extra>`,
        })), getLayout('Composición del Mix de Tipos de Beca (%) — S1 vs S2', {
            barmode: 'stack',
            showlegend: true,
            legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.32 },
            xaxis: { title: '% del total', gridcolor: 'rgba(255,255,255,0.08)' },
            yaxis: { automargin: true },
            margin: { t: 58, r: 20, b: 95, l: 90 },
        }), plotConfig);
    }

    // ════════════════════════════════════════════════════════════════════════
    // GRÁFICA C — Δ puntos porcentuales del mix (S2 − S1)
    // ════════════════════════════════════════════════════════════════════════
    const elC = document.getElementById('chart-sem-delta-pp');
    if (elC) {
        elC.classList.remove('loading');
        const deltaPP = ORDER.map(t => +((mix2[t] - mix1[t]).toFixed(2)));

        const deltaAbsMax = Math.max(...deltaPP.map(Math.abs));
        const deltaPad = deltaAbsMax * 0.55;
        const deltaYMin = Math.min(...deltaPP) - deltaPad;
        const deltaYMax = Math.max(...deltaPP) + deltaPad;

        Plotly.newPlot(elC, [{
            type: 'bar',
            x: ORDER,
            y: deltaPP,
            marker: { color: deltaPP.map(v => v >= 0 ? '#50C878' : '#FF6B6B') },
            text: deltaPP.map(v => `${v >= 0 ? '+' : ''}${v.toFixed(1)} pp`),
            textposition: 'outside',
            textfont: { color: '#FFFFFF', size: 12 },
            cliponaxis: false,
            hovertemplate: '<b>%{x}</b><br>Δ: %{y:+.2f} pp<extra></extra>',
        }], getLayout('Cambio en el Mix de Tipos (Δ pp, S2 − S1)', {
            shapes: [{
                type: 'line',
                x0: -0.5, x1: ORDER.length - 0.5, y0: 0, y1: 0,
                line: { color: 'rgba(255,255,255,0.4)', width: 1 },
            }],
            xaxis: { automargin: true, tickangle: -18, gridcolor: 'rgba(255,255,255,0.08)' },
            yaxis: { title: 'Δ pp', gridcolor: 'rgba(255,255,255,0.08)', zeroline: false, range: [deltaYMin, deltaYMax] },
            margin: { t: 58, r: 20, b: 85, l: 68 },
        }), plotConfig);
    }

    // ════════════════════════════════════════════════════════════════════════
    // GRÁFICA D — Waterfall: descomposición del cambio en importe promedio
    // ════════════════════════════════════════════════════════════════════════
    const elD = document.getElementById('chart-sem-waterfall');
    if (elD) {
        elD.classList.remove('loading');
        const fmt = v => `$${Math.abs(v).toFixed(2)}`;

        Plotly.newPlot(elD, [{
            type: 'waterfall',
            orientation: 'v',
            measure: ['absolute', 'relative', 'total'],
            x: ['<b>Promedio S1</b>', '<b>Efecto Composición<br>(cambio de mix)</b>', '<b>Promedio S2</b>'],
            y: [promS1, efectoMix, 0],
            text: [
                `$${promS1.toFixed(2)}`,
                `${efectoMix >= 0 ? '+' : '-'}$${Math.abs(efectoMix).toFixed(2)}`,
                `$${promS2.toFixed(2)}`,
            ],
            textposition: 'outside',
            textfont: { color: '#FFFFFF', size: 13 },
            increasing:  { marker: { color: '#50C878' } },
            decreasing:  { marker: { color: '#FF6B6B' } },
            totals:      { marker: { color: C.naranja } },
            connector:   { line: { color: 'rgba(255,255,255,0.35)', dash: 'dot', width: 1 } },
            hovertemplate: '<b>%{x}</b><br>$%{y:,.2f}<extra></extra>',
        }], getLayout('Descomposición del Cambio en Importe Promedio — S1 → S2', {
            yaxis: {
                title: 'Importe ($)',
                gridcolor: 'rgba(255,255,255,0.08)',
                range: [Math.min(promS1, promS2) * 0.96, Math.max(promS1, promS2) * 1.08],
            },
            margin: { t: 58, r: 40, b: 64, l: 78 },
        }), plotConfig);
    }

    // ════════════════════════════════════════════════════════════════════════
    // GRÁFICA E — Importe total erogado por tipo de beca (S1 vs S2)
    // ════════════════════════════════════════════════════════════════════════
    const elE = document.getElementById('chart-sem-importe-tipo-detalle');
    if (elE) {
        elE.classList.remove('loading');
        const totalS1 = ORDER.map(t => (c1[t] || 0) * IMPORTES_CAT[t]);
        const totalS2 = ORDER.map(t => (c2[t] || 0) * IMPORTES_CAT[t]);

        Plotly.newPlot(elE, [
            {
                type: 'bar', name: '<b>Semestre 1</b>',
                x: ORDER, y: totalS1,
                marker: { color: C.naranja },
                text: totalS1.map(v => `$${(v / 1e6).toFixed(2)}M`),
                textposition: 'outside',
                textfont: { color: '#FFFFFF', size: 11 },
                hovertemplate: '<b>%{x}</b><br>Sem 1: $%{y:,.0f}<extra></extra>',
            },
            {
                type: 'bar', name: '<b>Semestre 2</b>',
                x: ORDER, y: totalS2,
                marker: { color: C.verde },
                text: totalS2.map(v => `$${(v / 1e6).toFixed(2)}M`),
                textposition: 'outside',
                textfont: { color: '#FFFFFF', size: 11 },
                hovertemplate: '<b>%{x}</b><br>Sem 2: $%{y:,.0f}<extra></extra>',
            },
        ], getLayout('Importe Total Erogado por Tipo de Beca — S1 vs S2', {
            barmode: 'group',
            showlegend: true,
            legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.3 },
            xaxis: { automargin: true, tickangle: -18, gridcolor: 'rgba(255,255,255,0.08)' },
            yaxis: { title: 'Importe Total ($)', tickformat: '$,.0s', gridcolor: 'rgba(255,255,255,0.08)' },
            margin: { t: 58, r: 20, b: 95, l: 78 },
        }), plotConfig);
    }
});
