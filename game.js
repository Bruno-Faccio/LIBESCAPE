// --- CONFIGURAÇÃO DO CANVAS ---
const canvas = document.getElementById('jogo');
const ctx = canvas.getContext('2d');

// parte em que o código utiliza do canva para ajustar as escalas da tela
function ajustarTela() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
// Responsável por adicionar a responsividade da tela
window.addEventListener('resize', ajustarTela);
ajustarTela(); 

// --- INTERFACE E HUD ---
// Estes adicionam a parte do corpo da barra de vida, hud e moedas do game (esqueleto)
const uiTelas = { 
    inicial: document.getElementById('menu-inicial'), 
    config: document.getElementById('menu-config'),
    gameover: document.getElementById('menu-gameover'), 
    vitoria: document.getElementById('menu-vitoria') 
};
const hud = document.getElementById('hud');
const barraVida = document.getElementById('barra-vida');
const tempoHud = document.getElementById('tempo-hud');
const moedasHud = document.getElementById('moedas-hud');
const nomeHud = document.getElementById('nome-hud');

// --- CARREGAMENTO DE ASSETS ---
// Nessa parte ele utiliza o const para identificar os mapas como constantes fixas utilizando os arquivos em .png
const mapas = { 1: new Image(), 2: new Image(), 3: new Image() };
mapas[1].src = 'mapa.metro.png';
mapas[2].src = 'mapa.cidade.png';
mapas[3].src = 'mapa.faculdade.png'; 

const portasImagens = { 1: new Image(), 2: new Image(), 3: new Image() };
portasImagens[1].src = 'porta.mapa.metro.png';
portasImagens[2].src = 'porta.mapa.cidade.png';
portasImagens[3].src = 'porta.mapa.faculdade.png';

// parte em que adicionamos para ajustar cada inimigo e seus tamanhos.
const skinsInimigos = {
    '🧟': { img: new Image(), proj: null, tamanho: 65 },
    '🐺': { img: new Image(), proj: new Image(), tamanho: 160 },
    '👻': { img: new Image(), proj: new Image(), tamanho: 160 },
    '🦇': { img: new Image(), proj: null, tamanho: 65 },
    '🤖': { img: new Image(), proj: new Image(), tamanho: 160 },
    '👾': { img: new Image(), proj: new Image(), tamanho: 160 }
};

// Vinculação das imagens baseada nos emojis representativos
skinsInimigos['🧟'].img.src = 'zumbi.png';
skinsInimigos['🐺'].img.src = 'lobo.png';
skinsInimigos['🐺'].proj.src = 'osso.png';
skinsInimigos['👻'].img.src = 'fantasma.png';
skinsInimigos['👻'].proj.src = 'fogo.png';
skinsInimigos['🦇'].img.src = 'morcego.png';
skinsInimigos['🤖'].img.src = 'robo.png';
skinsInimigos['🤖'].proj.src = 'laser_red.png';
skinsInimigos['👾'].img.src = 'alien.png';
skinsInimigos['👾'].proj.src = 'laser_green.png';

// --- CONFIGURAÇÕES DE JOGO E MUNDO ---
const imagemJogador = new Image();
const MAPA_LARGURA = 3000;
const MAPA_ALTURA = 3000;
const ZOOM = 1.2; 
const MAX_INIMIGOS = 5; 
const META_MOEDAS = 6;
const mostrarParedes = false; // Debug

