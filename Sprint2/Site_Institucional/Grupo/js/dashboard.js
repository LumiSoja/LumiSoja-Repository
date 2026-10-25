if (exigirAcesso('dashboard')) {
'use strict';
    const LIMITES = { minimo: 15000, maximo: 80000, margemAtencao: 6500, metaHoras: 12 };
    const SETORES = ['norte', 'sul', 'leste', 'oeste'];
    const HORARIOS = ['06:00', '07:30', '09:00', '10:30', '12:00', '13:00', '14:00'];
    const HORAS = [6, 7.5, 9, 10.5, 12, 13, 14];
    const SITUACOES = {
        ideal: { nome: 'Ideal', cor: '#43964D', nivel: 0 },
        atencao: { nome: 'Atenção', cor: '#F39C12', nivel: 1 },
        perigo: { nome: 'Perigo', cor: '#d32f2f', nivel: 2 },
        'sem-dados': { nome: 'Sem dados', cor: '#7b8581', nivel: -1 }
    };

    // Dados locais para demonstrar a interface. Substitua por dados da API ao integrar o banco.
    // Cada posição corresponde a Norte, Sul, Leste e Oeste. null = sensor desativado.
    const fazendas = fazendasPermitidas();
    const sensores = [];
    fazendas.forEach(function (fazenda) {
        if (fazenda.semSensores) return;
        SETORES.forEach(function (setor, indice) {
            const lux = fazenda.leituras[indice];
            const numero = (fazenda.id - 1) * 4 + indice + 1;
            sensores.push({
                id: 'LDR_' + String(numero).padStart(2, '0'),
                fazendaId: fazenda.id,
                setor: setor,
                ativo: lux !== null,
                lux: lux,
                latitude: (fazenda.latitude + indice * 0.002).toFixed(4),
                longitude: (fazenda.longitude - indice * 0.0015).toFixed(4),
                historico: lux === null ? [] : [0.04, 0.28, 0.70, 1.08, 1.20, 1.08, 1].map(function (fator) { return Math.round(lux * fator); })
            });
        });
    });

    const estado = { fazenda: 'todas', setor: 'todos' };
    const el = function (id) { return document.getElementById(id); };
    const numero = function (valor) { return Math.round(valor).toLocaleString('pt-BR'); };
    const capitalizar = function (texto) { return texto.charAt(0).toUpperCase() + texto.slice(1); };
    const media = function (valores) { return valores.length ? valores.reduce(function (soma, valor) { return soma + valor; }, 0) / valores.length : null; };

    function situacaoLux(lux) {
        if (lux === null || !Number.isFinite(lux)) return 'sem-dados';
        if (lux <= LIMITES.minimo || lux >= LIMITES.maximo) return 'perigo';
        if (lux <= LIMITES.minimo + LIMITES.margemAtencao || lux >= LIMITES.maximo - LIMITES.margemAtencao) return 'atencao';
        return 'ideal';
    }

    function filtrarSensores(fazendaId, setor) {
        return sensores.filter(function (sensor) {
            return (fazendaId === 'todas' || sensor.fazendaId === Number(fazendaId)) && (setor === 'todos' || sensor.setor === setor);
        });
    }

    function sensoresComLeitura(lista) {
        return lista.filter(function (sensor) { return sensor.ativo && Number.isFinite(sensor.lux); });
    }

    function resumir(lista) {
        const ativos = sensoresComLeitura(lista);
        const contagens = { ideal: 0, atencao: 0, perigo: 0 };
        ativos.forEach(function (sensor) { contagens[situacaoLux(sensor.lux)]++; });
        const situacao = !ativos.length ? 'sem-dados' : contagens.perigo ? 'perigo' : contagens.atencao ? 'atencao' : 'ideal';
        return { ativos: ativos, contagens: contagens, situacao: situacao, media: media(ativos.map(function (sensor) { return sensor.lux; })) };
    }

    function nomeFazenda() {
        return estado.fazenda === 'todas' ? 'Todas as fazendas' : fazendas.find(function (fazenda) { return fazenda.id === Number(estado.fazenda); }).nome;
    }

    function nomeSetor() { return estado.setor === 'todos' ? 'Todos os setores' : 'Setor ' + capitalizar(estado.setor); }

    // Duração acima do mínimo: interpolação entre as leituras de 06h a 14h.
    function horasDeExposicao(sensor) {
        let horas = 0;
        for (let i = 1; i < sensor.historico.length; i++) {
            const antes = sensor.historico[i - 1];
            const depois = sensor.historico[i];
            const intervalo = HORAS[i] - HORAS[i - 1];
            if (antes >= LIMITES.minimo && depois >= LIMITES.minimo) horas += intervalo;
            else if ((antes >= LIMITES.minimo) !== (depois >= LIMITES.minimo)) {
                const fracao = (LIMITES.minimo - antes) / (depois - antes);
                horas += intervalo * (antes >= LIMITES.minimo ? fracao : 1 - fracao);
            }
        }
        return horas;
    }


    // Desenha apenas as duas linhas tracejadas nos gráficos do Chart.js.
    // Como a linha usa a largura do gráfico, funciona até ao selecionar um único setor.
    const linhasDePerigo = {
        id: 'linhasDePerigo',
        afterDatasetsDraw: function (grafico) {
            const contexto = grafico.ctx;
            const area = grafico.chartArea;
            const limites = [
                { valor: LIMITES.minimo, nome: 'Mínimo: 15 mil lux', cor: '#d32f2f' },
                { valor: LIMITES.maximo, nome: 'Máximo: 80 mil lux', cor: '#a31616' }
            ];
            contexto.save();
            contexto.font = '11px Arial';
            contexto.textAlign = 'right';
            limites.forEach(function (limite) {
                const altura = grafico.scales.y.getPixelForValue(limite.valor);
                contexto.strokeStyle = limite.cor;
                contexto.fillStyle = limite.cor;
                contexto.setLineDash([6, 4]);
                contexto.beginPath();
                contexto.moveTo(area.left, altura);
                contexto.lineTo(area.right, altura);
                contexto.stroke();
                contexto.fillText(limite.nome, area.right - 4, altura - 5);
            });
            contexto.restore();
        }
    };

    let graficoHistorico;
    let graficoSetores;
    let graficoSituacao;
    if (typeof Chart !== 'undefined') {
        graficoHistorico = new Chart(el('myChart'), {
            type: 'line',
            data: { labels: HORARIOS, datasets: [{ label: 'Luminosidade (Lux)', data: [], borderColor: '#E5B32D', backgroundColor: '#E5B32D', tension: 0.4, fill: false }] },
            options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { y: { beginAtZero: true, suggestedMax: 100000 } } },
            plugins: [linhasDePerigo]
        });
        graficoSetores = new Chart(el('myChart2'), {
            type: 'bar',
            data: { labels: [], datasets: [{ label: 'Média de Luminosidade (Lux)', data: [], backgroundColor: '#43964D' }] },
            options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { y: { beginAtZero: true, suggestedMax: 100000 } } },
            plugins: [linhasDePerigo]
        });
        graficoSituacao = new Chart(el('myChart3'), {
            type: 'doughnut',
            data: { labels: ['Ideal', 'Atenção', 'Perigo'], datasets: [{ label: 'Sensores com leitura', data: [], backgroundColor: ['#43964D', '#F39C12', '#d32f2f'] }] },
            options: { responsive: true, maintainAspectRatio: false, animation: false }
        });
    } else el('erro-graficos').hidden = false;

    function atualizarTabelaFazendas() {
        const linhas = [{ id: 'todas', nome: 'Todas as fazendas' }].concat(fazendas);
        el('fazendas-body').innerHTML = linhas.map(function (fazenda) {
            const resumo = resumir(filtrarSensores(String(fazenda.id), estado.setor));
            const selecionada = String(fazenda.id) === estado.fazenda;
            return '<tr data-fazenda="' + fazenda.id + '" class="' + (selecionada ? 'selecionada' : '') + '"><td><button type="button" class="botao-fazenda" aria-pressed="' + selecionada + '"><span class="bolinha ' + resumo.situacao + '" aria-hidden="true"></span> ' + textoSeguro(fazenda.nome) + '</button></td><td><span class="' + resumo.situacao + '">' + SITUACOES[resumo.situacao].nome + '</span><br><small>' + (resumo.media === null ? 'Sem leitura' : numero(resumo.media) + ' lux') + '</small></td></tr>';
        }).join('');
    }

    function atualizarIndicadores(lista, resumo) {
        el('titulo-selecao').textContent = nomeFazenda();
        el('situacao-selecao').textContent = nomeSetor() + ' — ' + SITUACOES[resumo.situacao].nome;
        el('bolinha-selecao').className = 'bolinha ' + resumo.situacao;
        el('lux-atual').textContent = resumo.media === null ? '—' : numero(resumo.media) + ' Lux';
        el('lux-detalhe').textContent = resumo.ativos.length + ' sensor(es) com leitura';
        el('sensores-contagem').textContent = resumo.ativos.length + '/' + lista.length;
        el('sensores-desativados').textContent = (lista.length - resumo.ativos.length) + ' desativado(s) no recorte';
        const horas = media(resumo.ativos.map(horasDeExposicao));
        const minutos = horas === null ? null : Math.round(horas * 60);
        el('exposicao').textContent = minutos === null ? '—' : Math.floor(minutos / 60) + 'h ' + String(minutos % 60).padStart(2, '0') + 'm';
        el('meta-exposicao').textContent = horas === null ? 'Sem dados para calcular' : Math.round(horas / LIMITES.metaHoras * 100) + '% da meta diária de 12h atingida';
        el('risco-atual').textContent = SITUACOES[resumo.situacao].nome;
        el('risco-atual').className = resumo.situacao;
        const baixos = resumo.ativos.filter(function (sensor) { return sensor.lux <= LIMITES.minimo; }).length;
        const altos = resumo.ativos.filter(function (sensor) { return sensor.lux >= LIMITES.maximo; }).length;
        if (resumo.situacao === 'perigo') el('risco-detalhe').textContent = baixos + ' no mínimo ou abaixo; ' + altos + ' no máximo ou acima';
        else if (resumo.situacao === 'atencao') el('risco-detalhe').textContent = resumo.contagens.atencao + ' sensor(es) próximo(s) dos limites';
        else el('risco-detalhe').textContent = resumo.situacao === 'ideal' ? 'Nenhum alerta de luminosidade' : 'Sem sensor ativo com leitura';
        const pior = resumo.ativos.find(function (sensor) { return situacaoLux(sensor.lux) === resumo.situacao; });
        el('risco-local').textContent = pior && resumo.situacao !== 'ideal' ? pior.id + ' — ' + capitalizar(pior.setor) + ' — ' + numero(pior.lux) + ' lux' : '';
        el('sem-leituras').hidden = resumo.ativos.length > 0;
    }

    function atualizarGraficos(lista, resumo) {
        const historico = HORARIOS.map(function (_, indice) { return media(resumo.ativos.map(function (sensor) { return sensor.historico[indice]; })); });
        const setores = estado.setor === 'todos' ? SETORES : [estado.setor];
        const medias = setores.map(function (setor) { return resumir(lista.filter(function (sensor) { return sensor.setor === setor; })).media; });
        const contagens = resumo.contagens;
        el('titulo-historico').textContent = 'Histórico de Luminosidade Diária (Lux) — ' + nomeFazenda() + ' — ' + nomeSetor();
        el('resumo-distribuicao').textContent = contagens.ideal + ' ideais, ' + contagens.atencao + ' em atenção, ' + contagens.perigo + ' em perigo.';
        el('valores-historico').innerHTML = '<table><thead><tr><th>Horário</th><th>Média (Lux)</th></tr></thead><tbody>' + HORARIOS.map(function (hora, i) { return '<tr><td>' + hora + '</td><td>' + (historico[i] === null ? 'Sem leitura' : numero(historico[i])) + '</td></tr>'; }).join('') + '</tbody></table>';
        if (!graficoHistorico) return;
        graficoHistorico.data.datasets[0].data = historico;
        graficoSetores.data.labels = setores.map(capitalizar);
        graficoSetores.data.datasets[0].data = medias;
        graficoSetores.data.datasets[0].backgroundColor = medias.map(function (lux) { return SITUACOES[situacaoLux(lux)].cor; });
        graficoSituacao.data.datasets[0].data = [contagens.ideal, contagens.atencao, contagens.perigo];
        el('myChart').setAttribute('aria-label', 'Histórico em lux: ' + historico.map(function (lux, i) { return HORARIOS[i] + ': ' + (lux === null ? 'sem leitura' : numero(lux)); }).join('; '));
        el('myChart2').setAttribute('aria-label', 'Médias em lux: ' + setores.map(function (setor, i) { return setor + ': ' + (medias[i] === null ? 'sem leitura' : numero(medias[i])); }).join('; '));
        el('myChart3').setAttribute('aria-label', el('resumo-distribuicao').textContent);
        graficoHistorico.update();
        graficoSetores.update();
        graficoSituacao.update();
    }

    function atualizarPainel() {
        const lista = filtrarSensores(estado.fazenda, estado.setor);
        const resumo = resumir(lista);
        atualizarTabelaFazendas();
        atualizarIndicadores(lista, resumo);
        atualizarGraficos(lista, resumo);
    }

    function atualizarSensores() {
        const lista = filtrarSensores(estado.fazenda, estado.setor);
        const filtro = el('sensor-status-filter').value;
        const exibidos = lista.filter(function (sensor) { return filtro === 'todos' || (filtro === 'ativo' ? sensor.ativo : !sensor.ativo); });
        const ativos = lista.filter(function (sensor) { return sensor.ativo; }).length;
        el('escopo-sensores').textContent = nomeFazenda() + ' — ' + nomeSetor();
        el('contagem-sensores').textContent = ativos + ' ativo(s); ' + (lista.length - ativos) + ' desativado(s).';
        el('sensores-body').innerHTML = exibidos.length ? exibidos.map(function (sensor) {
            const fazenda = fazendas.find(function (item) { return item.id === sensor.fazendaId; });
            return '<tr><th scope="row">' + sensor.id + '</th><td>' + textoSeguro(fazenda.nome) + '</td><td>' + capitalizar(sensor.setor) + '</td><td>' + (sensor.ativo ? 'Ativo' : 'Desativado') + '</td><td class="' + situacaoLux(sensor.lux) + '">' + (sensor.ativo ? numero(sensor.lux) + ' lux<br>' + SITUACOES[situacaoLux(sensor.lux)].nome : 'Sem leitura') + '</td><td>' + textoSeguro(sensor.latitude) + ', ' + textoSeguro(sensor.longitude) + '</td></tr>';
        }).join('') : '<tr><td colspan="6">Nenhum sensor encontrado para este filtro.</td></tr>';
        el('resultado-sensores').textContent = exibidos.length + ' de ' + lista.length + ' sensores exibidos.';
    }

    fazendas.forEach(function (fazenda) {
        const opcao = document.createElement('option');
        opcao.value = fazenda.id;
        opcao.textContent = fazenda.nome;
        el('fazenda-select').append(opcao);
    });
    el('fazenda-select').addEventListener('change', function () { estado.fazenda = this.value; atualizarPainel(); });
    el('setor-select').addEventListener('change', function () { estado.setor = this.value; atualizarPainel(); });
    el('fazendas-body').addEventListener('click', function (evento) {
        const linha = evento.target.closest('tr[data-fazenda]');
        if (!linha) return;
        estado.fazenda = linha.dataset.fazenda;
        el('fazenda-select').value = estado.fazenda;
        atualizarPainel();
        if (evento.detail === 0) el('fazendas-body').querySelector('tr[data-fazenda="' + estado.fazenda + '"] button').focus();
    });
    el('abrir-sensores').addEventListener('click', function () {
        el('sensor-status-filter').value = 'todos';
        atualizarSensores();
        el('sensores-dialog').showModal();
    });
    el('sensor-status-filter').addEventListener('change', atualizarSensores);
    el('fechar-sensores').addEventListener('click', function () { el('sensores-dialog').close(); });
    atualizarPainel();
    
    document.getElementById('conteudo-dashboard').hidden = false;
}
