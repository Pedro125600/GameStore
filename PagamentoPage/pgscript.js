const usernameText = document.getElementById("usernameText");
const logoutButton = document.getElementById("logout-button");
const urlParams = new URLSearchParams(window.location.search);
const IdJogo = urlParams.get('id');

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

let Jogos; // Objeto que contem todas os jogos
try {
    Jogos = JSON.parse(localStorage.jogos);
} catch {
    Jogos = {};
    localStorage.setItem("jogos", JSON.stringify(Jogos));
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

async function ConectDatabase() {
    try {
        let cart = [];
        
        for (let id of jogos_carrinho) {
            cart.push(id);
        };

        for (let jogo of Jogos) {
            if (cart.includes(jogo.id)) {
                storedprices.push(jogo.valor);
                addCard(jogo);
            }
        };

        Soma()
    } catch (error) {
        console.error('Error fetching the JSON data:', error);
    }
}

var auserId;
var cardCounter = 1;

function addCard(jogo) {
    const cardId = `${cardCounter}`;
    let promover = `<div id="bandaider" class=" card-body text-wrap">
        <p><a class="text-decoration-none">${jogo.nome}</a></p>
        <p>R$${jogo.valor}</p>`;
    
    const modalHtml = `<div class="modal modal-sheet p-4 py-md-5" tabindex="-1" role="dialog"
    id="modalChoice${cardId}" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered pe-sm-0 pe-md-3" aria-hidden="true" role="document">
        <div class="modal-content bg-dark rounded-3 shadow">
            <div class="modal-body p-4 text-center">
                <h5 class="mb-0">Tem certeza que quer remover este jogo do carrinho?</h5>
                <h4 class="mb-0" style="color: rgb(230, 200, 230)">${jogo.nome}</h5>
                <p class="mb-0">Você poderá adiciona-lo novamente pela loja.</p>
            </div>
            <div class="modal-footer flex-nowrap p-0">
                <button type="button"
                    class="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end"
                    data-bs-dismiss="modal" onclick="removeCart('${jogo.id}')" style="color: rgb(255, 150, 255)"><strong>Sim, remover</strong></button>
                <button type="button"
                    class="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0"
                    data-bs-dismiss="modal" style="color: rgb(255, 150, 255)">Não</button>
            </div>
        </div>
    </div>
</div>`
    const cardHtml = `
        <div id="${cardId}" class="d-flex col-6 col-sm-6 col-md-4 col-lg-3 mt-4 lh-sm px-0 align-items-stretch">
            <div class="carrinho my-2 d-flex align-items-stretch h-md-100">
                <div class="p-2">
                    <img class="display-flex flex-grow flex-shrink col-10 col-sm-10 col-md-10 col-lg-6"
                        src="${jogo.capa}" width="100%">
                    ${promover}
                        <a href="#/" class="" data-bs-toggle="modal" data-bs-target="#modalChoice${cardId}">Remover Jogo</a>
                    </div>
                </div>
            </div>
        </div>${modalHtml}
    `;
    const container = document.getElementById('cards-container');
    container.insertAdjacentHTML('beforeend', cardHtml);
    cardCounter++;

    Soma();
}

var storedprices = [0.0];
var soma = 0;

ConectDatabase()

function Soma() {
    soma = 0;
    for (price of storedprices) {
        console.log(price)
        soma += price;
    }
    let window = document.getElementById('totalscreen');
    window.innerHTML = "TOTAL: R$" + parseFloat(soma).toFixed(2);
}

/*function removeCart(cardId) {
    const card = document.getElementById(cardId);
    if (card) {
        card.remove();
    }
    storedprices[cardId] = 0;
    Soma();
}*/
async function removeCart(gameId) {
    try {
        let index = jogos_carrinho.findIndex(item => item == gameId);
        if (index !== -1) {
            jogos_carrinho.splice(index, 1);
        }

        localStorage.setItem("jogos_carrinho", JSON.stringify(jogos_carrinho))
        window.location.reload()
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}


var pgprp = document.getElementById('paymethod');
pgprp.addEventListener('change', function () {
    PagaProper();
}, false);

function PagaProper() {
    const paycontainer = document.getElementById('paycontainer');
    let menu = pgprp.value;
    let externaltemplate = `<div class="text-center"><p class="lh-3 text-center mb-1"><br>Para sua segurança, a compra será realizada através do site BoaCompra</p>
    <p id="errorB"></p><button class="text-center lh-3 col-12 p-2 my-4 rounded" onclick="ExternalSite('${menu}', 1)" target="_blank">Continuar com BoaCompra</button></div>`;
    let internaltemplate = `<p class="mb-1"><br>Número do cartão:</p>
    <input class="px-2 mb-2" type="number" id="Cnum">
    <p id="error1"></p>
    <div class="col-12 mb-3 d-flex flex-wrap flex-grow flex-shrink p-0">
        <div>
            <p class="mb-1">Primeiro Nome:</p>
            <input class="px-2" type="text" id="Cfn">
            <p id="error2"></p>
        </div>
        <div>
            <p class="mb-1">Último Nome:</p>
            <input class="px-2" type="text" id="Csn">
            <p id="error3"></p>
        </div>
    </div>
    <div class="col-12 d-flex flex-wrap flex-grow flex-shrink p-0">
        <div class="inner">
            <p class="mb-3">Data de Expiração:</p>
            <p class="mb-1">Mês</p>
            <input class="px-2" placeholder="MM" type="number" id="Cmo">
            <p id="error4"></p>
            <p class="mb-1">Ano</p>
            <input class="px-2 mb-3" placeholder="YYYY" type="number" id="Cyr">
            <p id="error5"></p>
        </div>
    </div>
    <div class="p-0">
        <p class="mb-1">Código de segurança</p>
        <input class="px-2" type="password" id="Csc">
        <p id="error6"></p>
    </div>
    <p id="errorA"></p>
    <button class="mx-auto my-4 rounded" onclick="ExternalSite(pgprp.value, 0)">Continuar</button>`;
    let actualHtml;
    switch (menu) {
        case 'paypal':
            actualHtml = internaltemplate;
            break;
        case 'visa':
            actualHtml = internaltemplate;
            break;
        case 'mastercard':
            actualHtml = internaltemplate;
            break;
        case 'pix':
            uh = 1;
            actualHtml = externaltemplate;
            break;
        case 'visanational':
            uh = 2;
            actualHtml = externaltemplate;
            break;
        case 'mastercardnational':
            uh = 2;
            actualHtml = externaltemplate;
            break;
        case 'boleto':
            uh = 1;
            actualHtml = externaltemplate;
            break;
        case 'none':
            actualHtml = "";
    }
    paycontainer.innerHTML = actualHtml;
}

function ExternalSite(site, type) {
    var failsafe;
    if (soma <= 0) {
        failsafe = false;
    }
    else {
        failsafe = true;
    }
    let errorcontainer1 = document.getElementById('errorA');
    let errorcontainer2 = document.getElementById('errorB');
    if (type >= 1) {
        if (failsafe) {
            switch (site) {
                case 'pix':
                    window.open('other/BoaCompraSim.html');
                    break;
                case 'boleto':
                    window.open('other/BoaCompraSim.html');
                    break;
                default:
                    window.open('other/BoaCompraSim2.html');
                    break;
            }
        }
        else {
            errorcontainer2.innerHTML = "Não há itens a comprar";
        }
    }
    else {
        if (failsafe) {
            if (document.getElementById('Cnum').value == "") {
                errorcontainer1.innerHTML = `<p> *Preencha todos os campos <p>`
            }
            else if (document.getElementById('Cfn').value == "") {
                errorcontainer1.innerHTML = `<p> *Preencha todos os campos <p>`
            }
            else if (document.getElementById('Csn').value == "") {
                errorcontainer1.innerHTML = `<p> *Preencha todos os campos <p>`
            }
            else if (document.getElementById('Cmo').value == "") {
                errorcontainer1.innerHTML = `<p> *Preencha todos os campos <p>`
            }
            else if (document.getElementById('Cyr').value == "") {
                errorcontainer1.innerHTML = `<p> *Preencha todos os campos <p>`
            }
            else if (document.getElementById('Csc').value == "") {
                errorcontainer1.innerHTML = `<p> *Preencha todos os campos <p>`
            }
            else {
                window.open("other/Sucesso.html", "_self");
            }
        }
        else {
            errorcontainer1.innerHTML = `<p> Não há itens a comprar <p>`;
        }
    }
}

