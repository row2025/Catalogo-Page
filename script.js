const productos = [
  {
    nombre: "Camiseta FLAWLESS Blanca",
    tipo: "camiseta",
    precio: "12,95€",
    imagenes: ["./images/camiseta.png", "./images/camiseta2.png"],
    descripcion: "Camiseta oversize con diseño exclusivo. Ideal para el verano."
  },
  {
    nombre: "Camiseta WORK IT Negra",
    tipo: "camiseta",
    precio: "12,95€",
    imagenes: ["./images/camiseta3.png", "./images/camiseta4.png"],
    descripcion: "Camiseta con diseño perfecto para ir al gimnasio o salir a la calle."
  },
  {
    nombre: "Pantalón ROW",
    tipo: "pantalón",
    precio: "69,99€",
    imagenes: ["./images/pantalon1.png", "./images/pantalon2.png"],
    descripcion: "Pantalón cargo con múltiples bolsillos. Comodidad y estilo en uno solo."
  },
  {
    nombre: "Camiseta ROW",
    tipo: "camiseta",
    precio: "29,99€",
    imagenes: ["./images/camiseta1.png", "./images/camiseta2.png"],
    descripcion: "Camiseta básica con diseño minimalista y suave al tacto."
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

    let currentImg = 0;
    const img = document.createElement("img");
    img.src = producto.imagenes[currentImg];
    img.alt = producto.nombre;

    const imagenContenedor = document.createElement("div");
    imagenContenedor.className = "imagen-contenedor";
    imagenContenedor.appendChild(img);

    const flechasContenedor = document.createElement("div");
    flechasContenedor.className = "flechas";

    const btnPrev = document.createElement("button");
    btnPrev.className = "flecha izquierda";
    btnPrev.textContent = "<";
    btnPrev.onclick = (e) => {
      e.stopPropagation();
      currentImg = (currentImg - 1 + producto.imagenes.length) % producto.imagenes.length;
      img.src = producto.imagenes[currentImg];
    };

    const btnNext = document.createElement("button");
    btnNext.className = "flecha derecha";
    btnNext.textContent = ">";
    btnNext.onclick = (e) => {
      e.stopPropagation();
      currentImg = (currentImg + 1) % producto.imagenes.length;
      img.src = producto.imagenes[currentImg];
    };

    flechasContenedor.appendChild(btnPrev);
    flechasContenedor.appendChild(btnNext);
    imagenContenedor.appendChild(flechasContenedor);

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

document.getElementById("buscador").addEventListener("input", (e) => {
  terminoBusqueda = e.target.value;
  renderProductos();
});

renderProductos();
