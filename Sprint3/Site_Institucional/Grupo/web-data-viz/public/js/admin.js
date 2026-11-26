var perfis = [];
var empresas = [];
var usuarios = [];
var fazendas = [];

var referencias = {
    nomePerfil: document.getElementById("nome_perfil"),
    cargoPerfil: document.getElementById("cargo_perfil"),
    formUsuario: document.getElementById("form_usuario"),
    formEmpresa: document.getElementById("form_empresa"),
    formFazenda: document.getElementById("form_fazenda"),
    acesso: document.getElementById("acesso"),
    empresaUsuario: document.getElementById("empresa_usuario"),
    empresaFazenda: document.getElementById("empresa_fazenda"),
    editarAcesso: document.getElementById("editar_acesso"),
    editarId: document.getElementById("editar_id"),
    editarNome: document.getElementById("editar_nome"),
    editarPerfil: document.getElementById("editar_perfil"),
    editarEmpresa: document.getElementById("editar_empresa"),
    msgUsuario: document.getElementById("msg_usuario"),
    msgEmpresa: document.getElementById("msg_empresa"),
    msgFazenda: document.getElementById("msg_fazenda"),
    msgEditar: document.getElementById("msg_editar"),
    boxes: document.getElementById("boxes"),
    totalUsuarios: document.getElementById("total_usuarios"),
    listaEmpresas: document.getElementById("lista_empresas"),
    listaFazendas: document.getElementById("lista_fazendas")
};

