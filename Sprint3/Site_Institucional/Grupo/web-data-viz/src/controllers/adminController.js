var adminModel = require("../models/adminModel");

function limparTexto(valor) {
    if (valor === undefined || valor === null) {
        return "";
    }

    return String(valor).trim();
}

function limparOpcional(valor) {
    var texto = limparTexto(valor);
    return texto === "" ? null : texto;
}

function extrairNumero(valor) {
    if (valor === undefined || valor === null || valor === "") {
        return NaN;
    }

    return Number(valor);
}

function campoVazio(valor) {
    return limparTexto(valor) === "";
}

function listarPerfis(req, res) {
    adminModel.listarPerfis()
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao listar perfis." });
        });
}

function listarUsuarios(req, res) {
    adminModel.listarUsuarios()
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao listar usuarios." });
        });
}

function cadastrarUsuario(req, res) {
    var nome = limparTexto(req.body.nome);
    var cpf = limparTexto(req.body.cpf);
    var senha = limparTexto(req.body.senha);
    var email = limparTexto(req.body.email);
    var telefone = limparTexto(req.body.telefone);
    var perfilId = extrairNumero(req.body.perfilId);
    var empresaId = req.body.empresaId === "" || req.body.empresaId === undefined || req.body.empresaId === null ? null : Number(req.body.empresaId);

    if (campoVazio(nome)) {
        res.status(400).json({ mensagem: "Informe o nome do usuario." });
    } else if (campoVazio(cpf)) {
        res.status(400).json({ mensagem: "Informe o CPF do usuario." });
    } else if (campoVazio(senha)) {
        res.status(400).json({ mensagem: "Informe a senha do usuario." });
    } else if (campoVazio(email)) {
        res.status(400).json({ mensagem: "Informe o e-mail do usuario." });
    } else if (campoVazio(telefone)) {
        res.status(400).json({ mensagem: "Informe o telefone do usuario." });
    } else if (Number.isNaN(perfilId)) {
        res.status(400).json({ mensagem: "Informe o perfil de acesso." });
    } else if ((perfilId === 2 || perfilId === 3) && empresaId === null) {
        res.status(400).json({ mensagem: "Selecione a empresa para este perfil de usuario." });
    } else {
        adminModel.buscarUsuarioPorCpf(cpf)
            .then(function (usuariosEncontrados) {
                if (usuariosEncontrados.length > 0) {
                    res.status(409).json({ mensagem: "Já existe usuario com este CPF." });
                    return null;
                }

                return adminModel.buscarContatoPorEmail(email)
                    .then(function (contatosEncontrados) {
                        if (contatosEncontrados.length > 0) {
                            res.status(409).json({ mensagem: "Já existe contato com este e-mail." });
                            return null;
                        }

                        return adminModel.cadastrarUsuario(nome, cpf, senha, perfilId, empresaId)
                            .then(function (resultadoUsuario) {
                                var idUsuario = resultadoUsuario.insertId;
                                return adminModel.cadastrarContatoUsuario(email, telefone, idUsuario)
                                    .then(function () {
                                        res.status(201).json({ mensagem: "Usuario cadastrado com sucesso." });
                                    });
                            });
                    });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ mensagem: "Erro ao cadastrar usuario." });
            });
    }
}

function atualizarAcesso(req, res) {
    var idUsuario = Number(req.params.id);
    var perfilId = extrairNumero(req.body.perfilId);
    var empresaId = req.body.empresaId === "" || req.body.empresaId === undefined || req.body.empresaId === null ? null : Number(req.body.empresaId);

    if (Number.isNaN(idUsuario)) {
        res.status(400).json({ mensagem: "ID do usuario invalido." });
    } else if (Number.isNaN(perfilId)) {
        res.status(400).json({ mensagem: "Informe o perfil de acesso." });
    } else if ((perfilId === 2 || perfilId === 3) && empresaId === null) {
        res.status(400).json({ mensagem: "Selecione a empresa para este perfil de usuario." });
    } else {
        adminModel.atualizarAcesso(idUsuario, perfilId, empresaId)
            .then(function () {
                res.status(200).json({ mensagem: "Acesso atualizado com sucesso." });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ mensagem: "Erro ao atualizar o acesso." });
            });
    }
}

