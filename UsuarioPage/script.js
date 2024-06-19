const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const userSection = document.getElementById('user-section');
const loginSection = document.getElementById('login-section');
const userNameDisplay = document.getElementById('user-name');

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
    userNameDisplay.textContent = Credentials.unchangedname
}