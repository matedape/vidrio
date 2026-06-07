"use strict";
const canvas = document.getElementById('vidrio');
const ctx = canvas.getContext('2d');
const cartelInstrucciones = document.querySelector('.instrucciones');
const btnCaptura = document.getElementById('btnCaptura');
const btnReset = document.getElementById('btnReset');
const inputGrosor = document.getElementById('grosor');
const panelControles = document.getElementById('panelControles');
const btnMinimizar = document.getElementById('btnMinimizar');
let dibujando = false;
let grosorPincel = 40;
// Configuración unificada del pincel/goma
function configurarPincel() {
    ctx.lineWidth = grosorPincel;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}
// Ajustar el tamaño del canvas al de la pantalla
function ajustarPantalla() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    configurarPincel();
    pintarCapaVidrio();
}
// Pintar la capa inicial de vidrio empañado (Glassmorphism)
function pintarCapaVidrio() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = 'blur(16px)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
}
// Función para ejecutar el efecto de limpieza
function limpiar(e) {
    if (!dibujando)
        return;
    ctx.globalCompositeOperation = 'destination-out';
    let clientX;
    let clientY;
    if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }
    else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    ctx.lineTo(clientX, clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(clientX, clientY);
}
if (btnReset) {
    btnReset.addEventListener('click', () => {
        pintarCapaVidrio();
        configurarPincel();
        // Volvemos a mostrar las instrucciones si se habían ocultado
        if (cartelInstrucciones) {
            cartelInstrucciones.classList.remove('oculto');
        }
    });
}
if (inputGrosor) {
    inputGrosor.addEventListener('input', () => {
        grosorPincel = parseInt(inputGrosor.value);
        configurarPincel(); // Actualiza el contexto del canvas al toque
    });
}
if (btnCaptura) {
    btnCaptura.addEventListener('click', () => {
        // 1. Creamos un canvas temporal en memoria del mismo tamaño
        const canvasTemporal = document.createElement('canvas');
        canvasTemporal.width = canvas.width;
        canvasTemporal.height = canvas.height;
        const ctxTemporal = canvasTemporal.getContext('2d');
        if (ctxTemporal) {
            // 2. Pintamos el fondo celeste/azul del baño en el canvas temporal
            // Usamos un gradiente idéntico al de tu CSS para que la foto salga igual
            const gradiente = ctxTemporal.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradiente.addColorStop(0, '#a2d2ff'); // Tus colores celestes estilo espejo
            gradiente.addColorStop(1, '#bde0fe');
            ctxTemporal.fillStyle = gradiente;
            ctxTemporal.fillRect(0, 0, canvasTemporal.width, canvasTemporal.height);
            // 3. Dibujamos encima lo que limpiaste en tu canvas real
            ctxTemporal.drawImage(canvas, 0, 0);
            // 4. Convertimos el resultado en un archivo PNG descargable
            const urlImagen = canvasTemporal.toDataURL('image/png');
            // 5. Truco del enlace fantasma para forzar la descarga en la compu o celu
            const enlaceDescarga = document.createElement('a');
            enlaceDescarga.download = 'mi-espejo.png'; // Nombre del archivo
            enlaceDescarga.href = urlImagen;
            enlaceDescarga.click(); // Forzamos el click de descarga
        }
    });
}
if (btnMinimizar && panelControles) {
    btnMinimizar.addEventListener('click', () => {
        // Alternamos la clase minimizado
        panelControles.classList.toggle('minimizado');
        // Cambiamos el emoticón según el estado del panel
        if (panelControles.classList.contains('minimizado')) {
            btnMinimizar.innerText = '➕'; // Si está cerrado, muestra el más para abrir
        }
        else {
            btnMinimizar.innerText = '➖'; // Si está abierto, muestra el menos para cerrar
        }
    });
}
// Eventos para el Mouse
canvas.addEventListener('mousedown', (e) => {
    dibujando = true;
    ctx.globalCompositeOperation = 'destination-out';
    configurarPincel(); // Asegura que conserve el grosor al hacer click
    if (cartelInstrucciones)
        cartelInstrucciones.classList.add('oculto');
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
});
canvas.addEventListener('mouseup', () => dibujando = false);
canvas.addEventListener('mousemove', limpiar);
// Eventos Táctiles (para el celular)
canvas.addEventListener('touchstart', (e) => {
    dibujando = true;
    ctx.globalCompositeOperation = 'destination-out';
    configurarPincel();
    if (cartelInstrucciones)
        cartelInstrucciones.classList.add('oculto');
    ctx.beginPath();
    ctx.moveTo(e.touches[0].clientX, e.touches[0].clientY);
});
canvas.addEventListener('touchend', () => dibujando = false);
canvas.addEventListener('touchmove', limpiar);
// Controlar el rediseño si se cambia el tamaño de la ventana
window.addEventListener('resize', ajustarPantalla);
// 🚀 INICIALIZACIÓN SEGURA: Esperamos a que la ventana cargue TODO el HTML antes de ejecutar el JS
window.addEventListener('load', () => {
    ajustarPantalla();
});
