let usernameInput = document.getElementById("usernameInput");
let usernameErrorText = document.getElementById("errorUsername");
let usernameDiv = document.getElementById("usernameDiv");
let passwordInput = document.getElementById("passwordInput");
let passwordErrorText = document.getElementById("errorPassword");
let passwordDiv = document.getElementById("passwordDiv");
let loginButton = document.getElementById("loginButton");

let Cadastros; // Onde será guardado todas as contas
try {
    Cadastros = JSON.parse(localStorage.Cadastros);
} catch {
    Cadastros = {};
    localStorage.setItem("Cadastros", JSON.stringify(Cadastros));
}

function checkUsername() {
    if (!Cadastros[usernameInput.value.toLowerCase()]) {
        textError("Username", "Conta Não Encontrada!");
        return false;
    } else {
        return true;
    }
}

function checkPassword() {
    console.log(Cadastros[usernameInput.value.toLowerCase()]["senha"]);
    if (
        Cadastros[usernameInput.value.toLowerCase()]["senha"] !=
        passwordInput.value
    ) {
        textError("Password", "Senha Incorreta.");
        return false;
    } else {
        return true;
    }
}

function resetErrors() {
    for (let i = 1; i <= 2; i++) {
        let groupDiv;
        let errorElement;
        switch (i) {
            case 1:
                groupDiv = usernameDiv;
                errorElement = usernameErrorText;
                break;
            case 2:
                groupDiv = passwordDiv;
                errorElement = passwordErrorText;
                break;
        }

        errorElement.style.setProperty("display", "none", "important");

        [...groupDiv.children].forEach((element) => {
            element.style.setProperty("border-color", "#e000e0", "important");
        });
    }
}

function textError(errorElement, errorMessage) {
    let groupDiv;

    switch (errorElement) {
        case "Username":
            groupDiv = usernameDiv;
            errorElement = usernameErrorText;
            break;
        case "Password":
            groupDiv = passwordDiv;
            errorElement = passwordErrorText;
            break;
    }

    try {
        errorElement.style.setProperty("display", "flex", "important");
        [...groupDiv.children].forEach((element) => {
            element.style.setProperty("border-color", "red", "important");
        });

        if (errorMessage) {
            errorElement.children[0].textContent = errorMessage;
        }
    } catch {
        console.warn("Função textError acionada com elemento inválido");
    }
}

loginButton.addEventListener("click", () => {
    resetErrors();
    let validUser = checkUsername();

    if (validUser) {
        if (checkPassword()) {
            // Se estiver tudo certo!
            loginButton.value = "Login Realizado!";
            localStorage.setItem(
                "Credentials",
                JSON.stringify({
                    unchangedname: usernameInput.value,
                    name: usernameInput.value.toLowerCase(),
                    senha: passwordInput.value,
                }),
            );

            //Aguardar 2 segundos e ir para a página de acesso
            setTimeout(() => {
                window.location.href = "../UsuarioPage/index.html";
            }, 1000);
        }
    }
});
