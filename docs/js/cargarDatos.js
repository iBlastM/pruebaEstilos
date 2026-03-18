// ── CARGA_DATOS.JS ────────────────────────────────────────────────────────────
// Carga dfFinal.json (formato JSON Lines), pre-procesa los datos y
// dispara el evento global 'datosListos' para que cada gráfica se inicialice.

async function cargarDatos() {
    // Marcar todos los contenedores como "loading"
    document.querySelectorAll('.chart-container').forEach(el => el.classList.add('loading'));

    try {
        const resp = await fetch('./dfFinal.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
        const text = await resp.text();

        // dfFinal.json se genera con orient='records', lines=True → una línea por registro
        const data = text
            .trim()
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => JSON.parse(line));

        // Asegurar tipos numéricos
        data.forEach(d => {
            d.IMPORTE = Number(d.IMPORTE) || 0;
            d.EDAD    = Number(d.EDAD)    || 0;
        });

        const bins   = [0, 12, 15, 18, 21, 25, 30, Infinity];
        const labels = ['<12', '12-14', '15-17', '18-20', '21-24', '25-29', '30+'];
        data.forEach(d => {
            if (!d.GRUPO_EDAD) {
                for (let i = 0; i < bins.length - 1; i++) {
                    if (d.EDAD >= bins[i] && d.EDAD < bins[i + 1]) {
                        d.GRUPO_EDAD = labels[i];
                        break;
                    }
                }
            }
        });

        window.dashDataFull = data;
        window.dashData = data;
        document.dispatchEvent(new Event('datosListos'));

    } catch (err) {
        console.error('[Dashboard] Error al cargar dfFinal.json:', err);
        const banner = document.getElementById('error-msg');
        if (banner) banner.style.display = 'block';
        document.querySelectorAll('.chart-container').forEach(el => el.classList.remove('loading'));
    }
}

// cargarDatos() es llamada por loader.js una vez que los partials HTML están en el DOM.