// Coordenadas das colisões (geradas via image-map.net)
const paredesFase1 = [
    { x: 89, y: 830, w: 567, h: 280 }, { x: 740, y: 826, w: 573, h: 290 },
    { x: 2, y: 977, w: 1399, h: 142 }, { x: -1, y: 862, w: 106, h: 115 },
    { x: -1, y: 0, w: 1402, h: 71 }, { x: 2, y: 58, w: 98, h: 84 },
    { x: 1299, y: 51, w: 101, h: 108 }, { x: 1300, y: 863, w: 100, h: 141 },
    { x: 2, y: 135, w: 23, h: 753 }, { x: 1367, y: 144, w: 33, h: 726 },
    { x: 89, y: 220, w: 568, h: 153 }, { x: 739, y: 219, w: 571, h: 155 },
    { x: 89, y: 520, w: 568, h: 162 }, { x: 739, y: 520, w: 569, h: 162 },
    { x: 149, y: 748, w: 40, h: 25 }, { x: 211, y: 749, w: 42, h: 24 },
    { x: 565, y: 749, w: 39, h: 23 }, { x: 795, y: 747, w: 42, h: 26 },
    { x: 1146, y: 747, w: 43, h: 26 }, { x: 1211, y: 748, w: 41, h: 24 },
    { x: 149, y: 436, w: 39, h: 21 }, { x: 213, y: 436, w: 38, h: 26 },
    { x: 326, y: 742, w: 151, h: 35 }, { x: 925, y: 742, w: 151, h: 34 }
];

const paredesFase2 = [
    { x: 744, y: 668, w: 193, h: 407 }, { x: 1125, y: 665, w: 222, h: 204 },
    { x: 1102, y: 926, w: 266, h: 143 }, { x: 25, y: 860, w: 147, h: 212 },
    { x: 54, y: 506, w: 122, h: 292 }, { x: 461, y: 967, w: 102, h: 114 }
];

const paredesFase3 = [
    { x: 111, y: 305, w: 407, h: 218 }, { x: 6, y: 11, w: 401, h: 213 },
    { x: 186, y: 661, w: 199, h: 144 }, { x: 1015, y: 661, w: 199, h: 144 },
    { x: 1139, y: 437, w: 67, h: 129 }, { x: 902, y: 306, w: 385, h: 220 },
    { x: 8, y: 974, w: 404, h: 144 }, { x: -2, y: -1, w: 32, h: 1122 },
    { x: 997, y: 937, w: 402, h: 185 }, { x: 402, y: -2, w: 999, h: 147 },
    { x: 502, y: 895, w: 396, h: 224 }, { x: 394, y: 1058, w: 616, h: 63 },
    { x: 1370, y: 126, w: 31, h: 862 }, { x: 1036, y: 822, w: 157, h: 30 },
    { x: 208, y: 822, w: 155, h: 30 }, { x: 1278, y: 684, w: 23, h: 171 },
    { x: 106, y: 688, w: 17, h: 172 }, { x: 103, y: 936, w: 313, h: 45 },
    { x: 993, y: 119, w: 114, h: 114 }, { x: 835, y: 87, w: 38, h: 267 },
    { x: 523, y: 140, w: 40, h: 207 }, { x: 397, y: 124, w: 130, h: 67 },
    { x: 847, y: 125, w: 165, h: 67 }, { x: 560, y: 142, w: 284, h: 28 },
    { x: 1182, y: 140, w: 199, h: 84 }, { x: 847, y: 310, w: 68, h: 45 }
];

// --- ESTADO DO JOGO ---
let paredesAtuais = [], estadoJogo = 'menu', tempoRestante = 30;
let frameId, intervaloTimer, moedasColetadas = 0, faseAtual = 1, tempoTransicaoInicio = 0;
const teclas = {};

// Input de teclado
window.addEventListener('keydown', e => teclas[e.code] = true);
window.addEventListener('keyup', e => teclas[e.code] = false);

// --- SISTEMA DE ÁUDIO ---
let audioCtx;
function ativarSom() { 
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
    if (audioCtx.state === 'suspended') audioCtx.resume(); 
}

