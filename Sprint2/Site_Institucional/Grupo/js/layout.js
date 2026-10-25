// O mesmo cabeçalho e rodapé é usado em todas as páginas.
function montarLayout() {
    const usuario = usuarioLogado();
    let links = '<li><a href="index.html">Home</a></li><li><a href="calculadora.html">Simulador</a></li>';
    if (MODO_ESTATICO || podeDashboard(usuario)) links += '<li><a href="dashboard.html">Dashboard</a></li>';
    if (MODO_ESTATICO || podeAdministrar(usuario)) links += '<li><a href="telaAdm.html">Administração</a></li>';
    if (usuario && !MODO_ESTATICO) {
        links += '<li class="saudacao">Olá, ' + textoSeguro(usuario.nome.split(' ')[0]) + '</li><li><button id="sair" type="button">Sair</button></li>';
    } else {
        links += '<li><a href="cadastro_usuario.html">Cadastro</a></li><li><a href="login.html">Login</a></li>';
    }
    document.getElementById('cabecalho').innerHTML = '<div class="containerCabecalho"><a class="logo" href="index.html" aria-label="LumiSoja — Home"><img src="img/logo.jpeg" alt=""><span class="tituloLogo">LumiSoja</span></a><nav aria-label="Navegação principal"><ul class="barraNavegacao">' + links + '</ul></nav></div>';
    document.getElementById('rodape').innerHTML = '<div class="containerEmpresaRodape"><a class="logoRodape" href="index.html"><img src="img/logo.jpeg" alt=""><span class="tituloRodape">LumiSoja © 2026</span></a><div class="informacoesRodape"><p>CNPJ: 31.872.495/0001-72</p><p>Av. Paulista, 1267 - Bela Vista<br>São Paulo - 07259-002</p></div><nav aria-label="Navegação do rodapé"><h3>Navegação</h3><ul class="itensLista"><li><a href="index.html#sobre">Sobre nós</a></li><li><a href="calculadora.html">Simulador</a></li><li><a href="index.html#contato">Contato</a></li></ul></nav></div>';
    document.querySelectorAll('#cabecalho a').forEach(function (link) {
        if (link.getAttribute('href') === location.pathname.split('/').pop()) link.setAttribute('aria-current', 'page');
    });
    const sair = document.getElementById('sair');
    if (sair) sair.addEventListener('click', function () { sessionStorage.removeItem(CHAVE_SESSAO); window.location.href = 'index.html'; });
}
montarLayout();
