const usernameText = document.getElementById("usernameText");
const logoutButton = document.getElementById("logout-button");
const URLSearch = new URLSearchParams(window.location.search)
const jogoId = Number(URLSearch.get("id"))

let jogoNome = document.getElementById("jogoNome")
let jogoDescricao = document.getElementById("jogoDescricao")
let jogoCriador = document.getElementById("jogoCriador")
let jogoDesenvolvedor = document.getElementById("jogoDesenvolvedor")
let jogoGenero = document.getElementById("jogoGenero")
let jogoImagem = document.getElementById("jogoImagem")
let outraImagemTemplate = document.getElementById("outraImagemTemplate")
let jogoValor = document.getElementById("jogoValor")
let carrinhoButton = document.getElementById("carrinhoButton")
let comprarButton = document.getElementById("comprarButton")

logoutButton.addEventListener("click", () => {
    // Sair da conta atual (Remover as credenciais e redirecionar para a página de login)
    localStorage.setItem("Credentials", JSON.stringify({}));
    window.location.href = "../LoginPage/index.html";
})

const pesquisarButton = document.getElementById("PesquisarButton")
pesquisarButton.addEventListener("click", function(e) {
    e.preventDefault()
    let textoParaPesquisar = pesquisarButton.parentNode.querySelector("input").value
    if (textoParaPesquisar) {
        window.location.href = "../CadastroJogo/listaJogos.html?search=" + textoParaPesquisar.toLowerCase()
    } else {
        window.location.href = "../CadastroJogo/listaJogos.html"
    }
})

let Cadastros; // Objeto que contem todas as contas
try {
    Cadastros = JSON.parse(localStorage.Cadastros);
} catch {
    Cadastros = {};
    localStorage.setItem("Cadastros", JSON.stringify(Cadastros));
}

let Credentials = JSON.parse(localStorage.getItem("Credentials"));

// Redirecionar a pessoa para a página de Login se ela não estiver logada ou se não for admin
if (
    !Cadastros[Credentials.name] ||
    Cadastros[Credentials.name]["senha"] != Credentials.senha
) {
    localStorage.setItem("Credentials", JSON.stringify({}));
    window.location.href = "../LoginPage/index.html";
} else {
    usernameText.textContent = Credentials.unchangedname
}

let Jogos; // Objeto que contem todas os jogos
try {
    Jogos = JSON.parse(localStorage.jogos);
} catch {
    Jogos = [];
    localStorage.setItem("jogos", JSON.stringify(Jogos));
}

let JogosComprados; // Objeto que contem o ID de todos os jogos comprados
try {
    JogosComprados = Cadastros[Credentials.name].JogosComprados;
} catch (err) {
    JogosComprados = []
    Cadastros[Credentials.name].JogosComprados = JogosComprados
    localStorage.setItem("Cadastros", JSON.stringify(Cadastros));
}

let jogos_carrinho; // Objeto que contem um vetor de ID dos jogos no carrinho
try {
    jogos_carrinho = JSON.parse(localStorage.getItem("jogos_carrinho"));
    if (!jogos_carrinho) {
        throw "erro"
    }
} catch (err) {
    jogos_carrinho = []
    localStorage.setItem("jogos_carrinho", JSON.stringify(jogos_carrinho));
}

let jogos
try {
    jogos = JSON.parse(localStorage.getItem("jogos"))
    if (!jogos) {
        throw "erro"
    }
} catch {
    console.log("hi")
    localStorage.setItem("jogos", JSON.stringify([]));
}

let jogo;
for (let i = 0; i < Jogos.length; i++) {
    if (Jogos[i].id == jogoId) {
        jogo = Jogos[i]
    }
}

jogoNome.textContent = " " + jogo.nome
jogoCriador.textContent = " " + jogo.criadora
jogoDescricao.textContent = " " + jogo.descricao
jogoDesenvolvedor.textContent = " " + jogo.desenvolvedor
jogoGenero.textContent = " " + jogo.genero
jogoImagem.src = jogo.capa
jogoValor.textContent = " " + `R$${jogo.valor}`

for (let img of jogo.outrasImagens) {
    let clone = outraImagemTemplate.cloneNode(true)

    clone.src = img
    clone.setAttribute("class", "img-fluid mb-2")

    outraImagemTemplate.parentNode.appendChild(clone)
}

if (jogos_carrinho.includes(jogoId)) {
    carrinhoButton.style.backgroundColor = "green"
}

if (JogosComprados.includes(jogoId)) {
    carrinhoButton.setAttribute("disabled", "true")
    comprarButton.setAttribute("disabled", "true")
}
comprarButton.addEventListener("click", function () {
    if (!jogos_carrinho.includes(jogoId)) {
        jogos_carrinho.push(jogoId)
        localStorage.setItem("jogos_carrinho", JSON.stringify(jogos_carrinho));
    }
    window.location.href = "../PagamentoPage/pagamento.html"
})

carrinhoButton.addEventListener("click", function () {
    if (carrinhoButton.style.backgroundColor != "green") {
        if (!jogos_carrinho.includes(jogoId)) {
            jogos_carrinho.push(jogoId)
        }
        carrinhoButton.style.backgroundColor = "green"
    } else {
        let index = jogos_carrinho.findIndex(item => item == jogoId);
        if (index !== -1) {
            jogos_carrinho.splice(index, 1);
        }
        carrinhoButton.style.backgroundColor = "rgb(153, 51, 153)"
    }

    localStorage.setItem("jogos_carrinho", JSON.stringify(jogos_carrinho));
})