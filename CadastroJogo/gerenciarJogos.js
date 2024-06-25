const usernameText = document.getElementById("usernameText")
const logoutButton = document.getElementById("logout-button")
const adminButton = document.getElementById("adminButton")
const adminError = document.getElementById("adminError")
const pesquisarJogoForm = document.getElementById("search-bar-form")
const pesquisarButton = document.getElementById("PesquisarButton")
const URLSearch = new URLSearchParams(window.location.search)
const pesquisarQuery = URLSearch.get("search")

if (pesquisarJogoForm) {
  let input = pesquisarJogoForm.querySelector("input")
  let button = pesquisarJogoForm.querySelector("button")

  input.addEventListener("keyup", function(e) {
    e.preventDefault()

    pesquisar(input.value.toLowerCase())
  })
  button.addEventListener("click", function (e) {
    e.preventDefault()

    pesquisar(input.value.toLowerCase())
  })
    
}

function pesquisar(text) {
  let jogosCadastrados = JSON.parse(localStorage.getItem("jogos")) || [];
  if (text) {
    let jogosFiltrados = jogosCadastrados.filter(game => game.nome.toLowerCase().includes(text.toLowerCase()));
    exibirJogosCadastrados(jogosFiltrados);
  } else {
    exibirJogosCadastrados();
  }
}

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

// Redirecionar a pessoa para a página de Login se ela não estiver logada
if (
  !Cadastros[Credentials.name] ||
  Cadastros[Credentials.name]["senha"] != Credentials.senha ||
  (!adminButton && Credentials.name != "admin")
) {
  localStorage.setItem("Credentials", JSON.stringify({}));
  window.location.href = "../LoginPage/index.html";
} else {
  usernameText.textContent = Credentials.unchangedname
}

logoutButton.addEventListener("click", () => {
  // Sair da conta atual (Remover as credenciais e redirecionar para a página de login)
  localStorage.setItem("Credentials", JSON.stringify({}));
  window.location.href = "../LoginPage/index.html";
})

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

if (adminButton) {
  adminButton.addEventListener("click", () => {
    if (Credentials.name == "admin") {
      window.location.href = "./index.html"
    } else {
      adminError.setAttribute("class", "text-danger fs-5")
    }
  })
}

try {
  if (!JSON.parse(localStorage.jogos)) {
    throw "erro"
  };
} catch {
  localStorage.setItem("jogos", JSON.stringify([]));
}

let jogoEditandoId = null;