function tocarSom(tipo) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator(); 
    const gain = audioCtx.createGain();
    osc.connect(gain); 
    gain.connect(audioCtx.destination);
    
    if (tipo === 'dano') { 
        osc.type = 'sawtooth'; 
        osc.frequency.setValueAtTime(150, audioCtx.currentTime); 
        osc.start(); osc.stop(audioCtx.currentTime + 0.1); 
    }
    if (tipo === 'vitoria') { 
        osc.type = 'sine'; 
        osc.frequency.setValueAtTime(660, audioCtx.currentTime); 
        osc.start(); osc.stop(audioCtx.currentTime + 0.3); 
    }
    if (tipo === 'moeda') { 
        osc.type = 'sine'; 
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); 
        osc.start(); osc.stop(audioCtx.currentTime + 0.1); 
    }
}

// --- FUNÇÕES DE FÍSICA E COLISÃO ---
function podeMover(novoX, novoY, tamanho) {
    if (novoX < 0 || novoY < 0 || novoX > MAPA_LARGURA - tamanho || novoY > MAPA_ALTURA - tamanho) return false;
    let mapaAtual = mapas[faseAtual];
    let fX = MAPA_LARGURA / (mapaAtual.naturalWidth || 1400);
    let fY = MAPA_ALTURA / (mapaAtual.naturalHeight || 1100);
    for (let p of paredesAtuais) {
        if (novoX < (p.x * fX) + (p.w * fX) && novoX + tamanho > (p.x * fX) && 
            novoY < (p.y * fY) + (p.h * fY) && novoY + tamanho > (p.y * fY)) return false; 
    }
    return true; 
}

function verificarColisaoObj(obj1, obj2) { 
    return obj1.x < obj2.x + obj2.tamanho && 
           obj1.x + obj1.tamanho > obj2.x && 
           obj1.y < obj2.y + obj2.tamanho && 
           obj1.y + obj1.tamanho > obj2.y;
}

// --- CLASSES ---
class Entidade {
    constructor(x, y, tamanho, velocidade, sprite) { 
        this.x = x; this.y = y; this.tamanho = tamanho; this.velocidade = velocidade; this.sprite = sprite; 
    }
    desenhar(ctx) { 
        if (this.sprite instanceof Image) {
            if (this.sprite.complete) ctx.drawImage(this.sprite, this.x, this.y, this.tamanho, this.tamanho);
        } else {
            ctx.save(); ctx.font = `${this.tamanho}px Arial`; ctx.textAlign = "left"; 
            ctx.textBaseline = "top"; ctx.fillText(this.sprite, this.x, this.y); ctx.restore();
        }
    }
}

class Jogador extends Entidade {
    constructor(x, y) { 
        super(x, y, 77, 7.0, imagemJogador); 
        this.vida = 100; this.invulneravel = 0; 
    }
    atualizar() {
        let dx = 0, dy = 0;
        if (teclas['ArrowUp'] || teclas['KeyW']) dy -= this.velocidade;
        if (teclas['ArrowDown'] || teclas['KeyS']) dy += this.velocidade;
        if (teclas['ArrowLeft'] || teclas['KeyA']) dx -= this.velocidade;
        if (teclas['ArrowRight'] || teclas['KeyD']) dx += this.velocidade;
        
        if (dx !== 0 && podeMover(this.x + dx, this.y, this.tamanho)) this.x += dx;
        if (dy !== 0 && podeMover(this.x, this.y + dy, this.tamanho)) this.y += dy;
        if (this.invulneravel > 0) this.invulneravel--;
    }
    tomarDano() { 
        if (this.invulneravel <= 0) { 
            this.vida -= 25; this.invulneravel = 40; tocarSom('dano'); 
            barraVida.style.width = `${Math.max(0, this.vida)}%`; 
            if (this.vida <= 0) finalizarJogo('gameover'); 
        } 
    }
    desenhar(ctx) { if (this.invulneravel % 4 < 2) super.desenhar(ctx); }
}

class Moeda extends Entidade { 
    constructor(x, y) { super(x, y, 35, 0, '💎'); this.coletada = false; } 
}

