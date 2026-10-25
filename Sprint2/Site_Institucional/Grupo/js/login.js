// Baseado no JS original do grupo: validação simples com vetores e if/else.
// Este login é só uma demonstração. Não há API, sessão nem banco conectado.
let usuarioEmail = ['demo@lumisoja.com'];
let usuarioSenha = ['Demo123!'];

function EmailToLowerCase() {
    ipt_email.value = ipt_email.value.toLowerCase();
}

function ValidarEmail() {
    let email = ipt_email.value.replaceAll(' ', '');
    let senha = ipt_senha.value;

    if (email.includes('@') && email.includes('.') && email.indexOf('@') != email.indexOf('.') - 1) {
        if (email == usuarioEmail[0] && senha == usuarioSenha[0]) {
            msg_login.innerHTML = 'Dados de teste corretos! Você pode visitar a dashboard de demonstração.';
            msg_login.style.color = 'white';
        } else {
            msg_login.innerHTML = 'E-mail ou senha de demonstração incorretos.';
            msg_login.style.color = '#ffde4e';
        }
    } else {
        msg_login.innerHTML = 'Insira um e-mail válido!';
        msg_login.style.color = '#ffde4e';
    }
}
