import { db, collection, setDoc, doc, getDoc } from './firebase.js';

let currentSlide = 0;

function moveSlide(direction) {
  const container = document.querySelector('.carousel-container');
  const slides = document.querySelectorAll('.carousel-item');
  const totalSlides = slides.length;

  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  container.style.transform = `translateX(-${currentSlide * 337}px)`;
}

function comprar() {
  alert('¡Gracias por tu compra! Próximamente te contactaremos.');
}

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

function resaltarEstrellas(valor) {
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
  resaltarEstrellas(valor);
  mostrarMediaValoracion();
}

async function mostrarMediaValoracion() {
  const docRef = doc(db, "valoraciones", PRODUCT_ID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const votos = docSnap.data().votos || [];
    const media = votos.reduce((a, b) => a + b, 0) / votos.length;
    document.getElementById("avg-value").innerText = media.toFixed(1);
  } else {
    document.getElementById("avg-value").innerText = "-";
  }
}

// Estrellas
stars.forEach(star => {
  star.addEventListener("mouseenter", () => {
    resaltarEstrellas(parseFloat(star.getAttribute("data-value")));
  });

  star.addEventListener("mouseleave", () => {
    resaltarEstrellas(userVotedValue || 0);
  });

  star.addEventListener("click", async () => {
    const value = parseFloat(star.getAttribute("data-value"));
    await guardarValoracion(value);
  });
});

// Selector de talla estilo Amazon
const tallaButtons = document.querySelectorAll(".talla-btn");
tallaButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tallaButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const tallaSeleccionada = btn.dataset.talla;
    console.log("Talla seleccionada:", tallaSeleccionada);
  });
});

(async () => {
  await fetchUserIP();

  if (userIP) {
    const userIPRef = doc(collection(db, "valoraciones", PRODUCT_ID, "users"), userIP);
    const userVoteSnap = await getDoc(userIPRef);

    if (userVoteSnap.exists()) {
      userVotedValue = userVoteSnap.data().valoracion;
      resaltarEstrellas(userVotedValue);
    }
  }

  await mostrarMediaValoracion();
})();

window.moveSlide = moveSlide;
window.comprar = comprar;
