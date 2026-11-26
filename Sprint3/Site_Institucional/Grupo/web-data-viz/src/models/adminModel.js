var database = require("../database/config");

function sqlTexto(valor) {
    if (valor === undefined || valor === null) {
        return "NULL";
    }

    var texto = String(valor);
    if (texto.trim() === "") {
        return "NULL";
    }

    return "'" + texto.replaceAll("'", "''") + "'";
}

function sqlNumero(valor) {
    if (valor === undefined || valor === null || valor === "") {
        return "NULL";
    }

    var numero = Number(valor);
    if (Number.isNaN(numero)) {
        return "NULL";
    }

    return String(numero);
}

function listarPerfis() {
    var instrucaoSql = `
        SELECT id, nome, descricao
        FROM perfil_acesso
        ORDER BY id;
    `;

    return database.executar(instrucaoSql);
}

function listarUsuarios() {
    var instrucaoSql = `
        SELECT
            u.id,
            u.nome,
            u.cpf,
            u.ativo,
            u.fk_perfil_acesso AS perfilId,
            p.nome AS perfilNome,
            u.fk_empresa AS empresaId,
            e.nome AS empresaNome,
            c.email,
            c.telefone
        FROM usuario u
            INNER JOIN perfil_acesso p
                ON p.id = u.fk_perfil_acesso
            LEFT JOIN empresa e
                ON e.id = u.fk_empresa
            LEFT JOIN contato c
                ON c.fk_usuario = u.id
        ORDER BY u.nome;
    `;

    return database.executar(instrucaoSql);
}

function buscarUsuarioPorCpf(cpf) {
    var instrucaoSql = `
        SELECT id
        FROM usuario
        WHERE cpf = ${sqlTexto(cpf)};
    `;

    return database.executar(instrucaoSql);
}

function buscarContatoPorEmail(email) {
    var instrucaoSql = `
        SELECT id
        FROM contato
        WHERE email = ${sqlTexto(email)};
    `;

    return database.executar(instrucaoSql);
}

function cadastrarUsuario(nome, cpf, senha, perfilId, empresaId) {
    var instrucaoSql = `
        INSERT INTO usuario (nome, cpf, senha, fk_perfil_acesso, fk_empresa)
        VALUES (${sqlTexto(nome)}, ${sqlTexto(cpf)}, ${sqlTexto(senha)}, ${sqlNumero(perfilId)}, ${sqlNumero(empresaId)});
    `;

    return database.executar(instrucaoSql);
}

function cadastrarContatoUsuario(email, telefone, usuarioId) {
    var instrucaoSql = `
        INSERT INTO contato (telefone, email, fk_usuario, fk_empresa)
        VALUES (${sqlTexto(telefone)}, ${sqlTexto(email)}, ${sqlNumero(usuarioId)}, NULL);
    `;

    return database.executar(instrucaoSql);
}

function atualizarAcesso(idUsuario, perfilId, empresaId) {
    var instrucaoSql = `
        UPDATE usuario
        SET fk_perfil_acesso = ${sqlNumero(perfilId)},
            fk_empresa = ${sqlNumero(empresaId)}
        WHERE id = ${sqlNumero(idUsuario)};
    `;

    return database.executar(instrucaoSql);
}

function listarEmpresas() {
    var instrucaoSql = `
        SELECT
            e.id,
            e.nome,
            e.razao_social AS razaoSocial,
            e.cnpj,
            c.email,
            c.telefone,
            endr.logradouro,
            endr.numero,
            endr.bairro,
            endr.cep,
            endr.cidade,
            endr.estado
        FROM empresa e
            LEFT JOIN contato c
                ON c.fk_empresa = e.id
            LEFT JOIN endereco endr
                ON endr.fk_empresa = e.id
        ORDER BY e.nome;
    `;

    return database.executar(instrucaoSql);
}

