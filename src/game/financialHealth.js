// Este é o principal diferencial de aprendizado do jogo: em vez de só
// mostrar caixa e patrimônio, calculamos um Índice de Saúde Financeira
// (0 a 100), recalculado a cada rodada, que resume se as DECISÕES do
// jogador seguem boas práticas financeiras, não só se ele está "ganhando".
// É plenamente possível estar em 1º lugar no campeonato e ter um índice
// de saúde financeira baixo — essa divergência É a lição.

function liquidityScore(state, fixedCost) {
  if (fixedCost <= 0) return 30
  const monthsCovered = state.cash / fixedCost
  return Math.max(0, Math.min(30, monthsCovered * 15))
}

function debtScore(state, netWorth) {
  const debt = state.debt || 0
  if (netWorth <= 0) return 0
  const ratio = debt / netWorth
  return Math.max(0, 25 - ratio * 25)
}

function diversificationScore(state) {
  if (state.squad.length === 0) return 10
  const totalValue = state.squad.reduce((s, p) => s + p.marketValue, 0)
  if (totalValue === 0) return 10
  const maxShare = Math.max(...state.squad.map((p) => p.marketValue / totalValue))
  // Quanto menor a concentração no jogador mais caro, melhor a diversificação.
  return Math.max(0, 20 * (1 - maxShare))
}

function reserveScore(state, seasonStartingBudget) {
  const target = (seasonStartingBudget || 20_000_000) * 0.15
  const fund = state.emergencyFund || 0
  return Math.min(15, (fund / target) * 15)
}

function consistencyScore(state) {
  const recent = state.history.slice(-3)
  if (recent.length === 0) return 5
  const positiveRounds = recent.filter((h) => h.netCashFlow >= 0).length
  return (positiveRounds / recent.length) * 10
}

export function computeFinancialHealth(state, netWorth, fixedCost, seasonStartingBudget) {
  const liquidity = liquidityScore(state, fixedCost)
  const debt = debtScore(state, netWorth)
  const diversification = diversificationScore(state)
  const reserve = reserveScore(state, seasonStartingBudget)
  const consistency = consistencyScore(state)
  const score = Math.round(liquidity + debt + diversification + reserve + consistency)
  return {
    score: Math.max(0, Math.min(100, score)),
    breakdown: { liquidity, debt, diversification, reserve, consistency },
  }
}

export const TITLES = [
  { min: 0, name: 'Estagiário Financeiro' },
  { min: 40, name: 'Analista Financeiro' },
  { min: 60, name: 'Gerente Financeiro' },
  { min: 75, name: 'Diretor Financeiro' },
  { min: 90, name: 'CFO Lendário' },
]

export function titleForScore(score) {
  let current = TITLES[0]
  for (const t of TITLES) {
    if (score >= t.min) current = t
  }
  return current.name
}
