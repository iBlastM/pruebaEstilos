// ── GRAFICA_IMPORTE_NIVEL.JS ──────────────────────────────────────────────────
// Treemap: Distribución del gasto total por Nivel Educativo → Tipo de Beca → Género

document.addEventListener('datosListos', () => {
    const el = document.getElementById('chart-importe-nivel');
    el.classList.remove('loading');

    const data = window.dashData;

    // Construir jerarquía Nivel → Tipo → Género con suma de IMPORTE
    const byNivelTipoGen = {};
    data.forEach(d => {
        const n = d.NIVEL_EDUCATIVO || 'Sin nivel';
        const t = d.TIPO_BECA       || 'Sin tipo';
        const g = d.GENERO          || 'Sin género';
        if (!byNivelTipoGen[n])    byNivelTipoGen[n] = {};
        if (!byNivelTipoGen[n][t]) byNivelTipoGen[n][t] = {};
        byNivelTipoGen[n][t][g] = (byNivelTipoGen[n][t][g] || 0) + d.IMPORTE;
    });

    // Color fijo por tipo (intermedio) — independiente del nivel raíz
    const allTipos = [...new Set(data.map(d => d.TIPO_BECA).filter(Boolean))].sort();
    const tipoColor = {};
    allTipos.forEach((t, i) => { tipoColor[t] = C.paleta[i % C.paleta.length]; });

    // Colores fijos por género — independientes del tipo padre
    const allGeneros = [...new Set(data.map(d => d.GENERO).filter(Boolean))].sort();
    const GENERO_PALETTE = ['#5B8AF5', '#F472B6', '#34D399', '#FBBF24', '#A78BFA'];
    const generoColor = {};
    allGeneros.forEach((g, i) => { generoColor[g] = GENERO_PALETTE[i % GENERO_PALETTE.length]; });

    const ids = [], labels = [], parents = [], values = [], nodeColors = [];

    Object.entries(byNivelTipoGen).forEach(([nivel, tipos]) => {
        const nivelTotal = Object.values(tipos)
            .flatMap(g => Object.values(g))
            .reduce((a, b) => a + b, 0);

        // Nodo raíz — nivel educativo
        ids.push(nivel);
        labels.push(nivel);
        parents.push('');
        values.push(nivelTotal);
        nodeColors.push('rgba(255,255,255,0.06)');

        Object.entries(tipos).forEach(([tipo, generos]) => {
            const tipoTotal = Object.values(generos).reduce((a, b) => a + b, 0);
            const base      = tipoColor[tipo] || C.paleta[0];

            // Nodo intermedio — tipo de beca
            ids.push(nivel + '/' + tipo);
            labels.push(tipo);
            parents.push(nivel);
            values.push(tipoTotal);
            nodeColors.push(base);

            // Nodos hoja — género con color propio fijo
            const genList = Object.keys(generos).sort();
            genList.forEach((gen) => {
                ids.push(nivel + '/' + tipo + '/' + gen);
                labels.push(gen);
                parents.push(nivel + '/' + tipo);
                values.push(generos[gen]);
                nodeColors.push(generoColor[gen] || '#6B7280');
            });
        });
    });

    Plotly.newPlot(el, [{
        type: 'treemap',
        ids, labels, parents, values,
        branchvalues: 'total',
        marker: {
            colors: nodeColors,
            line: { width: 2, color: C.paperBg },
        },
        texttemplate: '<b>%{label}</b><br>$%{value:,.0f}',
        hovertemplate: '<b>%{label}</b><br>Total: $%{value:,.0f}<br>%{percentRoot:.1%} del gasto total<extra></extra>',
        textfont: { size: 11, color: '#FFFFFF', family: C.fuente },
        pathbar: { visible: true, thickness: 20 },
    }], getLayout('Distribución del Gasto: Nivel → Tipo → Género', {
        margin: { t: 58, r: 8, b: 8, l: 8 },
        uniformtext: { minsize: 9, mode: 'hide' },
    }), plotConfig);
});