function editarUsuario(req, res) {
    var idUsuario = Number(req.params.id);
    var nome = limparTexto(req.body.nome);
    var cpf = limparTexto(req.body.cpf);
    var senha = limparTexto(req.body.senha);
    var email = limparTexto(req.body.email);
    var telefone = limparTexto(req.body.telefone);
    var perfilId = extrairNumero(req.body.perfilId);
    var empresaId = req.body.empresaId === "" || req.body.empresaId === undefined || req.body.empresaId === null ? null : Number(req.body.empresaId);

    if (Number.isNaN(idUsuario)) {
        res.status(400).json({ mensagem: "ID do usuario invalido." });
    } else if (campoVazio(nome)) {
        res.status(400).json({ mensagem: "Informe o nome do usuario." });
    } else if (campoVazio(cpf)) {
        res.status(400).json({ mensagem: "Informe o CPF do usuario." });
    } else if (campoVazio(senha)) {
        res.status(400).json({ mensagem: "Informe a senha do usuario." });
    } else if (campoVazio(email)) {
        res.status(400).json({ mensagem: "Informe o e-mail do usuario." });
    } else if (campoVazio(telefone)) {
        res.status(400).json({ mensagem: "Informe o telefone do usuario." });
    } else if (Number.isNaN(perfilId)) {
        res.status(400).json({ mensagem: "Informe o perfil de acesso." });
    } else if ((perfilId === 2 || perfilId === 3) && empresaId === null) {
        res.status(400).json({ mensagem: "Selecione a empresa para este perfil de usuario." });
    } else {
        adminModel.buscarUsuarioPorId(idUsuario)
            .then(function (usuariosEncontrados) {
                if (usuariosEncontrados.length === 0) {
                    res.status(404).json({ mensagem: "Usuario nao encontrado." });
                    return null;
                }

                return adminModel.buscarUsuarioPorCpf(cpf)
                    .then(function (cpfEncontrado) {
                        if (cpfEncontrado.length > 0 && Number(cpfEncontrado[0].id) !== idUsuario) {
                            res.status(409).json({ mensagem: "Ja existe usuario com este CPF." });
                            return null;
                        }

                        return adminModel.buscarContatoPorEmail(email)
                            .then(function (emailEncontrado) {
                                if (emailEncontrado.length > 0 && Number(emailEncontrado[0].id) !== idUsuario) {
                                    res.status(409).json({ mensagem: "Ja existe contato com este e-mail." });
                                    return null;
                                }

                                return adminModel.atualizarUsuario(idUsuario, nome, cpf, senha, perfilId, empresaId)
                                    .then(function () {
                                        return adminModel.atualizarContatoUsuario(email, telefone, idUsuario)
                                            .then(function (resultadoContato) {
                                                if (resultadoContato.affectedRows === 0) {
                                                    return adminModel.cadastrarContatoUsuario(email, telefone, idUsuario);
                                                }

                                                return resultadoContato;
                                            })
                                            .then(function () {
                                                res.status(200).json({ mensagem: "Usuario atualizado com sucesso." });
                                            });
                                    });
                            });
                    });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ mensagem: "Erro ao editar usuario." });
            });
    }
}

