// Glossário vivo. Cada conceito aparece com a explicação completa
// só na primeira vez que é acionado (ver game/conceptTracker.js).
// "trigger" documenta QUANDO o app deve disparar esse card no fluxo do jogo,
// para orientar a implementação da lógica em cada tela.

export const CONCEPTS = {
  restricao_orcamentaria: {
    id: 'restricao_orcamentaria',
    season: 1,
    name: 'Restrição orçamentária',
    short: 'Você só pode gastar até o limite do seu caixa disponível.',
    explanation:
      'Todo orçamento tem um teto. Gastar além dele não é ambição, é descontrole. ' +
      'No futebol, times que estouram a folha salarial sem receita para sustentar ' +
      'entram em crise financeira, mesmo tendo um elenco valioso no papel.',
    trigger: 'Ao tentar comprar um jogador acima do saldo em caixa, bloquear a compra e mostrar este card.',
  },
  custo_oportunidade: {
    id: 'custo_oportunidade',
    season: 1,
    name: 'Custo de oportunidade',
    short: 'Escolher uma coisa sempre significa abrir mão de outra.',
    explanation:
      'Cada real gasto em um jogador é um real que não pode ser gasto em outro. ' +
      'Não existe decisão financeira sem um "caminho não escolhido". ' +
      'A pergunta certa nunca é "isso é bom?", é "isso é melhor que a alternativa?"',
    trigger: 'Ao escolher entre dois jogadores de orçamento similar, mostrar o jogador não escolhido e o que ele teria entregado.',
  },
  receita_despesa: {
    id: 'receita_despesa',
    season: 1,
    name: 'Receita vs. despesa',
    short: 'Ter patrimônio valioso não é o mesmo que ter dinheiro disponível.',
    explanation:
      'Bilheteria, patrocínio e premiação entram como receita. Salários e taxas de ' +
      'transferência saem como despesa. Um clube pode ter um elenco milionário e, ' +
      'ainda assim, não ter caixa para pagar a folha no fim do mês.',
    trigger: 'Ao fechar cada rodada, mostrar o extrato simples: receita da rodada, despesa da rodada, saldo resultante.',
  },

  risco_retorno: {
    id: 'risco_retorno',
    season: 2,
    name: 'Relação risco-retorno',
    short: 'Potencial de ganho maior normalmente vem com risco maior.',
    explanation:
      'Um jogador jovem e barato pode virar um crânio ou se contundir e nunca ' +
      'entregar nada. Um jogador consagrado custa mais caro, mas seu desempenho ' +
      'é mais previsível. Nenhuma das duas opções é "errada", são perfis de risco diferentes.',
    trigger: 'Ao visualizar um jogador jovem no mercado, mostrar a faixa de resultado possível (valorização vs risco de lesão/baixo desempenho).',
  },
  diversificacao: {
    id: 'diversificacao',
    season: 2,
    name: 'Diversificação',
    short: 'Não concentre seu orçamento em poucas apostas do mesmo tipo.',
    explanation:
      'Se todo o seu orçamento está em atacantes caros da mesma faixa etária, um ' +
      'problema em uma posição só (lesão, queda de forma) compromete o time inteiro. ' +
      'Distribuir risco entre posições e perfis de jogador protege o resultado geral.',
    trigger: 'Ao montar um elenco muito concentrado numa posição ou faixa de valor, exibir um aviso de concentração de risco.',
  },
  depreciacao_valorizacao: {
    id: 'depreciacao_valorizacao',
    season: 2,
    name: 'Depreciação e valorização de ativos',
    short: 'O valor de um jogador muda com o tempo, como qualquer ativo.',
    explanation:
      'Jogadores perdem valor com a idade ou lesões (depreciação) e ganham valor ' +
      'com desempenho e visibilidade (valorização). Comprar um ativo no momento ' +
      'certo do ciclo de valor é tão importante quanto o preço pago por ele.',
    trigger: 'A cada rodada, recalcular e mostrar a variação de valor de mercado de cada jogador do elenco.',
  },
  custo_fixo_variavel: {
    id: 'custo_fixo_variavel',
    season: 2,
    name: 'Custo fixo vs. custo variável',
    short: 'Salário é custo fixo. Bônus por desempenho é custo variável.',
    explanation:
      'Custos fixos existem independente do resultado (salário mensal). Custos ' +
      'variáveis dependem do desempenho (bônus por gol ou vitória). Um clube com ' +
      'muito custo fixo sofre mais em temporadas ruins, porque a despesa não recua junto com a receita.',
    trigger: 'Ao negociar um contrato, mostrar a divisão entre parte fixa (salário) e parte variável (bônus por desempenho).',
  },

  alavancagem: {
    id: 'alavancagem',
    season: 3,
    name: 'Alavancagem financeira',
    short: 'Usar dinheiro de terceiros para crescer mais rápido, com risco maior.',
    explanation:
      'Adiantar receita futura de patrocínio para comprar um jogador agora é ' +
      'alavancagem. Pode acelerar resultados, mas compromete caixa futuro, ' +
      'reduzindo a margem de manobra se algo não sair como planejado.',
    trigger: 'Ao oferecer a opção de "adiantar patrocínio" ou financiar uma compra, mostrar o compromisso de caixa nas próximas rodadas.',
  },
  endividamento_fair_play: {
    id: 'endividamento_fair_play',
    season: 3,
    name: 'Endividamento e fair play financeiro',
    short: 'Existe um limite saudável de dívida em relação à receita.',
    explanation:
      'Assim como bancos usam covenants para limitar o endividamento de uma ' +
      'empresa, o fair play financeiro do futebol limita quanto um clube pode ' +
      'dever em relação ao que fatura. Ultrapassar esse limite gera penalidades, dentro e fora do jogo.',
    trigger: 'A cada rodada, calcular e exibir o índice dívida/receita, com aviso visual se estiver perto do limite.',
  },
  break_even: {
    id: 'break_even',
    season: 3,
    name: 'Ponto de equilíbrio (break-even)',
    short: 'O tanto que você precisa faturar só para não ter prejuízo.',
    explanation:
      'Ponto de equilíbrio é a receita mínima (público pagante, vitórias, bônus) ' +
      'necessária para cobrir a folha salarial e as despesas fixas. Abaixo disso, ' +
      'cada rodada aumenta o prejuízo, mesmo que o time jogue bem em campo.',
    trigger: 'Mostrar, no painel financeiro, quantas vitórias ou quanto público pagante é necessário na rodada para cobrir a folha.',
  },

  valor_presente_futuro: {
    id: 'valor_presente_futuro',
    season: 4,
    name: 'Valor presente e valor futuro do dinheiro',
    short: 'Um real hoje vale mais que um real daqui a um ano.',
    explanation:
      'Pagar um jogador à vista custa menos no total do que parcelar com juros ' +
      'embutidos. O dinheiro no futuro vale menos que o mesmo valor hoje, porque ' +
      'ele deixou de poder ser usado ou investido nesse meio tempo.',
    trigger: 'Ao oferecer opção de pagamento à vista vs. parcelado, mostrar o custo total de cada uma.',
  },
  roi_payback: {
    id: 'roi_payback',
    season: 4,
    name: 'ROI e payback',
    short: 'Em quanto tempo o investimento se paga, e quanto ele rende depois.',
    explanation:
      'ROI (retorno sobre investimento) mede o ganho gerado em relação ao valor ' +
      'investido. Payback é o tempo necessário para esse investimento se pagar. ' +
      'Um jogador caro que se paga em 3 rodadas pode ser melhor negócio que um barato que nunca se paga.',
    trigger: 'Ao comprar um jogador, estimar e mostrar o payback esperado em número de rodadas, com base em impacto de desempenho.',
  },
  analise_cenarios: {
    id: 'analise_cenarios',
    season: 4,
    name: 'Análise de cenários',
    short: 'Nenhuma decisão financeira deveria assumir só um futuro possível.',
    explanation:
      'Testar uma decisão em cenário otimista, realista e pessimista mostra a ' +
      'faixa real de resultados possíveis, em vez de uma única previsão que ' +
      'raramente se confirma exatamente como esperado.',
    trigger: 'Ao confirmar uma decisão importante, mostrar o resultado projetado nos três cenários antes da confirmação final.',
  },

  juros_compostos: {
    id: 'juros_compostos',
    season: 5,
    name: 'Juros compostos',
    short: 'Reinvestir o rendimento faz o dinheiro crescer sobre si mesmo.',
    explanation:
      'Lucro de venda de jogador reinvestido no fundo do clube rende novamente ' +
      'sobre o valor total (principal + rendimento anterior), não só sobre o valor ' +
      'original. É por isso que começar a reinvestir cedo importa mais que investir muito de uma vez.',
    trigger: 'Ao reinvestir lucro de venda no "fundo do clube", mostrar a projeção de crescimento composto ao longo das rodadas restantes.',
  },
  inflacao: {
    id: 'inflacao',
    season: 5,
    name: 'Inflação',
    short: 'O custo de manter as coisas sobe com o tempo, mesmo sem mudar nada.',
    explanation:
      'O custo de manutenção do elenco tende a subir a cada temporada. Se a ' +
      'receita não acompanha esse aumento, o poder de compra do clube encolhe, ' +
      'mesmo com o caixa nominal parecendo estável.',
    trigger: 'A cada nova temporada, aumentar o custo base de manutenção do elenco e mostrar o comparativo com a receita.',
  },
  reserva_emergencia: {
    id: 'reserva_emergencia',
    season: 5,
    name: 'Reserva de emergência',
    short: 'Guardar caixa mínimo para imprevistos evita decisões desesperadas.',
    explanation:
      'Manter uma reserva de caixa protege contra imprevistos como lesão de ' +
      'jogador-chave ou multa inesperada, evitando que o clube precise vender ' +
      'ativos importantes às pressas, em condições ruins, só para sobreviver a um susto.',
    trigger: 'Ao final do jogo, verificar se o clube manteve uma reserva mínima de caixa e destacar isso no extrato final.',
  },
}

export const CONCEPTS_BY_SEASON = (seasonId) =>
  Object.values(CONCEPTS).filter((c) => c.season === seasonId)
