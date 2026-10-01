const API = "http://localhost:3000/api";

const formLogin = document.getElementById("form-login");
const mensagemLogin = document.getElementById("mensagem-login");

formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    mensagemLogin.textContent = "";

    try {
        const resposta = await fetch(`${API}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        console.log("Resposta do servidor:", dados);

        if (!resposta.ok) {
            mensagemLogin.textContent =
                dados.erro || "Usuário não encontrado ou senha incorreta";
            return;
        }

        localStorage.setItem("usuario", JSON.stringify({
            id_usuario: dados.id,
            nome: dados.nome,
            email: dados.email
        }));

        window.location.href = "index.html";

    } catch (erro) {
        console.error("Erro:", erro);

        mensagemLogin.textContent =
            "Não foi possível conectar com o servidor.";
    }
});