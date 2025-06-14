import { db, collection, setDoc, doc, getDoc } from './firebase.js';

let currentSlide = 0;

function moveSlide(direction) {
  const container = document.querySelector('.carousel-container');
  const slides = document.querySelectorAll('.carousel-item');
  const totalSlides = slides.length;

  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  container.style.transform = `translateX(-${currentSlide * 337}px)`;
}

function mostrarFormulario() {
  const formDiv = document.getElementById('formulario-compra');
  formDiv.style.display = 'block';
  window.scrollTo({ top: formDiv.offsetTop, behavior: 'smooth' });
}

function ocultarFormulario() {
  const formDiv = document.getElementById('formulario-compra');
  formDiv.style.display = 'none';
}

// Manejo del envío del formulario de compra
document.getElementById('formCompra').addEventListener('submit', async (e) => {
  e.preventDefault();

  const cantidadS = parseInt(document.getElementById("cantidadS").value, 10);
  const cantidadM = parseInt(document.getElementById("cantidadM").value, 10);
  const cantidadL = parseInt(document.getElementById("cantidadL").value, 10);

  if (cantidadS + cantidadM + cantidadL === 0) {
    alert("Debes seleccionar al menos una camiseta.");
    return;
  }


  const nombre = e.target.nombre.value.trim();
  const email = e.target.email.value.trim();
  const direccion = e.target.direccion.value.trim();
  const telefono = e.target.telefono.value.trim();

  if (!nombre || !email || !direccion || !telefono) {
    alert('Por favor completa todos los campos.');
    return;
  }

  try {
    // Creamos un documento con ID autogenerado en la colección 'datosCompra'
    const nuevoPedidoRef = doc(collection(db, 'datosCompra'));
    await setDoc(nuevoPedidoRef, {
      nombre,
      email,
      direccion,
      telefono,
      fecha: new Date(),
      pedido: {
        S: cantidadS,
        M: cantidadM,
        L: cantidadL
      }
    });


    alert('¡Gracias por tu pedido! Nos pondremos en contacto pronto.');

    e.target.reset();
    document.getElementById('formulario-compra').style.display = 'none';
  } catch (error) {
    console.error('Error guardando pedido en Firebase:', error);
    alert('Hubo un error al enviar tu pedido. Por favor, inténtalo de nuevo.');
  }
});

const PRODUCT_ID = "flawless_tshirt";
const stars = document.querySelectorAll(".stars i");

let userIP = null;
let userVotedValue = null;

async function fetchUserIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    userIP = data.ip;
  } catch (error) {
    console.error("Error obteniendo IP del usuario:", error);
  }
}


function resaltarEstrellas(valor, esVotoUsuario = false) {
  if (userVotedValue !== null && !esVotoUsuario) return;

  stars.forEach(star => {
    const val = parseFloat(star.getAttribute("data-value"));
    star.classList.toggle("active", val <= valor);
  });
}


async function guardarValoracion(valor) {
  if (!userIP) {
    alert("No se pudo obtener tu IP, no puedes votar.");
    return;
  }

  const userDocRef = doc(db, "valoraciones", PRODUCT_ID);
  const userIPRef = doc(collection(db, "valoraciones", PRODUCT_ID, "users"), userIP);

  const userVoteSnap = await getDoc(userIPRef);
  const docSnap = await getDoc(userDocRef);
  let votos = [];

  if (docSnap.exists()) {
    votos = docSnap.data().votos || [];
  }

  if (userVoteSnap.exists()) {
    const oldValoracion = userVoteSnap.data().valoracion;

    if (oldValoracion === valor) {
      alert("Ya tienes esta valoración. Gracias.");
      return;
    }

    await setDoc(userIPRef, {
      valoracion: valor,
      timestamp: new Date()
    });

    const index = votos.indexOf(oldValoracion);
    if (index !== -1) {
      votos[index] = valor;
    } else {
      votos.push(valor);
    }

    await setDoc(userDocRef, { votos }, { merge: true });
  } else {
    await setDoc(userIPRef, {
      valoracion: valor,
      timestamp: new Date()
    });

    votos.push(valor);
    await setDoc(userDocRef, { votos }, { merge: true });
  }

  userVotedValue = valor;
  resaltarEstrellas(valor, true); // Esto sí actualiza las estrellas
  mostrarMediaValoracion();
}

async function mostrarMediaValoracion() {
  const docRef = doc(db, "valoraciones", PRODUCT_ID);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    document.getElementById("avg-value").textContent = "-";
    return;
  }
  const votos = docSnap.data().votos || [];
  if (votos.length === 0) {
    document.getElementById("avg-value").textContent = "-";
    return;
  }
  const suma = votos.reduce((a, b) => a + b, 0);
  const media = (suma / votos.length).toFixed(2);
  document.getElementById("avg-value").textContent = media;
  resaltarEstrellas(media);
}

let tallaSeleccionada = null;

document.querySelectorAll(".talla-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".talla-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    tallaSeleccionada = btn.textContent.trim();
  });
});


stars.forEach(star => {
  star.addEventListener("click", () => {
    const valor = parseInt(star.getAttribute("data-value"));
    guardarValoracion(valor);
  });
});

// Inicializar
fetchUserIP();
mostrarMediaValoracion();

window.ocultarFormulario = ocultarFormulario;
window.mostrarFormulario = mostrarFormulario;
window.moveSlide = moveSlide;
