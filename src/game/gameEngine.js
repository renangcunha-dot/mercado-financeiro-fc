import { SEASONS } from '../data/seasons'
import { CLUBS, clubById } from '../data/clubs'
import { generateSquad, generateTransferMarket } from './playerGenerator'
import { initRivals, evolveRivals, resetRivalPointsForNewSeason } from './rivals'
import { TACTICS } from './tactics'
import { FORMATIONS } from './formations'
import { lineupStrengthDelta } from './lineup'
import { computeFinancialHealth, titleForScore } from './financialHealth'
import { evaluateAchievements } from './achievements'
import { sponsorRevenueForRound } from './sponsorship'

// Estado inicial do jogo, a partir do clube escolhido pelo jogador. Todos
// os 8 clubes (o jogador e os 7 rivais) começam com o MESMO orçamento e um
// elenco completo de 22 jogadores gerado na hora — nenhuma vantagem inicial.
export function createInitialState(clubId) {
  const season = SEASONS[0]
  const usedNames = new Set()
  const club = clubById(clubId) || CLUBS[0]
  const squad = generateSquad(usedNames).map((p) => ({ ...p, boughtFor: p.marketValue, roundsHeld: 0 }))
  const transferMarket = generateTransferMarket(60, usedNames)
  // O jogador recebe de graça um elenco de 22 jogadores com valor de mercado
  // próprio, além do caixa. Para a largada ser REALMENTE igual, os rivais
  // precisam começar com o mesmo patrimônio total (caixa + valor de elenco
  // equivalente), não só o mesmo caixa.
  const squadValue = squad.reduce((sum, p) => sum + p.marketValue, 0)

  return {
    clubId: club.id,
    seasonIndex: 0,
    round: 1,
    cash: season.startingBudget,
    squad,
    market: transferMarket,
    history: [],
    unlockedConcepts: [],
    debt: 0,
    installments: [],
    emergencyFund: 0,
    fixedCostInflationFactor: 1,
    infrastructureLevel: 0,
    revenueBoostNextRound: 0,
    scoutingOutcome: null,
    sponsorship: null,
    crisisSurvivedThisSeason: false,
    scenariosTriedThisSeason: new Set(),
    debtRatioOkStreak: 0,
    rivals: initRivals(season.startingBudget + squadValue, club.id),
    streak: 0,
    points: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    financialHealthScore: 50,
    badges: [],
    newlyUnlockedBadges: [],
    seenOnboarding: false,
    formationId: '4-4-2',
    startingXI: [],
    gameOver: false,
  }
}

export function currentSeason(state) {
  return SEASONS[state.seasonIndex]
}

export function currentClub(state) {
  return clubById(state.clubId) || CLUBS[0]
}

// Receita de bilheteria/base: cresce com o tamanho do elenco, infraestrutura
// e um eventual boost temporário de marketing.
export function ticketRevenue(state) {
  const base = 300_000
  const squadBonus = state.squad.length * 25_000
  const infraMultiplier = 1 + (state.infrastructureLevel || 0) * 0.04
  const marketingMultiplier = 1 + (state.revenueBoostNextRound || 0)
  return Math.round((base + squadBonus) * state.fixedCostInflationFactor * infraMultiplier * marketingMultiplier)
}

// Merchandising: receita passiva de venda de camisas e produtos, cresce
// com o tamanho do elenco (mais "estrelas" vendem mais produto) e com a
// posição na tabela (time popular vende mais).
export function merchandisingRevenue(state) {
  const base = 40_000
  const squadFactor = state.squad.length * 4_000
  const pointsFactor = (state.points || 0) * 2_500
  return Math.round((base + squadFactor + pointsFactor) * state.fixedCostInflationFactor)
}

export function roundRevenue(state, won) {
  return ticketRevenue(state) + merchandisingRevenue(state) + sponsorRevenueForRound(state.sponsorship, won)
}

// Custo de elenco (salários dos jogadores) e custo de estrutura (staff,
// manutenção do estádio) SEPARADOS — o custo de estrutura não desaparece
// mesmo com elenco pequeno, reforçando o conceito de custo fixo.
export function squadFixedCost(state) {
  const salaries = state.squad.reduce((sum, p) => sum + p.fixedSalary, 0)
  return Math.round(salaries * state.fixedCostInflationFactor)
}

export function staffFixedCost(state) {
  const base = 90_000 + state.squad.length * 3_000
  return Math.round(base * state.fixedCostInflationFactor)
}

export function installmentDue(state) {
  return (state.installments || []).reduce((sum, i) => sum + i.amount, 0)
}