function excluirUsuario(req, res) {
    var idUsuario = Number(req.params.id);

    if (Number.isNaN(idUsuario)) {
        res.status(400).json({ mensagem: "ID do usuario invalido." });
    } else {
        adminModel.buscarUsuarioPorId(idUsuario)
            .then(function (usuariosEncontrados) {
                if (usuariosEncontrados.length === 0) {
                    res.status(404).json({ mensagem: "Usuario nao encontrado." });
                    return null;
                }

                return adminModel.deletarContatosUsuario(idUsuario)
                    .then(function () {
                        return adminModel.deletarUsuario(idUsuario);
                    })
                    .then(function () {
                        res.status(200).json({ mensagem: "Usuario excluido com sucesso." });
                    });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ mensagem: "Erro ao excluir usuario." });
            });
    }
}

function listarEmpresas(req, res) {
    adminModel.listarEmpresas()
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao listar empresas." });
        });
}

function cadastrarEmpresa(req, res) {
    var nome = limparTexto(req.body.nome);
    var razaoSocial = limparTexto(req.body.razaoSocial);
    var cnpj = limparTexto(req.body.cnpj);
    var email = limparOpcional(req.body.email);
    var telefone = limparOpcional(req.body.telefone);
    var logradouro = limparOpcional(req.body.logradouro);
    var numero = limparOpcional(req.body.numero);
    var bairro = limparOpcional(req.body.bairro);
    var cep = limparOpcional(req.body.cep);
    var cidade = limparOpcional(req.body.cidade);
    var estado = limparOpcional(req.body.estado);

    if (campoVazio(nome)) {
        res.status(400).json({ mensagem: "Informe o nome fantasia da empresa." });
    } else if (campoVazio(razaoSocial)) {
        res.status(400).json({ mensagem: "Informe a razao social da empresa." });
    } else if (campoVazio(cnpj)) {
        res.status(400).json({ mensagem: "Informe o CNPJ da empresa." });
    } else {
        adminModel.buscarEmpresaPorCnpj(cnpj)
            .then(function (empresasEncontradas) {
                if (empresasEncontradas.length > 0) {
                    res.status(409).json({ mensagem: "Ja existe empresa com este CNPJ." });
                    return null;
                }

                return adminModel.cadastrarEmpresa(nome, razaoSocial, cnpj)
                    .then(function (resultadoEmpresa) {
                        var idEmpresa = resultadoEmpresa.insertId;
                        var promessas = [];

                        if (email !== null || telefone !== null) {
                            promessas.push(adminModel.cadastrarContatoEmpresa(email, telefone, idEmpresa));
                        }

                        if (logradouro !== null || numero !== null || bairro !== null || cep !== null || cidade !== null || estado !== null) {
                            promessas.push(adminModel.cadastrarEnderecoEmpresa(logradouro, numero, bairro, cep, cidade, estado, idEmpresa));
                        }

                        return Promise.all(promessas)
                            .then(function () {
                                res.status(201).json({ mensagem: "Empresa cadastrada com sucesso." });
                            });
                    });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ mensagem: "Erro ao cadastrar empresa." });
            });
    }
}

