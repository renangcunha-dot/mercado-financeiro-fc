// Cada temporada define orçamento inicial, número de rodadas,
// os conceitos financeiros que ficam ativos, e a condição de avanço.
// Isso é o "mapa de progressão" combinado com o usuário.

export const SEASONS = [
  {
    id: 1,
    name: 'Temporada 1 — Base',
    objective: 'Aprender a jogar sem quebrar',
    startingBudget: 20_000_000,
    rounds: 5,
    activeConcepts: ['restricao_orcamentaria', 'custo_oportunidade', 'receita_despesa'],
    advanceCondition: {
      type: 'cashPositiveAtEnd',
      description: 'Terminar as 5 rodadas com caixa positivo',
    },
  },
  {
    id: 2,
    name: 'Temporada 2 — Risco',
    objective: 'Entender que toda decisão financeira envolve incerteza',
    startingBudget: 40_000_000,
    rounds: 6,
    activeConcepts: ['risco_retorno', 'diversificacao', 'depreciacao_valorizacao', 'custo_fixo_variavel'],
    advanceCondition: {
      type: 'surviveCrisis',
      description: 'Sobreviver a uma crise simulada (lesão de jogador-chave) sem quebrar o caixa',
    },
  },
  {
    id: 3,
    name: 'Temporada 3 — Estrutura de Capital',
    objective: 'Gerenciar dívida e ponto de equilíbrio',
    startingBudget: 70_000_000,
    rounds: 6,
    activeConcepts: ['alavancagem', 'endividamento_fair_play', 'break_even'],
    advanceCondition: {
      type: 'debtRatioBelowLimit',
      description: 'Manter índice de dívida/receita abaixo do limite por 3 rodadas seguidas',
    },
  },
  {
    id: 4,
    name: 'Temporada 4 — Investimento',
    objective: 'Avaliar decisões no tempo',
    startingBudget: 100_000_000,
    rounds: 7,
    activeConcepts: ['valor_presente_futuro', 'roi_payback', 'analise_cenarios'],
    advanceCondition: {
      type: 'tryAllScenarios',
      description: 'Tomar pelo menos uma decisão em cada cenário (otimista, realista, pessimista)',
    },
  },
  {
    id: 5,
    name: 'Temporada 5 — Legado',
    objective: 'Pensar a longo prazo, não só na próxima rodada',
    startingBudget: null, // calculado a partir do desempenho acumulado
    rounds: 8,
    activeConcepts: ['juros_compostos', 'inflacao', 'reserva_emergencia'],
    advanceCondition: {
      type: 'emergencyReserveBuilt',
      description: 'Encerrar o jogo com reserva de emergência mínima constituída',
    },
  },
]