class Projetil extends Entidade {
    constructor(x, y, dx, dy, img) { 
        super(x, y, 25, 8, img); this.dx = dx; this.dy = dy; this.ativo = true; 
    }
    atualizar() { 
        this.x += this.dx * this.velocidade; 
        this.y += this.dy * this.velocidade; 
        if (!podeMover(this.x, this.y, this.tamanho)) this.ativo = false; 
    }
}

class Inimigo extends Entidade {
    constructor(x, y, tipoEmoji) { 
        const config = skinsInimigos[tipoEmoji];
        let vel = 3.5, tipoClass = 'melee';
        if (tipoEmoji === '🦇') vel = 5.0;
        if (['🐺', '👻', '🤖', '👾'].includes(tipoEmoji)) {
            tipoClass = 'shooter';
            vel = (tipoEmoji === '👻' || tipoEmoji === '🤖') ? 2.0 : 3.0;
        }
        super(x, y, config.tamanho, vel, config.img); 
        this.tipoEmoji = tipoEmoji; this.tipoClass = tipoClass; this.imgProj = config.proj;
        this.angulo = Math.random() * Math.PI * 2; 
        this.cooldownTiro = Math.floor(Math.random() * 60) + 60; 
    }
    atualizar(alvo) {
        let dx = (alvo.x - this.x), dy = (alvo.y - this.y), dist = Math.hypot(dx, dy), moveX = 0, moveY = 0;
        if (dist < 600) { 
            if (this.tipoClass === 'shooter') {
                if (dist > 300) { moveX = (dx/dist) * this.velocidade; moveY = (dy/dist) * this.velocidade; }
                else if (dist < 200) { moveX = -(dx/dist) * this.velocidade; moveY = -(dy/dist) * this.velocidade; }
                if (this.cooldownTiro <= 0 && this.imgProj) { 
                    projeteis.push(new Projetil(this.x + 10, this.y + 10, dx / dist, dy / dist, this.imgProj)); 
                    this.cooldownTiro = 90; 
                }
            } else { moveX = (dx/dist) * this.velocidade; moveY = (dy/dist) * this.velocidade; }
        } else { 
            moveX = Math.cos(this.angulo) * 2; moveY = Math.sin(this.angulo) * 2; 
            if (Math.random() < 0.02) this.angulo = Math.random() * Math.PI * 2; 
        }
        if (this.cooldownTiro > 0) this.cooldownTiro--;
        if (moveX !== 0 && podeMover(this.x + moveX, this.y, this.tamanho)) this.x += moveX;
        if (moveY !== 0 && podeMover(this.x, this.y + moveY, this.tamanho)) this.y += moveY;
    }
}

class Porta extends Entidade { 
    constructor(x, y) { super(x, y, 310, 0, null); this.aberta = false; } 
    desenhar(ctx) {
        if (this.aberta) {
            let img = portasImagens[faseAtual];
            if (img.complete) ctx.drawImage(img, this.x, this.y, this.tamanho, this.tamanho);
        }
    }
}

// --- VARIÁVEIS DE INSTÂNCIA ---
let jogador, porta, inimigos = [], moedas = [], projeteis = [];

// --- GESTÃO DE MENUS E FLUXO ---
function mostrarConfiguracao() { 
    uiTelas.inicial.classList.remove('ativa'); 
    uiTelas.config.classList.add('ativa'); 
}

window.iniciarJogo = function() {
    ativarSom(); 
    nomeHud.innerText = document.getElementById('input-nome').value || 'Zé';
    const sel = document.querySelector('input[name="personagem"]:checked');
    imagemJogador.src = sel ? sel.value : 'skin1.png';
    iniciarFase(1); 
    if (frameId) cancelAnimationFrame(frameId); 
    loop();
};

window.voltarMenu = () => { 
    estadoJogo = 'menu'; 
    clearInterval(intervaloTimer);
    for (let t in uiTelas) uiTelas[t].classList.remove('ativa');
    uiTelas.inicial.classList.add('ativa'); 
    hud.style.display = 'none'; 
    if (frameId) cancelAnimationFrame(frameId);
};

