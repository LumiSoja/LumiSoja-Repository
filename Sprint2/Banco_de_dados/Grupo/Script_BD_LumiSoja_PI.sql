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


-- NOSSOS ACESSOS:

-- Possível Cliente - Sem acesso aos dashboards e sensores
-- Cliente - Responsável por uma empresa cliente cadastrada
-- Funcionário - Funcionário de empresa cliente com acesso aos dashboards e alertas
-- Suporte - Funcionário da LumiSoja responsável pelo suporte e cadastros
-- Administrador - Administradores e desenvolvedores da LumiSoja
