import { db, collection, getDocs } from './firebase.js';

async function cargarCatalogo() {
  const contenedor = document.getElementById('catalogo');
  contenedor.innerHTML = '';

  try {
    const productosRef = collection(db, 'productos');
    const snapshot = await getDocs(productosRef);

    snapshot.forEach(doc => {
      const data = doc.data();

      const card = document.createElement('div');
      card.className = 'producto';

      const imagenContenedor = document.createElement('div');
      imagenContenedor.className = 'imagen-contenedor';

      const imgPrincipal = document.createElement('img');
      imgPrincipal.src = '';
      imgPrincipal.alt = data.nombre;
      imagenContenedor.appendChild(imgPrincipal);

      const flechas = document.createElement('div');
      flechas.className = 'flechas';

      const btnPrev = document.createElement('button');
      btnPrev.className = 'flecha';
      btnPrev.textContent = '‹';

      const btnNext = document.createElement('button');
      btnNext.className = 'flecha';
      btnNext.textContent = '›';

      flechas.appendChild(btnPrev);
      flechas.appendChild(btnNext);
      imagenContenedor.appendChild(flechas);

      const coloresCont = document.createElement('div');
      coloresCont.className = 'colores-cont';

      const info = document.createElement('div');
      info.className = 'info';

      const nombre = document.createElement('h3');
      nombre.textContent = data.nombre;

      const descripcion = document.createElement('p');
      descripcion.className = 'descripcion';
      descripcion.textContent = data.descripcion || '';

      const precio = document.createElement('p');
      precio.className = 'precio';
      precio.textContent = `$${data.precio}`;

      info.appendChild(nombre);
      info.appendChild(precio);
      info.appendChild(descripcion);

      let colorSeleccionadoIndex = 0;
      let imagenIndex = 0;

      function actualizarImagen() {
        const colorActual = data.colores && data.colores.length > 0
          ? data.colores[colorSeleccionadoIndex]
          : null;

        const imagenes = colorActual ? colorActual.imagenes : (data.imagenes || []);
        if (imagenes.length === 0) {
          imgPrincipal.src = './images/placeholder.png';
          return;
        }
        if (imagenIndex >= imagenes.length) imagenIndex = 0;
        if (imagenIndex < 0) imagenIndex = imagenes.length - 1;

        imgPrincipal.src = imagenes[imagenIndex];
      }

      if (data.colores && data.colores.length > 0) {
        data.colores.forEach((color, i) => {
          const swatch = document.createElement('button');
          swatch.className = 'swatch';
          swatch.title = color.nombre;

          if (color.codigo.startsWith('linear-gradient')) {
            swatch.style.backgroundImage = color.codigo;
          } else {
            swatch.style.backgroundColor = color.codigo;
          }

          swatch.addEventListener('click', () => {
            colorSeleccionadoIndex = i;
            imagenIndex = 0;
            actualizarImagen();

            [...coloresCont.children].forEach(btn => btn.classList.remove('activo'));
            swatch.classList.add('activo');
          });

          coloresCont.appendChild(swatch);
        });
      }

      if ((!data.colores || data.colores.length === 0) && data.imagenes && data.imagenes.length > 0) {
        colorSeleccionadoIndex = -1;
        imagenIndex = 0;
      }

      btnPrev.addEventListener('click', () => {
        imagenIndex--;
        actualizarImagen();
      });

      btnNext.addEventListener('click', () => {
        imagenIndex++;
        actualizarImagen();
      });

      actualizarImagen();

      if (coloresCont.children.length > 0) {
        coloresCont.children[0].classList.add('activo');
      }

      imagenContenedor.appendChild(coloresCont); // <--- ahora los colores están DENTRO de la imagen

      card.appendChild(imagenContenedor);
      card.appendChild(info);

      contenedor.appendChild(card);
    });

  } catch (error) {
    console.error('Error cargando productos:', error);
    contenedor.textContent = 'Error cargando productos.';
  }
}

cargarCatalogo();
