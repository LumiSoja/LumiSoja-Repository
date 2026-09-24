-- Criação do database
CREATE DATABASE soja_iot;
--
USE soja_iot;


-- /////////////////////////////////////////////////////////////////////////////
-- TABELA EMPRESA
CREATE TABLE empresa (
idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
razao_social VARCHAR (200) NOT NULL,
cnpj CHAR (14) UNIQUE NOT NULL,
email_institucional VARCHAR (50) UNIQUE,
hectares DECIMAL (10,2) NOT NULL
);

-- TABELA USUARIO
CREATE TABLE usuario (
idUsuario INT PRIMARY KEY AUTO_INCREMENT,
cpf CHAR (11) UNIQUE NOT NULL,
nome_usuario VARCHAR (50) NOT NULL,
email VARCHAR (50) UNIQUE NOT NULL,
senha VARCHAR (30) UNIQUE NOT NULL,
fk_empresa INT,
INDEX fk_usuarioempresa_idx (fk_empresa),
CONSTRAINT fk_usuarioempresa FOREIGN KEY (fk_empresa) REFERENCES empresa(idEmpresa)
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

-- SELECT GERAL dos dados da Empresa
SELECT
idEmpresa, razao_social AS nome,
cnpj, email_institucional AS email, hectares
FROM empresa;

-- /////////////////////////////////////////////////////////////////////////////

-- SELECT GERAL dos dados dos Usuarios
SELECT
idUsuario, cpf, nome_usuario AS nome,
email, senha, empresa_usuario AS empresa
FROM usuario;


-- /////////////////////////////////////////////////////////////////////////////
-- TABELA SENSOR - GRANDILL
CREATE TABLE sensor_gardill (
idSensor INT PRIMARY KEY AUTO_INCREMENT,
status_sensor TINYINT,
local_instalado VARCHAR (45)
);

INSERT INTO sensor_gardill (status_sensor, local_instalado) VALUES
(TRUE, 'área 01'),
(FALSE, 'área 02');

-- SELECT GERAL de sensores por Empresa
SELECT
idSensor,
CASE WHEN status_sensor = TRUE THEN 'Ativo'
ELSE 'Inativo'
END AS 'status',
local_instalado
FROM  sensor_gardill;


-- /////////////////////////////////////////////////////////////////////////////
-- TABELA COM OS DADOS DO SENSOR - GRANDILL
CREATE TABLE lux_gardill (
idLux INT PRIMARY KEY AUTO_INCREMENT,
data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
qtd_lux DECIMAL (7,2),
fk_sensor INT,
INDEX fk_sensorlux_idx (fk_sensor),
CONSTRAINT fk_sensorlux FOREIGN KEY (fk_sensor) REFERENCES sensor_gardill(idSensor)
);

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

-- UPDATE para simulação de luminosidade - registro a cada 10 minutos
UPDATE lux_gardill SET
data_hora = '2026-09-09 08:00:00'
WHERE idLux = 1;
UPDATE lux_gardill SET
data_hora = '2026-09-09 08:10:00'
WHERE idLux = 2;
UPDATE lux_gardill SET
data_hora = '2026-09-09 08:20:00'
WHERE idLux = 3;
UPDATE lux_gardill SET
data_hora = '2026-09-09 08:30:00'
WHERE idLux = 4;
UPDATE lux_gardill SET
data_hora = '2026-09-09 08:40:00'
WHERE idLux = 5;
UPDATE lux_gardill SET
data_hora = '2026-09-09 08:50:00'
WHERE idLux = 6;
UPDATE lux_gardill SET
data_hora = '2026-09-09 09:00:00'
WHERE idLux = 7;
UPDATE lux_gardill SET
data_hora = '2026-09-09 09:10:00'
WHERE idLux = 8;
UPDATE lux_gardill SET
data_hora = '2026-09-09 09:20:00'
WHERE idLux = 9;
UPDATE lux_gardill SET
data_hora = '2026-09-09 09:30:00'
WHERE idLux = 10;
UPDATE lux_gardill SET
data_hora = '2026-09-09 09:40:00'
WHERE idLux = 11;
UPDATE lux_gardill SET
data_hora = '2026-09-09 09:50:00'
WHERE idLux = 12;

-- SELECT GERAL de luminosidade dos sensores de determinada empresa
SELECT idLux, data_hora, qtd_lux
FROM lux_gardill;


-- /////////////////////////////////////////////////////////////////////////////
-- SIMULADOR DE SELECTS


-- SELECTS ESPECIFICOS - EMPRESA

-- selecionando a quantidade de hectares de determinada empresa
SELECT CONCAT('A emperesa', ' ', razao_social, ' ', 'possui ', ' ', hectares, ' ', 'hectares.')
AS 'Informações de hectares'
FROM empresa;


-- SELECTS ESPECÍFICOS - USUARIO

-- lista de usuarios em ordem alfabética
SELECT * FROM usuario ORDER BY nome_usuario ASC;

-- usuarios onde o nome começa com A
SELECT * FROM usuario WHERE nome_usuario LIKE 'A%';


-- SELECTS ESPECÍFICOS - SENSOR_GARDILL

-- selecionando sensores ativos
SELECT idSensor,
CASE WHEN status_sensor = TRUE THEN 'Ativo'
END AS 'status',
local_instalado
FROM sensor_gardill
WHERE status_sensor = TRUE;


-- SELECTS ESPECÍFICOS - LUX_GARDILL

-- selecionando niveis de luminosidade especificos
SELECT * FROM lux_gardill WHERE qtd_lux >= 36000 AND qtd_lux <= 46000;

-- SELECT de dados dentro de um determinado horário
SELECT * FROM lux_gardill WHERE data_hora
BETWEEN '2026-09-09 08:00:00' AND '2026-09-09 09:00:00';