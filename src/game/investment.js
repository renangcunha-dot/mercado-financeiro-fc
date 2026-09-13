// A cada rodada, o clube tem um orçamento de investimento discricionário
// pequeno (separado do caixa principal) que precisa ser alocado numa só
// frente. É uma decisão real de alocação de capital: cada opção tem um
// perfil de retorno diferente, e só uma pode ser escolhida por rodada.

export const INVESTMENT_OPTIONS = {
  marketing: {
    id: 'marketing',
    name: 'Marketing e patrocínio',
    description: 'Aumenta a receita da PRÓXIMA rodada em 25%. Efeito único, não acumula.',
    risk: 'baixo',
  },
  scouting: {
    id: 'scouting',
    name: 'Olheiros (scouting)',
    description:
      'Chance de encontrar um jogador com 20% de desconto no mercado na próxima rodada. Pode não dar em nada.',
    risk: 'medio',
  },
  infraestrutura: {
    id: 'infraestrutura',
    name: 'Infraestrutura do clube',
    description:
      'Aumenta a receita base permanentemente em 4%, mas o efeito é pequeno e só compensa a longo prazo.',
    risk: 'baixo_longo_prazo',
  },
}

export const INVESTMENT_LIST = Object.values(INVESTMENT_OPTIONS)

export function investmentBudgetForRound(state) {
  // Cresce com o orçamento da temporada, mas é sempre uma fração pequena
  // do caixa, para não virar substituto da decisão principal de compra.
  return Math.round(state.cash * 0.03) || 50_000
}

export function applyInvestment(state, optionId, marketPlayers) {
  switch (optionId) {
    case 'marketing':
      return { ...state, revenueBoostNextRound: 0.25 }
    case 'scouting': {
      const found = Math.random() < 0.5
      if (!found || marketPlayers.length === 0) return { ...state, scoutingOutcome: 'sem_achado' }
      const target = marketPlayers[Math.floor(Math.random() * marketPlayers.length)]
      const market = state.market.map((p) =>
        p.id === target.id ? { ...p, marketValue: Math.round(p.marketValue * 0.8), discounted: true } : p
      )
      return { ...state, market, scoutingOutcome: target.name }
    }
    case 'infraestrutura':
      return { ...state, infrastructureLevel: (state.infrastructureLevel || 0) + 1 }
    default:
      return state
  }
}
