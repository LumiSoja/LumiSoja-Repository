// Cabeçalho e rodapé iguais em todas as páginas.
// Não há controle de acesso: esta versão do site é somente demonstrativa.

cabecalho.innerHTML = `
    <div class="containerCabecalho">
        <a class="logo" href="index.html">
            <img src="img/logo.jpeg" alt="Logo LumiSoja">
            <span class="tituloLogo">LumiSoja</span>
        </a>
        <nav aria-label="Navegação principal">
            <ul class="barraNavegacao">
                <li><a href="index.html">Home</a></li>
                <li><a href="calculadora.html">Simulador</a></li>
                <li><a href="dashboard.html">Dashboard</a></li>
                <li><a href="telaAdm.html">Administração</a></li>
                <li><a href="cadastro_usuario.html">Cadastro</a></li>
                <li><a href="login.html">Login</a></li>
            </ul>
        </nav>
    </div>
`;

rodape.innerHTML = `
    <div class="containerEmpresaRodape">
        <a class="logoRodape" href="index.html">
            <img src="img/logo.jpeg" alt="Logo LumiSoja">
            <span class="tituloRodape">LumiSoja © 2026</span>
        </a>
        <div class="informacoesRodape">
            <p>CNPJ: 31.872.495/0001-72</p>
            <p>Av. Paulista, 1267 - Bela Vista<br>São Paulo - 07259-002</p>
        </div>
        <nav aria-label="Navegação do rodapé">
            <h3>Navegação</h3>
            <ul class="itensLista">
                <li><a href="index.html#sobre">Sobre nós</a></li>
                <li><a href="calculadora.html">Simulador</a></li>
                <li><a href="index.html#contato">Contato</a></li>
            </ul>
        </nav>
    </div>
`;
