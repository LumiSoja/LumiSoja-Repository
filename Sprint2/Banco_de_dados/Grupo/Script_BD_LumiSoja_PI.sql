CREATE DATABASE soja_iot;
USE soja_iot;

-- TABELA EMPRESA
CREATE TABLE empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL,
    razao_social VARCHAR(50) NOT NULL UNIQUE,
    cnpj CHAR(14) UNIQUE NOT NULL,
    email_corporativo VARCHAR(60) NOT NULL UNIQUE,
    senha VARCHAR(45) NOT NULL,
    hectares DECIMAL(10,2) NOT NULL,
    logradouro VARCHAR(50)
);

-- TABELA FUNCIONÁRIO
CREATE TABLE funcionario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL,
    email_funcionario VARCHAR(60) NOT NULL UNIQUE,
    senha_funcionario VARCHAR(45) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    cargo VARCHAR(45),
    telefone CHAR(11), -- Com DDD
    fk_empresa INT,
    CONSTRAINT fk_funcionario 
        FOREIGN KEY (fk_empresa) 
        REFERENCES empresa(id)
);

-- TABELA FAZENDA
CREATE TABLE fazenda (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_fazenda VARCHAR(45) NOT NULL,
    logradouro VARCHAR(45) UNIQUE,
    qtd_sensores INT NOT NULL,
    fk_empresa INT,
    CONSTRAINT fk_fazendas 
        FOREIGN KEY (fk_empresa) 
        REFERENCES empresa(id)
);

-- TABELA SENSOR
CREATE TABLE sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    identificacao VARCHAR(45) NOT NULL,
    posicionamento VARCHAR(45),
    ativo BOOLEAN,
    fk_fazenda INT,
    CONSTRAINT fk_sensor 
        FOREIGN KEY (fk_fazenda) 
        REFERENCES fazenda(id)
);

-- TABELA LEITURA_LUMINOSIDADE
CREATE TABLE leitura_luminosidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lux DECIMAL(10,2) NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_sensor INT,
    CONSTRAINT fk_leitura_sensor 
        FOREIGN KEY (fk_sensor) 
        REFERENCES sensor(id)
);

-- ==================== INSERTS ====================

-- 1. EMPRESAS
INSERT INTO empresa (nome, razao_social, cnpj, email_corporativo, senha, hectares) VALUES
('Cargill', 'Cargill Agrícola S.A', '28544309000188', 'contato@cargill.com', 'senha123', 25000),
('Bom Futuro', 'Grupo Bom Futuro', '01196438000130', 'parceria.tech@bomfuturo.com.br', 'senha123', 600000),
('SLC Agrícola', 'SLC Agrícola S.A', '89692016000118', 'ri@slcagricola.com.br', 'senha123', 674000);

-- 2. FUNCIONÁRIOS
INSERT INTO funcionario (nome, cpf, email_funcionario, senha_funcionario, fk_empresa) VALUES
('Raquel Anjos', '01203345567', 'raquel.anjos@cargill.com', '12345678', 1),
('Maria Magalhães', '85567722245', 'maria.magalhaes@slcagricola.com', 'maria082018', 3),
('Angelina Souza', '15569923218', 'angelina.souza@bomfuturo.com.br', 'ang1798', 2),
('Julio Lucas', '39880102002', 'julio.lucas@slcagricola.com', 'jl18h207', 3),
('Kaio Luka', '95970504410', 'kaio.luka@bomfuturo.com.br', 'kl2874fh', 2),
('Pietra Antunes', '09581256008', 'pietra.antunes@cargill.com', 'bdbh56644', 1);

-- 3. FAZENDAS
INSERT INTO fazenda (nome_fazenda, logradouro, qtd_sensores, fk_empresa) VALUES
('Fazenda Planalto', 'Rodovia BR-163 Km 20, Sorriso-MT', 50, 1),
('Fazenda Mutum', 'Rodovia MT-235, Nova Mutum-MT', 150, 2),
('Fazenda Planeste', 'Balsas-MA, Zona Rural', 100, 3);

-- 4. SENSORES
INSERT INTO sensor (identificacao, posicionamento, ativo, fk_fazenda) VALUES
('LUMI-SS-01', 'Talhão 1 - Norte', TRUE, 1),
('LUMI-SS-02', 'Talhão A - Centro', TRUE, 2),
('LUMI-SS-01', 'Talhão Leste - Borda', FALSE, 3);

-- 5. LEITURAS
INSERT INTO leitura_luminosidade (lux, fk_sensor) VALUES
(35000, 1),
(36000, 1),
(37000, 1),
(48000, 2),
(50000, 2);

-- ==================== CONSULTAS RELACIONADAS ====================

SELECT 
    func.nome AS Nome_Funcionario, 
    func.email_funcionario AS Email, 
    emp.nome AS Empresa
FROM funcionario AS func
	JOIN empresa AS emp 
    ON func.fk_empresa = emp.id;

SELECT 
    emp.nome AS Nome_Empresa, 
    emp.hectares AS Hectares_Totais, 
    faz.nome_fazenda AS Fazenda, 
    faz.qtd_sensores AS Sensores_Contratados
FROM empresa AS emp
	LEFT JOIN fazenda AS faz 
    ON emp.id = faz.fk_empresa;
    
SELECT 
    faz.nome_fazenda AS Fazenda, 
    sen.identificacao AS ID_Sensor, 
    sen.posicionamento AS Local_Instalacao, 
    leit.lux AS Nivel_Luminosidade, 
    leit.data_hora AS Momento_Leitura
FROM leitura_luminosidade AS leit
	JOIN sensor AS sen 
    ON leit.fk_sensor = sen.id
	JOIN fazenda AS faz 
    ON sen.fk_fazenda = faz.id;
    