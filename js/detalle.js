import { db, doc, getDoc } from '../js/firebase.js';

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const contenedor = document.getElementById('detalle-producto');

function corregirRutaImagen(ruta) {
  if (ruta.startsWith('./images/')) {
    return '../' + ruta.slice(2);
  }
  return ruta;
}

async function mostrarDetalle() {
  if (!id) {
    contenedor.innerHTML = '<p>Error: ID de producto no proporcionado.</p>';
    return;
  }

  try {
    const docRef = doc(db, 'productos', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      contenedor.innerHTML = '<p>Producto no encontrado.</p>';
      return;
    }

    const data = docSnap.data();

    let imagenesActuales = [];
    let imagenIndex = 0;

    let imagenURL = '../images/placeholder.png';
    let coloresHTML = '';
    let nombreColor = '';

    if (data.colores && data.colores.length > 0) {
      const primerColor = data.colores.find(c => c.imagenes && c.imagenes.length > 0);
      if (primerColor) {
        imagenesActuales = primerColor.imagenes.map(corregirRutaImagen);
        imagenURL = imagenesActuales[0];
        nombreColor = primerColor.nombre || '';
      }

      coloresHTML = `
        <div class="colores-disponibles">
          ${data.colores.map((color, index) => `
            <button 
              class="swatch ${index === 0 ? 'activo' : ''}" 
              style="background: ${color.codigo};"
              data-imagenes='${JSON.stringify(color.imagenes)}'
              data-nombre="${color.nombre}"
              aria-label="Color ${color.nombre}"
            ></button>
          `).join('')}
        </div>
      `;
    } else if (data.imagenes && data.imagenes.length > 0) {
      imagenesActuales = data.imagenes.map(corregirRutaImagen);
      imagenURL = imagenesActuales[0];
    }

    const div = document.createElement('div');
    div.classList.add('detalle-producto');

    div.innerHTML = `
      <div class="imagen-contenedor">
        <button id="prevBtn" class="nav-btn lateral">◀</button>
        <img id="imagen-principal" src="${imagenURL}" alt="Imagen del producto ${data.nombre}">
        <button id="nextBtn" class="nav-btn lateral">▶</button>
        ${coloresHTML}
      </div>

      <div class="info-detalle">
        <h2>${data.nombre}</h2>
        <p class="precio">${data.precio || 'Precio no disponible'}</p>
        <p class="descripcion">${data.descripcion || 'Sin descripción.'}</p>
      </div>
    `;

    contenedor.appendChild(div);

    const imagenPrincipal = document.getElementById('imagen-principal');
    const swatches = document.querySelectorAll('.swatch');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function actualizarImagen() {
      imagenPrincipal.src = imagenesActuales[imagenIndex];
    }

    prevBtn.addEventListener('click', () => {
      if (imagenesActuales.length === 0) return;
      imagenIndex = (imagenIndex - 1 + imagenesActuales.length) % imagenesActuales.length;
      actualizarImagen();
    });

    nextBtn.addEventListener('click', () => {
      if (imagenesActuales.length === 0) return;
      imagenIndex = (imagenIndex + 1) % imagenesActuales.length;
      actualizarImagen();
    });

    swatches.forEach(btn => {
      btn.addEventListener('click', () => {
        const nuevasImagenes = JSON.parse(btn.getAttribute('data-imagenes')).map(corregirRutaImagen);
        const nuevoNombre = btn.getAttribute('data-nombre');

        imagenesActuales = nuevasImagenes;
        imagenIndex = 0;
        actualizarImagen();

        swatches.forEach(s => s.classList.remove('activo'));
        btn.classList.add('activo');
      });
    });

  } catch (error) {
    console.error('Error al obtener el producto:', error);
    contenedor.innerHTML = '<p>Error al cargar el producto.</p>';
  }
}

mostrarDetalle();
