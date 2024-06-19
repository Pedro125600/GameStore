const usernameText = document.getElementById("usernameText");
const logoutButton = document.getElementById("logout-button");
  
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

function cadastrarJogo() {
  const nome = getInputValue("nomeJogo");
  const genero = getInputValue("generoJogo");
  const descricao = getInputValue("descricaoJogo");
  const desenvolvedor = getInputValue("desenvolvedorJogo");
  const criadora = getInputValue("criadoraJogo");
  const valor = parseFloat(getInputValue("valorJogo"));
  const capaFile = document.getElementById("capaJogo").files[0];
  const outrasImagensInput = document.getElementById("outrasImagens");

  if (!nome || !genero || !descricao || !desenvolvedor || !criadora || isNaN(valor) || !capaFile || !outrasImagensInput.files.length) {
    let mensagem = "Por favor, preencha os seguintes campos:\n";
    if (!nome) mensagem += "- Nome do Jogo\n";
    if (!genero) mensagem += "- Gênero do Jogo\n";
    if (!descricao) mensagem += "- Descrição do Jogo\n";
    if (!desenvolvedor) mensagem += "- Desenvolvedor do Jogo\n";
    if (!criadora) mensagem += "- Criadora do Jogo\n";
    if (isNaN(valor)) mensagem += "- Valor do Jogo\n";
    if (!capaFile) mensagem += "- Capa do Jogo\n";
    if (!outrasImagensInput.files.length) mensagem += "- Outras Imagens do Jogo\n";
    alert(mensagem);
    return;
  }

  const jogos = {
    id: generateUniqueId(),
    nome: nome,
    genero: genero,
    descricao: descricao,
    desenvolvedor: desenvolvedor,
    criadora: criadora,
    valor: valor,
    capa: "",
    outrasImagens: []
  };

  const promises = Array.from(outrasImagensInput.files).map(readFileAsDataURL);
  promises.push(readFileAsDataURL(capaFile));

  Promise.all(promises).then((results) => {
    jogos.outrasImagens = results.slice(0, -1);
    jogos.capa = results[results.length - 1];

    const jogosCadastrados = JSON.parse(localStorage.getItem("jogos")) || [];
    jogosCadastrados.push(jogos);
    localStorage.setItem("jogos", JSON.stringify(jogosCadastrados));

    limparCampos();
    exibirJogosCadastrados();
    alert("Jogo cadastrado com sucesso!");
  });
}

function generateUniqueId() {
  const jogosCadastrados = JSON.parse(localStorage.getItem("jogos")) || [];
  let lastId = jogosCadastrados.length > 0 ? jogosCadastrados[jogosCadastrados.length - 1].id : 0;
  return lastId + 1;
}



function getInputValue(id) {
  return document.getElementById(id).value;
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

function limparCampos() {
  const fields = [
    "nomeJogo",
    "generoJogo",
    "descricaoJogo",
    "desenvolvedorJogo",
    "criadoraJogo",
    "valorJogo",
    "capaJogo",
    "outrasImagens"
  ];

  fields.forEach((field) => {
    document.getElementById(field).value = "";
  });
}

function exibirJogosCadastrados() {
  const jogosCadastrados = JSON.parse(localStorage.getItem("jogos")) || [];
  const tableBody = document.getElementById("jogosCadastradosBody");
  tableBody.innerHTML = "";

  jogosCadastrados.forEach((jogo, index) => {
    const tableRow = generateTableRow(jogo);
    tableBody.innerHTML += tableRow;
  });
}

function generateTableRow(jogo) {
  return `
    <tr>
     <td>${jogo.id}</td>
      <td>${jogo.nome}</td>
      <td>${jogo.genero}</td>
      <td class="truncate">${jogo.descricao}</td>
      <td>${jogo.desenvolvedor}</td>
      <td>${jogo.criadora}</td>
      <td>${jogo.valor}</td>
      <td><img src="${jogo.capa}" alt="Capa do Jogo" width="100"></td>
      <td class="container mt-5">${generateOtherImages(jogo.outrasImagens)}</td>
    </tr>
  `;
}

function generateOtherImages(outrasImagens) {
  return outrasImagens.map((imagem) => `<img class="col-md-6" src="${imagem}" alt="Outra Imagem do Jogo" style="display: inline-block; margin: 10px; width: 100px;">`).join('');
}

exibirJogosCadastrados();