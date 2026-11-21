CREATE DATABASE LumiSoja;
USE LumiSoja;

-- ==================== TABELAS ====================

CREATE TABLE perfil_acesso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    descricao VARCHAR(255) NOT NULL
);

CREATE TABLE empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    razao_social VARCHAR(45) NOT NULL,
    cnpj CHAR(14) NOT NULL UNIQUE
);

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    ativo TINYINT NOT NULL DEFAULT 1,
    fk_perfil_acesso INT NOT NULL,
    fk_empresa INT,

    CONSTRAINT fk_perfil_acesso
        FOREIGN KEY (fk_perfil_acesso)
        REFERENCES perfil_acesso(id),
    CONSTRAINT fk_empresa
        FOREIGN KEY (fk_empresa)
        REFERENCES empresa(id),
    CONSTRAINT chUsuarioAtivo
        CHECK (ativo IN (0, 1))
);

CREATE TABLE contato (
    id INT PRIMARY KEY AUTO_INCREMENT,
    telefone CHAR(11),
    email VARCHAR(65) UNIQUE,
    fk_usuario INT,
    fk_empresa INT,

    CONSTRAINT fk_usuario2_idx
        FOREIGN KEY (fk_usuario)
        REFERENCES usuario(id),
    CONSTRAINT fk_empresa2_idx
        FOREIGN KEY (fk_empresa)
        REFERENCES empresa(id)
);

CREATE TABLE fazenda (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_fazenda VARCHAR(45) NOT NULL,
    hectare DECIMAL(10,2) NOT NULL,
    fk_empresa INT NOT NULL,
    preco_saca INT NOT NULL,
    quantidade_saca INT NOT NULL,

    CONSTRAINT fk_empresa3_idx
        FOREIGN KEY (fk_empresa)
        REFERENCES empresa(id)
);

CREATE TABLE endereco (
    id INT PRIMARY KEY AUTO_INCREMENT,
    logradouro VARCHAR(100),
    numero VARCHAR(6),
    bairro VARCHAR(50),
    cep CHAR(8),
    cidade VARCHAR(45),
    estado VARCHAR(45),
    fk_empresa INT,
    fk_fazenda INT,

    CONSTRAINT fk_empresa4_idx
        FOREIGN KEY (fk_empresa)
        REFERENCES empresa(id),
    CONSTRAINT fk_fazenda_idx
        FOREIGN KEY (fk_fazenda)
        REFERENCES fazenda(id)
);

CREATE TABLE sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    identificacao VARCHAR(45) NOT NULL UNIQUE,
    setor VARCHAR(10) NOT NULL,
    coordenada VARCHAR(45) NOT NULL,
    ativo TINYINT NOT NULL,
    fk_fazenda INT,

    CONSTRAINT fk_fazenda2_idx
        FOREIGN KEY (fk_fazenda)
        REFERENCES fazenda(id),
    CONSTRAINT chSetor
        CHECK (setor IN ('leste', 'oeste', 'norte', 'sul'))
);

CREATE TABLE leitura_sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lux DECIMAL(10,2) NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_sensor INT,

    CONSTRAINT fk_sensor
        FOREIGN KEY (fk_sensor)
        REFERENCES sensor(id)
);

-- ==================== INSERTS ====================

-- 1 = Comum
-- 2 = Administrador
-- 3 = Funcionário
-- 4 = DEV comum
-- 5 = DEV administrador

INSERT INTO perfil_acesso (nome, descricao) VALUES
('Comum',
'Acesso às páginas públicas e ao simulador, sem acesso à dashboard ou à administração'),
('Administrador',
'Administrador da empresa cliente, com acesso à dashboard e ao cadastro de funcionários e administradores da própria empresa'),
('Funcionário',
'Funcionário de empresa cliente com acesso à dashboard, sem acesso à administração'),
('DEV comum',
'Desenvolvedor da LumiSoja com acesso ao sistema e ao cadastro de empresas e fazendas, sem poder retirar acesso de outros DEV'),
('DEV administrador',
'Desenvolvedor administrador da LumiSoja com acesso ao sistema, cadastro de empresas e fazendas e gestão dos demais DEV');

