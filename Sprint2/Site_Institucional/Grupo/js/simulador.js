// Calculadora original: cálculos e estrutura preservados.

ipt_empresa.focus();

    div_msg.innerHTML = `<h2>Faça a sua simulação e descubra como podemos te ajudar a otimizar sua operação</h2>`;


    function textoExplicativo() {
        desc.hidden = !desc.hidden;
        btn_explicacao.setAttribute('aria-expanded', String(!desc.hidden));
    }


    function calcular() {

        let empresa = ipt_empresa.value.trim();
        // Impede que caracteres de HTML digitados no nome virem código na página.
        empresa = empresa.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

        // Dados para os cálculos:

        let hectare = Number(ipt_hectares.value.replace(',', '.'));
        let valor_sacas = Number(ipt_valor_sacas.value.replace(',', '.'));

        let media_população_por_hectare = Number(225000); // (200000 + 250000) / 2 - Altadefensivos
        let media_vagens_por_planta = Number(69); // (63 + 75) / 2 - Grupo Quinote & Barros
        let grao_por_vagens = Number(2.5); //  - Pioneer
        let peso_medio_mil_graos = Number(180); // (140 + 220) / 2 - Pioneer
        let media_cultivo_por_ano = Number(1.5); // (1 + 2) / 2 - 


        let valorInvalido = isNaN(hectare) || isNaN(valor_sacas) || empresa == '' || hectare <= 0 || valor_sacas <= 0;

        // Cálculo estimativa de Produtividade SEM sensores: 

        if (!valorInvalido) {

            // Como calcular a produtividade de soja por hectare?  

            // - Conte o número de plantas em uma área conhecida.
            // - Calcule o número de vagens por planta.
            // - Determine o número médio de grãos por vagem.
            // - Avalie o peso médio de grãos. 

            let calculo_produtividade = (225 * media_vagens_por_planta * grao_por_vagens * peso_medio_mil_graos) / 60000;
            let produtividade_anual_sem_sensor = calculo_produtividade * media_cultivo_por_ano;
            let produtividade_mensal_sem_sensor = produtividade_anual_sem_sensor / 12;


            // Cálculo da estimativa de Faturamento SEM sensores:

            let estimativa_sacas_soja_colhidas = produtividade_anual_sem_sensor * hectare;
            let faturamento_atual_anual = estimativa_sacas_soja_colhidas * valor_sacas;
            let faturamento_atual_mensal = faturamento_atual_anual / 12;


            // Cálculo estimativa de Produtividade COM sensores:

            let percentual_produtividade_com_sensor = ((20 + 66) / 2) / 100;
            let percentual_aplicado_produtividade_anual = produtividade_anual_sem_sensor * percentual_produtividade_com_sensor;
            let produtividade_anual_com_sensores = produtividade_anual_sem_sensor + percentual_aplicado_produtividade_anual;
            let produtividade_mensal_com_sensores = produtividade_anual_com_sensores / 12;


            // Cálculo da estimativa de Faturamento COM sensores:

            let percentual_aplicado_faturamento_com_sensores = faturamento_atual_anual * percentual_produtividade_com_sensor;
            let faturamento_anual_com_sensores = faturamento_atual_anual + percentual_aplicado_faturamento_com_sensores;
            let faturamento_mensal_com_sensores = faturamento_anual_com_sensores / 12;
            let faturamento_elevado = faturamento_anual_com_sensores - faturamento_atual_anual


            div_msg.innerHTML = `
            <h4>Prévia de resultados para ${empresa}:</h4>
            <h2 class="retorno_aumento_fatura">${faturamento_elevado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} a mais por ano </h2>


            <div class="container_retorno">

                <div class="container_grade_metricas">
                    <h4 class="cabecalho_retorno">Estimativas de faturamento da sua empresa: </h4>
            
                    <div class="container_estimativas">
                        <div class="box">
                            <p class="valoresSolucaoPre">Faturamento Atual Anual sem Sensoreamento:
                                <b>${faturamento_atual_anual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
                            </p>
                            <p class="valoresSolucaoPre">Faturamento Mensal sem Sensoreamento: 
                                <b>${faturamento_atual_mensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
                            </p>
                        </div>

                        <div class="box">
                            <p class="valoresSolucaoPos">Faturamento Anual com Nossa Solução:
                                <b>${faturamento_anual_com_sensores.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
                            </p>
                            <p class="valoresSolucaoPos">Faturamento Mensal com Nossa Solução:
                                <b>${faturamento_mensal_com_sensores.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
                            </p>
                        </div>
                    </div>

                </div>


                <div class="container_grade_metricas">
                    <h4 class="cabecalho_retorno">Estimativa de produção colaborando conosco - aumento de até 43%: </h4>
                    
                    <div class="container_estimativas">
                        <div class="box">
                            <p class="valoresSolucaoPre">Produtividade Atual Anual sem Sensoreamento: 
                                <b>${produtividade_anual_sem_sensor.toFixed(1)} sacas/ha</b>
                            </p>
                            <p class="valoresSolucaoPre">Produtividade Mensal sem Sensoreamento: 
                                <b>${produtividade_mensal_sem_sensor.toFixed(1)} sacas/ha</b>
                            </p>
                        </div>

                        <div class="box">
                            <p class="valoresSolucaoPos">Produtividade Anual com Nossa Solução:
                                <b>${produtividade_anual_com_sensores.toFixed(1)} sacas/ha</b>
                            </p>
                            <p class="valoresSolucaoPos">Produtividade Mensal com Nossa Solução:
                                <b>${produtividade_mensal_com_sensores.toFixed(1)} sacas/ha</b>
                            </p>
                        </div>
                    </div>

                </div>

        </div>
        `;

        } else {
            div_msg.innerHTML = '<h4>Ao menos um dos campos não foi preenchido adequadamente. Confira as suas respostas.</h4>';
        }


        ipt_empresa.focus();
    }

