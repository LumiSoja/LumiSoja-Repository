// Tela de administração demonstrativa.
// Os cadastros ficam apenas nos vetores desta página, até atualizar o navegador.
// Não há banco de dados, login real ou permissões de usuário nesta versão.

let empresas = [
    { nome: 'AgroVale', razao: 'AgroVale Agropecuária Ltda', cnpj: '12345678000190' },
    { nome: 'Soja Forte', razao: 'Soja Forte Agrícola Ltda', cnpj: '98765432000110' },
    { nome: 'Campo Verde', razao: 'Campo Verde Produção Rural Ltda', cnpj: '45678912000135' }
];
let fazendas = [
    { nome: 'Fazenda Boa Vista', empresa: 0, hectare: 1500.50, cidade: 'Guarantã do Norte / MT' },
    { nome: 'Estância Progresso', empresa: 0, hectare: 850, cidade: 'Londrina / PR' },
    { nome: 'Fazenda Sol Nascente', empresa: 1, hectare: 3200.75, cidade: 'Mineiros / GO' },
    { nome: 'Sítio AgroVerde', empresa: 2, hectare: 410.10, cidade: 'Tenente Portela / RS' },
    { nome: 'Fazenda Ouro Negro', empresa: 1, hectare: 5000, cidade: 'Balsas / MA' }
];
let usuarios = [
    { nome: 'Thiago - exemplo', cpf: '23456789012', email: 'thiago@exemplo.com', empresa: 0, perfil: 'Administrador' },
    { nome: 'Gustavo - exemplo', cpf: '34567890123', email: 'gustavo@exemplo.com', empresa: 1, perfil: 'Funcionário' }
];

nome_perfil.innerHTML = 'Administrador (exemplo)';
cargo_perfil.innerHTML = 'Modo estático - sem login';

function textoSeguro(texto) {
    return String(texto).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function atualizarAdministracao() {
    let listaOpcoes = '<option value="">Selecione a empresa</option>';
    let tabelaEmpresas = '';
    for (let i = 0; i < empresas.length; i++) {
        listaOpcoes += `<option value="${i}">${textoSeguro(empresas[i].nome)}</option>`;
        tabelaEmpresas += `<tr><td>${textoSeguro(empresas[i].nome)}</td><td>${textoSeguro(empresas[i].razao)}</td><td>${textoSeguro(empresas[i].cnpj)}</td></tr>`;
    }
    empresa_usuario.innerHTML = listaOpcoes;
    empresa_fazenda.innerHTML = listaOpcoes;
    editar_empresa.innerHTML = listaOpcoes;
    lista_empresas.innerHTML = tabelaEmpresas;

    let tipos = '<option value="Comum">Comum</option><option value="Funcionário">Funcionário</option><option value="Administrador">Administrador</option><option value="DEV comum">DEV comum</option><option value="DEV administrador">DEV administrador</option>';
    acesso.innerHTML = tipos;
    editar_perfil.innerHTML = tipos;

    let tabelaFazendas = '';
    for (let i = 0; i < fazendas.length; i++) {
        let cidadeEstado = fazendas[i].cidade;

        if (fazendas[i].estado != undefined && fazendas[i].estado != '') {
            cidadeEstado += ' / ' + fazendas[i].estado;
        }

        tabelaFazendas += `<tr><td>${textoSeguro(fazendas[i].nome)}</td><td>${textoSeguro(empresas[fazendas[i].empresa].nome)}</td>
            <td>${fazendas[i].hectare.toLocaleString('pt-BR')}</td><td>${textoSeguro(cidadeEstado)}</td></tr>`;
    }
    lista_fazendas.innerHTML = tabelaFazendas;

    let cards = '';
    for (let i = 0; i < usuarios.length; i++) {
        let pessoa = usuarios[i];
        let empresa = 'Sem vínculo com empresa';
        if (String(pessoa.empresa) != '') empresa = empresas[pessoa.empresa].nome;
        cards += `<div class="box"><img src="img/usuario.svg" alt="">
            <div class="info-box"><span class="nome-usuario">${textoSeguro(pessoa.nome)}</span>
            <span class="cargo-usuario">${textoSeguro(pessoa.perfil)}</span>
            <p>${textoSeguro(pessoa.email)}</p><small>${textoSeguro(empresa)}</small></div>
            <div class="acoes-usuario">
                <button type="button" onclick="editarUsuario(${i})">Alterar acesso</button>
                <button type="button" class="remover" onclick="removerUsuario(${i})" title="Remover da demonstração">×</button>
            </div></div>`;
    }
    boxes.innerHTML = cards;
    total_usuarios.innerHTML = usuarios.length + ' usuário(s) na demonstração';
}

function adicionarUsuario() {
    let nome = ipt_usuario.value.trim();
    let cpf = cpf_usuario.value.replaceAll('.', '').replaceAll('-', '');
    let email = email_usuario.value.trim();
    let telefone = telefone_usuario.value.trim();
    let senha = senha_usuario.value;
    let confirmacao = confirmacao_usuario.value;
    let empresa = empresa_usuario.value;
    let perfil = acesso.value;

    if (nome == '' || cpf.length != 11 || !email.includes('@') || telefone == '') {
        msg_usuario.innerHTML = 'Preencha corretamente nome, CPF, e-mail e telefone.';
    } else if (senha.length < 8 || senha != confirmacao) {
        msg_usuario.innerHTML = 'A senha precisa ter 8 caracteres e a confirmação deve ser igual.';
    } else if ((perfil == 'Funcionário' || perfil == 'Administrador') && empresa == '') {
        msg_usuario.innerHTML = 'Selecione a empresa deste usuário.';
    } else {
        // A senha não é guardada no vetor.
        usuarios.push({ nome: nome, cpf: cpf, email: email, perfil: perfil, empresa: empresa });
        atualizarAdministracao();
        msg_usuario.innerHTML = 'Usuário adicionado à demonstração. Não foi salvo no banco.';
        ipt_usuario.value = '';
        cpf_usuario.value = '';
        email_usuario.value = '';
        telefone_usuario.value = '';
        senha_usuario.value = '';
        confirmacao_usuario.value = '';
    }
}

function adicionarEmpresa() {
    let nome = nome_empresa.value.trim();
    let razao = razao_empresa.value.trim();
    let cnpj = cnpj_empresa.value.replaceAll('.', '').replaceAll('/', '').replaceAll('-', '');
    let email = email_empresa.value.trim();
    let telefone = telefone_empresa.value.replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '').replaceAll('-', '');
    let logradouro = logradouro_empresa.value.trim();
    let numero = numero_empresa.value.trim();
    let bairro = bairro_empresa.value.trim();
    let cep = cep_empresa.value.replaceAll('-', '');
    let cidade = cidade_empresa.value.trim();
    let estado = estado_empresa.value.trim();
    let repetido = false;
    for (let i = 0; i < empresas.length; i++) {
        if (empresas[i].cnpj == cnpj) repetido = true;
    }

    if (nome == '' || razao == '' || cnpj.length != 14) {
        msg_empresa.innerHTML = 'Informe nome, razão social e CNPJ com 14 números.';
    } else if (repetido) {
        msg_empresa.innerHTML = 'Este CNPJ já está na demonstração.';
    } else {
        empresas.push({ nome: nome, razao: razao, cnpj: cnpj, email: email, telefone: telefone, logradouro: logradouro, numero: numero, bairro: bairro, cep: cep, cidade: cidade, estado: estado });
        atualizarAdministracao();
        msg_empresa.innerHTML = 'Empresa adicionada à demonstração.';
        nome_empresa.value = '';
        razao_empresa.value = '';
        cnpj_empresa.value = '';
        email_empresa.value = '';
        telefone_empresa.value = '';
        logradouro_empresa.value = '';
        numero_empresa.value = '';
        bairro_empresa.value = '';
        cep_empresa.value = '';
        cidade_empresa.value = '';
        estado_empresa.value = '';
    }
}