INSERT INTO empresa (nome, razao_social, cnpj) VALUES
('AgroVale', 'AgroVale Agropecuária Ltda', '12345678000190'),
('Soja Forte', 'Soja Forte Agrícola Ltda', '98765432000110'),
('Campo Verde', 'Campo Verde Produção Rural Ltda', '45678912000135');

INSERT INTO usuario (
    nome, senha, cpf, fk_perfil_acesso, fk_empresa
) VALUES
('Vinicius Oliveira', 'senha123', '12345678901', 1, NULL),
('Thiago Ishikawa', 'senha456', '23456789012', 2, 1),
('Gustavo Fermino', 'senha789', '34567890123', 3, 2);

INSERT INTO contato (
    telefone, email, fk_usuario, fk_empresa
) VALUES
('11987654321', 'vini@email.com', 1, NULL),
('11998765432', 'thiago@agrovale.com', 2, NULL),
('11999887766', 'gusta@sojaforte.com', 3, NULL),
('1134567890', 'contato@agrovale.com.br', NULL, 1),
('1135678901', 'contato@sojaforte.com.br', NULL, 2),
('1136789012', 'contato@campoverde.com.br', NULL, 3);

INSERT INTO fazenda (
    nome_fazenda, hectare, fk_empresa, preco_saca, quantidade_saca
) VALUES
('Fazenda Boa Vista', 1500.50, 1, 150, 45),
('Estância Progresso', 850.00, 1, 160, 40),
('Fazenda Sol Nascente', 3200.75, 2, 138, 50),
('Sítio AgroVerde', 410.10, 3, 166, 60),
('Fazenda Ouro Negro', 5000.00, 2, 145, 55);

INSERT INTO endereco (
    logradouro, numero, bairro, cep,
    cidade, estado, fk_empresa, fk_fazenda
) VALUES

-- ENDEREÇO FAZENDA BOA VISTA
(
    'Rodovia BR-163, Km 142', '100', 'Zona Rural',
    '78520000', 'Guarantã do Norte', 'Mato Grosso', 1, 1
),

-- ENDEREÇO FAZENDA ESTÂNCIA PROGRESSO
(
    'Estrada Vicinal do Cafezal', '450',
    'Distrito Industrial Agrícola',
    '86000000', 'Londrina', 'Paraná', 1, 2
),

-- ENDEREÇO FAZENDA SOL NASCENTE
(
    'Rodovia GO-341, Km 45', '250', 'Zona Rural',
    '75830000', 'Mineiros', 'Goiás', 2, 3
),

-- ENDEREÇO FAZENDA SÍTIO AGROVERDE
(
    'Estrada Municipal da Soja', '780', 'Área Rural',
    '98500000', 'Tenente Portela', 'Rio Grande do Sul', 3, 4
),

-- ENDEREÇO FAZENDA OURO NEGRO
(
    'Rodovia BR-020, Km 510', '1200', 'Gerais de Balsas',
    '65800000', 'Balsas', 'Maranhão', 2, 5
),

-- ENDEREÇO EMPRESA AGROVALE
(
    'Avenida Brigadeiro Faria Lima', '1485', 'Pinheiros',
    '01452002', 'São Paulo', 'São Paulo', 1, NULL
),

-- ENDEREÇO EMPRESA SOJA FORTE
(
    'Avenida Historiador Rubens de Mendonça', '2000', 'Alvorada',
    '78048340', 'Cuiabá', 'Mato Grosso', 2, NULL
),

-- ENDEREÇO EMPRESA CAMPO VERDE
(
    'Avenida Sete de Setembro', '320', 'Vila Industrial',
    '85851000', 'Foz do Iguaçu', 'Paraná', 3, NULL
);

