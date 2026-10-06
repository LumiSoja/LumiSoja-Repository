CREATE TABLE perfil_acesso (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL, 
    descricao VARCHAR(255) NOT NULL
);

CREATE TABLE empresa (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    razao_social VARCHAR(45) NOT NULL,
    cnpj CHAR(14) NOT NULL UNIQUE,
    email_corporativo VARCHAR(70) NOT NULL UNIQUE,
    logradouro VARCHAR(45) NOT NULL
);

CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE,
    senha VARCHAR(45) NOT NULL,
    telefone CHAR(11) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    fk_perfil_acesso INT,
    fk_empresa INT,
    INDEX fk_perfil_acesso_idx (fk_perfil_acesso),
    CONSTRAINT fk_perfil_acesso FOREIGN KEY (fk_perfil_acesso) REFERENCES perfil_acesso(id),
    INDEX fk_empresa_idx (fk_empresa),
    CONSTRAINT fk_empresa FOREIGN KEY (fk_empresa) REFERENCES empresa(id)
);

CREATE TABLE fazenda (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome_fazenda VARCHAR(45) NOT NULL,
    logradouro VARCHAR(45) NOT NULL,
    hectare DECIMAL(10,2) NOT NULL,
    fk_empresa INT,
    INDEX fk_empresa_idx (fk_empresa),
    CONSTRAINT fk_empresa FOREIGN KEY (fk_empresa) REFERENCES emmpresa(id)
);

CREATE TABLE sensor (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome_sensor VARCHAR(45) NOT NULL UNIQUE,
    localizacao VARCHAR(45) NOT NULL,
    ativo TINYINT NOT NULL,
    fk_fazenda INT UNIQUE,
    INDEX fk_fazenda_idx (fk_fazenda),
    CONSTRAINT fk_fazenda FOREIGN KEY (fk_fazenda) REFERENCES fazenda(id)
);

CREATE TABLE leitura_sensor (
	id INT PRIMARY KEY AUTO_INCREMENT,
    lux DECIMAL(10,2) NOT NULL,
    data_hora DATETIME NOT NULL,
    fk_sensor INT,
    INDEX fk_sensor_idx (fk_sensor),
    CONSTRAINT fk_sensor FOREIGN KEY (fk_sensor) REFERENCES sensor(id)
);
