// ── TABS.JS ───────────────────────────────────────────────────────────────────
// Define las pestañas, construye la barra de navegación y gestiona el cambio
// entre paneles. window.TABS es leído por loader.js.

window.TABS = [
    { id: 'demografico', label: 'Perfil Demográfico',       src: 'partials/demografico.html' },
    { id: 'educativo',   label: 'Educativo y Becas',        src: 'partials/educativo.html'   },
    { id: 'importe',     label: 'Análisis del Importe',     src: 'partials/importe.html'     },
    { id: 'territorial', label: 'Distribución Territorial', src: 'partials/territorial.html' },
    { id: 'comparativo', label: 'Comparativo por Periodo',  src: 'partials/comparativo.html' },
];

// ── Construir botones de pestaña ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('tabs-nav');
    if (!nav) return;

    window.TABS.forEach((tab, i) => {
        const btn = document.createElement('button');
        btn.className = i === 0 ? 'tab-btn active' : 'tab-btn';
        btn.dataset.tab = tab.id;
        btn.textContent = tab.label;
        btn.addEventListener('click', () => activarTab(tab.id));
        nav.appendChild(btn);
    });
});

// ── Activar una pestaña ───────────────────────────────────────────────────────
function activarTab(tabId) {
    // Botones
    document.querySelectorAll('.tab-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.tab === tabId)
    );

    // Paneles — usar hidden para no destruir eventos de Plotly
    document.querySelectorAll('.tab-section').forEach(s => {
        s.hidden = s.id !== 'tab-' + tabId;
    });

    // Forzar redimensionado de Plotly (charts que renderizaron con display:none)
    setTimeout(() => window.dispatchEvent(new Event('resize')), 60);

    window._tabActual = tabId;
}
