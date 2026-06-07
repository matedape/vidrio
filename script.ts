const canvas = document.getElementById('vidrio') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const btnCaptura = document.getElementById('btnCaptura') as HTMLButtonElement;
const btnReset = document.getElementById('btnReset') as HTMLButtonElement;
const inputGrosor = document.getElementById('grosor') as HTMLInputElement;
const panelControles = document.getElementById('panelControles') as HTMLDivElement;
const btnMinimizar = document.getElementById('btnMinimizar') as HTMLSpanElement;

let dibujando: boolean = false;
let grosorPincel: number = 40; 

function configurarPincel(): void {
    ctx.lineWidth = grosorPincel; 
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

function ajustarPantalla(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    configurarPincel();
    pintarCapaVidrio();
}

function pintarCapaVidrio(): void {
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = 'blur(16px)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
}

function limpiar(e: MouseEvent | TouchEvent): void {
    if (!dibujando) return;
    ctx.globalCompositeOperation = 'destination-out';
    let clientX: number, clientY: number;

    if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    ctx.lineTo(clientX, clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(clientX, clientY);
}

// RESET MANUAL
if (btnReset) {
    btnReset.addEventListener('click', () => {
        pintarCapaVidrio();
        configurarPincel();
    });
}

// SLIDER GROSOR
if (inputGrosor) {
    inputGrosor.addEventListener('input', () => {
        grosorPincel = parseInt(inputGrosor.value);
        configurarPincel(); 
    });
}

// CAPTURA PNG
if (btnCaptura) {
    btnCaptura.addEventListener('click', () => {
        const canvasTemporal = document.createElement('canvas');
        canvasTemporal.width = canvas.width;
        canvasTemporal.height = canvas.height;
        const ctxTemporal = canvasTemporal.getContext('2d');

        if (ctxTemporal) {
            const gradiente = ctxTemporal.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradiente.addColorStop(0, '#a2d2ff'); 
            gradiente.addColorStop(1, '#bde0fe');
            ctxTemporal.fillStyle = gradiente;
            ctxTemporal.fillRect(0, 0, canvasTemporal.width, canvasTemporal.height);
            ctxTemporal.drawImage(canvas, 0, 0);

            const urlImagen = canvasTemporal.toDataURL('image/png');
            const enlaceDescarga = document.createElement('a');
            enlaceDescarga.download = 'mi-espejo.png';
            enlaceDescarga.href = urlImagen;
            enlaceDescarga.click();
        }
    });
}

// MINIMIZAR / MAXIMIZAR PANEL
if (btnMinimizar && panelControles) {
    btnMinimizar.addEventListener('click', () => {
        panelControles.classList.toggle('minimizado');
        btnMinimizar.innerText = panelControles.classList.contains('minimizado') ? '➕' : '➖';
    });
}

// EVENTOS DE DIBUJO
canvas.addEventListener('mousedown', (e: MouseEvent) => {
    dibujando = true;
    ctx.globalCompositeOperation = 'destination-out';
    configurarPincel(); 
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
});
canvas.addEventListener('mouseup', () => dibujando = false);
canvas.addEventListener('mousemove', limpiar);

canvas.addEventListener('touchstart', (e: TouchEvent) => {
    dibujando = true;
    ctx.globalCompositeOperation = 'destination-out';
    configurarPincel();
    ctx.beginPath();
    ctx.moveTo(e.touches[0].clientX, e.touches[0].clientY);
});
canvas.addEventListener('touchend', () => dibujando = false);
canvas.addEventListener('touchmove', limpiar);

window.addEventListener('resize', ajustarPantalla);
window.addEventListener('load', ajustarPantalla);