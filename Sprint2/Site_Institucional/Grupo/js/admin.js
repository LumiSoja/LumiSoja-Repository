if (exigirAcesso('admin')) {
    const atorAdm = usuarioLogado();
    const formularioUsuario = document.getElementById('form-usuario');
    document.getElementById('nome-perfil').textContent = atorAdm.nome;
    document.getElementById('cargo-perfil').textContent = MODO_ESTATICO ? 'Modo estático — sem login' : PERFIS[atorAdm.perfil];
    if (MODO_ESTATICO) {
        formularioUsuario.querySelectorAll('input[type="password"]').forEach(function (campo) { campo.required = false; campo.removeAttribute('minlength'); });
        formularioUsuario.querySelector('.nota').textContent = 'Senhas opcionais nesta demonstração; nenhuma senha é salva.';
    }
    document.getElementById('area-dev').hidden = !ehDev(atorAdm);
    document.getElementById('conteudo-admin').hidden = false;

    function opcoesPerfil() {
        let perfis = ehDev(atorAdm) ? ['comum', 'funcionario', 'administrador'] : ['funcionario', 'administrador'];
        if (atorAdm.perfil === 'dev_admin') perfis = perfis.concat(['dev', 'dev_admin']);
        return perfis.map(function (perfil) { return '<option value="' + perfil + '">' + PERFIS[perfil] + '</option>'; }).join('');
    }
    document.getElementById('acesso').innerHTML = opcoesPerfil();
    document.getElementById('editar-perfil').innerHTML = opcoesPerfil();

    function preencherEmpresas() {
        const empresas = lerDados().empresas.filter(function (empresa) { return ehDev(atorAdm) || empresa.id === atorAdm.empresaId; });
        ['empresa-usuario', 'empresa-fazenda', 'editar-empresa'].forEach(function (id) {
            const seletor = document.getElementById(id);
            const anterior = seletor.value;
            seletor.innerHTML = '<option value="">Selecione a empresa</option>' + empresas.map(function (empresa) { return '<option value="' + empresa.id + '">' + textoSeguro(empresa.nome) + '</option>'; }).join('');
            seletor.value = anterior;
        });
        if (!ehDev(atorAdm)) document.getElementById('empresa-usuario').value = String(atorAdm.empresaId);
    }

    function ajustarEmpresa(perfilId, empresaId) {
        const perfil = document.getElementById(perfilId).value;
        const seletor = document.getElementById(empresaId);
        const precisa = perfil === 'funcionario' || perfil === 'administrador';
        seletor.required = precisa;
        seletor.disabled = !precisa || !ehDev(atorAdm);
        if (!precisa) seletor.value = '';
        if (precisa && !ehDev(atorAdm)) seletor.value = String(atorAdm.empresaId);
    }
    document.getElementById('acesso').addEventListener('change', function () { ajustarEmpresa('acesso', 'empresa-usuario'); });
    document.getElementById('editar-perfil').addEventListener('change', function () { ajustarEmpresa('editar-perfil', 'editar-empresa'); });

    function atualizarAdministracao() {
        preencherEmpresas();
        ajustarEmpresa('acesso', 'empresa-usuario');
        const dados = lerDados();
        const usuarios = usuariosVisiveis();
        document.getElementById('total-usuarios').textContent = usuarios.length + ' usuário(s) ativo(s)';
        document.getElementById('boxes').innerHTML = usuarios.map(function (usuario) {
            const empresa = dados.empresas.find(function (item) { return item.id === usuario.empresaId; });
            let botoes = '';
            if (ehDev(atorAdm) && atorAdm.id !== usuario.id && (!ehDev(usuario) || atorAdm.perfil === 'dev_admin')) botoes += '<button type="button" data-editar="' + usuario.id + '">Alterar acesso</button>';
            if (podeDesativar(atorAdm, usuario)) botoes += '<button type="button" class="remover" data-desativar="' + usuario.id + '" title="Desativar usuário" aria-label="Desativar ' + textoSeguro(usuario.nome) + '">×</button>';
            return '<div class="box"><img src="img/usuario.svg" alt=""><div class="info-box"><span class="nome-usuario">' + textoSeguro(usuario.nome) + '</span><span class="cargo-usuario">' + PERFIS[usuario.perfil] + '</span><p>' + textoSeguro(usuario.email) + '</p><small>' + textoSeguro(empresa ? empresa.nome : 'Sem vínculo com empresa') + '</small></div><div class="acoes-usuario">' + botoes + '</div></div>';
        }).join('') || '<p>Nenhum usuário disponível.</p>';
        // Não monta informações da área DEV para administradores de empresas.
        if (!ehDev(atorAdm)) return;
        document.getElementById('lista-empresas').innerHTML = dados.empresas.map(function (empresa) { return '<tr><td>' + textoSeguro(empresa.nome) + '</td><td>' + textoSeguro(empresa.razaoSocial) + '</td><td>' + textoSeguro(empresa.cnpj) + '</td></tr>'; }).join('');
        document.getElementById('lista-fazendas').innerHTML = dados.fazendas.map(function (fazenda) {
            const empresa = dados.empresas.find(function (item) { return item.id === fazenda.empresaId; });
            return '<tr><td>' + textoSeguro(fazenda.nome) + '</td><td>' + textoSeguro(empresa.nome) + '</td><td>' + fazenda.hectares.toLocaleString('pt-BR') + '</td><td>' + textoSeguro(fazenda.cidade) + '</td></tr>';
        }).join('');
    }

    formularioUsuario.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        const mensagem = document.getElementById('msg-usuario');
        const botao = this.querySelector('button[type="submit"]');
        botao.disabled = true;
        try {
            await cadastrarUsuario({ nome: document.getElementById('ipt_usuario').value, cpf: document.getElementById('cpf-usuario').value, email: document.getElementById('email-usuario').value, telefone: document.getElementById('telefone-usuario').value, perfil: document.getElementById('acesso').value, empresaId: Number(document.getElementById('empresa-usuario').value) || null }, document.getElementById('senha-usuario').value, document.getElementById('confirmacao-usuario').value, false);
            this.reset();
            mensagem.className = 'mensagem sucesso';
            mensagem.textContent = MODO_ESTATICO ? 'Usuário adicionado à demonstração. A navegação continua livre.' : 'Usuário cadastrado e disponível para login.';
            atualizarAdministracao();
        } catch (erro) { mensagem.className = 'mensagem erro'; mensagem.textContent = erro.message; }
        finally { botao.disabled = false; }
    });

    document.getElementById('form-empresa').addEventListener('submit', function (evento) {
        evento.preventDefault();
        const mensagem = document.getElementById('msg-empresa');
        try {
            cadastrarEmpresa({ nome: document.getElementById('nome-empresa').value, razaoSocial: document.getElementById('razao-empresa').value, cnpj: document.getElementById('cnpj-empresa').value });
            this.reset();
            mensagem.className = 'mensagem sucesso';
            mensagem.textContent = 'Empresa cadastrada. Agora você pode vincular usuários e fazendas a ela.';
            atualizarAdministracao();
        } catch (erro) { mensagem.className = 'mensagem erro'; mensagem.textContent = erro.message; }
    });

    document.getElementById('form-fazenda').addEventListener('submit', function (evento) {
        evento.preventDefault();
        const mensagem = document.getElementById('msg-fazenda');
        try {
            cadastrarFazenda({ nome: document.getElementById('nome-fazenda').value, empresaId: Number(document.getElementById('empresa-fazenda').value), hectares: Number(document.getElementById('hectares-fazenda').value), cidade: document.getElementById('cidade-fazenda').value });
            this.reset();
            mensagem.className = 'mensagem sucesso';
            mensagem.textContent = 'Fazenda cadastrada e vinculada à empresa. Ela aparecerá na dashboard sem sensores ou leituras.';
            atualizarAdministracao();
        } catch (erro) { mensagem.className = 'mensagem erro'; mensagem.textContent = erro.message; }
    });

    document.getElementById('boxes').addEventListener('click', function (evento) {
        const desativar = evento.target.closest('[data-desativar]');
        const editar = evento.target.closest('[data-editar]');
        const mensagem = document.getElementById('msg-admin');
        try {
            if (desativar && confirm(MODO_ESTATICO ? 'Desativar este usuário de exemplo na demonstração?' : 'Desativar este usuário? Ele perderá o acesso ao sistema.')) {
                desativarUsuario(Number(desativar.dataset.desativar));
                mensagem.className = 'mensagem sucesso';
                mensagem.textContent = 'Usuário desativado. O histórico foi preservado.';
                atualizarAdministracao();
            }
            if (editar) {
                const alvo = usuariosVisiveis().find(function (usuario) { return usuario.id === Number(editar.dataset.editar); });
                document.getElementById('editar-id').value = alvo.id;
                document.getElementById('editar-nome').textContent = alvo.nome;
                document.getElementById('editar-perfil').value = alvo.perfil;
                ajustarEmpresa('editar-perfil', 'editar-empresa');
                document.getElementById('editar-empresa').value = alvo.empresaId || '';
                document.getElementById('msg-editar').textContent = '';
                document.getElementById('editar-acesso').showModal();
            }
        } catch (erro) { mensagem.className = 'mensagem erro'; mensagem.textContent = erro.message; }
    });
    document.getElementById('form-editar').addEventListener('submit', function (evento) {
        evento.preventDefault();
        try {
            alterarAcessoUsuario(Number(document.getElementById('editar-id').value), document.getElementById('editar-perfil').value, Number(document.getElementById('editar-empresa').value) || null);
            document.getElementById('editar-acesso').close();
            atualizarAdministracao();
        } catch (erro) { document.getElementById('msg-editar').textContent = erro.message; }
    });
    document.getElementById('fechar-edicao').addEventListener('click', function () { document.getElementById('editar-acesso').close(); });
    atualizarAdministracao();
}
