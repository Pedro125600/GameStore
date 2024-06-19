function Verify(ver) {
    if (ver == 0) {
        let errorcontainer3 = document.getElementById('errorcontainer3');
        if (document.getElementById('name').value == "") {
            errorcontainer3.innerHTML = "*Preencha todos os campos";
        }
        else if (document.getElementById('cpf').value == "") {
            errorcontainer3.innerHTML = "*Preencha todos os campos";
        }
        else {
            window.open("Sucesso.html");
        }
    }
    else {
        let errorcontainer3 = document.getElementById('errorcontainer3');
        if (document.getElementById('Cnum').value == "") {
            errorcontainer3.innerHTML = `<p> *Preencha todos os campos <p>`
        }
        else if (document.getElementById('Cfn').value == "") {
            errorcontainer3.innerHTML = `<p> *Preencha todos os campos <p>`
        }
        else if (document.getElementById('Csn').value == "") {
            errorcontainer3.innerHTML = `<p> *Preencha todos os campos <p>`
        }
        else if (document.getElementById('Cmo').value == "") {
            errorcontainer3.innerHTML = `<p> *Preencha todos os campos <p>`
        }
        else if (document.getElementById('Cyr').value == "") {
            errorcontainer3.innerHTML = `<p> *Preencha todos os campos <p>`
        }
        else if (document.getElementById('Csc').value == "") {
            errorcontainer3.innerHTML = `<p> *Preencha todos os campos <p>`
        }
        else {
            window.open("Sucesso.html");
        }
    }

}