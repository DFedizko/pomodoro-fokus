const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');

const btnRemoverConcluidas = document.getElementById('btn-remover-concluidas'); 
const btnRemoverTodas = document.getElementById('btn-remover-todas'); 


// Define a variável se o primeiro argumento existir, se não (se for null), define o segundo.
let tarefas = JSON.parse(localStorage.getItem('tarefas')) // Transforma string formatada em Objeto
|| [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas)); // Transforma objeto em string para o localStorage ler
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');
    
    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>`;
    
    const p = document.createElement('p');
    p.textContent = tarefa.descricao;
    p.classList.add('app__section-task-list-item-description');

    const button = document.createElement('button');
    button.classList.add('app_button-edit');

    button.onclick = () => {
        const novoNome = prompt('Qual é o novo nome da tarefa?');

        if (novoNome == null || novoNome.trim() == '') { return }

        p.textContent = novoNome;
        tarefa.descricao = novoNome; // Passa o novo nome para o objeto com o atributo tarefa
        atualizarTarefas(); // Pega o objeto com o valor novo (nome) e joga para o local storage através do setItem
    }

    const img = document.createElement('img');
    img.src = './imagens/edit.png';

    li.append(svg, p, button);
    button.appendChild(img);

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        button.setAttribute('disabled', true);
    } else {
        // Remove ou adiciona classe css na li
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active').forEach(item => item.classList.remove('app__section-task-list-item-active'));
            
            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = '';
    
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
            }
            
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
            li.classList.add('app__section-task-list-item-active');
        }
    }
    
    return li;
}   

btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden');
});

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textarea.value,
    }
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();

    // Esconde o form e limpa textarea
    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden');
});

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});

// Botão cancelar
btnCancelar.onclick = () => {
    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden');
};

// Adiciona um ouvinte de eventos para quando o evento "FocoFinalizado" for disparado, no caso, quando o pomodoro acabar e o atributo no html "data-contexto" for "foco"
document.addEventListener('FocoFinalizado', () => {

    // Quando essas variáveis tiverem algum valor diferente de null (quando a tarefa estiver selecionada)
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', true);
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
});

const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    });
    
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();
}

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);