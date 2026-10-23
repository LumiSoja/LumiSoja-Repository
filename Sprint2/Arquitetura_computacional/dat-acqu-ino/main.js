// importa os bibliotecas necessários
const serialport = require('serialport'); // Biblioteca de comunicação com as portas USB
const express = require('express'); // Biblioteca apra criar o servidor web
const mysql = require('mysql2'); // Biblioteca que faz ligação com o banco de dados

// constantes para configurações
const SERIAL_BAUD_RATE = 9600; // Velocidade da captura de dados pela porta USB(Mesma do código em nodeJs)
const SERVIDOR_PORTA = 3300; // porta Utilizada para que o Servidor seja aberto

// habilita ou desabilita a inserção de dados no banco de dados
const HABILITAR_OPERACAO_INSERIR = true; //utilizado para decidir se serão enviados dados ao banco ou não

// função para comunicação serial
const serial = async (
    valoresSensorAnalogico
    // ,    valoresSensorDigital,
) => { // recebe a lista 'valoresSensorAnalogico' como parâmetro, que servirá para armazenamento contínuo para o histórico dos dados lidos via USB.

    // conexão com o banco de dados MySQL
    let poolBancoDados = mysql.createPool(
        {
            host: 'localhost',
            user: 'user_insert2',
            password: 'Sptech@2026',
            database: 'LumiSoja',
            port: 3307
        }
    ).promise(); // Cria uma variavel que funciona como uma piscina para registrar credenciais do banco de dados, ele funciona como um gerenciador inteligente para conexões, o pool serve para ser utilizado como uma forma de entrada mais fácil e otimizada do código conseguir enviar dados para o banco, tornando o envio continuo sem a necessidade do mysql se fechar e abrir novamente quando detectar que um dado novo esta chegando.

    // lista as portas seriais disponíveis e procura pelo Arduino
    const portas = await serialport.SerialPort.list(); // Faz uma varredura nas entradas USB do computador
    const portaArduino = portas.find((porta) => porta.vendorId == 2341 && porta.productId == 43);
    if (!portaArduino) {
        throw new Error('O arduino não foi encontrado em nenhuma porta serial');
    } // Ao encontrar os dsipositivos conectados ele verifica se um dos dispositivos é o Arduino Uno R3, onde essas acima são suas assinaturas digitais qeu fazem ele ser reconhecido como esse dispositivo.

    // configura a porta serial com o baud rate especificado
    const arduino = new serialport.SerialPort(
        {
            path: portaArduino.path,
            baudRate: SERIAL_BAUD_RATE
        }
    );  // Após isso ele configura o BoudRate(Velocidade da captura de dados através da porta USB), utilizando a variavel criada anteriormente

    // evento quando a porta serial é aberta
    arduino.on('open', () => {
        console.log(`A leitura do arduino foi iniciada na porta ${portaArduino.path} utilizando Baud Rate de ${SERIAL_BAUD_RATE}`);
    }); // Ocorre a abertura da porta 3300 para inicialização do servidor caso a os parametros da portaArduino estejam corretos, e envia os dados de forma correta caso o boudRate esteja na mesma velocidade parametrizada no codigo nodeJs do sensor, caso esteja com um BoudRate diferente ele acaba gerando 'Lixo'.

    // processa os dados recebidos do Arduino
    arduino.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' })).on('data', async (data) => { // Sempre quando chega um dado novo no nosso nodeJs, ele pula de linha através do 'ln', aqui na nossa api este codigo diz, que sempre que um dado novo chegar e o codigo nodeJs pular uma linha pegamos o valor novo que chegou.
        console.log(data);
        const valores = data.split(';'); // Captura os dados vindos do arduino e separa ele quando verificar o caractere ';', para separar lo, após isso ele adiciona esse dado separado em uma lista chamada valores, que é adicionado na posição 0 da array que é a posição que contem dados analógicos na API.
        const lux = parseFloat(valores[0]); // Depois ele transforma esse dado da posição 0 em Decimal através do comando parseFloat
        // const sensorDigital = (valores[1]);

        // armazena os valores dos sensores nos arrays correspondentes
        valoresSensorAnalogico.push(lux); // Depois ele envia esse dado lux para a lista valoresSensorAnalogico que sera criada posteriormente
        // valoresSensorDigital.push(sensorDigital);

        // insere os dados no banco de dados (se habilitado)
        if (HABILITAR_OPERACAO_INSERIR) {

            // este insert irá inserir os dados na tabela "medida"
            await poolBancoDados.execute(
                'INSERT INTO leitura_sensor (lux) VALUES (?)',
                [lux] // Da um insert no banco de dados na tabela leitura_sensor no campo lux, acessando o dado lux.
            );
            console.log("valores inseridos no banco: ", lux + "." /*", 2" + sensorDigital*/);

        } // Caso a Função de inserir dados esteja ligada ele insere os valores no banco de dados

    });

    // evento para lidar com erros na comunicação serial
    arduino.on('error', (mensagem) => {
        console.error(`Erro no arduino (Mensagem: ${mensagem}`)
    });
}

// função para criar e configurar o servidor web
const servidor = (
    valoresSensorAnalogico
    // ,    valoresSensorDigital
) => {
    const app = express();

    // configurações de requisição e resposta
    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        next();
    });

    // inicia o servidor na porta especificada
    app.listen(SERVIDOR_PORTA, () => {
        console.log(`API executada com sucesso na porta ${SERVIDOR_PORTA}`);
    });

    // define os endpoints da API para cada tipo de sensor
    app.get('/sensores/analogico', (_, response) => {
        return response.json(valoresSensorAnalogico);
    });
    // app.get('/sensores/digital', (_, response) => {
    //     return response.json(valoresSensorDigital);
    // });
}

// função principal assíncrona para iniciar a comunicação serial e o servidor web
(async () => {
    // arrays para armazenar os valores dos sensores
    const valoresSensorAnalogico = [];
    // const valoresSensorDigital = [];

    // inicia a comunicação serial
    await serial(
        valoresSensorAnalogico
        // ,        valoresSensorDigital
    );

    // inicia o servidor web
    servidor(
        valoresSensorAnalogico
        // ,        valoresSensorDigital
    );
})();

