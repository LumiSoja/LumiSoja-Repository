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
numero INT,
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
posicionamento VARCHAR(45) NOT NULL,
ativo TINYINT NOT NULL,
fk_fazenda INT UNIQUE,
    CONSTRAINT fk_fazenda2_idx
		FOREIGN KEY (fk_fazenda) 
        REFERENCES fazenda(id)
);

CREATE TABLE leitura_sensor (
	id INT PRIMARY KEY AUTO_INCREMENT,
    lux DECIMAL(10,2) NOT NULL,
    data_hora DATETIME NOT NULL,
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

INSERT INTO sensor (identificacao, posicionamento, ativo, fk_fazenda) VALUES
('LDR_01', 'Setor Sul', 1, 1),
('LDR_02', 'Setor Leste', 0, 2),
('LDR_03', 'Setor Norte', 1, 3),
('LDR_04', 'Setor Noroeste', 1, 4),
('LDR_05', 'Setor Nordeste', 1, 5);

INSERT INTO leitura_sensor (lux, data_hora, fk_sensor) VALUES

(35000, NOW(), 1),
(36000, NOW(), 1),
(38000, NOW(), 2),
(39000, NOW(), 3),
(40000, NOW(), 4);