function buscarEmpresaPorCnpj(cnpj) {
    var instrucaoSql = `
        SELECT id
        FROM empresa
        WHERE cnpj = ${sqlTexto(cnpj)};
    `;

    return database.executar(instrucaoSql);
}

function cadastrarEmpresa(nome, razaoSocial, cnpj) {
    var instrucaoSql = `
        INSERT INTO empresa (nome, razao_social, cnpj)
        VALUES (${sqlTexto(nome)}, ${sqlTexto(razaoSocial)}, ${sqlTexto(cnpj)});
    `;

    return database.executar(instrucaoSql);
}

function cadastrarContatoEmpresa(email, telefone, empresaId) {
    var instrucaoSql = `
        INSERT INTO contato (telefone, email, fk_usuario, fk_empresa)
        VALUES (${sqlTexto(telefone)}, ${sqlTexto(email)}, NULL, ${sqlNumero(empresaId)});
    `;

    return database.executar(instrucaoSql);
}

function cadastrarEnderecoEmpresa(logradouro, numero, bairro, cep, cidade, estado, empresaId) {
    var instrucaoSql = `
        INSERT INTO endereco (logradouro, numero, bairro, cep, cidade, estado, fk_empresa, fk_fazenda)
        VALUES (${sqlTexto(logradouro)}, ${sqlTexto(numero)}, ${sqlTexto(bairro)}, ${sqlTexto(cep)}, ${sqlTexto(cidade)}, ${sqlTexto(estado)}, ${sqlNumero(empresaId)}, NULL);
    `;

    return database.executar(instrucaoSql);
}

function listarFazendas() {
    var instrucaoSql = `
        SELECT
            f.id,
            f.nome_fazenda AS nome,
            f.hectare,
            f.preco_saca AS precoSaca,
            f.quantidade_saca AS quantidadeSaca,
            f.fk_empresa AS empresaId,
            e.nome AS empresaNome,
            endr.logradouro,
            endr.numero,
            endr.bairro,
            endr.cep,
            endr.cidade,
            endr.estado
        FROM fazenda f
            INNER JOIN empresa e
                ON e.id = f.fk_empresa
            LEFT JOIN endereco endr
                ON endr.fk_fazenda = f.id
        ORDER BY f.nome_fazenda;
    `;

    return database.executar(instrucaoSql);
}

function cadastrarFazenda(nome, hectare, empresaId, precoSaca, quantidadeSaca) {
    var instrucaoSql = `
        INSERT INTO fazenda (nome_fazenda, hectare, fk_empresa, preco_saca, quantidade_saca)
        VALUES (${sqlTexto(nome)}, ${sqlNumero(hectare)}, ${sqlNumero(empresaId)}, ${sqlNumero(precoSaca)}, ${sqlNumero(quantidadeSaca)});
    `;

    return database.executar(instrucaoSql);
}

function cadastrarEnderecoFazenda(logradouro, numero, bairro, cep, cidade, estado, fazendaId) {
    var instrucaoSql = `
        INSERT INTO endereco (logradouro, numero, bairro, cep, cidade, estado, fk_empresa, fk_fazenda)
        VALUES (${sqlTexto(logradouro)}, ${sqlTexto(numero)}, ${sqlTexto(bairro)}, ${sqlTexto(cep)}, ${sqlTexto(cidade)}, ${sqlTexto(estado)}, NULL, ${sqlNumero(fazendaId)});
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    listarPerfis,
    listarUsuarios,
    buscarUsuarioPorCpf,
    buscarContatoPorEmail,
    cadastrarUsuario,
    cadastrarContatoUsuario,
    atualizarAcesso,
    listarEmpresas,
    buscarEmpresaPorCnpj,
    cadastrarEmpresa,
    cadastrarContatoEmpresa,
    cadastrarEnderecoEmpresa,
    listarFazendas,
    cadastrarFazenda,
    cadastrarEnderecoFazenda
};