INSERT INTO sensor (
    identificacao, setor, coordenada, ativo, fk_fazenda
) VALUES
('LDR_01', 'sul', '-23.5615 -46.6553', 1, 1),
('LDR_02', 'leste', '-27.6723 -51.8913', 0, 2),
('LDR_03', 'norte', '-18.2351 -40.2123', 1, 3),
('LDR_04', 'oeste', '-34.5625 -62.6554', 1, 4),
('LDR_05', 'leste', '-13.3695 -36.2757', 1, 5);

INSERT INTO leitura_sensor (lux, data_hora, fk_sensor) VALUES
(35000, NOW(), 1),
(36000, NOW(), 1),
(38000, NOW(), 2),
(39000, NOW(), 3),
(40000, NOW(), 4);

-- ==================== SELECTS ====================


/* Lista as fazendas e suas respectivas empresas */
SELECT
	fznd.nome_fazenda AS "Fazenda",
	emp.nome AS "Empresa",
	fznd.hectare AS "Área em hectares"
FROM fazenda fznd
JOIN empresa emp ON emp.id = fznd.fk_empresa;

/* Lista os usuários com seus respectivos perfis e empresas */
SELECT
	usr.nome AS "Usuário",
	pfa.nome AS "Perfil de acesso",
	emp.nome AS "Empresa"
FROM usuario usr
JOIN perfil_acesso pfa ON pfa.id = usr.fk_perfil_acesso
LEFT JOIN empresa emp ON emp.id = usr.fk_empresa
ORDER BY usr.nome;

/* Nome da empresa, contato e suas fazendas
   com os respectivos endereços */

SELECT
    emp.nome AS "Nome da empresa",
    ctt.telefone AS "Contato",
    ctt.email AS "Email",
    fznd.nome_fazenda AS "Fazenda",
    ende.logradouro AS "Rua da fazenda",
    ende.numero AS "Numero"
FROM empresa emp
JOIN contato ctt
    ON ctt.fk_empresa = emp.id
JOIN fazenda fznd
    ON fznd.fk_empresa = emp.id
JOIN endereco ende
    ON ende.fk_fazenda = fznd.id;


/* Indica a fazenda com seus respectivos sensores
   e dados capturados */

SELECT
    fznd.id AS "Id",
    fznd.nome_fazenda AS "Nome da fazenda",
    s.identificacao AS "Identificação do sensor",
    s.setor AS "Setor",
    s.coordenada AS "Coordenada",
    CASE
        WHEN s.ativo = 1 THEN "Sensor ligado"
        ELSE "Sensor desligado"
    END AS "Situação do sensor",
    ls.lux AS "lux"
FROM fazenda fznd
JOIN sensor s
    ON s.fk_fazenda = fznd.id
JOIN leitura_sensor ls
    ON ls.fk_sensor = s.id;
    
    
-- ============================================ --
    -- ============= VIEWS ================ --

-- ULTIMA LEITURA DE CADA SENSOR

CREATE VIEW vw_ultima_leitura_sensor AS
SELECT
    leituras.sensor_id,
    leituras.leitura_id,
    leituras.lux,
    leituras.data_hora
FROM (
    SELECT
        ls.fk_sensor AS sensor_id,
        ls.id AS leitura_id,
        ls.lux,
        ls.data_hora,
        ROW_NUMBER() OVER (
            PARTITION BY ls.fk_sensor
            ORDER BY ls.data_hora DESC, ls.id DESC
        ) AS posicao
    FROM leitura_sensor AS ls
) AS leituras
WHERE leituras.posicao = 1;


-- DADOS COMPLETOS DO SENSOR
-- Gravidade:
-- 3: perigo
-- 2: atenção
-- 1: ideal
-- 0: sem leitura válida

