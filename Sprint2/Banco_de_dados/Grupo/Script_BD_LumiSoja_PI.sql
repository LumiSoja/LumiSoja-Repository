CREATE DATABASE soja_iot;
USE soja_iot;

-- TABELA EMPRESA
CREATE TABLE empresa (
	idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(45),
	razao_social VARCHAR(45) UNIQUE,
	cnpj CHAR(14),
	email_corporativo VARCHAR(50) UNIQUE,
	senha VARCHAR(45),
	hectares DECIMAL(10,2)
);

-- TABELA FUNCIONÁRIO
CREATE TABLE funcionario (
	idFuncionario INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(45),
	email_funcionario VARCHAR(45) UNIQUE,
	senha_funcionario VARCHAR(45),
	cpf CHAR(11) UNIQUE,
	fk_empresa INT,
	INDEX fk_funcionario_cadastro_idx (fk_empresa),
	CONSTRAINT fk_funcionario FOREIGN KEY (fk_empresa) REFERENCES empresa(idEmpresa)
);

-- TABELA FAZENDA
CREATE TABLE fazenda (
	idFazenda INT PRIMARY KEY AUTO_INCREMENT,
    nome_fazenda VARCHAR(45),
    endereco VARCHAR(45) UNIQUE,
    qtd_sensores INT,
    fk_empresa INT,
    INDEX fk_fazendas_empresa1_idx (fk_empresa),
    CONSTRAINT fk_fazendas FOREIGN KEY (fk_empresa) REFERENCES empresa(idEmpresa)
);

-- TABELA SENSOR
CREATE TABLE sensor (
idSensor INT PRIMARY KEY AUTO_INCREMENT,
identificacao VARCHAR(45),
posicionamento VARCHAR(45),
lux DECIMAL(10,2),
ativo TINYINT,
data_hora DATETIME,
fk_fazenda INT,
INDEX fk_sensor_fazenda1_idx (fk_fazenda),
CONSTRAINT fk_sensor FOREIGN KEY (fk_fazenda) REFERENCES fazenda(idFazenda)
);

INSERT INTO empresa (razao_social, cnpj, email_institucional, hectares) VALUES
('Gardill', '28544309000188', 'Gardill@gardill.com', 25),
('Grupo Bom Futuro', '01196438000130', 'parceria.tech@bomfuturo.com.br', 600),
('SLC Agrícola', '89692016000118', 'ri@slcagricola.com.br', 674);

INSERT INTO usuario (nome_usuario, cpf, email, senha, fk_empresa) VALUES
('Raquel Anjos', '01203345567','RaquelAnjos@gardill.com', '12345678', '1'),
('Maria Magalhães', '85567722245','MariaMagalhães@gardill.com', 'maria082018', '3'),
('Angelina Souza', '15569923218','AngelinaSouza@gardill.com', 'ang1798', '2'),
('Julio Lucas', '39880102002','JulioLucas@gardill.com', 'jl18h207', '3'),
('Kaio Luka', '9597050441','KaioLuka@gardill.com', 'kl2874fh', '2'),
('Pietra Antunes', '09581256008','PietraAntunes@gardill.com', 'bdbh56644', '1'),
('Alexandre Pietro', '62587598079','AlexandrePietro@gardill.com', '1783647688', '1');

INSERT INTO sensor_gardill (status_sensor, local_instalado) VALUES
(TRUE, 'área 01'),
(FALSE, 'área 02');

INSERT INTO lux_gardill (data_hora, qtd_lux) VALUES
(DEFAULT, 35000),
(DEFAULT, 35000),
(DEFAULT, 36000),
(DEFAULT, 37000),
(DEFAULT, 37000),
(DEFAULT, 38000),
(DEFAULT, 39000),
(DEFAULT, 40000),
(DEFAULT, 42000),
(DEFAULT, 46000),
(DEFAULT, 48000),
(DEFAULT, 50000);