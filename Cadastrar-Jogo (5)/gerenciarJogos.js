let jogoEditandoId = null;

function exibirJogosCadastrados() {
  const jogosCadastrados = JSON.parse(localStorage.getItem("jogos")) || [];
  const tbody = document.getElementById("jogosCadastradosBody");
  tbody.innerHTML = "";

  jogosCadastrados.forEach((jogo) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${jogo.id}</td>
      <td>${jogo.nome}</td>
      <td>${jogo.genero}</td>
      <td  class="truncate">${jogo.descricao}</td>
      <td>${jogo.desenvolvedor}</td>
      <td>${jogo.criadora}</td>
      <td>${jogo.valor}</td>
      <td><img src="${jogo.capa}" alt="Capa do Jogo" style="width: 50px;"></td>
      <td>${generateOtherImages(jogo.outrasImagens)}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarJogo(${jogo.id})">Editar</button>
        <button class="btn btn-danger btn-sm mt-2" onclick="excluirJogo(${jogo.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(row);
  });
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
  exibirJogosCadastrados();
}