function editarEmpresa(req, res) {
    var idEmpresa = Number(req.params.id);
    var nome = limparTexto(req.body.nome);
    var razaoSocial = limparTexto(req.body.razaoSocial);
    var cnpj = limparTexto(req.body.cnpj);
    var email = limparOpcional(req.body.email);
    var telefone = limparOpcional(req.body.telefone);
    var logradouro = limparOpcional(req.body.logradouro);
    var numero = limparOpcional(req.body.numero);
    var bairro = limparOpcional(req.body.bairro);
    var cep = limparOpcional(req.body.cep);
    var cidade = limparOpcional(req.body.cidade);
    var estado = limparOpcional(req.body.estado);

    if (Number.isNaN(idEmpresa)) {
        res.status(400).json({ mensagem: "ID da empresa invalido." });
    } else if (campoVazio(nome)) {
        res.status(400).json({ mensagem: "Informe o nome fantasia da empresa." });
    } else if (campoVazio(razaoSocial)) {
        res.status(400).json({ mensagem: "Informe a razao social da empresa." });
    } else if (campoVazio(cnpj)) {
        res.status(400).json({ mensagem: "Informe o CNPJ da empresa." });
    } else {
        adminModel.buscarEmpresaPorId(idEmpresa)
            .then(function (empresasEncontradas) {
                if (empresasEncontradas.length === 0) {
                    res.status(404).json({ mensagem: "Empresa nao encontrada." });
                    return null;
                }

                return adminModel.buscarEmpresaPorCnpj(cnpj)
                    .then(function (cnpjEncontrado) {
                        if (cnpjEncontrado.length > 0 && Number(cnpjEncontrado[0].id) !== idEmpresa) {
                            res.status(409).json({ mensagem: "Ja existe empresa com este CNPJ." });
                            return null;
                        }

                        return adminModel.atualizarEmpresa(idEmpresa, nome, razaoSocial, cnpj)
                            .then(function () {
                                return adminModel.atualizarContatoEmpresa(email, telefone, idEmpresa);
                            })
                            .then(function () {
                                return adminModel.atualizarEnderecoEmpresa(logradouro, numero, bairro, cep, cidade, estado, idEmpresa);
                            })
                            .then(function () {
                                res.status(200).json({ mensagem: "Empresa atualizada com sucesso." });
                            });
                    });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ mensagem: "Erro ao editar empresa." });
            });
    }
}

function excluirEmpresa(req, res) {
    var idEmpresa = Number(req.params.id);

    if (Number.isNaN(idEmpresa)) {
        res.status(400).json({ mensagem: "ID da empresa invalido." });
    } else {
        adminModel.buscarEmpresaPorId(idEmpresa)
            .then(function (empresasEncontradas) {
                if (empresasEncontradas.length === 0) {
                    res.status(404).json({ mensagem: "Empresa nao encontrada." });
                    return null;
                }

                return adminModel.deletarEmpresaCompleta(idEmpresa)
                    .then(function () {
                        res.status(200).json({ mensagem: "Empresa excluida com sucesso." });
                    });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ mensagem: "Erro ao excluir empresa." });
            });
    }
}

function listarFazendas(req, res) {
    adminModel.listarFazendas()
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ mensagem: "Erro ao listar fazendas." });
        });
}

function cadastrarFazenda(req, res) {
    var nome = limparTexto(req.body.nome);
    var empresaId = extrairNumero(req.body.empresaId);
    var hectare = extrairNumero(req.body.hectare);
    var logradouro = limparOpcional(req.body.logradouro);
    var numero = limparOpcional(req.body.numero);
    var bairro = limparOpcional(req.body.bairro);
    var cep = limparOpcional(req.body.cep);
    var cidade = limparOpcional(req.body.cidade);
    var estado = limparOpcional(req.body.estado);
    var precoSaca = req.body.precoSaca === undefined || req.body.precoSaca === null || req.body.precoSaca === "" ? 0 : Number(req.body.precoSaca);
    var quantidadeSaca = req.body.quantidadeSaca === undefined || req.body.quantidadeSaca === null || req.body.quantidadeSaca === "" ? 0 : Number(req.body.quantidadeSaca);

    if (campoVazio(nome)) {
        res.status(400).json({ mensagem: "Informe o nome da fazenda." });
    } else if (Number.isNaN(empresaId)) {
        res.status(400).json({ mensagem: "Selecione a empresa da fazenda." });
    } else if (Number.isNaN(hectare) || hectare <= 0) {
        res.status(400).json({ mensagem: "Informe uma area valida em hectares." });
    } else if (campoVazio(cidade)) {
        res.status(400).json({ mensagem: "Informe a cidade da fazenda." });
    } else {
        adminModel.cadastrarFazenda(nome, hectare, empresaId, precoSaca, quantidadeSaca)
            .then(function (resultadoFazenda) {
                var idFazenda = resultadoFazenda.insertId;
                if (logradouro === null && numero === null && bairro === null && cep === null && cidade === null && estado === null) {
                    res.status(201).json({ mensagem: "Fazenda cadastrada com sucesso." });
                    return null;
                }

                return adminModel.cadastrarEnderecoFazenda(logradouro, numero, bairro, cep, cidade, estado, idFazenda)
                    .then(function () {
                        res.status(201).json({ mensagem: "Fazenda cadastrada com sucesso." });
                    });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ mensagem: "Erro ao cadastrar fazenda." });
            });
    }
}

