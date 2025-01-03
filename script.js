const html = document.querySelector('html');

const focoBtn = document.querySelector('.app__card-button--foco');
const curtoBtn = document.querySelector('.app__card-button--curto');
const longoBtn = document.querySelector('.app__card-button--longo');
const botoes = document.querySelectorAll('.app__card-button');

const iniciarPausarBtn = document.getElementById('start-pause');
const textoIniciarPausarBtn = document.querySelector('#start-pause span');
const temporizador = document.getElementById('timer');
const imagem = document.querySelector('.app__image');
const frase = document.querySelector('.app__title');

const musicaFocoInput = document.getElementById('alternar-musica');
const musica = new Audio('./sons/luna-rise-part-one.mp3');
musica.loop = true;

const somPlay = new Audio('./sons/play.wav');
const somPause = new Audio('./sons/pause.mp3');
const somBeep = new Audio('./sons/beep.mp3');

const volume = 0.05;
musica.volume = 0.5; somPlay.volume = volume; somPause.volume = volume; somBeep.volume = volume;

let tempoDecorridoEmSegundos = 1500; // Default: 1500
let intervaloId = null;

musicaFocoInput.addEventListener('change', () => musica.paused ? musica.play() : musica.pause());

focoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBtn.classList.add('active');
});

curtoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBtn.classList.add('active');
});

longoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBtn.classList.add('active');
});

function alterarContexto(contexto) { // Passa o valor string do atributo data-contexto do html
    mostrarTempo();
    botoes.forEach((contexto) => {
        contexto.classList.remove('active');
    });
    html.setAttribute('data-contexto', contexto);
    imagem.src = `./imagens/${contexto}.png`;

    // Valida string
    switch (contexto) {
        // Caso a string seja igual á
        case 'foco':
            frase.innerHTML = `
                Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`;
            break;
        case 'descanso-curto':
            frase.innerHTML = `
                Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            break;
        case 'descanso-longo':
            frase.innerHTML = `
                Hora de voltar à superfície.<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
            break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    // Quando o tempo acabar
    if (tempoDecorridoEmSegundos < 1) {
        alert('Tempo finalizado!');

        const focoAtivo = html.getAttribute('data-contexto') == 'foco';

        // Só dispara o evento quando o tempo acabar e focoAtivo for true
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento); // Broadcast
        }
        
        zerar();
        return somBeep.play();
    }
    tempoDecorridoEmSegundos--;
    mostrarTempo();
}

iniciarPausarBtn.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    // Ao pausar
    if (intervaloId) {
        somPause.play();
        textoIniciarPausarBtn.textContent = 'Começar';
        textoIniciarPausarBtn.previousElementSibling.src = './imagens/play_arrow.png';
        return zerar();
    }

    //Ao dar Play
    somPlay.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    textoIniciarPausarBtn.textContent = 'Pausar';
    textoIniciarPausarBtn.previousElementSibling.src = './imagens/pause.png';
}

function zerar() {
    clearInterval(intervaloId);
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'});
    temporizador.innerHTML = tempoFormatado;
}

mostrarTempo();