function iniciarFase(num) {
    faseAtual = num;
    if (faseAtual === 1) paredesAtuais = paredesFase1;
    else if (faseAtual === 2) paredesAtuais = paredesFase2;
    else if (faseAtual === 3) paredesAtuais = paredesFase3;

    const tamP = 310; 
    let mapaImg = mapas[faseAtual];
    let fX = 3000 / (mapaImg.naturalWidth || 1400);
    let fY = 3000 / (mapaImg.naturalHeight || 1100);

    // Posicionamento da porta
    if (faseAtual === 1) {
        porta = new Porta(625 * fX, 0.4 * fY); 
    } else {
        let portaX, portaY;
        let tentativa = 0;
        do {
            portaX = Math.random() * (MAPA_LARGURA - tamP);
            portaY = Math.random() * (MAPA_ALTURA - tamP);
            tentativa++;
        } while (!podeMover(portaX, portaY, tamP) && tentativa < 100);
        porta = new Porta(portaX, portaY);
    }
    porta.tamanho = tamP;

    // Reset de personagens e itens
    jogador = new Jogador(MAPA_LARGURA/2, MAPA_ALTURA/2 + 600); 
    moedasColetadas = 0; moedasHud.innerText = "0"; 
    tempoRestante = 30; tempoHud.innerText = tempoRestante;
    
    const sprites = { 1: ['🧟', '🐺'], 2: ['👻', '🦇'], 3: ['🤖', '👾'] }[faseAtual];
    inimigos = []; projeteis = []; 
    while (inimigos.length < MAX_INIMIGOS) {
        let rx = Math.random() * (MAPA_LARGURA - 160), ry = Math.random() * (MAPA_ALTURA - 160);
        let tipoE = sprites[Math.floor(Math.random() * sprites.length)];
        if (podeMover(rx, ry, skinsInimigos[tipoE].tamanho)) inimigos.push(new Inimigo(rx, ry, tipoE));
    }
    
    moedas = [];
    while (moedas.length < META_MOEDAS) {
        let rx = Math.random() * (MAPA_LARGURA - 100), ry = Math.random() * (MAPA_ALTURA - 100);
        if (podeMover(rx, ry, 35)) moedas.push(new Moeda(rx, ry));
    }

    if(intervaloTimer) clearInterval(intervaloTimer);
    intervaloTimer = setInterval(() => { 
        if(estadoJogo === 'jogando' && tempoRestante > 0) { 
            tempoRestante--; tempoHud.innerText = tempoRestante; 
        } 
    }, 1000);

    estadoJogo = 'jogando';
    for (let t in uiTelas) uiTelas[t].classList.remove('ativa');
    hud.style.display = 'block'; 
    barraVida.style.width = '100%';
}

function finalizarJogo(res) { 
    estadoJogo = res; 
    clearInterval(intervaloTimer);
    for (let t in uiTelas) uiTelas[t].classList.remove('ativa');
    uiTelas[res].classList.add('ativa'); 
    hud.style.display = 'none'; 
}

// --- SISTEMA DE VISUALIZAÇÃO ---
function desenharMinimapa(camX, camY) {
    ctx.setTransform(1,0,0,1,0,0);
    const mmS = 200, mmX = canvas.width - 220, mmY = 20, esc = mmS/MAPA_LARGURA;
    ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(mmX, mmY, mmS, mmS);
    ctx.save(); ctx.beginPath(); ctx.rect(mmX, mmY, mmS, mmS); ctx.clip();
    let m = mapas[faseAtual]; if (m.complete) ctx.drawImage(m, mmX, mmY, mmS, mmS);
    ctx.fillStyle = 'red'; inimigos.forEach(i => ctx.fillRect(mmX + i.x*esc, mmY + i.y*esc, 4, 4));
    ctx.fillStyle = '#00f2ff'; moedas.forEach(mo => { if(!mo.coletada) ctx.fillRect(mmX + mo.x*esc, mmY + mo.y*esc, 3, 3); });
    ctx.fillStyle = 'white'; ctx.fillRect(mmX + jogador.x*esc, mmY + jogador.y*esc, 6, 6);
    if(porta.aberta) { ctx.fillStyle = 'yellow'; ctx.fillRect(mmX + porta.x*esc, mmY + porta.y*esc, 10, 10); }
    ctx.restore(); 
}

