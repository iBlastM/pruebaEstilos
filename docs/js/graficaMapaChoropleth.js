// ── GRAFICA_MAPA_CHOROPLETH.JS ────────────────────────────────────────────────
// Mapa de calor (choropleth) de beneficiarios por Colonia o Delegación
// Estilo inspirado en plantilla2.py: escala portland, fondo oscuro, bordes blancos

(function () {
    let geoColonias     = null;
    let geoDelegaciones = null;
    let geoMunicipio    = null;
    let modoActual      = 'delegaciones'; // valor inicial

    // ── Carga de GeoJSONs en cuanto se ejecuta el script ──────────────────────
    const geoPromise = Promise.all([
        fetch('geoJsons/COL_LOC_V2_CORREGIDORA.geojson').then(r => r.json()),
        fetch('geoJsons/DELEGACIONES_QRO_CORR.geojson').then(r => r.json()),
        fetch('geoJsons/Corregidora.geojson').then(r => r.json()),
    ]).then(([col, del_, mun]) => {
        geoColonias     = col;
        geoDelegaciones = del_;
        geoMunicipio    = mun;
    }).catch(err => console.error('[MapaChoropleth] Error al cargar GeoJSON:', err));

    // ── Espera datos del dashboard + GeoJSONs ─────────────────────────────────
    document.addEventListener('datosListos', async () => {
        await geoPromise;

        const el     = document.getElementById('chart-mapa-corregidora');
        const btnDel = document.getElementById('btn-mapa-delegaciones');
        const btnCol = document.getElementById('btn-mapa-colonias');

        el.classList.remove('loading');

        btnDel.addEventListener('click', () => {
            if (modoActual === 'delegaciones') return;
            modoActual = 'delegaciones';
            btnDel.classList.add('active');
            btnCol.classList.remove('active');
            dibujarMapa(el);
        });

        btnCol.addEventListener('click', () => {
            if (modoActual === 'colonias') return;
            modoActual = 'colonias';
            btnCol.classList.add('active');
            btnDel.classList.remove('active');
            dibujarMapa(el);
        });

        dibujarMapa(el);
    });

    // ── Renderizado del mapa ──────────────────────────────────────────────────
    function dibujarMapa(el) {
        const esColonia   = modoActual === 'colonias';
        const campo       = esColonia ? 'COLONIA'          : 'DELEGACION';
        const geojson     = esColonia ? geoColonias        : geoDelegaciones;
        const featureKey  = esColonia ? 'properties.NOM_COL' : 'properties.NOM_DEL';
        const titulo      = esColonia
            ? 'Distribución de Beneficiarios por <b>Colonia</b>'
            : 'Distribución de Beneficiarios por <b>Delegación</b>';

        // Conteo de beneficiarios agrupado por campo
        const conteo = contarPor(window.dashData, campo);

        // Todos los nombres de features del GeoJSON (orden garantizado)
        const nombres = geojson.features.map(f =>
            esColonia ? f.properties.NOM_COL : f.properties.NOM_DEL
        );
        const valores = nombres.map(n => conteo[n] || 0);

        // Rango de color: mínimo 0, máximo real (percentil 95 para no distorsionar)
        const ordered = [...valores].sort((a, b) => a - b);
        const p95idx  = Math.floor(ordered.length * 0.95);
        const valMax  = ordered[p95idx] || Math.max(...valores) || 1;

        // Textos del hover
        const textoHover = nombres.map(n =>
            `<b>${n}</b><br>${(conteo[n] || 0).toLocaleString('es-MX')} beneficiarios`
        );

        // ── Trace 1: calor choropleth ──────────────────────────────────────────
        const traceChalor = {
            type: 'choropleth',
            geojson: geojson,
            locations: nombres,
            z: valores,
            featureidkey: featureKey,
            colorscale: 'portland',
            zmin: 0,
            zmax: valMax,
            colorbar: {
                title: {
                    text: 'Beneficiarios',
                    font: { color: '#FFFFFF', size: 12, family: C.fuente },
                    side: 'right',
                },
                tickfont:     { color: '#FFFFFF', size: 11, family: C.fuente },
                outlinecolor: 'rgba(255,255,255,0.45)',
                outlinewidth: 1,
                bordercolor:  'rgba(255,255,255,0.2)',
                borderwidth:  1,
                bgcolor:      'rgba(24,18,43,0.75)',
                len:          0.65,
                thickness:    17,
                x:            0.65,
                xpad:         6,
                ticksuffix:   '',
            },
            marker: {
                line: { color: 'rgba(255,255,255,0.7)', width: 1.4 },
            },
            text: textoHover,
            hovertemplate: '%{text}<extra></extra>',
            // Zonas sin dato: color casi negro (transparente sobre tierra)
            zauto: false,
        };

        // ── Trace 2: solo bordes internos (igual que plantilla2.py) ─────────────
        const traceBordes = {
            type: 'choropleth',
            geojson: geojson,
            locations: nombres,
            z: nombres.map(() => 1),
            featureidkey: featureKey,
            colorscale: [['0', 'rgba(0,0,0,0)'], ['1', 'rgba(0,0,0,0)']],
            marker: {
                line: { color: 'rgba(255,255,255,0.9)', width: 1.6 },
            },
            zmin: 0, zmax: 1,
            showscale: false,
            hoverinfo: 'skip',
        };

        // ── Trace 3: contorno del municipio de Corregidora ───────────────────
        const traceMunicipio = {
            type: 'choropleth',
            geojson: geoMunicipio,
            locations: ['Corregidora'],
            z: [1],
            featureidkey: 'properties.name',
            colorscale: [['0', 'rgba(0,0,0,0)'], ['1', 'rgba(0,0,0,0)']],
            marker: {
                line: { color: 'rgba(229,134,6,1)', width: 3 },
            },
            zmin: 0, zmax: 1,
            showscale: false,
            hoverinfo: 'skip',
        };

        // ── Trace 4: leyenda — contorno naranja = Municipio Corregidora ──────
        const traceLeyenda = {
            type: 'scattergeo',
            lat: [null],
            lon: [null],
            mode: 'lines',
            line: { color: 'rgba(229,134,6,1)', width: 3 },
            name: 'Municipio Corregidora',
            showlegend: true,
        };

        const layout = {
            title: {
                text: titulo,
                font: { size: 14, color: '#FFFFFF', family: C.fuente },
                x: 0.5,
                xanchor: 'center',
                pad: { t: 6 },
            },
            paper_bgcolor: C.paperBg,      // '#393053'
            font:  { color: '#FFFFFF', family: C.fuente, size: 12 },
            margin: { t: 56, r: 20, b: 36, l: 20 },
            showlegend: true,
            legend: {
                x: 0.5,
                y: -0.04,
                xanchor: 'center',
                yanchor: 'top',
                orientation: 'h',
                font: { color: '#FFFFFF', size: 12, family: C.fuente },
                bgcolor: 'rgba(0,0,0,0)',
                borderwidth: 0,
            },
            geo: {
                fitbounds:       'geojson',
                projection:      { type: 'mercator' },
                showcoastlines:  false,
                showland:        true,
                landcolor:       '#1A1A1D',  // igual que plantilla2.py PLOT_COLOR
                showocean:       false,
                showlakes:       false,
                showframe:       false,
                showrivers:      false,
                showcountries:   false,
                showsubunits:    false,
                bgcolor:         '#18122B',
            },
        };

        Plotly.react(el, [traceChalor, traceBordes, traceMunicipio, traceLeyenda], layout, plotConfig);
    }

})();
