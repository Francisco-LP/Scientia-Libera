import { ARTICULOS } from './data.js';

// Elementos del DOM
const appContainer = document.getElementById('app-container');
const logo = document.querySelector('.logo');

// Estado de la aplicación
let vistaActual = 'home'; // 'home' o id del artículo

// Función para formatear fechas
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

// --- RENDERIZADO DE VISTAS ---

// Renderizar la vista principal (Grid de artículos)
const renderHome = () => {
    const gridHtml = `
        <div class="articles-grid">
            ${ARTICULOS.map(art => `
                <article class="card" data-id="${art.id}">
                    <div class="card-img-wrapper">
                        <img src="${art.imagenUrl}" alt="${art.titulo}" class="card-img" loading="lazy">
                    </div>
                    <div class="card-content">
                        <span class="card-category">${art.categoria}</span>
                        <h2 class="card-title">${art.titulo}</h2>
                        <p class="card-summary">${art.resumen}</p>
                        <div class="card-meta">
                            <span>Leer más &rarr;</span>
                            <span>${formatDate(art.fecha)}</span>
                        </div>
                    </div>
                </article>
            `).join('')}
        </div>
    `;

    appContainer.innerHTML = gridHtml;

    // Añadir event listeners a las tarjetas
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            navegar(card.dataset.id);
        });
    });
};

// Renderizar la vista de un artículo individual
const renderArticle = (id) => {
    const articulo = ARTICULOS.find(a => a.id === id);

    if (!articulo) {
        appContainer.innerHTML = `<div class="article-view"><h2>Artículo no encontrado</h2><button class="back-btn" id="btn-back">Volver</button></div>`;
        document.getElementById('btn-back').addEventListener('click', () => navegar('home'));
        return;
    }

    const articleHtml = `
        <article class="article-view">
            <button class="back-btn" id="btn-back">&larr; Volver al inicio</button>
            <header class="article-header">
                <span class="article-category">${articulo.categoria}</span>
                <h1 class="article-title">${articulo.titulo}</h1>
                <div class="article-meta">Publicado el ${formatDate(articulo.fecha)}</div>
            </header>
            <img src="${articulo.imagenUrl}" alt="${articulo.titulo}" class="article-hero-img">
            <div class="article-body">
                ${articulo.contenido}
            </div>
        </article>
    `;

    appContainer.innerHTML = articleHtml;

    // Event listener para el botón de volver
    document.getElementById('btn-back').addEventListener('click', () => navegar('home'));

    // Hacer scroll al top al cargar el artículo
    window.scrollTo(0, 0);
};

// --- CONTROLADOR DE NAVEGACIÓN CON TRANSICIÓN ---

const navegar = (nuevaVista) => {
    if (vistaActual === nuevaVista) return;

    // Iniciar fade out
    appContainer.classList.add('fade-out');

    // Esperar a que termine la transición (300ms definido en CSS)
    setTimeout(() => {
        vistaActual = nuevaVista;

        if (vistaActual === 'home') {
            renderHome();
        } else {
            renderArticle(vistaActual);
        }

        // Iniciar fade in
        appContainer.classList.remove('fade-out');
    }, 300); // Mismo tiempo que var(--transition-speed)
};

// --- INICIALIZACIÓN ---

const init = () => {
    // Event listener global para el logo
    logo.addEventListener('click', () => navegar('home'));

    // Renderizado inicial
    renderHome();
};

// Iniciar la app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