// --- LOOP PRINCIPAL ---
function loop() {
    if (estadoJogo === 'menu' || estadoJogo === 'gameover' || estadoJogo === 'vitoria') return;
    
    // Tela de Transição entre fases
    if (estadoJogo === 'transicao') {
        const dec = Date.now() - tempoTransicaoInicio; 
        let rest = Math.ceil((7000 - dec) / 1000); 
        ctx.setTransform(1,0,0,1,0,0); 
        ctx.clearRect(0,0,canvas.width,canvas.height); 
        ctx.fillStyle='#111'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle='#f1c40f'; ctx.font='bold 35px Arial'; ctx.textAlign='center'; 
        ctx.fillText(`Fase ${faseAtual} concluída!`, canvas.width/2, canvas.height/2 - 40);
        ctx.fillStyle='#fff'; ctx.font='25px Arial'; 
        ctx.fillText(`Próxima fase em: ${Math.max(0, rest)}s`, canvas.width/2, canvas.height/2 + 30);
        if (rest <= 0) iniciarFase(faseAtual + 1);
        frameId = requestAnimationFrame(loop); return;
    }

    // Atualização de Lógica
    jogador.atualizar();
    inimigos.forEach(i => { i.atualizar(jogador); if (verificarColisaoObj(jogador, i)) jogador.tomarDano(); });
    projeteis.forEach(p => { 
        p.atualizar(); 
        if (p.ativo && verificarColisaoObj(jogador, p)) { jogador.tomarDano(); p.ativo = false; } 
    });
    projeteis = projeteis.filter(p => p.ativo);
    
    moedas.forEach(m => { 
        if (!m.coletada && verificarColisaoObj(jogador, m)) { 
            m.coletada = true; moedasColetadas++; moedasHud.innerText = moedasColetadas; tocarSom('moeda'); 
        } 
    });

    // Condição para abrir a porta (Exemplo: Todas moedas coletadas E tempo esgotado)
    if (moedasColetadas >= META_MOEDAS && tempoRestante <= 0) porta.aberta = true;

    // Verificação de saída do nível
    if (porta.aberta && verificarColisaoObj(jogador, porta)) {
        if(faseAtual < 3) { estadoJogo = 'transicao'; tempoTransicaoInicio = Date.now(); tocarSom('vitoria'); }
        else { finalizarJogo('vitoria'); tocarSom('vitoria'); }
    }

    // Controle da Câmera
    let camX = Math.max(0, Math.min(jogador.x - canvas.width/2/ZOOM, MAPA_LARGURA - canvas.width/ZOOM));
    let camY = Math.max(0, Math.min(jogador.y - canvas.height/2/ZOOM, MAPA_ALTURA - canvas.height/ZOOM));

    // Renderização
    ctx.setTransform(1,0,0,1,0,0); 
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.translate(-camX*ZOOM, -camY*ZOOM); 
    ctx.scale(ZOOM, ZOOM);

    let mapa = mapas[faseAtual]; 
    if (mapa.complete && mapa.naturalWidth !== 0) ctx.drawImage(mapa, 0, 0, MAPA_LARGURA, MAPA_ALTURA);
    
    if (porta.aberta) porta.desenhar(ctx);
    moedas.forEach(m => { if(!m.coletada) m.desenhar(ctx); });
    projeteis.forEach(p => p.desenhar(ctx));
    inimigos.forEach(i => i.desenhar(ctx));
    jogador.desenhar(ctx);
    
    // Interface sobre o mapa
    desenharMinimapa(camX, camY);
    
    frameId = requestAnimationFrame(loop);
}