function exibirJogosCadastrados(jogos) {
  let jogosCadastrados;
  if (jogos) {
    jogosCadastrados = jogos
  } else {
    jogosCadastrados = JSON.parse(localStorage.getItem("jogos")) || [];
  }

  const tbody = document.getElementById("jogosCadastradosBody");
  tbody.innerHTML = "";

  for (let jogo of jogosCadastrados) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${jogo.id}</td>
      <td><a href="../Pagina do jogo/index.html?id=${jogo.id}">${jogo.nome}</a></td>
      <td>${jogo.genero}</td>
      <td  class="truncate">${jogo.descricao}</td>
      <td>${jogo.desenvolvedor}</td>
      <td>${jogo.criadora}</td>
      <td>${jogo.valor}</td>
      <td><img src="${jogo.capa}" alt="Capa do Jogo" style="width: 50px;"></td>
      <td>${generateOtherImages(jogo.outrasImagens)}</td>
      <td>
        ${(Credentials.name == "admin") ? `<button class="btn btn-warning btn-sm" onclick="editarJogo(${jogo.id})">Editar</button>
        <button class="btn btn-danger btn-sm mt-2" onclick="excluirJogo(${jogo.id})">Excluir</button>` : ""}
        <button class="btn btn-primary btn-sm mt-2" onclick="comprarJogo(${jogo.id})" ${(JogosComprados.includes(jogo.id)) ? "disabled>Possuído</button>" : ">Comprar</button>"}
      </td>
    `;
    tbody.appendChild(row);
  }
}

function comprarJogo(jogoId) {
  if (!jogos_carrinho.includes(jogoId)) {
    jogos_carrinho.push(jogoId)
    localStorage.setItem("jogos_carrinho", JSON.stringify(jogos_carrinho));
  }
  window.location.href = "../PagamentoPage/pagamento.html"
}

function generateOtherImages(outrasImagens) {
  return outrasImagens.map((imagem) => `<img src="${imagem}" alt="Outra Imagem do Jogo" style="display: inline-block; margin: 10px; width: 100px;">`).join('');
}

function editarJogo(id) {
  window.location.href = `gerenciarJogos.html?id=${id}`;
}

function excluirJogo(id) {
  let jogosCadastrados = JSON.parse(localStorage.getItem("jogos")) || [];
  jogosCadastrados = jogosCadastrados.filter(j => j.id !== id);
  localStorage.setItem("jogos", JSON.stringify(jogosCadastrados));

  for (let conta in Cadastros) {
    console.log(Cadastros[conta])
    console.log(Cadastros[conta].JogosComprados)
    if (Cadastros[conta].JogosComprados?.includes(id)) {
      let index = Cadastros[conta].JogosComprados.findIndex(item => item == id);
      if (index !== -1) {
        Cadastros[conta].JogosComprados.splice(index, 1);
        localStorage.setItem("Cadastros", JSON.stringify(Cadastros));
      }
    }
  }

  exibirJogosCadastrados();
  alert("Jogo excluído com sucesso!");
}

function carregarDadosEdicao() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));
  if (!id) return;

  const jogosCadastrados = JSON.parse(localStorage.getItem("jogos")) || [];
  const jogo = jogosCadastrados.find(j => j.id === id);

  if (jogo) {
    document.getElementById("editNomeJogo").value = jogo.nome;
    document.getElementById("editGeneroJogo").value = jogo.genero;
    document.getElementById("editDescricaoJogo").value = jogo.descricao;
    document.getElementById("editDesenvolvedorJogo").value = jogo.desenvolvedor;
    document.getElementById("editCriadoraJogo").value = jogo.criadora;
    document.getElementById("editValorJogo").value = jogo.valor;
    jogoEditandoId = id;
  }
}

function salvarAlteracoes() {
  const nome = document.getElementById("editNomeJogo").value;
  const genero = document.getElementById("editGeneroJogo").value;
  const descricao = document.getElementById("editDescricaoJogo").value;
  const desenvolvedor = document.getElementById("editDesenvolvedorJogo").value;
  const criadora = document.getElementById("editCriadoraJogo").value;
  const valor = parseFloat(document.getElementById("editValorJogo").value);
  const capaFile = document.getElementById("editCapaJogo").files[0];
  const outrasImagensInput = document.getElementById("editOutrasImagens");

  let jogosCadastrados = JSON.parse(localStorage.getItem("jogos")) || [];
  const jogoIndex = jogosCadastrados.findIndex(j => j.id === jogoEditandoId);

  if (jogoIndex !== -1) {
    const jogo = jogosCadastrados[jogoIndex];

    jogo.nome = nome;
    jogo.genero = genero;
    jogo.descricao = descricao;
    jogo.desenvolvedor = desenvolvedor;
    jogo.criadora = criadora;
    jogo.valor = valor;

    const promises = [];

    if (capaFile) {
      promises.push(readFileAsDataURL(capaFile).then((result) => {
        jogo.capa = result;
      }));
    }

    if (outrasImagensInput.files.length > 0) {
      const outrasImagensPromises = Array.from(outrasImagensInput.files).map(readFileAsDataURL);
      promises.push(Promise.all(outrasImagensPromises).then((results) => {
        jogo.outrasImagens = results;
      }));
    }

    Promise.all(promises).then(() => {
      jogosCadastrados[jogoIndex] = jogo;
      localStorage.setItem("jogos", JSON.stringify(jogosCadastrados));
      window.location.href = 'listaJogos.html';
    });
  }
  alert("Jogo alterado com sucesso!");
}

function cancelarEdicao() {
  window.location.href = 'listaJogos.html';
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(file);
  });
}

if (window.location.pathname.endsWith('gerenciarJogos.html')) {
  carregarDadosEdicao();
} else {
  if (pesquisarQuery) {
    pesquisarJogoForm.querySelector("input").value = pesquisarQuery
    pesquisar(pesquisarQuery)
  } else {
    exibirJogosCadastrados();
  }
}
