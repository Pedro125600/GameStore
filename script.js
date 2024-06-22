let Cadastros; // Objeto que contem todas as contas
try {
    Cadastros = JSON.parse(localStorage.Cadastros);
} catch {
    Cadastros = {};
    localStorage.setItem("Cadastros", JSON.stringify(Cadastros));
}

let Credentials = JSON.parse(localStorage.getItem("Credentials"));

if (!Credentials) {
    Credentials = {}
    localStorage.setItem("Credentials", JSON.stringify(Credentials));
}

// Redirecionar a pessoa para a página de Login se ela não estiver logada ou para a pagina de usuário caso já esteja em uma conta
if (
    !Cadastros[Credentials.name] ||
    Cadastros[Credentials.name]["senha"] != Credentials.senha
) {
    localStorage.setItem("Credentials", JSON.stringify({}));
    window.location.href = "./LoginPage/index.html";
} else {
    window.location.href = "./UsuarioPage/index.html"
}