CREATE VIEW vw_dashboard_sensores AS
SELECT
    s.id AS sensor_id,
    s.identificacao,
    f.id AS fazenda_id,
    f.nome_fazenda,
    f.fk_empresa AS empresa_id,
    s.setor,
    s.coordenada,
    s.ativo,
    CASE
        WHEN s.ativo = 1 THEN u.lux
        ELSE NULL
    END AS lux,
    CASE
        WHEN s.ativo = 1 THEN u.data_hora
        ELSE NULL
    END AS data_hora,
    CASE
        WHEN s.ativo = 0 THEN 'desativado'
        WHEN u.lux IS NULL THEN 'sem_dados'
        WHEN u.lux < 15000 OR u.lux > 80000
            THEN 'perigo'
        WHEN u.lux <= 21500 OR u.lux >= 73500
            THEN 'atencao'
        ELSE 'ideal'
    END AS situacao,
    CASE
        WHEN s.ativo = 0 OR u.lux IS NULL THEN 0
        WHEN u.lux < 15000 OR u.lux > 80000 THEN 3
        WHEN u.lux <= 21500 OR u.lux >= 73500 THEN 2
        ELSE 1
    END AS gravidade
FROM sensor AS s
LEFT JOIN fazenda AS f
    ON f.id = s.fk_fazenda
LEFT JOIN vw_ultima_leitura_sensor AS u
    ON u.sensor_id = s.id;


-- RESUMO POR SETOR

CREATE VIEW vw_dashboard_setores AS
SELECT
    p.fazenda_id,
    p.nome_fazenda,
    p.empresa_id,
    p.setor,
    COUNT(*) AS total_sensores,
    SUM(CASE
        WHEN p.ativo = 1 THEN 1
        ELSE 0
    END) AS sensores_ativos,
    SUM(CASE
        WHEN p.ativo = 0 THEN 1
        ELSE 0
    END) AS sensores_desativados,
    SUM(CASE
        WHEN p.ativo = 1 AND p.lux IS NOT NULL
            THEN 1
        ELSE 0
    END) AS sensores_com_leitura,
    ROUND(AVG(p.lux), 2) AS media_lux,
    MAX(p.gravidade) AS maior_gravidade,
    CASE
        WHEN SUM(CASE
            WHEN p.ativo = 1 THEN 1
            ELSE 0
        END) = 0 THEN 'inativo'
        WHEN SUM(CASE
            WHEN p.ativo = 1 AND p.lux IS NOT NULL
                THEN 1
            ELSE 0
        END) = 0 THEN 'sem_dados'
        WHEN MAX(p.gravidade) = 3 THEN 'perigo'
        WHEN MAX(p.gravidade) = 2 THEN 'atencao'
        ELSE 'ideal'
    END AS situacao_setor
FROM vw_dashboard_sensores AS p
WHERE p.fazenda_id IS NOT NULL
GROUP BY
    p.fazenda_id,
    p.nome_fazenda,
    p.empresa_id,
    p.setor;


-- SITUAÇÃO GERAL DAS FAZENDAS

CREATE VIEW vw_dashboard_fazendas AS
SELECT
    f.id AS fazenda_id,
    f.nome_fazenda,
    f.fk_empresa AS empresa_id,
    COUNT(s.sensor_id) AS total_sensores,
    COUNT(DISTINCT s.setor) AS setores_monitorados,
    COUNT(CASE
        WHEN s.ativo = 0 THEN 1
    END) AS sensores_desativados,
    COUNT(CASE
        WHEN s.ativo = 1 AND s.lux IS NOT NULL
            THEN 1
    END) AS sensores_com_leitura,
    MAX(s.gravidade) AS maior_gravidade,
    CASE
        WHEN MAX(s.gravidade) = 3 THEN 'perigo'
        WHEN MAX(s.gravidade) = 2 THEN 'atencao'
        WHEN MAX(s.gravidade) = 1 THEN 'ideal'
        ELSE 'sem_dados'
    END AS situacao_geral