function editarFazenda(req, res) {
    var idFazenda = Number(req.params.id);
    var nome = limparTexto(req.body.nome);
    var empresaId = extrairNumero(req.body.empresaId);
    var hectare = extrairNumero(req.body.hectare);
    var logradouro = limparOpcional(req.body.logradouro);
    var numero = limparOpcional(req.body.numero);
    var bairro = limparOpcional(req.body.bairro);
    var cep = limparOpcional(req.body.cep);
    var cidade = limparOpcional(req.body.cidade);
    var estado = limparOpcional(req.body.estado);
    var precoSaca = req.body.precoSaca === undefined || req.body.precoSaca === null || req.body.precoSaca === "" ? 0 : Number(req.body.precoSaca);
    var quantidadeSaca = req.body.quantidadeSaca === undefined || req.body.quantidadeSaca === null || req.body.quantidadeSaca === "" ? 0 : Number(req.body.quantidadeSaca);

    if (Number.isNaN(idFazenda)) {
        res.status(400).json({ mensagem: "ID da fazenda invalido." });
    } else if (campoVazio(nome)) {
        res.status(400).json({ mensagem: "Informe o nome da fazenda." });
    } else if (Number.isNaN(empresaId)) {
        res.status(400).json({ mensagem: "Selecione a empresa da fazenda." });
    } else if (Number.isNaN(hectare) || hectare <= 0) {
        res.status(400).json({ mensagem: "Informe uma area valida em hectares." });
    } else if (campoVazio(cidade)) {
        res.status(400).json({ mensagem: "Informe a cidade da fazenda." });
    } else {
        adminModel.buscarFazendaPorId(idFazenda)
            .then(function (fazendasEncontradas) {
                if (fazendasEncontradas.length === 0) {
                    res.status(404).json({ mensagem: "Fazenda nao encontrada." });
                    return null;
                }

                return adminModel.atualizarFazenda(idFazenda, nome, hectare, empresaId, precoSaca, quantidadeSaca)
                    .then(function () {
                        return adminModel.atualizarEnderecoFazenda(logradouro, numero, bairro, cep, cidade, estado, idFazenda);
                    })
                    .then(function () {
                        res.status(200).json({ mensagem: "Fazenda atualizada com sucesso." });
                    });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ mensagem: "Erro ao editar fazenda." });
            });
    }
}

function excluirFazenda(req, res) {
    var idFazenda = Number(req.params.id);

    if (Number.isNaN(idFazenda)) {
        res.status(400).json({ mensagem: "ID da fazenda invalido." });
    } else {
        adminModel.buscarFazendaPorId(idFazenda)
            .then(function (fazendasEncontradas) {
                if (fazendasEncontradas.length === 0) {
                    res.status(404).json({ mensagem: "Fazenda nao encontrada." });
                    return null;
                }

                return adminModel.deletarFazendaCompleta(idFazenda)
                    .then(function () {
                        res.status(200).json({ mensagem: "Fazenda excluida com sucesso." });
                    });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ mensagem: "Erro ao excluir fazenda." });
            });
    }
}

module.exports = {
    listarPerfis,
    listarUsuarios,
    cadastrarUsuario,
    atualizarAcesso,
    editarUsuario,
    excluirUsuario,
    listarEmpresas,
    cadastrarEmpresa,
    editarEmpresa,
    excluirEmpresa,
    listarFazendas,
    cadastrarFazenda,
    editarFazenda,
    excluirFazenda
};
