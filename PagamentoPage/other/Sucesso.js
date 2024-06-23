const usernameText = document.getElementById("usernameText");
const logoutButton = document.getElementById("logout-button");
const urlParams = new URLSearchParams(window.location.search);
const IdJogo = urlParams.get('id');

logoutButton.addEventListener("click", () => {
    // Sair da conta atual (Remover as credenciais e redirecionar para a página de login)
    localStorage.setItem("Credentials", JSON.stringify({}));
    window.location.href = "../../LoginPage/index.html";
})

const pesquisarButton = document.getElementById("PesquisarButton")
pesquisarButton.addEventListener("click", function(e) {
    e.preventDefault()
    window.location.href = "../CadastroJogo/listaJogos.html"
})

let Cadastros; // Objeto que contem todas as contas
try {
    Cadastros = JSON.parse(localStorage.Cadastros);
} catch {
    Cadastros = {};
    localStorage.setItem("Cadastros", JSON.stringify(Cadastros));
}

let Credentials = JSON.parse(localStorage.getItem("Credentials"));

// Redirecionar a pessoa para a página de Login se ela não estiver logada
if (
    !Cadastros[Credentials.name] ||
    Cadastros[Credentials.name]["senha"] != Credentials.senha
) {
    localStorage.setItem("Credentials", JSON.stringify({}));
    window.location.href = "../LoginPage/index.html";
} else {
    usernameText.textContent = Credentials.unchangedname
}

let JogosComprados; // Objeto que contem o ID de todos os jogos comprados
try {
    JogosComprados = Cadastros[Credentials.name].JogosComprados;
    if (!JogosComprados) {
        throw "error"
    }
} catch (err) {
    Cadastros[Credentials.name].JogosComprados = [] // Alterar depois
    JogosComprados = Cadastros[Credentials.name].JogosComprados;
    localStorage.setItem("Cadastros", JSON.stringify(Cadastros));
}

let jogos_carrinho; // Objeto que contem um vetor de ID dos jogos no carrinho
try {
    jogos_carrinho = JSON.parse(localStorage.getItem("jogos_carrinho"));
} catch (err) {
    jogos_carrinho = []
    localStorage.setItem("jogos_carrinho", JSON.stringify(jogos_carrinho));
}

if (jogos_carrinho.length == 0) {
    window.location.href = "../../UsuarioPage/index.html"
}

function processar() {
    try {
        
        while (jogos_carrinho.length > 0) {
            gameId = jogos_carrinho[0]
            BuyCart(gameId)
        }

        document.getElementById('resultcontainer').innerHTML = `Compra Processada com Sucesso! <br><br> <a href="../../UsuarioPage/index.html"> Ir para a Página de Usuário</a>`;
    } catch (error) {
        console.error('Error fetching the JSON data:', error);
    }
}

function removeCart(gameId) {
    try {
        const index = jogos_carrinho.findIndex(item => item == gameId);
        if (index !== -1) {
            jogos_carrinho.splice(index, 1);
            localStorage.setItem("jogos_carrinho", JSON.stringify(jogos_carrinho))
        }      
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

function BuyCart(gameId) {
    try {
        if (!JogosComprados.includes(gameId)) {
            JogosComprados.push(gameId);
        }

        document.getElementById("resultcontainer").innerHTML =
            `Compra em processamento. Por favor aguarde`;

            localStorage.setItem("Cadastros", JSON.stringify(Cadastros));
        
        removeCart(gameId);
    } catch (error) {
        document.getElementById('resultcontainer').innerHTML = "Ocorreu um erro na compra :(";
        console.error('Error buying to cart:', error);
    }
}

processar()