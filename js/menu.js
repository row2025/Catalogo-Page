document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const cerrarBtn = document.getElementById('cerrar-menu');
  const menuLateral = document.getElementById('menu-lateral');

  menuBtn.addEventListener('click', () => {
    menuLateral.classList.add('abierto');
  });

  cerrarBtn.addEventListener('click', () => {
    menuLateral.classList.remove('abierto');
  });
});