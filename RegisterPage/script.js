let usernameInput = document.getElementById("usernameInput");
let usernameErrorText = document.getElementById("errorUsername");
let usernameDiv = document.getElementById("usernameDiv");
let passwordInput = document.getElementById("passwordInput");
let passwordErrorText = document.getElementById("errorPassword");
let passwordDiv = document.getElementById("passwordDiv");
let emailInput = document.getElementById("emailInput");
let emailErrorText = document.getElementById("errorEmail");
let emailDiv = document.getElementById("emailDiv");
let registerButton = document.getElementById("registerButton");

let Cadastros; // Onde será guardado todas as contas
try {
    Cadastros = JSON.parse(localStorage.Cadastros);
} catch {
    Cadastros = {};
    localStorage.setItem("Cadastros", JSON.stringify(Cadastros));
}

function checkUsername() {
    if (usernameInput.value.length <= 3) {
        textError("Username", "Nome Muito Pequeno!");
        return false;
    } else if (usernameInput.value.length >= 13) {
        textError("Username", "Nome Muito Grande!");
        return false;
    } else if (Cadastros[usernameInput.value.toLowerCase()]) {
        textError("Username", "Nome Já Existente!");
        return false;
    } else {
        return true;
    }
}

function checkPassword() {
    if (passwordInput.value.length <= 6) {
        textError("Password", "Senha Muito Curta!");
        return false;
    } else if (/\d/.test(passwordInput.value) == false) {
        textError("Password", "Senha Deve Ter Números!");
        return false;
    } else if (
        /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(passwordInput.value) ==
        false
    ) {
        textError("Password", "Senha Deve Ter Caracteres Especiais!");
        return false;
    } else {
        return true;
    }
}

function checkEmail() {
    //Regex para validação de e-mail retirado de: https://regexr.com/3e48o
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(emailInput.value) == false) {
        textError("Email", "Email Inválido");
        return false;
    } else {
        return true;
    }
}

function resetErrors() {
    for (let i = 1; i <= 3; i++) {
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
            case 3:
                groupDiv = emailDiv;
                errorElement = emailErrorText;
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
        case "Email":
            groupDiv = emailDiv;
            errorElement = emailErrorText;
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

registerButton.addEventListener("click", () => {
    resetErrors();
    let usernameCheck = checkUsername();
    let passwordCheck = checkPassword();
    let emailCheck = checkEmail();

    if (usernameCheck && passwordCheck && emailCheck) {
        //Se estiver tudo certo
        Cadastros[usernameInput.value.toLowerCase()] = {
            senha: passwordInput.value,
            email: emailInput.value,
        };
        localStorage.setItem("Cadastros", JSON.stringify(Cadastros));
        registerButton.value = "Registro Realizado!";

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
});
