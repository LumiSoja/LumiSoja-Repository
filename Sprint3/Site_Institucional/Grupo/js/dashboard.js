// Dashboard estática: valores fictícios para apresentar a interface.
// Não recebe dados reais do Arduino e não consulta o MySQL.

let setores = ['norte', 'sul', 'leste', 'oeste'];
let horarios = ['06:00', '07:30', '09:00', '10:30', '12:00', '13:00', '14:00'];
let fatores = [0.04, 0.28, 0.70, 1.08, 1.20, 1.08, 1];

// Cada vetor de leituras acompanha os setores na ordem acima.
// null representa um sensor desligado.
let fazendas = [
    { id: 1, nome: 'Fazenda Boa Vista', cidade: 'Guarantã do Norte - MT', coordenada: '-9.7875, -54.9120', leituras: [34250, 38500, 13000, null] },
    { id: 2, nome: 'Estância Progresso', cidade: 'Londrina - PR', coordenada: '-23.3045, -51.1696', leituras: [28500, 30500, 32500, 26500] },
    { id: 3, nome: 'Fazenda Sol Nascente', cidade: 'Mineiros - GO', coordenada: '-17.5694, -52.5510', leituras: [74500, 62000, 54000, 57000] },
    { id: 4, nome: 'Sítio AgroVerde', cidade: 'Tenente Portela - RS', coordenada: '-27.3711, -53.7580', leituras: [19500, 26000, null, 31000] },
    { id: 5, nome: 'Fazenda Ouro Negro', cidade: 'Balsas - MA', coordenada: '-7.5325, -46.0356', leituras: [83500, null, 51000, 46000] }
];

let sensores = [];
for (let i = 0; i < fazendas.length; i++) {
    for (let j = 0; j < setores.length; j++) {
        sensores.push({
            identificacao: 'LDR_' + (i * 4 + j + 1),
            fazenda: fazendas[i].id,
            nomeFazenda: fazendas[i].nome,
            setor: setores[j],
            lux: fazendas[i].leituras[j],
            coordenada: fazendas[i].coordenada
        });
    }
}

let graficoHistorico = null;
let graficoSetores = null;
let graficoSituacoes = null;

function situacaoLux(lux) {
    if (lux == null) return 'Sem dados';
    if (lux <= 15000 || lux >= 80000) return 'Perigo';
    if (lux <= 21500 || lux >= 73500) return 'Atenção';
    return 'Ideal';
}

function corSituacao(situacao) {
    if (situacao == 'Perigo') return '#d32f2f';
    if (situacao == 'Atenção') return '#F39C12';
    if (situacao == 'Ideal') return '#43964D';
    return '#7b8581';
}

function numero(valor) {
    return Math.round(valor).toLocaleString('pt-BR');
}

function iniciarFazendas() {
    for (let i = 0; i < fazendas.length; i++) {
        fazenda_select.innerHTML += `<option value="${fazendas[i].id}">${fazendas[i].nome}</option>`;
    }
    atualizarDashboard();
}