export function buyPlayer(state, playerId, price = null) {
  const player = state.market.find((p) => p.id === playerId)
  if (!player) return { ok: false, state, reason: 'not_found' }
  if (state.squad.some((p) => p.id === playerId)) {
    return { ok: false, state, reason: 'already_owned' }
  }
  const finalPrice = price ?? player.marketValue
  if (finalPrice > state.cash) {
    return { ok: false, state, reason: 'insufficient_budget', concept: 'restricao_orcamentaria' }
  }
  const newState = {
    ...state,
    cash: state.cash - finalPrice,
    market: state.market.filter((p) => p.id !== playerId),
    squad: [...state.squad, { ...player, boughtFor: finalPrice, marketValue: player.marketValue, roundsHeld: 0 }],
  }
  return { ok: true, state: newState, concept: 'custo_oportunidade' }
}

export function buyPlayerFinanced(state, playerId, downPaymentPct = 0.3, installmentsCount = 4) {
  const player = state.market.find((p) => p.id === playerId)
  if (!player) return { ok: false, state, reason: 'not_found' }
  const interestRate = 0.06
  const totalWithInterest = Math.round(player.marketValue * (1 + interestRate))
  const downPayment = Math.round(totalWithInterest * downPaymentPct)
  if (downPayment > state.cash) {
    return { ok: false, state, reason: 'insufficient_budget', concept: 'restricao_orcamentaria' }
  }
  const remainingAmount = totalWithInterest - downPayment
  const installmentAmount = Math.round(remainingAmount / installmentsCount)
  const newState = {
    ...state,
    cash: state.cash - downPayment,
    market: state.market.filter((p) => p.id !== playerId),
    squad: [...state.squad, { ...player, boughtFor: totalWithInterest, marketValue: player.marketValue, roundsHeld: 0 }],
    installments: [
      ...(state.installments || []),
      { id: `${playerId}-${state.round}`, remaining: installmentsCount, amount: installmentAmount },
    ],
    debt: (state.debt || 0) + remainingAmount,
  }
  return { ok: true, state: newState, concept: 'valor_presente_futuro', totalWithInterest }
}

// Vender devolve o jogador ao mercado internacional, em vez de sumir —
// assim ele pode reaparecer como oportunidade para outra decisão futura.
export function sellPlayer(state, playerId) {
  const player = state.squad.find((p) => p.id === playerId)
  if (!player) return { ok: false, state, reason: 'not_found' }
  const profit = player.marketValue - player.boughtFor
  const newState = {
    ...state,
    cash: state.cash + player.marketValue,
    squad: state.squad.filter((p) => p.id !== playerId),
    market: [...state.market, { ...player, hot: false, discounted: false }],
  }
  return { ok: true, state: newState, profit, concept: 'depreciacao_valorizacao', soldWithProfit: profit > 0 }
}

export function signSponsor(state, offer) {
  return { ...state, sponsorship: { ...offer, roundsActive: 0 } }
}

