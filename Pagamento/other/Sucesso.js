var auserId;
document.addEventListener('DOMContentLoaded', async (event) => {
    try {
        const userId = 1; // a conectar com database de usuários
        const response1 = await fetch('http://localhost:3000/User/' + userId);
        const user = await response1.json();
        auserId = userId;
        var cart = user.jogos_carrinho.map(carts => carts.id);
        for (const gameId of cart) {
            //console.log(gameId + " got registered");
            await BuyCart(userId, gameId);
            //console.log(gameId + " went through BUY");
            await removeCart(gameId);
            //console.log(gameId + " went through REMOVE");
        }
        document.getElementById('resultcontainer').innerHTML = `Compra Processada com Sucesso! <br><br> <a href="../DebugLoja.html"> Verificar (página de teste)</a>`;
    } catch (error) {
        console.error('Error fetching the JSON data:', error);
    }
});

async function removeCart(gameId) {
    try {
        const response = await fetch('http://localhost:3000/User/' + auserId);
        const user = await response.json();
        const index = user.jogos_carrinho.findIndex(item => item.id === gameId);
        if (index !== -1) {
            //console.log(index + 1 + "° got out!");
            user.jogos_carrinho.splice(index, 1);

            const updateResponse = await fetch('http://localhost:3000/User/' + auserId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (!updateResponse.ok) {
                throw new Error('Failed to update the cart');
            }
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

async function BuyCart(userId, gameId) {
    try {
        const response = await fetch('http://localhost:3000/User/' + userId);
        const user = await response.json();
        //console.log(gameId + " got In!");
        user.jogos_comprados.push({ id: gameId });

        const updateResponse = await fetch('http://localhost:3000/User/' + userId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!updateResponse.ok) {
            throw new Error('Failed to update the cart');
        }
        document.getElementById("resultcontainer").innerHTML =
            `Compra em processamento. Por favor aguarde`;
    } catch (error) {
        document.getElementById('resultcontainer').innerHTML = "Ocorreu um erro na compra :(";
        console.error('Error buying to cart:', error);
    }
}