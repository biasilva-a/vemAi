const API = "http://localhost:3000/api";

const listaEventos = document.getElementById("lista-eventos");
const campoPesquisa = document.getElementById("campo-pesquisa");
const btnUsuario = document.getElementById("btn-usuario");
const btnMinhasInscricoes = document.getElementById("btn-minhas-inscricoes");
const btnSair = document.getElementById("btn-sair");
const btnCadastrarEvento = document.getElementById("btn-cadastrar-evento");
const formEvento = document.getElementById("form-evento");
const listaInscricoes = document.getElementById("lista-inscricoes");

const modalEvento = new bootstrap.Modal(document.getElementById("modalEvento"));
const modalInscricoes = new bootstrap.Modal(document.getElementById("modalInscricoes"));

let eventos = [];
let categoriaSelecionada = "todos";

function pegarUsuario() {
    return JSON.parse(localStorage.getItem("usuario"));
}

const usuario = pegarUsuario();

if (!usuario) {
    window.location.href = "html1.html";
}

function atualizarUsuario() {
    const usuario = pegarUsuario();

    if (usuario) {
        btnUsuario.textContent = usuario.nome;
    }
}

atualizarUsuario();

async function carregarEventos() {
    try {
        const resposta = await fetch(`${API}/eventos`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar eventos.");
        }

        eventos = await resposta.json();
        mostrarEventos(eventos);

    } catch (erro) {
        console.error(erro);

        listaEventos.innerHTML = `
            <div class="mensagem-eventos">
                Não foi possível carregar os eventos.
            </div>
        `;
    }
}

function mostrarEventos(lista) {
    listaEventos.innerHTML = "";

    if (lista.length === 0) {
        listaEventos.innerHTML = `
            <div class="mensagem-eventos">
                Nenhum evento encontrado.
            </div>
        `;

        return;
    }

    lista.forEach(evento => {
        listaEventos.innerHTML += `
            <div class="col-4">
                <div class="card evento-card">
                    <div class="card-body">
                        <h3 class="card-title">${evento.nome}</h3>
                        <p class="evento-descricao">${evento.descricao}</p>
                        <p class="evento-informacoes">Data: ${evento.data}</p>
                        <p class="evento-informacoes">Horário: ${evento.horario}</p>
                        <p class="evento-informacoes">Local: ${evento.local}</p>
                        <p class="evento-informacoes">Categoria: ${evento.categoria}</p>
                        <button class="btn btn-inscrever" onclick="inscreverEvento(${evento.id_eventos})">
                            Inscrever-se
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

btnCadastrarEvento.addEventListener("click", () => {
    const usuario = pegarUsuario();

    if (!usuario) {
        window.location.href = "index1.html";
        return;
    }

    modalEvento.show();
});

formEvento.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const usuario = pegarUsuario();

    if (!usuario) {
        window.location.href = "index1.html";
        return;
    }

    const dadosEvento = {
        nome: document.getElementById("nome-evento").value,
        descricao: document.getElementById("descricao-evento").value,
        data: document.getElementById("data-evento").value,
        horario: document.getElementById("horario-evento").value,
        local: document.getElementById("local-evento").value,
        categoria: document.getElementById("categoria-evento").value,
        vagas: Number(document.getElementById("vagas-evento").value),
        id_usuario: usuario.id_usuario
    };

    try {
        const resposta = await fetch(`${API}/eventos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosEvento)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro || "Erro ao cadastrar evento.");
            return;
        }

        alert("Evento cadastrado com sucesso.");

        formEvento.reset();
        modalEvento.hide();
        carregarEventos();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor.");
    }
});

async function inscreverEvento(idEvento) {
    const usuario = pegarUsuario();

    if (!usuario) {
        window.location.href = "index1.html";
        return;
    }

    try {
        const resposta = await fetch(`${API}/inscricoes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_usuario: usuario.id_usuario,
                id_evento: idEvento
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro || "Não foi possível realizar a inscrição.");
            return;
        }

        alert("Inscrição realizada com sucesso.");

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor.");
    }
}

btnMinhasInscricoes.addEventListener("click", () => {
    carregarInscricoes();
    modalInscricoes.show();
});

async function carregarInscricoes() {
    const usuario = pegarUsuario();

    if (!usuario) {
        window.location.href = "index1.html";
        return;
    }

    listaInscricoes.innerHTML = `
        <p class="text-center">
            Carregando inscrições...
        </p>
    `;

    try {
        const resposta = await fetch(
            `${API}/inscricoes/usuario/${usuario.id_usuario}`
        );

        const inscricoes = await resposta.json();

        if (!resposta.ok) {
            listaInscricoes.innerHTML = `
                <p class="text-center">
                    Não foi possível carregar suas inscrições.
                </p>
            `;

            return;
        }

        if (inscricoes.length === 0) {
            listaInscricoes.innerHTML = `
                <p class="text-center">
                    Você ainda não possui inscrições.
                </p>
            `;

            return;
        }

        listaInscricoes.innerHTML = "";

        inscricoes.forEach(inscricao => {
            listaInscricoes.innerHTML += `
                <div class="inscricao-item">
                    <div>
                        <h5>${inscricao.nome}</h5>
                        <p>Data: ${inscricao.data}</p>
                        <p>Horário: ${inscricao.horario}</p>
                        <p>Local: ${inscricao.local}</p>
                        <p>Categoria: ${inscricao.categoria}</p>
                        <span class="status-inscricao">${inscricao.status}</span>
                    </div>

                    <button
                        class="btn btn-cancelar-inscricao"
                        onclick="cancelarInscricao(${inscricao.id_inscricao})">
                        Cancelar inscrição
                    </button>
                </div>
            `;
        });

    } catch (erro) {
        console.error(erro);

        listaInscricoes.innerHTML = `
            <p class="text-center">
                Erro ao conectar com o servidor.
            </p>
        `;
    }
}

async function cancelarInscricao(idInscricao) {
    const confirmar = confirm("Deseja cancelar esta inscrição?");

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(
            `${API}/inscricoes/${idInscricao}`,
            {
                method: "DELETE"
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(
                dados.erro ||
                "Não foi possível cancelar a inscrição."
            );

            return;
        }

        alert("Inscrição cancelada com sucesso.");

        carregarInscricoes();
        carregarEventos();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor.");
    }
}

btnSair.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "index1.html";
});

campoPesquisa.addEventListener("input", () => {
    const texto = campoPesquisa.value.toLowerCase();

    const resultado = eventos.filter(evento => {
        const nome = evento.nome.toLowerCase();
        const descricao = evento.descricao.toLowerCase();
        const categoria = evento.categoria.toLowerCase();

        const pesquisa =
            nome.includes(texto) ||
            descricao.includes(texto) ||
            categoria.includes(texto);

        const filtroCategoria =
            categoriaSelecionada === "todos" ||
            categoria === categoriaSelecionada;

        return pesquisa && filtroCategoria;
    });

    mostrarEventos(resultado);
});

const botoesCategoria = document.querySelectorAll(".categoria");

botoesCategoria.forEach(botao => {
    botao.addEventListener("click", () => {
        botoesCategoria.forEach(item => {
            item.classList.remove("ativa");
        });

        botao.classList.add("ativa");

        categoriaSelecionada =
            botao.dataset.categoria.toLowerCase();

        campoPesquisa.value = "";

        const resultado = eventos.filter(evento => {
            if (categoriaSelecionada === "todos") {
                return true;
            }

            return evento.categoria.toLowerCase() === categoriaSelecionada;
        });

        mostrarEventos(resultado);
    });
});

carregarEventos();