// Nesta etapa, todas as telas ficam abertas, sem login, servidor ou banco.
// As regras de perfis abaixo ficam preservadas para a implementação futura.
const MODO_ESTATICO = true;
const CHAVE_DADOS = 'lumisoja_site_v1';
const CHAVE_SESSAO = 'lumisoja_usuario';
const PERFIS = { comum: 'Comum', funcionario: 'Funcionário', administrador: 'Administrador', dev: 'DEV comum', dev_admin: 'DEV administrador' };

// Se o navegador não permitir salvar dados em arquivos locais, a tela ainda abre.
let dadosTemporarios = null;
function lerDados() {
    try { return JSON.parse(localStorage.getItem(CHAVE_DADOS) || dadosTemporarios); }
    catch (erro) { return JSON.parse(dadosTemporarios); }
}
function salvarDados(dados) {
    dadosTemporarios = JSON.stringify(dados);
    try { localStorage.setItem(CHAVE_DADOS, dadosTemporarios); }
    catch (erro) { /* A demonstração continua apenas na memória desta página. */ }
}
function ehDev(usuario) { return usuario && (usuario.perfil === 'dev' || usuario.perfil === 'dev_admin'); }
function podeDashboard(usuario) { return usuario && usuario.perfil !== 'comum' && Boolean(PERFIS[usuario.perfil]); }
function podeAdministrar(usuario) { return usuario && (usuario.perfil === 'administrador' || ehDev(usuario)); }
function textoSeguro(texto) {
    return String(texto == null ? '' : texto).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function usuarioLogado() {
    // Ator fictício para demonstrar os formulários; não cria uma sessão de login.
    if (MODO_ESTATICO) return { id: 0, nome: 'Visualização demonstrativa', perfil: 'dev_admin', empresaId: null, ativo: true };
    const id = Number(sessionStorage.getItem(CHAVE_SESSAO));
    return lerDados().usuarios.find(function (usuario) { return usuario.id === id && usuario.ativo; }) || null;
}

function exigirAcesso(tipo) {
    if (MODO_ESTATICO) return true;
    const usuario = usuarioLogado();
    if (!usuario) { window.location.replace('login.html'); return false; }
    if ((tipo === 'dashboard' && !podeDashboard(usuario)) || (tipo === 'admin' && !podeAdministrar(usuario))) {
        window.location.replace('index.html?acesso=negado');
        return false;
    }
    return true;
}

function novoId(lista) {
    return lista.reduce(function (maior, item) { return Math.max(maior, item.id); }, 0) + 1;
}

function registrarAcao(dados, acao, alvo) {
    const usuario = usuarioLogado();
    dados.historico.push({ usuarioId: usuario ? usuario.id : null, acao: acao, alvoId: alvo, data: new Date().toISOString() });
}

function validarCadastro(pessoa, senha, confirmacao) {
    pessoa.nome = pessoa.nome.trim();
    pessoa.email = pessoa.email.trim().toLowerCase();
    pessoa.cpf = pessoa.cpf.replace(/\D/g, '');
    pessoa.telefone = pessoa.telefone.replace(/\D/g, '');
    if (pessoa.nome.length < 3) throw new Error('Informe o nome completo.');
    if (!/^\d{11}$/.test(pessoa.cpf)) throw new Error('O CPF deve ter 11 números.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pessoa.email)) throw new Error('Informe um e-mail válido.');
    if (!/^\d{10,11}$/.test(pessoa.telefone)) throw new Error('O telefone deve ter 10 ou 11 números, incluindo o DDD.');
    if (MODO_ESTATICO) return;
    if (senha.length < 8 || !/[A-Z]/.test(senha) || !/[0-9]/.test(senha) || !/[^a-zA-Z0-9\s]/.test(senha)) {
        throw new Error('Use uma senha com 8 caracteres ou mais, letra maiúscula, número e símbolo.');
    }
    if (senha !== confirmacao) throw new Error('As senhas não conferem.');
}

// Não grava a senha em texto puro. Isso não torna um protótipo no navegador seguro para produção.
async function hashDaSenha(senha, sal) {
    if (!window.crypto || !window.crypto.subtle) throw new Error('Abra o projeto pelo Live Server em localhost para testar o login.');
    const codificador = new TextEncoder();
    const chave = await crypto.subtle.importKey('raw', codificador.encode(senha), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: codificador.encode(sal), iterations: 100000, hash: 'SHA-256' }, chave, 256);
    return Array.from(new Uint8Array(bits)).map(function (numero) { return numero.toString(16).padStart(2, '0'); }).join('');
}

function validarPermissaoCadastro(ator, perfil, empresaId, dados) {
    if (!PERFIS[perfil]) throw new Error('Perfil inválido.');
    if (!ator) {
        if (perfil !== 'comum' || empresaId !== null) throw new Error('O cadastro público cria somente usuários comuns.');
    } else {
        if (!podeAdministrar(ator)) throw new Error('Você não pode cadastrar usuários pela administração.');
        if (!ehDev(ator) && (!['funcionario', 'administrador'].includes(perfil) || empresaId !== ator.empresaId)) throw new Error('Cadastre apenas funcionários ou administradores da sua empresa.');
        if (['dev', 'dev_admin'].includes(perfil) && ator.perfil !== 'dev_admin') throw new Error('Somente DEV administrador pode cadastrar outros DEV.');
    }
    if (['funcionario', 'administrador'].includes(perfil) && !dados.empresas.some(function (empresa) { return empresa.id === empresaId; })) throw new Error('Selecione a empresa do usuário.');
    if (['comum', 'dev', 'dev_admin'].includes(perfil) && empresaId !== null) throw new Error('Este perfil não deve ser vinculado a uma empresa.');
}

async function cadastrarUsuario(pessoa, senha, confirmacao, cadastroPublico) {
    validarCadastro(pessoa, senha, confirmacao);
    let dados = lerDados();
    let ator = cadastroPublico ? null : usuarioLogado();
    if (cadastroPublico) { pessoa.perfil = 'comum'; pessoa.empresaId = null; }
    validarPermissaoCadastro(ator, pessoa.perfil, pessoa.empresaId, dados);
    if (dados.usuarios.some(function (usuario) { return usuario.email === pessoa.email || usuario.cpf === pessoa.cpf; })) throw new Error('E-mail ou CPF já cadastrado.');
    // No modo estático não há autenticação e nenhuma senha é gravada.
    let sal = null;
    let hash = null;
    if (!MODO_ESTATICO) {
        sal = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(function (numero) { return numero.toString(16).padStart(2, '0'); }).join('');
        hash = await hashDaSenha(senha, sal);
    }
    // Revalida depois da operação assíncrona para respeitar alterações em outra aba.
    dados = lerDados();
    ator = cadastroPublico ? null : usuarioLogado();
    validarPermissaoCadastro(ator, pessoa.perfil, pessoa.empresaId, dados);
    if (!cadastroPublico && !ator) throw new Error('Entre novamente antes de cadastrar.');
    if (dados.usuarios.some(function (usuario) { return usuario.email === pessoa.email || usuario.cpf === pessoa.cpf; })) throw new Error('E-mail ou CPF já cadastrado.');
    const id = novoId(dados.usuarios);
    dados.usuarios.push({ id: id, nome: pessoa.nome, cpf: pessoa.cpf, email: pessoa.email, telefone: pessoa.telefone, perfil: pessoa.perfil, empresaId: pessoa.empresaId, ativo: true, sal: sal, senhaHash: hash });
    registrarAcao(dados, 'Cadastrar usuário', id);
    salvarDados(dados);
    return id;
}

async function entrar(email, senha) {
    const usuario = lerDados().usuarios.find(function (item) { return item.ativo && item.email === email.trim().toLowerCase(); });
    if (!usuario || await hashDaSenha(senha, usuario.sal) !== usuario.senhaHash) throw new Error('E-mail ou senha incorretos.');
    const atual = lerDados().usuarios.find(function (item) { return item.id === usuario.id && item.ativo; });
    if (!atual) throw new Error('Esta conta não está disponível.');
    sessionStorage.setItem(CHAVE_SESSAO, String(atual.id));
    return atual;
}

function usuariosVisiveis() {
    const ator = usuarioLogado();
    if (!podeAdministrar(ator)) return [];
    return lerDados().usuarios.filter(function (usuario) {
        return usuario.ativo && (ehDev(ator) || (!ehDev(usuario) && usuario.empresaId === ator.empresaId));
    });
}

function podeDesativar(ator, alvo) {
    if (!ehDev(ator) || !alvo || !alvo.ativo || ator.id === alvo.id) return false;
    if (ehDev(alvo) && ator.perfil !== 'dev_admin') return false;
    if (alvo.perfil === 'dev_admin' && lerDados().usuarios.filter(function (u) { return u.ativo && u.perfil === 'dev_admin'; }).length <= 1) return false;
    return true;
}

function desativarUsuario(id) {
    const dados = lerDados();
    const alvo = dados.usuarios.find(function (usuario) { return usuario.id === id; });
    if (!podeDesativar(usuarioLogado(), alvo)) throw new Error('Você não pode desativar este usuário.');
    alvo.ativo = false;
    registrarAcao(dados, 'Desativar usuário', id);
    salvarDados(dados);
}

function alterarAcessoUsuario(id, perfil, empresaId) {
    const ator = usuarioLogado();
    const dados = lerDados();
    const alvo = dados.usuarios.find(function (usuario) { return usuario.id === id && usuario.ativo; });
    if (!ehDev(ator) || !alvo) throw new Error('Você não pode alterar este acesso.');
    if (ehDev(alvo) && ator.perfil !== 'dev_admin') throw new Error('Somente DEV administrador pode alterar perfis DEV.');
    if (ator.id === alvo.id) throw new Error('Outro DEV administrador deve alterar seu acesso.');
    if (alvo.perfil === 'dev_admin' && perfil !== 'dev_admin' && dados.usuarios.filter(function (usuario) { return usuario.ativo && usuario.perfil === 'dev_admin'; }).length <= 1) throw new Error('O sistema precisa manter um DEV administrador ativo.');
    validarPermissaoCadastro(ator, perfil, empresaId, dados);
    alvo.perfil = perfil;
    alvo.empresaId = empresaId;
    registrarAcao(dados, 'Alterar acesso do usuário', id);
    salvarDados(dados);
}

function cadastrarEmpresa(empresa) {
    if (!ehDev(usuarioLogado())) throw new Error('Somente DEV pode cadastrar empresas.');
    const dados = lerDados();
    empresa.nome = empresa.nome.trim();
    empresa.razaoSocial = empresa.razaoSocial.trim();
    empresa.cnpj = empresa.cnpj.replace(/\D/g, '');
    if (!empresa.nome || !empresa.razaoSocial || !/^\d{14}$/.test(empresa.cnpj)) throw new Error('Informe nome, razão social e CNPJ com 14 números.');
    if (dados.empresas.some(function (item) { return item.cnpj === empresa.cnpj; })) throw new Error('Este CNPJ já está cadastrado.');
    empresa.id = novoId(dados.empresas);
    dados.empresas.push(empresa);
    registrarAcao(dados, 'Cadastrar empresa', empresa.id);
    salvarDados(dados);
}

function cadastrarFazenda(fazenda) {
    if (!ehDev(usuarioLogado())) throw new Error('Somente DEV pode cadastrar fazendas.');
    const dados = lerDados();
    fazenda.nome = fazenda.nome.trim();
    fazenda.cidade = fazenda.cidade.trim();
    if (!fazenda.nome || !fazenda.cidade || !Number.isFinite(fazenda.hectares) || fazenda.hectares <= 0) throw new Error('Informe nome, cidade/UF e uma área maior que zero.');
    if (!dados.empresas.some(function (empresa) { return empresa.id === fazenda.empresaId; })) throw new Error('Selecione uma empresa cadastrada.');
    fazenda.id = novoId(dados.fazendas);
    fazenda.leituras = [null, null, null, null];
    // Cadastro não inventa sensores: os sensores serão associados na integração com o banco.
    fazenda.semSensores = true;
    dados.fazendas.push(fazenda);
    registrarAcao(dados, 'Cadastrar fazenda', fazenda.id);
    salvarDados(dados);
}

function fazendasPermitidas() {
    const ator = usuarioLogado();
    if (!podeDashboard(ator)) return [];
    return lerDados().fazendas.filter(function (fazenda) { return ehDev(ator) || fazenda.empresaId === ator.empresaId; });
}

function prepararDemonstracao() {
    if (lerDados()) return;
    const usuarios = [
        { id: 1, nome: 'Visitante de exemplo', email: 'comum@lumisoja.teste', perfil: 'comum', empresaId: null },
        { id: 2, nome: 'Thiago de exemplo', email: 'funcionario@agrovale.teste', perfil: 'funcionario', empresaId: 1 },
        { id: 3, nome: 'Vinicius de exemplo', email: 'admin@agrovale.teste', perfil: 'administrador', empresaId: 1 },
        { id: 4, nome: 'DEV de exemplo', email: 'dev@lumisoja.teste', perfil: 'dev', empresaId: null },
        { id: 5, nome: 'DEV administrador de exemplo', email: 'devadmin@lumisoja.teste', perfil: 'dev_admin', empresaId: null },
        { id: 6, nome: 'Administrador Soja Forte', email: 'admin@sojaforte.teste', perfil: 'administrador', empresaId: 2 }
    ];
    usuarios.forEach(function (usuario) {
        usuario.cpf = String(10000000000 + usuario.id);
        usuario.telefone = '11999999999';
        usuario.ativo = true;
        usuario.sal = 'demonstracao-lumisoja';
        usuario.senhaHash = '57ecf6ced78de2e0b7bac7b20957958541bfee4f9eee730b332c73be7d502b45';
    });
    salvarDados({
        usuarios: usuarios,
        empresas: [
            { id: 1, nome: 'AgroVale', razaoSocial: 'AgroVale Agropecuária Ltda', cnpj: '12345678000190' },
            { id: 2, nome: 'Soja Forte', razaoSocial: 'Soja Forte Agrícola Ltda', cnpj: '98765432000110' },
            { id: 3, nome: 'Campo Verde', razaoSocial: 'Campo Verde Produção Rural Ltda', cnpj: '45678912000135' }
        ],
        fazendas: [
            { id: 1, empresaId: 1, nome: 'Fazenda Boa Vista', hectares: 1500.50, cidade: 'Guarantã do Norte · MT', latitude: -9.7875, longitude: -54.9120, leituras: [34250, 38500, 13000, null] },
            { id: 2, empresaId: 1, nome: 'Estância Progresso', hectares: 850, cidade: 'Londrina · PR', latitude: -23.3045, longitude: -51.1696, leituras: [28500, 30500, 32500, 26500] },
            { id: 3, empresaId: 2, nome: 'Fazenda Sol Nascente', hectares: 3200.75, cidade: 'Mineiros · GO', latitude: -17.5694, longitude: -52.5510, leituras: [74500, 62000, 54000, 57000] },
            { id: 4, empresaId: 3, nome: 'Sítio AgroVerde', hectares: 410.10, cidade: 'Tenente Portela · RS', latitude: -27.3711, longitude: -53.7580, leituras: [19500, 26000, null, 31000] },
            { id: 5, empresaId: 2, nome: 'Fazenda Ouro Negro', hectares: 5000, cidade: 'Balsas · MA', latitude: -7.5325, longitude: -46.0356, leituras: [83500, null, 51000, 46000] }
        ],
        historico: []
    });
}

prepararDemonstracao();
