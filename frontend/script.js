const formLogin = document.getElementById("formLogin");
const mensagem = document.getElementById("mensagem");

formLogin.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    mensagem.textContent = "";

    try {

        const resposta = await fetch("/login", {

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

        if (!resposta.ok) {

            mensagem.textContent =
                dados.mensagem ||
                "Usuário não encontrado ou senha incorreta";

            return;
        }

        console.log("Usuário logado:", dados.usuario);

        localStorage.setItem(
            "usuario",
            JSON.stringify(dados.usuario)
        );

        window.location.href = "/";

    } catch (erro) {

        console.error(erro);

        mensagem.textContent =
            "Erro ao conectar com o servidor.";
    }

});