FROM fazenda AS f
LEFT JOIN vw_dashboard_sensores AS s
    ON s.fazenda_id = f.id
GROUP BY
    f.id,
    f.nome_fazenda,
    f.fk_empresa;


-- DISTRIBUIÇÃO DAS SITUAÇÕES

CREATE VIEW vw_dashboard_distribuicao AS
SELECT
    p.empresa_id,
    p.fazenda_id,
    p.nome_fazenda,
    p.setor,
    p.situacao,
    COUNT(*) AS quantidade_sensores
FROM vw_dashboard_sensores AS p
WHERE p.ativo = 1
    AND p.lux IS NOT NULL
    AND p.fazenda_id IS NOT NULL
GROUP BY
    p.empresa_id,
    p.fazenda_id,
    p.nome_fazenda,
    p.setor,
    p.situacao;


-- INDICADOR FINANCEIRO

CREATE VIEW vw_dashboard_financeiro AS
SELECT
    f.id AS fazenda_id,
    f.nome_fazenda,
    f.fk_empresa AS empresa_id,
    f.hectare,
    f.quantidade_saca AS sacas_por_hectare_hipotese,
    f.preco_saca,
    ROUND(
        f.hectare *
        f.quantidade_saca *
        f.preco_saca,
        2
    ) AS receita_bruta_potencial
FROM fazenda AS f;


-- SETORES INATIVOS

CREATE VIEW vw_kpi_inativos AS
SELECT
    empresa_id,
    fazenda_id,
    nome_fazenda,
    setor,
    1 AS setores_monitorados,
    CASE
        WHEN situacao_setor = 'inativo' THEN 1
        ELSE 0
    END AS setores_inativos,
    sensores_ativos,
    sensores_desativados,
    sensores_com_leitura
FROM vw_dashboard_setores;


-- LUMINOSIDADE MAIS DISCREPANTE
-- Menor luminosidade atual por fazenda e setor

CREATE VIEW vw_kpi_discrepancia AS
SELECT
    dados.sensor_id,
    dados.identificacao,
    dados.fazenda_id,
    dados.nome_fazenda,
    dados.empresa_id,
    dados.setor,
    dados.lux,
    dados.data_hora,
    dados.situacao
FROM (
    SELECT
        s.*,
        ROW_NUMBER() OVER (
            PARTITION BY s.fazenda_id, s.setor
            ORDER BY s.lux ASC, s.sensor_id ASC
        ) AS posicao
    FROM vw_dashboard_sensores AS s
    WHERE s.ativo = 1
        AND s.lux IS NOT NULL) AS dados
WHERE dados.posicao = 1;


-- PRODUTIVIDADE POR FAZENDA E SETOR

CREATE VIEW vw_produtividade_fazenda_setor AS
SELECT DISTINCT
    f.id AS fazenda_id,
    f.nome_fazenda,
    f.fk_empresa AS empresa_id,
    s.setor,
    f.hectare,
    f.quantidade_saca AS sacas_por_hectare,
    (f.hectare * f.quantidade_saca)
        AS sacas_estimadas
FROM fazenda AS f
JOIN sensor AS s
    ON s.fk_fazenda = f.id;


-- PRODUTIVIDADE MÉDIA POR SETOR

CREATE VIEW vw_produtividade_por_setor AS
SELECT
    setor,
    CASE
        WHEN SUM(hectare) = 0 THEN 0
        ELSE ROUND(
            SUM(sacas_estimadas) / SUM(hectare), 2)
    END AS media_sacas_hectare,
    COUNT(*) AS fazendas_consideradas
FROM vw_produtividade_fazenda_setor
GROUP BY setor;


-- DISTRIBUIÇÃO GERAL DAS SITUAÇÕES

CREATE VIEW vw_dashboard_distribuicao_geral AS
SELECT
    situacao,
    SUM(quantidade_sensores) AS total
FROM vw_dashboard_distribuicao
GROUP BY situacao;
