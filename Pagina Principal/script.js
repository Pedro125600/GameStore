const usernameText = document.getElementById("usernameText")
const logoutButton = document.getElementById("logout-button")
const cardTemplate = document.getElementById("cardTemplate")
const popularesDiv = document.getElementById("PopularesDiv")
const recomendadosDiv = document.getElementById("RecomendadosDiv")

logoutButton.addEventListener("click", () => {
    // Sair da conta atual (Remover as credenciais e redirecionar para a página de login)
    localStorage.setItem("Credentials", JSON.stringify({}));
    window.location.href = "../LoginPage/index.html";
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

function random(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkVazio(diretorio) {
    if (jogos.length == 0) {
        let p = document.createElement("p")
        p.setAttribute("class", "mx-auto")
        p.textContent = "Não há nenhum jogo por enquanto!"
        diretorio.appendChild(p)
        return true
    }
    return false
}

function adicionarCardsAleatorio(diretorio) {
    
    if (checkVazio(diretorio)) {
        return
    }

    let counter = 0;
    let randomGames = []
    
    while (counter < 3 && counter < jogos.length) {
        let randNumber = random(0, jogos.length -1)
    
        if (!randomGames.includes(randNumber)) {
            randomGames.push(randNumber)
            counter++;
        }
    }
    
    counter = 0;
    
    while (counter < 3) {
        for (let index of randomGames) {
            if (counter == 3) {
                break;
            }
    
            let clone = cardTemplate.cloneNode(true)
            let jogo = jogos[index]
        
            clone.querySelector(".cardLink").textContent = jogo.nome
            clone.querySelector(".cardLink").href = "../Pagina do jogo/index.html?id=" + jogo.id
            clone.querySelector(".cardImgLink").href = "../Pagina do jogo/index.html?id=" + jogo.id
            clone.querySelector(".card-img").src = jogo.capa

            diretorio.appendChild(clone)
            clone.setAttribute("class", "col-md-4 mb-3")
            counter++;
        }
    }
}
adicionarCardsAleatorio(recomendadosDiv)
adicionarCardsAleatorio(popularesDiv)