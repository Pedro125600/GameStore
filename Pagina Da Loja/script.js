const userNameDisplay = document.getElementById('user-name')
const usernameText = document.getElementById("usernameText")
const logoutButton = document.getElementById("logout-button")
const game1 = document.getElementById("game1")
const cardTemplate = document.getElementById("cardTemplate")
const cardsDiv = cardTemplate.parentNode

logoutButton.addEventListener("click", () => {
    // Sair da conta atual (Remover as credenciais e redirecionar para a página de login)
    localStorage.setItem("Credentials", JSON.stringify({}));
    window.location.href = "../LoginPage/index.html";
})

let Cadastros; // Objeto que contem todas as contas
try {
    Cadastros = JSON.parse(localStorage.Cadastros);
} catch {
    Cadastros = {};
    localStorage.setItem("Cadastros", JSON.stringify(Cadastros));
}

let Jogos; // Objeto que contem todas os jogos
try {
    Jogos = JSON.parse(localStorage.jogos);
} catch {
    Jogos = [];
    localStorage.setItem("jogos", JSON.stringify(Jogos));
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

for (let jogo of Jogos) {
    try {
        let newCard = cardTemplate.cloneNode(true)
        let jogoId = jogo.id 

        newCard.setAttribute("alt", `Jogo ${jogoId}`)
        newCard.removeAttribute("id")

        newCard.querySelector(".img-fluid").src = jogo.capa
        cardsDiv.appendChild(newCard)
        newCard.querySelector(".card-title").textContent = jogo.nome
        newCard.querySelector(".card-title").href = "../Pagina do jogo/index.html?id=" + jogoId
        newCard.querySelector(".jogoLink").href = "../Pagina do jogo/index.html?id=" + jogoId
        
        newCard.setAttribute("class", "col-md-3 mb-3")
    } catch {
        console.log("Erro ao mostrar jogo com id: " + jogoId)
        break;
    }
}

if (cardsDiv.children.length == 1) {
    let newH3 = document.createElement("h3")
    newH3.textContent = "A loja está sem jogos!"
    newH3.setAttribute("class", "mx-auto")
    cardsDiv.appendChild(newH3)
}