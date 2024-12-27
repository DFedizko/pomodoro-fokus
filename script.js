const html = document.querySelector('html');
const focoBtn = document.querySelector('.app__card-button--foco');
const curtoBtn = document.querySelector('.app__card-button--curto');

focoBtn.addEventListener('click', () => {
    html.setAttribute('data-contexto', 'foco');
});

curtoBtn.addEventListener('click', () => {
    html.setAttribute('data-contexto', 'descanso-curto');
});