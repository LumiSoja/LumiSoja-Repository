const formularioLogin = document.getElementById('form-login');
if (MODO_ESTATICO) {
    formularioLogin.noValidate = true;
    document.getElementById('ipt_email').required = false;
    document.getElementById('ipt_senha').required = false;
    formularioLogin.querySelector('button[type="submit"]').textContent = 'Login';
}
formularioLogin.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    if (MODO_ESTATICO) { window.location.href = 'index.html'; return; }
    const botao = this.querySelector('button[type="submit"]');
    const mensagem = document.getElementById('msg-login');
    botao.disabled = true;
    mensagem.textContent = '';
    try {
        await entrar(document.getElementById('ipt_email').value, document.getElementById('ipt_senha').value);
        // Volta à landing page; o menu exibe somente os acessos do perfil logado.
        window.location.href = 'index.html';
    } catch (erro) { mensagem.textContent = erro.message; }
    finally { botao.disabled = false; }
});
