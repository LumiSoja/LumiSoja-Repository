CREATE DATABASE LumiSoja;
USE LumiSoja;

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
    senha VARCHAR(45) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    fk_perfil_acesso INT NOT NULL,
    fk_empresa INT,
    INDEX fk_perfil_acesso_idx (fk_perfil_acesso),
    CONSTRAINT fk_perfil_acesso FOREIGN KEY (fk_perfil_acesso) REFERENCES perfil_acesso(id),
    INDEX fk_empresa_idx (fk_empresa),
    CONSTRAINT fk_empresa FOREIGN KEY (fk_empresa) REFERENCES empresa(id)
);

CREATE TABLE contato (
id INT PRIMARY KEY AUTO_INCREMENT,
telefone CHAR(11),
email VARCHAR(65),
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
fk_fazenda INT UNIQUE,
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
    INDEX fk_sensor_idx (fk_sensor),
    CONSTRAINT fk_sensor FOREIGN KEY (fk_sensor) REFERENCES sensor(id)
);


-- ==================== INSERTS ====================


INSERT INTO perfil_acesso (nome, descricao) VALUES
('Possível Cliente', 'Sem acesso aos dashboards e sensores'),
('Cliente', 'Responsável por uma empresa cliente cadastrada'),
('Funcionário', 'Funcionário de empresa cliente com acesso aos dashboards e alertas'),
('Suporte', 'Funcionário da LumiSoja responsável pelo suporte e cadastros'),
('Administrador', 'Administradores e desenvolvedores da LumiSoja');

INSERT INTO empresa (nome, razao_social, cnpj) VALUES
('AgroVale', 'AgroVale Agropecuária Ltda', '12345678000190'),
('Soja Forte', 'Soja Forte Agrícola Ltda', '98765432000110'),
('Campo Verde', 'Campo Verde Produção Rural Ltda', '45678912000135');

INSERT INTO usuario (nome, senha, cpf, fk_perfil_acesso, fk_empresa) VALUES
('Vinicius Oliveira', 'senha123', '12345678901', 1, NULL),
('Thiago Ishikawa', 'senha456', '23456789012', 2, 1),
('Gustavo Fermino', 'senha789', '34567890123', 3, 2);

INSERT INTO contato (telefone, email, fk_usuario, fk_empresa) VALUES
('11987654321', 'vini@email.com', 1, NULL),
('11998765432', 'thiago@agrovale.com', 2, NULL),
('11999887766', 'gusta@sojaforte.com', 3, NULL),
('1134567890', 'contato@agrovale.com.br', NULL, 1),
('1135678901', 'contato@sojaforte.com.br', NULL, 2),
('1136789012', 'contato@campoverde.com.br', NULL, 3);

INSERT INTO fazenda (nome_fazenda, hectare, fk_empresa) VALUES
('Fazenda Boa Vista', 1500.50, 1),
('Estância Progresso', 850.00, 1),
('Fazenda Sol Nascente', 3200.75, 2),
('Sítio AgroVerde', 410.10, 3),
('Fazenda Ouro Negro', 5000.00, 2);

INSERT INTO endereco (logradouro, numero, bairro, cep, cidade, estado, fk_empresa, fk_fazenda) VALUES

-- ENDEREÇO FAZENDA BOA VISTA
('Rodovia BR-163, Km 142', NULL, 'Zona Rural', '78520000', 'Garantã do Norte', 'Mato Grosso', 1, 1),

-- ENDEREÇO FAZENDA ESTÂNCIA PROGRESSO
('Estrada Vicinal do Cafezal, S/N', NULL, 'Distrito Industrial Agrícola', '86000000', 'Londrina', 'Paraná', 1, 2),

-- ENDEREÇO FAZENDA SOL NASCENTE
('Rodovia GO-341, Km 45', '250', 'Zona Rural', '75830000', 'Mineiros', 'Goiás', 2, 3),

-- ENDEREÇO FAZENDA SÍTIO AGROVERDE
('Estrada Municipal da Soja, S/N', NULL, 'Área Rural', '98500000', 'Tenente Portela', 'Rio Grande do Sul', 3, 4),

-- ENDEREÇO FAZENDA OURO NEGRO
('Rodovia BR-020, Km 510', NULL, 'Gerais de Balsas', '65800000', 'Balsas', 'Maranhão', 2, 5),

-- ENDEREÇO EMPRESA AGROVALE
('Avenida Brigadeiro Faria Lima', '1485', 'Pinheiros', '01452002', 'São Paulo', 'São Paulo', 1, NULL),

-- ENDEREÇO EMPRESA SOJA FORTE
('Avenida Historiador Rubens de Mendonça', '2000', 'Alvorada','78048340', 'Cuiabá', 'Mato Grosso', 2, NULL),

-- ENDEREÇO EMPRESA CAMPO VERDE
('Avenida Sete de Setembro', '320', 'Vila Industrial', '85851000', 'Foz do Iguaçu', 'Paraná', 3, NULL);


INSERT INTO sensor (identificacao, setor, coordenada, ativo, fk_fazenda) VALUES
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


/* Indica o nome da empresa, suas credenciais de contato e suas fazendas 
correspondentes junto ao endereço das fazendas */
SELECT emp.nome "Nome da empresa", ctt.telefone "Contato", ctt.email "Email", 
fznd.nome_Fazenda "Fazenda", ende.logradouro "Rua da fazenda", ende.numero "Numero"
FROM empresa emp JOIN contato ctt ON ctt.fk_Empresa = emp.id
JOIN endereco ende ON ende.fk_empresa = emp.id
JOIN fazenda fznd ON fznd.fk_Empresa = emp.id
JOIN endereco ON ende.fk_Fazenda = fznd.id;

/* Indica a fazenda com seus respectivos sensores e dados capturados */
SELECT fznd.id "Id", fznd.nome_fazenda "Nome da fazenda", s.identificacao "Identificação do sensor",
 s.setor "Setor", s.coordenada "Coordenada", 
 CASE 
	WHEN s.ativo = 1 THEN "Sensor ligado"
	ELSE "Sensor desligado"
 END AS "Situação do sensor" , ls.lux "lux"
FROM fazenda fznd JOIN sensor s ON s.fk_Fazenda = fznd.id
JOIN leitura_sensor ls ON ls.fk_sensor = s.id;