// ── GRAFICA_COMPARATIVO_PERIODO.JS ────────────────────────────────────────────
// Comparativo por Periodo (2022-S1 … 2025-S2)
//   1. Beneficiarios totales por periodo (barras)
//   2. Beneficiarios por tipo de beca × periodo (barras agrupadas)
//   3. Composición del mix por periodo (barras 100% apiladas horizontal)
//   4. Importe promedio por periodo (línea)
//   5. Importe total por periodo (barras)
//   6. Variación de beneficiarios periodo a periodo (Δ %)
//   7. Nivel educativo × periodo (barras agrupadas)
//   8. Género × periodo (barras agrupadas)

document.addEventListener('datosListos', () => {
    const data = window.dashData;

    const PERIODOS_ORD = ['2022-S1', '2022-S2', '2023-S1', '2023-S2', '2025-S1', '2025-S2'];
    const periodosPresentes = PERIODOS_ORD.filter(p =>
        data.some(d => d.PERIODO === p)
    );

    if (periodosPresentes.length < 2) return;   // nada que comparar

    // ── Helpers locales ──────────────────────────────────────────────────────
    const filterP = p => data.filter(d => d.PERIODO === p);

    const nPor = periodos => {
        const out = {};
        periodos.forEach(p => { out[p] = data.filter(d => d.PERIODO === p).length; });
        return out;
    };

    const ORDER_TIPO = ['PRIMARIA', 'PRIMARIA EXCELENCIA', 'SECUNDARIA', 'SECUNDARIA EXCELENCIA'];
    const TIPO_COLORS = {
        'PRIMARIA':              '#5B8AF5',
        'PRIMARIA EXCELENCIA':   '#F5A623',
        'SECUNDARIA':            '#50C878',
        'SECUNDARIA EXCELENCIA': '#FF6B6B',
    };

    // Paleta para periodos (usa la paleta general del tema)
    const PERIODO_COLORS = [
        'rgb(229, 134, 6)',
        'rgb(82, 188, 163)',
        '#A855F7',
        '#EC4899',
        '#3B82F6',
        '#F97316',
    ];
    const colorP = p => PERIODO_COLORS[periodosPresentes.indexOf(p)] || C.paleta[0];

    const nPeriodo    = nPor(periodosPresentes);
    const promPeriodo = {};
    const totalPeriodo = {};
    periodosPresentes.forEach(p => {
        const sub = filterP(p);
        promPeriodo[p]  = sub.reduce((a, d) => a + d.IMPORTE, 0) / sub.length;
        totalPeriodo[p] = sub.reduce((a, d) => a + d.IMPORTE, 0);
    });

    // ════════════════════════════════════════════════════════════════════════
    // GRÁFICA 1 — Beneficiarios totales por periodo
    // ════════════════════════════════════════════════════════════════════════
    const el1 = document.getElementById('chart-periodo-beneficiarios');
    if (el1) {
        el1.classList.remove('loading');
        Plotly.newPlot(el1, [{
            type: 'bar',
            x: periodosPresentes,
            y: periodosPresentes.map(p => nPeriodo[p]),
            marker: { color: periodosPresentes.map(colorP) },
            text: periodosPresentes.map(p => nPeriodo[p].toLocaleString()),
            textposition: 'outside',
            textfont: { color: '#FFFFFF', size: 12 },
            cliponaxis: false,
            hovertemplate: '<b>%{x}</b><br>%{y:,} beneficiarios<extra></extra>',
        }], getLayout('Beneficiarios por Periodo', {
            xaxis: { title: 'Periodo', gridcolor: 'rgba(255,255,255,0.08)' },
            yaxis: { title: 'Beneficiarios', gridcolor: 'rgba(255,255,255,0.08)',
                     range: [0, Math.max(...periodosPresentes.map(p => nPeriodo[p])) * 1.2] },
            margin: { t: 58, r: 18, b: 58, l: 72 },
        }), plotConfig);
    }

    // ════════════════════════════════════════════════════════════════════════
    // GRÁFICA 2 — Beneficiarios por tipo de beca × periodo (barras agrupadas)
    // ════════════════════════════════════════════════════════════════════════
    const el2 = document.getElementById('chart-periodo-tipo-beca');
    if (el2) {
        el2.classList.remove('loading');
        const traces = ORDER_TIPO.map(tipo => {
            const yVals = periodosPresentes.map(p => {
                const sub = filterP(p);
                return sub.filter(d => d.TIPO_BECA === tipo).length;
            });
            return {
                type: 'bar', name: tipo,
                x: periodosPresentes, y: yVals,
                marker: { color: TIPO_COLORS[tipo] },
                text: yVals.map(v => v.toLocaleString()),
                textposition: 'outside',
                textfont: { color: '#FFFFFF', size: 10 },
                cliponaxis: false,
                hovertemplate: `<b>${tipo}</b><br>%{x}: %{y:,}<extra></extra>`,
            };
        });
        Plotly.newPlot(el2, traces, getLayout('Beneficiarios por Tipo de Beca y Periodo', {
            barmode: 'group',
            showlegend: true,
            legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.32 },
            xaxis: { title: 'Periodo', automargin: true, gridcolor: 'rgba(255,255,255,0.08)' },
            yaxis: { title: 'Beneficiarios', gridcolor: 'rgba(255,255,255,0.08)' },
            margin: { t: 58, r: 18, b: 95, l: 68 },
        }), plotConfig);
    }

    // ════════════════════════════════════════════════════════════════════════
    // GRÁFICA 3 — Composición del mix por periodo (barras 100% apiladas)
    // ════════════════════════════════════════════════════════════════════════
    const el3 = document.getElementById('chart-periodo-mix');
    if (el3) {
        el3.classList.remove('loading');
        const mixTraces = ORDER_TIPO.map(tipo => {
            const xVals = periodosPresentes.map(p => {
                const sub = filterP(p);
                return +(sub.filter(d => d.TIPO_BECA === tipo).length / sub.length * 100).toFixed(1);
            });
            return {
                type: 'bar', name: tipo,
                y: periodosPresentes, x: xVals,
                orientation: 'h',
                marker: { color: TIPO_COLORS[tipo] },
                text: xVals.map(v => `${v.toFixed(1)}%`),
                textposition: 'inside',
                textfont: { size: 11, color: 'white' },
                hovertemplate: `<b>${tipo}</b><br>%{y}: %{x:.1f}%<extra></extra>`,
            };
        });
        Plotly.newPlot(el3, mixTraces, getLayout('Composición del Mix de Tipos de Beca (%) por Periodo', {
            barmode: 'stack',
            showlegend: true,
            legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.32 },
            xaxis: { title: '% del total', gridcolor: 'rgba(255,255,255,0.08)' },
            yaxis: { automargin: true },
            margin: { t: 58, r: 18, b: 95, l: 80 },
        }), plotConfig);
    }

    // ════════════════════════════════════════════════════════════════════════
    // GRÁFICA 4 — Importe promedio por periodo (línea + puntos)
    // ════════════════════════════════════════════════════════════════════════
    const el4 = document.getElementById('chart-periodo-importe-prom');
    if (el4) {
        el4.classList.remove('loading');
        const yProm = periodosPresentes.map(p => +promPeriodo[p].toFixed(2));
        Plotly.newPlot(el4, [{
            type: 'scatter',
            mode: 'lines+markers+text',
            x: periodosPresentes,
            y: yProm,
            line: { color: C.naranja, width: 3 },
            marker: { size: 10, color: periodosPresentes.map(colorP),
                      line: { color: '#FFFFFF', width: 1 } },
            text: yProm.map(v => `$${v.toLocaleString('es-MX', {minimumFractionDigits: 0})}`),
            textposition: 'top center',
            textfont: { color: '#FFFFFF', size: 12 },
            hovertemplate: '<b>%{x}</b><br>Promedio: $%{y:,.2f}<extra></extra>',
        }], getLayout('Importe Promedio por Periodo', {
            xaxis: { title: 'Periodo', gridcolor: 'rgba(255,255,255,0.08)' },
            yaxis: { title: 'Importe Promedio ($)', tickformat: '$,.0f',
                     gridcolor: 'rgba(255,255,255,0.08)' },
            margin: { t: 58, r: 18, b: 58, l: 88 },
        }), plotConfig);
    }

    // ════════════════════════════════════════════════════════════════════════
    // GRÁFICA 5 — Importe total erogado por periodo (barras)
    // ════════════════════════════════════════════════════════════════════════
    const el5 = document.getElementById('chart-periodo-importe-total');
    if (el5) {
        el5.classList.remove('loading');
        const yTotal = periodosPresentes.map(p => totalPeriodo[p]);
        Plotly.newPlot(el5, [{
            type: 'bar',
            x: periodosPresentes,
            y: yTotal,
            marker: { color: periodosPresentes.map(colorP) },
            text: yTotal.map(v => `$${(v / 1e6).toFixed(2)}M`),
            textposition: 'outside',
            textfont: { color: '#FFFFFF', size: 12 },
            cliponaxis: false,
            hovertemplate: '<b>%{x}</b><br>Total: $%{y:,.0f}<extra></extra>',
        }], getLayout('Importe Total Erogado por Periodo', {
            xaxis: { title: 'Periodo', gridcolor: 'rgba(255,255,255,0.08)' },
            yaxis: { title: 'Importe Total ($)', tickformat: '$,.0s',
                     gridcolor: 'rgba(255,255,255,0.08)',
                     range: [0, Math.max(...yTotal) * 1.22] },
            margin: { t: 58, r: 18, b: 58, l: 88 },
        }), plotConfig);
    }

    // ════════════════════════════════════════════════════════════════════════
    // GRÁFICA 6 — Variación de beneficiarios periodo a periodo (Δ %)
    // ════════════════════════════════════════════════════════════════════════
    const el6 = document.getElementById('chart-periodo-delta');
    if (el6 && periodosPresentes.length > 1) {
        el6.classList.remove('loading');
        const xDelta = [];
        const yDelta = [];
        for (let i = 1; i < periodosPresentes.length; i++) {
            const prev = periodosPresentes[i - 1];
            const curr = periodosPresentes[i];
            xDelta.push(`${prev} → ${curr}`);
            yDelta.push(+((nPeriodo[curr] - nPeriodo[prev]) / nPeriodo[prev] * 100).toFixed(1));
        }
        Plotly.newPlot(el6, [{
            type: 'bar',
            x: xDelta,
            y: yDelta,
            marker: { color: yDelta.map(v => v >= 0 ? '#50C878' : '#FF6B6B') },
            text: yDelta.map(v => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`),
            textposition: 'outside',
            textfont: { color: '#FFFFFF', size: 13 },
            cliponaxis: false,
            hovertemplate: '<b>%{x}</b><br>Δ = %{y:+.1f}%<extra></extra>',
        }], getLayout('Variación de Beneficiarios entre Periodos (Δ %)', {
            shapes: [{ type: 'line', x0: -0.5, x1: xDelta.length - 0.5, y0: 0, y1: 0,
                       line: { color: 'rgba(255,255,255,0.5)', width: 1, dash: 'dot' } }],
            xaxis: { automargin: true, tickangle: -22, gridcolor: 'rgba(255,255,255,0.08)' },
            yaxis: { title: 'Δ %', gridcolor: 'rgba(255,255,255,0.08)',
                     range: [Math.min(...yDelta) * 1.4, Math.max(...yDelta) * 1.4] },
            margin: { t: 58, r: 18, b: 90, l: 60 },
        }), plotConfig);
    }

    // ════════════════════════════════════════════════════════════════════════
    // GRÁFICA 7 — Nivel educativo × periodo (barras agrupadas)
    // ════════════════════════════════════════════════════════════════════════
    const el7 = document.getElementById('chart-periodo-nivel');
    if (el7) {
        el7.classList.remove('loading');
        const niveles = [...new Set(data.map(d => d.NIVEL_EDUCATIVO))].filter(Boolean).sort();
        const tracesNiv = periodosPresentes.map((p, idx) => {
            const sub = filterP(p);
            return {
                type: 'bar', name: p,
                x: niveles,
                y: niveles.map(n => sub.filter(d => d.NIVEL_EDUCATIVO === n).length),
                marker: { color: PERIODO_COLORS[idx] || C.paleta[idx] },
                hovertemplate: `<b>${p}</b><br>%{x}: %{y:,}<extra></extra>`,
            };
        });
        Plotly.newPlot(el7, tracesNiv, getLayout('Nivel Educativo por Periodo', {
            barmode: 'group',
            showlegend: true,
            legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.35 },
            xaxis: { automargin: true, tickangle: -18, gridcolor: 'rgba(255,255,255,0.08)' },
            yaxis: { title: 'Beneficiarios', gridcolor: 'rgba(255,255,255,0.08)' },
            margin: { t: 58, r: 18, b: 100, l: 68 },
        }), plotConfig);
    }

    // ════════════════════════════════════════════════════════════════════════
    // GRÁFICA 8 — Género × periodo (barras agrupadas)
    // ════════════════════════════════════════════════════════════════════════
    const el8 = document.getElementById('chart-periodo-genero');
    if (el8) {
        el8.classList.remove('loading');
        const generos = [...new Set(data.map(d => d.GENERO))].filter(Boolean).sort();
        const tracesGen = periodosPresentes.map((p, idx) => {
            const sub = filterP(p);
            return {
                type: 'bar', name: p,
                x: generos,
                y: generos.map(g => sub.filter(d => d.GENERO === g).length),
                marker: { color: PERIODO_COLORS[idx] || C.paleta[idx] },
                hovertemplate: `<b>${p}</b><br>%{x}: %{y:,}<extra></extra>`,
            };
        });
        Plotly.newPlot(el8, tracesGen, getLayout('Género de Beneficiarios por Periodo', {
            barmode: 'group',
            showlegend: true,
            legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.32 },
            xaxis: { automargin: true, gridcolor: 'rgba(255,255,255,0.08)' },
            yaxis: { title: 'Beneficiarios', gridcolor: 'rgba(255,255,255,0.08)' },
            margin: { t: 58, r: 18, b: 95, l: 68 },
        }), plotConfig);
    }
});
