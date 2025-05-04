document.addEventListener("DOMContentLoaded", () => {
  const catalogo = document.getElementById("catalogo");
  const botonesFiltro = document.querySelectorAll(".grupo-filtros button");
  const inputBuscador = document.getElementById("buscador");
  const menuToggle = document.getElementById("menuToggle");
  const filtros = document.getElementById("filtros");

  let productos = [];
  let filtroActivo = "todos";
  let textoBusqueda = "";

  fetch("./productos.json")
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      renderizarCatalogo();
    })
    .catch((error) => console.error("Error al cargar productos:", error));

  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      botonesFiltro.forEach((b) => b.classList.remove("activo"));
      boton.classList.add("activo");
      filtroActivo = boton.dataset.filtro;
      renderizarCatalogo();
    });
  });

  inputBuscador.addEventListener("input", (e) => {
    textoBusqueda = e.target.value.toLowerCase();
    renderizarCatalogo();
  });

  menuToggle.addEventListener("click", () => {
    filtros.classList.toggle("mostrar");
  });

  function renderizarCatalogo() {
    catalogo.innerHTML = "";

    const productosFiltrados = productos.filter((producto) => {
      const coincideFiltro =
        filtroActivo === "todos" || producto.tipo === filtroActivo;
      const coincideBusqueda = producto.nombre
        .toLowerCase()
        .includes(textoBusqueda);
      return coincideFiltro && coincideBusqueda;
    });

    productosFiltrados.forEach((producto) => {
      const div = document.createElement("div");
      div.className = "producto";

      const imagenes = producto.imagenes || [];
      let indiceImagen = 0;

      div.innerHTML = `
        <div class="imagen-contenedor">
          <img src="${imagenes[indiceImagen]}" alt="${producto.nombre}" />
          <div class="flechas">
            <button class="flecha izq">&#9664;</button>
            <button class="flecha der">&#9654;</button>
          </div>
          <div class="colores-cont">
            ${(producto.colores || [])
              .map(
                (color, index) =>
                  `<button class="swatch" style="background:${color}" data-index="${index}"></button>`
              )
              .join("")}
          </div>
          <div class="descripcion">${producto.descripcion || ""}</div>
        </div>
        <div class="info">
          <div class="nombre">${producto.nombre}</div>
          <div class="precio">${producto.precio} €</div>
        </div>
      `;

      const img = div.querySelector("img");
      const btnIzq = div.querySelector(".flecha.izq");
      const btnDer = div.querySelector(".flecha.der");
      const swatches = div.querySelectorAll(".swatch");

      btnIzq.addEventListener("click", () => {
        indiceImagen =
          (indiceImagen - 1 + imagenes.length) % imagenes.length;
        img.src = imagenes[indiceImagen];
      });

      btnDer.addEventListener("click", () => {
        indiceImagen = (indiceImagen + 1) % imagenes.length;
        img.src = imagenes[indiceImagen];
      });

      swatches.forEach((swatch) => {
        swatch.addEventListener("click", () => {
          const index = parseInt(swatch.dataset.index);
          if (!isNaN(index) && imagenes[index]) {
            indiceImagen = index;
            img.src = imagenes[indiceImagen];
          }
        });
      });

      catalogo.appendChild(div);
    });
  }
});
