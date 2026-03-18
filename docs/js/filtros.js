// ── FILTROS.JS ────────────────────────────────────────────────────────────────
// Barra de filtros global: Año · Etapa · Nivel Educativo
// Actualiza window.dashData y re-dispara 'datosListos' para refrescar charts.

(function () {
    let _debounce = null;

    // ── Poblar dropdowns con valores únicos del dataset completo ─────────────
    function poblarDropdowns(data) {
        const selAnio  = document.getElementById('filtro-anio');
        const selEtapa = document.getElementById('filtro-etapa');
        const selNivel = document.getElementById('filtro-nivel');
        if (!selAnio || !selEtapa || !selNivel) return;

        // Años únicos ordenados
        const anios = [...new Set(data.map(d => d.AÑO))].filter(Boolean).sort();
        anios.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a;
            opt.textContent = a;
            selAnio.appendChild(opt);
        });

        // Niveles educativos únicos ordenados
        const niveles = [...new Set(data.map(d => d.NIVEL_EDUCATIVO))].filter(Boolean).sort();
        niveles.forEach(n => {
            const opt = document.createElement('option');
            opt.value = n;
            opt.textContent = n.charAt(0) + n.slice(1).toLowerCase();
            selNivel.appendChild(opt);
        });

        // Etapas (siempre fijas: 1 y 2)
        [['1', '1ª Etapa'], ['2', '2ª Etapa']].forEach(([val, txt]) => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = txt;
            selEtapa.appendChild(opt);
        });
    }

    // ── Leer valores actuales de los filtros ─────────────────────────────────
    function leerFiltros() {
        return {
            anio:  document.getElementById('filtro-anio')?.value  || '',
            etapa: document.getElementById('filtro-etapa')?.value || '',
            nivel: document.getElementById('filtro-nivel')?.value || '',
        };
    }

    // ── Actualizar etiqueta de resultados ─────────────────────────────────────
    function actualizarEtiqueta(n) {
        const el = document.getElementById('filtro-count');
        if (el) el.textContent = n.toLocaleString('es-MX') + ' registros';
    }

    // ── Aplicar filtros y re-renderizar ──────────────────────────────────────
    function aplicar() {
        const { anio, etapa, nivel } = leerFiltros();
        let filtered = window.dashDataFull;

        if (anio)  filtered = filtered.filter(d => d.AÑO  === anio);
        if (etapa) filtered = filtered.filter(d => d.SEMESTRE === etapa);
        if (nivel) filtered = filtered.filter(d => d.NIVEL_EDUCATIVO === nivel);

        window.dashData = filtered;
        actualizarEtiqueta(filtered.length);

        // Marcar charts como loading antes del re-render
        document.querySelectorAll('.chart-container').forEach(el => el.classList.add('loading'));
        document.dispatchEvent(new Event('datosListos'));
    }

    // ── Botón limpiar ─────────────────────────────────────────────────────────
    function limpiarFiltros() {
        ['filtro-anio', 'filtro-etapa', 'filtro-nivel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        aplicar();
    }

    // ── Inicialización (una sola vez al recibir datos) ────────────────────────
    document.addEventListener('datosListos', () => {
        if (window._filtrosInit) return;   // ya inicializado
        window._filtrosInit = true;

        poblarDropdowns(window.dashDataFull);
        actualizarEtiqueta(window.dashDataFull.length);

        ['filtro-anio', 'filtro-etapa', 'filtro-nivel'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => {
                clearTimeout(_debounce);
                _debounce = setTimeout(aplicar, 60);
            });
        });

        document.getElementById('filtro-limpiar')
            ?.addEventListener('click', limpiarFiltros);
    }, { once: true });
})();
