// É necessário mostrar os dados do usuário
let saveButton = document.getElementById("save-button");
let emailInput = document.getElementById("email");
let usernameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
let addressInput = document.getElementById("address");
let usernameText = document.getElementById("usernameText");
let logoutButton = document.getElementById("logout-button");
let alterButtons = document.getElementsByClassName("alter-button")
let textErrors = document.getElementsByClassName("text-error")

const pesquisarButton = document.getElementById("PesquisarButton")
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

//Se a pessoa não está logada em uma conta redirecionar ela para a página de Login
if (
    !Cadastros[Credentials.name] ||
    Cadastros[Credentials.name]["senha"] != Credentials.senha
) {
    localStorage.setItem("Credentials", JSON.stringify({}));
    window.location.href = "../LoginPage/index.html";
} else {
    usernameText.textContent = Credentials["unchangedname"];
    usernameInput.value = Credentials["unchangedname"];
    emailInput.value = Cadastros[Credentials.name]["email"];
    if (Cadastros[Credentials.name]["address"] != "undefined") {
        addressInput.value = Cadastros[Credentials.name]["address"] ?? "";
    }
}

for (let element of alterButtons) {
    let inputElement = element.parentElement.children[0];

    element.addEventListener("click", function () {
        alterarCampo(inputElement);
    })
};

function alterarCampo(campo) {
    if (campo.readOnly == true) {
        campo.readOnly = false;
        campo.focus();
    } else {
        campo.readOnly = true;
        if (campo.getAttribute("type") == "password") {
            campo.value = "";
        }
    }
}

function checkUsername() {
    if (usernameInput.value.length <= 3) {
        textError("Username", "Nome Muito Pequeno!");
        return false;
    } else if (usernameInput.value.length >= 13) {
        textError("Username", "Nome Muito Grande!");
        return false;
    } else if (Cadastros[usernameInput.value.toLowerCase()] && usernameInput.value.toLowerCase() != Credentials.name) {
        textError("Username", "Nome Já Existente!");
        return false;
    } else {
        return true;
    }
}

function checkPassword() {
    if (passwordInput.readOnly == false) {
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
        }
    } 
    return true;
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
    for (let element of textErrors) {
        element.style.display = "none";
    }
}
function textError(type, text) {
    let ele;
    if (type == "Password") {
        ele = document.getElementById("password");
    } else if (type == "Username") {
        ele = document.getElementById("username");
    } else {
        ele = document.getElementById("email");
    }

    let errorText = ele.parentElement.parentElement.children[3];
    errorText.textContent = text;
    errorText.style.display = "block";
}

saveButton.addEventListener("click", function () {
    resetErrors();
    let usernameCheck = checkUsername();
    let passwordCheck = checkPassword();
    let emailCheck = checkEmail();
    if (passwordCheck && usernameCheck && emailCheck) {

        //Setar username
        if (usernameInput.value.toLowerCase() != Credentials.name && usernameInput.readOnly == false) {
            Object.defineProperty(Cadastros, usernameInput.value.toLowerCase(), Object.getOwnPropertyDescriptor(Cadastros, Credentials.name))
            console.log(Cadastros)
            delete Cadastros[Credentials.name];
    
            console.log(Cadastros);
            Credentials.name = usernameInput.value.toLowerCase();
            console.log(Cadastros[Credentials.name]);
    
            Credentials.unchangedname = usernameInput.value;
        }
       
        //Setar password
        if (passwordInput.readOnly == false) {
            Cadastros[Credentials.name]["senha"] = passwordInput.value;
            Credentials.senha = passwordInput.value;
        }

        //Setar email
        if (emailInput.readOnly == false) {
            Cadastros[Credentials.name].email = emailInput.value;
        }

        //Setar address
        if (addressInput.readOnly == false) {
            Cadastros[Credentials.name]["address"] = addressInput.value;
        }

        // Atualizar no banco de dados
        localStorage.setItem("Credentials", JSON.stringify(Credentials));
        localStorage.setItem("Cadastros", JSON.stringify(Cadastros));
        window.location.reload();
    }
});

logoutButton.addEventListener("click", () => {
    // Sair da conta atual (Remover as credenciais e redirecionar para a página de login)
    localStorage.setItem("Credentials", JSON.stringify({}));
    window.location.href = "../LoginPage/index.html";
});
