const productos = [
  {
    nombre: "Camiseta FLAWLESS",
    tipo: "camiseta",
    precio: "12,95€",
    descripcion: "Camiseta oversize con diseño exclusivo. Ideal para el verano.",
    colores: [
      {
        nombre: "Blanca",
        codigo: "#ffffff",
        imagenes: ["./images/camiseta.png", "./images/camiseta2.png"]
      },
      {
        nombre: "Negra",
        codigo: "#000000",
        imagenes: ["./images/camisetaFlawlessNegraDelante.png", "./images/camisetaFlawlessNegraDetras.png"]
      }
    ]
  },
  {
    nombre: "Camiseta WORK IT Negra",
    tipo: "camiseta",
    precio: "12,95€",
    imagenes: ["./images/camiseta3.png", "./images/camiseta4.png"],
    descripcion: "Camiseta con diseño perfecto para ir al gimnasio o salir a la calle."
  },
  {
    nombre: "Camiseta WORK IT Negra Ajedrez",
    tipo: "camiseta",
    precio: "12,95€",
    imagenes: ["./images/camiseta5.png", "./images/camiseta6.png"],
    descripcion: "Camiseta con diseño perfecto salir a la calle. Ideal para el verano."
  },
  {
    nombre: "Camiseta diseño de cara",
    tipo: "camiseta",
    precio: "12,95€",
    descripcion: "Camiseta básica con diseño minimalista. Ideal para el verano.",
    colores: [
      {
        nombre: "Negra y roja",
        codigo: "linear-gradient(to right, black, red)",
        imagenes: ["./images/camisetaCaritaRoja.png", "./images/camisetaCaritaRojaDetras.png"]
      },
      {
        nombre: "Negra y Morada",
        codigo: "linear-gradient(to right, black, purple)",
        imagenes: ["./images/camisetaCaritaMorada.png", "./images/camisetaCaritaMoradaDetras.png"]
      },
      {
        nombre: "Negra y Rosa",
        codigo: "linear-gradient(to right, black, pink)",
        imagenes: ["./images/camisetaCaritaRosa.png", "./images/camisetaCaritaRosaDetras.png"]
      }
    ]
  }
];

const catalogo = document.getElementById("catalogo");
let filtroActivo = "todos";
let terminoBusqueda = "";

function renderProductos() {
  catalogo.innerHTML = "";
  const filtrados = productos.filter(p => {
    const coincideTipo = filtroActivo === "todos" || p.tipo === filtroActivo;
    const coincideTexto = p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase());
    return coincideTipo && coincideTexto;
  });

  if (filtrados.length === 0) {
    catalogo.innerHTML = "<p style='grid-column: 1 / -1; text-align:center;'>No se encontraron productos.</p>";
    return;
  }

  filtrados.forEach(producto => {
    const card = document.createElement("div");
    card.className = "producto";

    let currentColor = 0;
    let currentImg = 0;

    const img = document.createElement("img");
    const getImgs = () => producto.colores ? producto.colores[currentColor].imagenes : producto.imagenes;
    img.src = getImgs()[currentImg];
    img.alt = producto.nombre;

    const imagenContenedor = document.createElement("div");
    imagenContenedor.className = "imagen-contenedor";
    imagenContenedor.appendChild(img);

    const flechasContenedor = document.createElement("div");
    flechasContenedor.className = "flechas";

    const btnPrev = document.createElement("button");
    btnPrev.className = "flecha izquierda";
    btnPrev.textContent = "<";
    btnPrev.onclick = e => {
      e.stopPropagation();
      const arr = getImgs();
      currentImg = (currentImg - 1 + arr.length) % arr.length;
      img.src = arr[currentImg];
    };

    const btnNext = document.createElement("button");
    btnNext.className = "flecha derecha";
    btnNext.textContent = ">";
    btnNext.onclick = e => {
      e.stopPropagation();
      const arr = getImgs();
      currentImg = (currentImg + 1) % arr.length;
      img.src = arr[currentImg];
    };

    flechasContenedor.appendChild(btnPrev);
    flechasContenedor.appendChild(btnNext);
    imagenContenedor.appendChild(flechasContenedor);

    // Swatches de color dentro de la imagen, justo debajo de las flechas
    if (producto.colores) {
      const coloresCont = document.createElement("div");
      coloresCont.className = "colores-cont";
      producto.colores.forEach((clr, idx) => {
        const swatch = document.createElement("button");
        swatch.className = "swatch";
        swatch.title = clr.nombre;
        swatch.style.background = clr.codigo;
        swatch.dataset.colorIndex = idx;
        swatch.addEventListener("click", e => {
          e.stopPropagation();
          currentColor = parseInt(swatch.dataset.colorIndex);
          currentImg = 0;
          img.src = producto.colores[currentColor].imagenes[currentImg];
        });
        coloresCont.appendChild(swatch);
      });
      imagenContenedor.appendChild(coloresCont);
    }

    const descripcion = document.createElement("div");
    descripcion.className = "descripcion";
    descripcion.textContent = producto.descripcion;

    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = `
      <div>${producto.nombre}</div>
      <div class="precio">${producto.precio}</div>
    `;

    card.appendChild(imagenContenedor);
    card.appendChild(descripcion);
    card.appendChild(info);
    catalogo.appendChild(card);
  });
}

document.querySelectorAll(".filtros button").forEach(boton => {
  boton.addEventListener("click", () => {
    document.querySelectorAll(".filtros button").forEach(b => b.classList.remove("activo"));
    boton.classList.add("activo");
    filtroActivo = boton.dataset.filtro;
    renderProductos();
  });
});

document.getElementById("buscador").addEventListener("input", e => {
  terminoBusqueda = e.target.value;
  renderProductos();
});

renderProductos();
