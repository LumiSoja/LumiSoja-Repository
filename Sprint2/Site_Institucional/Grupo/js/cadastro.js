const formularioCadastro = document.getElementById('form-cadastro');
const senhaCadastro = document.getElementById('ipt_senha');
const confirmacaoCadastro = document.getElementById('ipt_confirmacao');
if (MODO_ESTATICO) {
    [senhaCadastro, confirmacaoCadastro].forEach(function (campo) { campo.required = false; campo.removeAttribute('minlength'); });
    document.querySelector('#form-cadastro .campo .nota').textContent = 'Senha opcional nesta demonstração. Nenhuma senha será salva.';
}

function atualizarSenha() {
    const senha = senhaCadastro.value;
    let pontos = 0;
    if (senha.length >= 8) pontos++;
    if (/[A-Z]/.test(senha)) pontos++;
    if (/[0-9]/.test(senha)) pontos++;
    if (/[^a-zA-Z0-9\s]/.test(senha)) pontos++;
    const nivel = document.getElementById('div_nivel');
    nivel.textContent = !senha ? 'Em branco' : pontos === 4 ? 'Forte' : pontos >= 2 ? 'Média' : 'Fraca';
    nivel.className = pontos === 4 ? 'sucesso' : 'erro';
    const iguais = senha === confirmacaoCadastro.value;
    const mensagem = document.getElementById('div_confirmacao');
    mensagem.textContent = !confirmacaoCadastro.value ? '' : iguais ? 'As senhas conferem.' : 'As senhas não conferem.';
    mensagem.className = iguais ? 'nota sucesso' : 'nota erro';
}
senhaCadastro.addEventListener('input', atualizarSenha);
confirmacaoCadastro.addEventListener('input', atualizarSenha);
formularioCadastro.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    const mensagem = document.getElementById('div_msg');
    const botao = formularioCadastro.querySelector('button[type="submit"]');
    botao.disabled = true;
    mensagem.textContent = '';
    try {
        await cadastrarUsuario({ nome: document.getElementById('ipt_nome').value, cpf: document.getElementById('ipt_cpf').value, email: document.getElementById('ipt_email').value, telefone: document.getElementById('ipt_tel').value }, senhaCadastro.value, confirmacaoCadastro.value, true);
        window.location.href = 'login.html';
    } catch (erro) {
        mensagem.className = 'mensagem erro';
        mensagem.textContent = erro.message;
    } finally { botao.disabled = false; }
});