export function simulateRound(state, tacticId = 'equilibrado', formationId = '4-4-2') {
  const tactic = TACTICS[tacticId] || TACTICS.equilibrado
  const formation = FORMATIONS[formationId] || FORMATIONS['4-4-2']

  const startingXI = (state.startingXI || []).filter((id) => state.squad.some((p) => p.id === id))
  const lineupDelta = startingXI.length > 0 ? lineupStrengthDelta(state.squad, formation, startingXI) : 0

  const winChance = Math.max(
    0.05,
    Math.min(0.85, 0.42 + tactic.winChanceDelta + formation.winChanceDelta + lineupDelta)
  )
  const drawChance = 0.25
  const roll = Math.random()
  const outcome = roll < winChance ? 'win' : roll < winChance + drawChance ? 'draw' : 'loss'
  const pointsGained = outcome === 'win' ? 3 : outcome === 'draw' ? 1 : 0
  const won = outcome === 'win'

  const revenue = roundRevenue(state, won)
  const fixedCost = squadFixedCost(state)
  const staffCost = staffFixedCost(state)
  const bonusCost = Math.round(
    state.squad.reduce((sum, p) => sum + (won ? p.bonusPerWin : 0), 0) * tactic.bonusMultiplier
  )
  const debtInterest = Math.round((state.debt || 0) * 0.02)
  const dueInstallments = installmentDue(state)
  const combinedInjuryChance = Math.max(0, tactic.injuryChance + formation.injuryChance)

  let updatedSquad = state.squad.map((p) => {
    const [min, max] = p.potentialRange
    const pct = (Math.random() * (max - min) + min) / 100
    const delta = Math.round(p.marketValue * pct)
    const newValue = Math.max(500_000, p.marketValue + delta)
    return {
      ...p,
      marketValue: newValue,
      lastDelta: newValue - p.marketValue,
      roundsHeld: p.roundsHeld + 1,
    }
  })

  // Só quem foi escalado titular corre risco de lesão na rodada; o banco
  // fica protegido (sem fallback, se não há escalação salva, todo o elenco
  // entra no sorteio — compatibilidade com saves antigos sem escalação).
  let injuryEvent = null
  const injuryPool = startingXI.length > 0 ? updatedSquad.filter((p) => startingXI.includes(p.id)) : updatedSquad
  if (injuryPool.length > 0 && Math.random() < combinedInjuryChance) {
    const target = injuryPool[Math.floor(Math.random() * injuryPool.length)]
    const idx = updatedSquad.findIndex((p) => p.id === target.id)
    const newValue = Math.round(target.marketValue * 0.85)
    updatedSquad = updatedSquad.map((p, i) => (i === idx ? { ...p, marketValue: newValue } : p))
    injuryEvent = { playerName: target.name }
  }

  const remainingInstallments = (state.installments || [])
    .map((i) => ({ ...i, remaining: i.remaining - 1 }))
    .filter((i) => i.remaining > 0)
  const newDebt = Math.max(0, (state.debt || 0) - dueInstallments)

  const netCashFlow = revenue - fixedCost - staffCost - bonusCost - debtInterest - dueInstallments
  const newCash = state.cash + netCashFlow
  const newStreak = won ? state.streak + 1 : 0

  const entry = {
    round: state.round,
    season: currentSeason(state).id,
    tactic: tactic.name,
    formation: formation.label,
    revenue,
    ticketRevenue: ticketRevenue(state),
    merchRevenue: merchandisingRevenue(state),
    sponsorRevenue: sponsorRevenueForRound(state.sponsorship, won),
    fixedCost,
    staffCost,
    bonusCost,
    debtInterest,
    dueInstallments,
    outcome,
    won,
    injuryEvent,
    netCashFlow,
    cashAfter: newCash,
  }

  let nextState = {
    ...state,
    cash: newCash,
    debt: newDebt,
    installments: remainingInstallments,
    squad: updatedSquad,
    startingXI,
    round: state.round + 1,
    history: [...state.history, entry],
    rivals: evolveRivals(state.rivals, state.points),
    streak: newStreak,
    points: state.points + pointsGained,
    wins: state.wins + (outcome === 'win' ? 1 : 0),
    draws: state.draws + (outcome === 'draw' ? 1 : 0),
    losses: state.losses + (outcome === 'loss' ? 1 : 0),
    revenueBoostNextRound: 0,
    sponsorship: state.sponsorship
      ? { ...state.sponsorship, roundsActive: state.sponsorship.roundsActive + 1 }
      : null,
  }

  const netWorth = playerNetWorth(nextState)
  const totalFixed = fixedCost + staffCost
  const { score } = computeFinancialHealth(nextState, netWorth, totalFixed, currentSeason(state).startingBudget)
  nextState.financialHealthScore = score
  nextState.financialTitle = titleForScore(score)

  // Grava o patrimônio pós-rodada na própria entrada do histórico, para
  // alimentar o gráfico de evolução sem precisar recalcular depois.
  const historyWithNetWorth = [...nextState.history]
  historyWithNetWorth[historyWithNetWorth.length - 1] = {
    ...historyWithNetWorth[historyWithNetWorth.length - 1],
    netWorthAfter: netWorth,
  }
  nextState.history = historyWithNetWorth

  const { badges, newly } = evaluateAchievements(nextState, { financialHealthScore: score })
  nextState.badges = badges
  nextState.newlyUnlockedBadges = newly

  return nextState
}

export function playerNetWorth(state) {
  const squadValue = state.squad.reduce((sum, p) => sum + p.marketValue, 0)
  return state.cash + squadValue - (state.debt || 0)
}

export function isSeasonComplete(state) {
  const season = currentSeason(state)
  return state.round > season.rounds
}

export function advanceToNextSeason(state) {
  const nextIndex = state.seasonIndex + 1

  const wasLeading = state.rivals.every((r) => state.points >= r.points)
  const { badges } = evaluateAchievements(state, {
    seasonEndedWithZeroDebt: (state.debt || 0) === 0,
    seasonEndedLeadingTable: wasLeading,
    financialHealthScore: state.financialHealthScore,
  })

  if (nextIndex >= SEASONS.length) {
    return { ...state, gameOver: true, badges }
  }

  const nextSeason = SEASONS[nextIndex]
  const carryOverBudget = nextSeason.startingBudget ?? Math.max(state.cash, 10_000_000)
  const boostedRivals = resetRivalPointsForNewSeason(state.rivals).map((r) => ({
    ...r,
    netWorth: r.netWorth + carryOverBudget,
  }))
  return {
    ...state,
    seasonIndex: nextIndex,
    round: 1,
    cash: state.cash + carryOverBudget,
    fixedCostInflationFactor: state.fixedCostInflationFactor * 1.08,
    crisisSurvivedThisSeason: false,
    scenariosTriedThisSeason: new Set(),
    debtRatioOkStreak: 0,
    rivals: boostedRivals,
    points: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    sponsorship: null, // contrato de patrocínio precisa ser renovado a cada temporada
    badges,
  }
}

export function unlockConcept(state, conceptId) {
  if (!conceptId || state.unlockedConcepts.includes(conceptId)) return state
  return { ...state, unlockedConcepts: [...state.unlockedConcepts, conceptId] }
}
