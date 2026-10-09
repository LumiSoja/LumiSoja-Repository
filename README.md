# 🌱 LumiSoja
Sistema de monitorização IoT para análise de luminosidade em plantações de soja, focado no apoio à tomada de decisão no agronegócio.

# 📖 Sobre o Projeto
A soja é uma das principais culturas agrícolas, e o seu desenvolvimento está diretamente ligado à incidência de radiação solar. O LumiSoja é uma solução tecnológica desenvolvida no ambiente académico da São Paulo Tech School, que utiliza telemetria (sensores IoT) para registar dados contínuos de luminosidade na lavoura. O objetivo é transformar essas medições em informações estruturadas, permitindo ao produtor otimizar as suas estratégias de maneio, mitigar riscos climáticos e maximizar a produtividade.

# 🎯 Funcionalidades Principais
Captação Contínua (IoT): Utilização de microcontroladores para a leitura em tempo real da incidência solar no campo.
Dashboard Interativa: Interface web desenvolvida para uma visualização clara, objetiva e intuitiva dos dados captados.
Simulador Financeiro: Ferramenta integrada na plataforma web para demonstrar a viabilidade e o impacto comercial do projeto ao cliente.
Armazenamento Estruturado: Persistência de registos de utilizadores, empresas e sensores numa base de dados relacional alojada num ambiente virtualizado.

# 🛠️ Tecnologias e Ferramentas
Hardware e IoT: Arduino (C/C++), Sensores de Luminosidade (LDR).
Base de Dados: MySQL.
Front-end / Web: HTML5, CSS3, JavaScript.
Infraestrutura: Máquina Virtual com sistema operativo de kernel Linux.
Prototipagem e Gestão: Figma (Design UI), Trello (Metodologia Ágil Kanban), GitHub (Versionamento).

# ⚙️ Premissas e Restrições de Operação
Para garantir o fluxo correto dos dados entre a lavoura e a plataforma web, a implementação exige:
Conectividade: Os módulos de captação operam obrigatoriamente através de uma rede Wi-Fi de 2.4 GHz (frequência de longo alcance).
Alimentação Elétrica: O hardware de campo deve ser alimentado com uma tensão contínua não superior a 5V.
Posicionamento: A área de instalação dos sensores deve estar livre de obstáculos que causem sombreamento constante (como matas ciliares ou variações extremas de relevo).
Escopo Delimitado: O sistema é estritamente de telemetria e análise. Não realiza automação de processos físicos (como irrigação ou iluminação artificial).

# 👥 A Equipe
Nascemos com a missão de conectar a inovação tecnológica à realidade do campo, unindo os nossos conhecimentos em desenvolvimento de software e hardware para resolver problemas reais.

Desenvolvedores:

Gabriel Pereira
Gabriel Alexander
Gustavo Fermino
Vinicius Oliveira
Thiago Ishikawa
Raphael Takakura

Stakeholders e Acompanhamento Estratégico:

Fernando Brandão
Julia Araripe

Projeto desenvolvido como requisito académico na São Paulo Tech School.