function atualizarDashboard() {
    let escolhaFazenda = fazenda_select.value;
    let escolhaSetor = setor_select.value;
    let ativos = [];
    let quantidadeDesativados = 0;
    let total = 0;
    let perigo = 0;
    let atencao = 0;
    let ideal = 0;
    let medias = [0, 0, 0, 0];
    let contagens = [0, 0, 0, 0];

    for (let i = 0; i < sensores.length; i++) {
        let s = sensores[i];
        if ((escolhaFazenda == 'todas' || s.fazenda == escolhaFazenda) &&
            (escolhaSetor == 'todos' || s.setor == escolhaSetor)) {
            if (s.lux == null) {
                quantidadeDesativados++;
            } else {
                ativos.push(s);
                total += s.lux;
                let tipo = situacaoLux(s.lux);
                if (tipo == 'Perigo') perigo++;
                else if (tipo == 'Atenção') atencao++;
                else ideal++;
                for (let j = 0; j < setores.length; j++) {
                    if (s.setor == setores[j]) {
                        medias[j] += s.lux;
                        contagens[j]++;
                    }
                }
            }
        }
    }

    let nome = 'Todas as fazendas';
    for (let i = 0; i < fazendas.length; i++) {
        if (fazendas[i].id == escolhaFazenda) nome = fazendas[i].nome;
    }
    titulo_selecao.innerHTML = nome;
    bolinha_selecao.style.backgroundColor = '#7b8581';
    sensores_contagem.innerHTML = ativos.length;
    sensores_desativados.innerHTML = quantidadeDesativados + ' desativado(s)';
    sem_leituras.hidden = ativos.length > 0;

    let mediaGeral = 0;
    let risco = 'Sem dados';
    if (ativos.length > 0) {
        mediaGeral = total / ativos.length;
        if (perigo > 0) risco = 'Perigo';
        else if (atencao > 0) risco = 'Atenção';
        else risco = 'Ideal';
    }

    bolinha_selecao.style.backgroundColor = corSituacao(risco);
    lux_atual.innerHTML = ativos.length > 0 ? numero(mediaGeral) + ' lux' : '—';
    risco_atual.innerHTML = risco;
    risco_atual.style.color = corSituacao(risco);
    risco_detalhe.innerHTML = ideal + ' ideal, ' + atencao + ' atenção, ' + perigo + ' perigo';
    risco_local.innerHTML = nome + (escolhaSetor == 'todos' ? '' : ' - Setor ' + escolhaSetor);
    situacao_selecao.innerHTML = 'Dados de exemplo para demonstração do sistema.';
    lux_detalhe.innerHTML = 'Média de ' + ativos.length + ' sensor(es) ativo(s)';
    resumo_distribuicao.innerHTML = 'Sensores com leitura: ' + ativos.length;

    // Estimativa simples de exposição a partir da curva ilustrativa de 06h a 14h.
    let historico = [];
    let horas = 0;
    for (let i = 0; i < fatores.length; i++) {
        let leituraHora = Math.round(mediaGeral * fatores[i]);
        historico.push(leituraHora);
        if (leituraHora > 15000 && i > 0) horas += 8 / (fatores.length - 1);
    }
    exposicao.innerHTML = ativos.length > 0 ? horas.toFixed(1).replace('.', ',') + ' h' : '—';
    meta_exposicao.innerHTML = 'Meta de 12h (curva demonstrativa)';

    let linhasTabela = '';
    for (let i = 0; i < fazendas.length; i++) {
        let soma = 0;
        let quantidade = 0;
        let situacaoFazenda = 'Sem dados';
        for (let j = 0; j < setores.length; j++) {
            if (escolhaSetor == 'todos' || escolhaSetor == setores[j]) {
                let valor = fazendas[i].leituras[j];
                if (valor != null) {
                    soma += valor;
                    quantidade++;
                    if (situacaoLux(valor) == 'Perigo') situacaoFazenda = 'Perigo';
                    else if (situacaoLux(valor) == 'Atenção' && situacaoFazenda != 'Perigo') situacaoFazenda = 'Atenção';
                    else if (situacaoFazenda == 'Sem dados') situacaoFazenda = 'Ideal';
                }
            }
        }
        linhasTabela += `<tr><td><button type="button" class="botao-fazenda" onclick="selecionarFazenda(${fazendas[i].id})">${fazendas[i].nome}</button></td>
            <td><span class="bolinha" style="background-color:${corSituacao(situacaoFazenda)}"></span> ${situacaoFazenda}</td></tr>`;
    }
    fazendas_body.innerHTML = linhasTabela;

    if (typeof Chart == 'undefined') {
        erro_graficos.hidden = false;
        valores_historico.innerHTML = 'Gráficos indisponíveis.';
        return;
    }

    if (graficoHistorico != null) graficoHistorico.destroy();
    if (graficoSetores != null) graficoSetores.destroy();
    if (graficoSituacoes != null) graficoSituacoes.destroy();

    graficoHistorico = new Chart(myChart, {
        type: 'line',
        data: { labels: horarios, datasets: [{ label: 'Luminosidade (Lux)', data: historico, borderColor: '#E5B32D', backgroundColor: '#E5B32D', tension: 0.4 }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });

    let coresSetores = [];
    for (let i = 0; i < medias.length; i++) {
        if (contagens[i] > 0) medias[i] = Math.round(medias[i] / contagens[i]);
        else medias[i] = 0;
        coresSetores.push(corSituacao(contagens[i] > 0 ? situacaoLux(medias[i]) : 'Sem dados'));
    }
    graficoSetores = new Chart(myChart2, {
        type: 'bar',
        data: { labels: ['Norte', 'Sul', 'Leste', 'Oeste'], datasets: [{ label: 'Média (Lux)', data: medias, backgroundColor: coresSetores }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
    graficoSituacoes = new Chart(myChart3, {
        type: 'doughnut',
        data: { labels: ['Ideal', 'Atenção', 'Perigo'], datasets: [{ data: [ideal, atencao, perigo], backgroundColor: ['#43964D', '#F39C12', '#d32f2f'] }] },
        options: { responsive: true, maintainAspectRatio: false }
    });

    let texto = '';
    for (let i = 0; i < historico.length; i++) {
        texto += horarios[i] + ': ' + numero(historico[i]) + ' lux<br>';
    }
    valores_historico.innerHTML = texto;
}

function selecionarFazenda(id) {
    fazenda_select.value = id;
    atualizarDashboard();
}

function abrirSensores() {
    sensor_status_filter.value = 'todos';
    atualizarSensores();
    sensores_dialog.showModal();
}

function atualizarSensores() {
    let texto = '';
    let quantidade = 0;
    for (let i = 0; i < sensores.length; i++) {
        let s = sensores[i];
        let ligar = s.lux != null;
        let escolhaFazenda = fazenda_select.value;
        let escolhaSetor = setor_select.value;
        let tipo = sensor_status_filter.value;
        if ((escolhaFazenda == 'todas' || escolhaFazenda == s.fazenda) &&
            (escolhaSetor == 'todos' || escolhaSetor == s.setor) &&
            (tipo == 'todos' || (tipo == 'ativo' && ligar) || (tipo == 'desativado' && !ligar))) {
            quantidade++;
            texto += `<tr><td>${s.identificacao}</td><td>${s.nomeFazenda}</td><td>${s.setor}</td>
                <td>${ligar ? 'Ativo' : 'Desativado'}</td><td>${ligar ? numero(s.lux) + ' lux' : '—'}</td><td>${s.coordenada}</td></tr>`;
        }
    }
    sensores_body.innerHTML = texto;
    escopo_sensores.innerHTML = 'Informações simuladas dos sensores, sem acesso ao banco.';
    contagem_sensores.innerHTML = quantidade + ' sensor(es) encontrado(s)';
    resultado_sensores.innerHTML = quantidade == 0 ? 'Nenhum sensor neste filtro.' : '';
}

iniciarFazendas();