function adicionarFazenda() {
    let nome = nome_fazenda.value.trim();
    let empresa = empresa_fazenda.value;
    let hectare = Number(hectares_fazenda.value);
    let cidade = cidade_fazenda.value.trim();
    let logradouro = logradouro_fazenda.value.trim();
    let numero = numero_fazenda.value.trim();
    let bairro = bairro_fazenda.value.trim();
    let cep = cep_fazenda.value.replaceAll('-', '');
    let estado = estado_fazenda.value.trim();

    if (nome == '' || empresa == '' || isNaN(hectare) || hectare <= 0 || cidade == '') {
        msg_fazenda.innerHTML = 'Preencha os dados da fazenda e escolha uma empresa.';
    } else {
        fazendas.push({ nome: nome, empresa: Number(empresa), hectare: hectare, cidade: cidade, logradouro: logradouro, numero: numero, bairro: bairro, cep: cep, estado: estado });
        atualizarAdministracao();
        msg_fazenda.innerHTML = 'Fazenda adicionada à demonstração (não vai automaticamente para a dashboard).';
        nome_fazenda.value = '';
        hectares_fazenda.value = '';
        cidade_fazenda.value = '';
        logradouro_fazenda.value = '';
        numero_fazenda.value = '';
        bairro_fazenda.value = '';
        cep_fazenda.value = '';
        estado_fazenda.value = '';
    }
}

function removerUsuario(posicao) {
    if (confirm('Remover este usuário apenas da demonstração?')) {
        usuarios.splice(posicao, 1);
        atualizarAdministracao();
        msg_admin.innerHTML = 'Usuário removido da lista temporária.';
    }
}

function editarUsuario(posicao) {
    editar_id.value = posicao;
    editar_nome.innerHTML = textoSeguro(usuarios[posicao].nome);
    editar_perfil.value = usuarios[posicao].perfil;
    editar_empresa.value = usuarios[posicao].empresa;
    msg_editar.innerHTML = '';
    editar_acesso.showModal();
}

function salletAcesso() {
    let posicao = Number(editar_id.value);
    let perfil = editar_perfil.value;
    let empresa = editar_empresa.value;
    if ((perfil == 'Administrador' || perfil == 'Funcionário') && empresa == '') {
        msg_editar.innerHTML = 'Selecione a empresa deste usuário.';
    } else {
        usuarios[posicao].perfil = perfil;
        usuarios[posicao].empresa = empresa;
        editar_acesso.close();
        atualizarAdministracao();
        msg_admin.innerHTML = 'Perfil alterado apenas na demonstração.';
    }
}

atualizarAdministracao();
