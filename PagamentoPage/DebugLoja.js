document.addEventListener('DOMContentLoaded', async (event) => {
  try {
    let cart = [];
    const userId = 1; // a conectar com database de usuários
    const response1 = await fetch('http://localhost:3000/User/' + userId);
    const user = await response1.json();
    user.jogos_comprados.forEach(carts => {
      cart.push(carts.id);
    });
    const response2 = await fetch('localdb.json');
    const data = await response2.json();
    data.jogos.forEach(jogo => {
      addCardloja(jogo)
      if (cart.includes(jogo.id)) {
        addCardcomprados(jogo);
      }
    });
  } catch (error) {
    console.error('Error fetching the JSON data:', error);
  }
});

var cardCounter = 1;
function addCardcomprados(jogo) {
  const cardId = `${cardCounter}`;
  let promover = `<div id="bandaider" class=" card-body text-wrap">
        <p><a class="text-decoration-none" href="game${jogo.id}.html">${jogo.nome}</a></p>`;
  const cardHtml = `
          <div id="${cardId}" class="d-flex col-6 col-sm-6 col-md-4 col-lg-3 mt-4 lh-sm px-0 align-items-stretch">
          <div class="carrinho my-2 d-flex align-items-stretch h-md-100">
              <div class="p-2">
                  <img class="display-flex flex-grow flex-shrink col-10 col-sm-10 col-md-10 col-lg-6"
                      src="${jogo.cover}" width="100%">
                      ${promover}
                  </div>
              </div>
          </div>
      </div>
  `;
  const container = document.getElementById('in_account');
  container.insertAdjacentHTML('beforeend', cardHtml);
  cardCounter++;
}

var cardCounter2 = 1;
function addCardloja(jogo) {
  const cardId = `${cardCounter2}`;
  let promover;
  if (jogo.sale > 0) {
    promover = `<div class=" card-body text-wrap text-break">
        <p><a class="text-decoration-none" href="game${jogo.id}.html">${jogo.nome}</a></p>
        <p class="d-flex oldprice text-decoration-line-through m-0 justify-content-center">
            R$${jogo.preço}</p>
        <div class="d-flex justify-content-center">
            <div class="promo mx-1">
                <p>-${Math.round(jogo.sale * 10000) / 100}%</p>
            </div>
            <p>R$${parseFloat(jogo.preço * (1 - jogo.sale)).toFixed(2)}</p>
        </div>`
  }
  else {
    promover = `<div id="bandaider" class=" card-body text-wrap">
        <p><a class="text-decoration-none" href="game${jogo.id}.html">${jogo.nome}</a></p>
        <p>R$${jogo.preço}</p>`;
  }
  const cardHtml = `
          <div id="${cardId}" class="d-flex col-6 col-sm-6 col-md-4 col-lg-3 mt-4 lh-sm px-0 align-items-stretch">
          <div class="carrinho my-2 d-flex align-items-stretch h-md-100">
              <div class="p-2">
                  <img class="display-flex flex-grow flex-shrink col-10 col-sm-10 col-md-10 col-lg-6"
                      src="${jogo.cover}" width="100%">
                      ${promover}
                      <a href="#/" class="" onclick="addCart(${1},${jogo.id})">Adicionar ao Carrinho</a>
                  </div>
              </div>
          </div>
      </div>
  `;
  const container = document.getElementById('lil_loja');
  container.insertAdjacentHTML('beforeend', cardHtml);
  cardCounter2++;
}

async function addCart(userId, gameId) {
  try {
    const response = await fetch('http://localhost:3000/User/' + userId);
    const user = await response.json();
    if (!user.jogos_carrinho.some(cartItem => cartItem.id === gameId)) {
      if (!user.jogos_comprados.some(cartItem => cartItem.id === gameId)) {
        user.jogos_carrinho.push({ id: gameId });
        const updateResponse = await fetch('http://localhost:3000/User/' + userId, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        })
        if (!updateResponse.ok) {
          throw new Error('Failed to update the cart');
        }
        alert("Jogo adicionado!");
      }
      else {
        alert("Este jogo já está comprado")
      }
    } else {
      alert("Este jogo já está no carrinho");
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}