function textoSeguro(texto) {
    return String(texto === undefined || texto === null ? "" : texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function soNumeros(texto) {
    return String(texto === undefined || texto === null ? "" : texto).replace(/\D/g, "");
}

function valorOuVazio(texto) {
    var valor = String(texto === undefined || texto === null ? "" : texto).trim();
    return valor;
}

function numeroOuNulo(texto) {
    var valor = valorOuVazio(texto);
    if (valor === "") {
        return null;
    }

    var numero = Number(valor);
    return Number.isNaN(numero) ? null : numero;
}

function formatarMoedaOuZero(valor) {
    var numero = Number(valor);
    if (Number.isNaN(numero)) {
        numero = 0;
    }

    return numero.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function requisitarJson(url, options) {
    var resposta = await fetch(url, Object.assign({
        headers: {
            "Content-Type": "application/json"
        }
    }, options || {}));

    var texto = await resposta.text();
    var dados = null;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch (erro) {
            dados = { mensagem: texto };
        }
    }

    if (!resposta.ok) {
        throw new Error((dados && dados.mensagem) || "Falha na requisicao.");
    }

    return dados;
}

function limparMensagens() {
    referencias.msgUsuario.textContent = "";
    referencias.msgEmpresa.textContent = "";
    referencias.msgFazenda.textContent = "";
    referencias.msgEditar.textContent = "";
}

function preencherSelect(select, itens, placeholder, renderItem) {
    var opcoes = `<option value="">${textoSeguro(placeholder)}</option>`;

    for (var i = 0; i < itens.length; i++) {
        opcoes += renderItem(itens[i]);
    }

    select.innerHTML = opcoes;
}

function getPerfilPorId(id) {
    for (var i = 0; i < perfis.length; i++) {
        if (Number(perfis[i].id) === Number(id)) {
            return perfis[i];
        }
    }

    return null;
}

function getEmpresaPorId(id) {
    for (var i = 0; i < empresas.length; i++) {
        if (Number(empresas[i].id) === Number(id)) {
            return empresas[i];
        }
    }

    return null;
}

function atualizarSelects() {
    preencherSelect(referencias.empresaUsuario, empresas, "Selecione a empresa", function (empresa) {
        return `<option value="${empresa.id}">${textoSeguro(empresa.nome)}</option>`;
    });

    preencherSelect(referencias.empresaFazenda, empresas, "Selecione a empresa", function (empresa) {
        return `<option value="${empresa.id}">${textoSeguro(empresa.nome)}</option>`;
    });

    preencherSelect(referencias.editarEmpresa, empresas, "Sem empresa", function (empresa) {
        return `<option value="${empresa.id}">${textoSeguro(empresa.nome)}</option>`;
    });

    preencherSelect(referencias.acesso, perfis, "Selecione o perfil", function (perfil) {
        return `<option value="${perfil.id}">${textoSeguro(perfil.nome)}</option>`;
    });

    preencherSelect(referencias.editarPerfil, perfis, "Selecione o perfil", function (perfil) {
        return `<option value="${perfil.id}">${textoSeguro(perfil.nome)}</option>`;
    });
}

function renderizarUsuarios() {
    var cards = "";

    for (var i = 0; i < usuarios.length; i++) {
        var usuario = usuarios[i];
        var empresa = usuario.empresaNome || (usuario.empresaId ? getEmpresaPorId(usuario.empresaId)?.nome : "Sem vínculo com empresa");
        var email = usuario.email || "E-mail não informado";
        var telefone = usuario.telefone || "Telefone não informado";

        cards += `<div class="box"><img src="../assets/img/usuario.svg" alt="">
            <div class="info-box"><span class="nome-usuario">${textoSeguro(usuario.nome)}</span>
            <span class="cargo-usuario">${textoSeguro(usuario.perfilNome || "Sem perfil")}</span>
            <p>${textoSeguro(email)}</p><small>${textoSeguro(telefone)}</small><small>${textoSeguro(empresa)}</small></div>
            <div class="acoes-usuario">
                <button type="button" onclick="editarUsuario(${usuario.id})">Alterar acesso</button>
                <button type="button" class="remover" onclick="excluirUsuario(${usuario.id})">Excluir</button>
            </div></div>`;
    }

    referencias.boxes.innerHTML = cards;
    referencias.totalUsuarios.textContent = usuarios.length + " usuário(s) cadastrados";
}

function renderizarEmpresas() {
    var linhas = "";

    for (var i = 0; i < empresas.length; i++) {
        var empresa = empresas[i];
        linhas += `<tr><td>${textoSeguro(empresa.nome)}</td><td>${textoSeguro(empresa.razaoSocial)}</td><td>${textoSeguro(empresa.cnpj)}</td><td><button type="button" class="remover" onclick="excluirEmpresa(${empresa.id})">Excluir</button></td></tr>`;
    }

    if (referencias.listaEmpresas.parentElement && referencias.listaEmpresas.parentElement.querySelector("thead tr")) {
        var cabecalhoEmpresas = referencias.listaEmpresas.parentElement.querySelector("thead tr");
        if (cabecalhoEmpresas.children.length === 3) {
            cabecalhoEmpresas.innerHTML += "<th scope=\"col\">Ações</th>";
        }
    }

    referencias.listaEmpresas.innerHTML = linhas;
}

function renderizarFazendas() {
    var linhas = "";

    for (var i = 0; i < fazendas.length; i++) {
        var fazenda = fazendas[i];
        var cidadeEstado = fazenda.cidade || "";

        if (fazenda.estado) {
            cidadeEstado += cidadeEstado ? " / " + fazenda.estado : fazenda.estado;
        }

        linhas += `<tr><td>${textoSeguro(fazenda.nome)}</td><td>${textoSeguro(fazenda.empresaNome || "Sem empresa")}</td><td>${textoSeguro(formatarMoedaOuZero(fazenda.hectare))}</td><td>${textoSeguro(cidadeEstado)}</td><td><button type="button" class="remover" onclick="excluirFazenda(${fazenda.id})">Excluir</button></td></tr>`;
    }

    if (referencias.listaFazendas.parentElement && referencias.listaFazendas.parentElement.querySelector("thead tr")) {
        var cabecalhoFazendas = referencias.listaFazendas.parentElement.querySelector("thead tr");
        if (cabecalhoFazendas.children.length === 4) {
            cabecalhoFazendas.innerHTML += "<th scope=\"col\">Ações</th>";
        }
    }

    referencias.listaFazendas.innerHTML = linhas;
}

function renderizarTela() {
    referencias.nomePerfil.textContent = "Administração";
    referencias.cargoPerfil.textContent = "Cadastro e gestão via banco de dados";
    atualizarSelects();
    renderizarUsuarios();
    renderizarEmpresas();
    renderizarFazendas();
}

async function carregarDados() {
    try {
        var resposta = await Promise.all([
            requisitarJson("/admin/perfis"),
            requisitarJson("/admin/usuarios"),
            requisitarJson("/admin/empresas"),
            requisitarJson("/admin/fazendas")
        ]);

        perfis = resposta[0] || [];
        usuarios = resposta[1] || [];
        empresas = resposta[2] || [];
        fazendas = resposta[3] || [];

        renderizarTela();
    } catch (erro) {
        console.error(erro);
        referencias.nomePerfil.textContent = "Administração";
        referencias.cargoPerfil.textContent = "Falha ao carregar dados";
        referencias.msgUsuario.textContent = erro.message;
    }
}

async function adicionarUsuario() {
    limparMensagens();

    var nome = valorOuVazio(document.getElementById("ipt_usuario").value);
    var cpf = soNumeros(document.getElementById("cpf_usuario").value);
    var email = valorOuVazio(document.getElementById("email_usuario").value);
    var telefone = soNumeros(document.getElementById("telefone_usuario").value);
    var senha = document.getElementById("senha_usuario").value;
    var confirmacao = document.getElementById("confirmacao_usuario").value;
    var perfilId = numeroOuNulo(referencias.acesso.value);
    var empresaId = numeroOuNulo(referencias.empresaUsuario.value);
    var perfilSelecionado = getPerfilPorId(perfilId);

    if (!nome || cpf.length !== 11 || !email || telefone.length < 10) {
        referencias.msgUsuario.textContent = "Preencha corretamente nome, CPF, e-mail e telefone.";
        return;
    }

    if (senha.length < 8 || senha !== confirmacao) {
        referencias.msgUsuario.textContent = "A senha precisa ter 8 caracteres e a confirmação deve ser igual.";
        return;
    }

    if (!perfilSelecionado) {
        referencias.msgUsuario.textContent = "Selecione o tipo de usuário.";
        return;
    }

    if ((perfilSelecionado.nome === "Administrador" || perfilSelecionado.nome === "Funcionário") && empresaId === null) {
        referencias.msgUsuario.textContent = "Selecione a empresa deste usuário.";
        return;
    }

    try {
        await requisitarJson("/admin/usuarios", {
            method: "POST",
            body: JSON.stringify({
                nome: nome,
                cpf: cpf,
                email: email,
                telefone: telefone,
                senha: senha,
                perfilId: perfilId,
                empresaId: empresaId
            })
        });

        referencias.msgUsuario.textContent = "Usuário cadastrado com sucesso.";
        document.getElementById("form_usuario").reset();
        await carregarDados();
    } catch (erro) {
        referencias.msgUsuario.textContent = erro.message;
    }
}

async function adicionarEmpresa() {
    limparMensagens();

    var nome = valorOuVazio(document.getElementById("nome_empresa").value);
    var razaoSocial = valorOuVazio(document.getElementById("razao_empresa").value);
    var cnpj = soNumeros(document.getElementById("cnpj_empresa").value);
    var email = valorOuVazio(document.getElementById("email_empresa").value);
    var telefone = soNumeros(document.getElementById("telefone_empresa").value);
    var logradouro = valorOuVazio(document.getElementById("logradouro_empresa").value);
    var numero = valorOuVazio(document.getElementById("numero_empresa").value);
    var bairro = valorOuVazio(document.getElementById("bairro_empresa").value);
    var cep = soNumeros(document.getElementById("cep_empresa").value);
    var cidade = valorOuVazio(document.getElementById("cidade_empresa").value);
    var estado = valorOuVazio(document.getElementById("estado_empresa").value);

    if (!nome || !razaoSocial || cnpj.length !== 14) {
        referencias.msgEmpresa.textContent = "Informe nome, razão social e CNPJ com 14 números.";
        return;
    }

    try {
        await requisitarJson("/admin/empresas", {
            method: "POST",
            body: JSON.stringify({
                nome: nome,
                razaoSocial: razaoSocial,
                cnpj: cnpj,
                email: email,
                telefone: telefone,
                logradouro: logradouro,
                numero: numero,
                bairro: bairro,
                cep: cep,
                cidade: cidade,
                estado: estado
            })
        });

        referencias.msgEmpresa.textContent = "Empresa cadastrada com sucesso.";
        document.getElementById("form_empresa").reset();
        await carregarDados();
    } catch (erro) {
        referencias.msgEmpresa.textContent = erro.message;
    }
}

async function adicionarFazenda() {
    limparMensagens();

    var nome = valorOuVazio(document.getElementById("nome_fazenda").value);
    var empresaId = numeroOuNulo(referencias.empresaFazenda.value);
    var hectare = Number(valorOuVazio(document.getElementById("hectares_fazenda").value));
    var logradouro = valorOuVazio(document.getElementById("logradouro_fazenda").value);
    var numero = valorOuVazio(document.getElementById("numero_fazenda").value);
    var bairro = valorOuVazio(document.getElementById("bairro_fazenda").value);
    var cep = soNumeros(document.getElementById("cep_fazenda").value);
    var cidade = valorOuVazio(document.getElementById("cidade_fazenda").value);
    var estado = valorOuVazio(document.getElementById("estado_fazenda").value);
    var precoSaca = document.getElementById("preco_saca_fazenda").value === "" ? 0 : Number(document.getElementById("preco_saca_fazenda").value);
    var quantidadeSaca = document.getElementById("quantidade_saca_fazenda").value === "" ? 0 : Number(document.getElementById("quantidade_saca_fazenda").value);

    if (!nome || empresaId === null || Number.isNaN(hectare) || hectare <= 0 || !cidade) {
        referencias.msgFazenda.textContent = "Preencha os dados da fazenda e escolha uma empresa.";
        return;
    }

    try {
        await requisitarJson("/admin/fazendas", {
            method: "POST",
            body: JSON.stringify({
                nome: nome,
                empresaId: empresaId,
                hectare: hectare,
                logradouro: logradouro,
                numero: numero,
                bairro: bairro,
                cep: cep,
                cidade: cidade,
                estado: estado,
                precoSaca: precoSaca,
                quantidadeSaca: quantidadeSaca
            })
        });

        referencias.msgFazenda.textContent = "Fazenda cadastrada com sucesso.";
        document.getElementById("form_fazenda").reset();
        await carregarDados();
    } catch (erro) {
        referencias.msgFazenda.textContent = erro.message;
    }
}

function editarUsuario(idUsuario) {
    var usuario = null;

    for (var i = 0; i < usuarios.length; i++) {
        if (Number(usuarios[i].id) === Number(idUsuario)) {
            usuario = usuarios[i];
            break;
        }
    }

    if (!usuario) {
        return;
    }

    referencias.editarId.value = usuario.id;
    referencias.editarNome.textContent = usuario.nome;
    referencias.editarPerfil.value = usuario.perfilId;
    referencias.editarEmpresa.value = usuario.empresaId || "";
    referencias.msgEditar.textContent = "";
    referencias.editarAcesso.showModal();
}

async function salvarAcesso() {
    limparMensagens();

    var idUsuario = numeroOuNulo(referencias.editarId.value);
    var perfilId = numeroOuNulo(referencias.editarPerfil.value);
    var empresaId = numeroOuNulo(referencias.editarEmpresa.value);
    var perfilSelecionado = getPerfilPorId(perfilId);

    if (idUsuario === null || perfilId === null || !perfilSelecionado) {
        referencias.msgEditar.textContent = "Selecione um perfil valido.";
        return;
    }

    if ((perfilSelecionado.nome === "Administrador" || perfilSelecionado.nome === "Funcionário") && empresaId === null) {
        referencias.msgEditar.textContent = "Selecione a empresa deste usuário.";
        return;
    }

    try {
        await requisitarJson(`/admin/usuarios/${idUsuario}/acesso`, {
            method: "PATCH",
            body: JSON.stringify({
                perfilId: perfilId,
                empresaId: empresaId
            })
        });

        referencias.editarAcesso.close();
        await carregarDados();
    } catch (erro) {
        referencias.msgEditar.textContent = erro.message;
    }
}

async function excluirUsuario(idUsuario) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) {
        return;
    }

    try {
        await requisitarJson(`/admin/usuarios/${idUsuario}`, {
            method: "DELETE"
        });

        await carregarDados();
    } catch (erro) {
        referencias.msgUsuario.textContent = erro.message;
    }
}

async function excluirEmpresa(idEmpresa) {
    if (!confirm("Tem certeza que deseja excluir esta empresa?")) {
        return;
    }

    try {
        await requisitarJson(`/admin/empresas/${idEmpresa}`, {
            method: "DELETE"
        });

        await carregarDados();
    } catch (erro) {
        referencias.msgEmpresa.textContent = erro.message;
    }
}

async function excluirFazenda(idFazenda) {
    if (!confirm("Tem certeza que deseja excluir esta fazenda?")) {
        return;
    }

    try {
        await requisitarJson(`/admin/fazendas/${idFazenda}`, {
            method: "DELETE"
        });

        await carregarDados();
    } catch (erro) {
        referencias.msgFazenda.textContent = erro.message;
    }
}

carregarDados();
