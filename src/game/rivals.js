import { CLUBS } from '../data/clubs'

// 7 rivais + você = liga de 8 clubes. Todos começam com o MESMO orçamento
// (nenhuma vantagem inicial). O que diferencia cada um é o "estilo de
// gestão": um conjunto de parâmetros que afeta tanto o resultado esportivo
// (vitória/empate/derrota, pontos) quanto a evolução financeira (patrimônio).
// Isso cria duas tabelas que podem divergir, que é a lição central do jogo:
// ser campeão em campo não significa ser saudável financeiramente.

export const STYLES = {
  agressivo: {
    id: 'agressivo',
    label: 'Agressivo',
    description: 'Aposta tudo em resultado esportivo, arriscando o financeiro.',
    winProb: 0.5,
    drawProb: 0.18,
    netWorthVolatility: 0.09,
    netWorthBias: 0.005,
  },
  conservador: {
    id: 'conservador',
    label: 'Conservador',
    description: 'Prioriza saúde financeira, mesmo abrindo mão de resultado.',
    winProb: 0.34,
    drawProb: 0.36,
    netWorthVolatility: 0.03,
    netWorthBias: 0.015,
  },
  especulador: {
    id: 'especulador',
    label: 'Especulador',
    description: 'Extremos: pode disparar ou quebrar. Sem meio-termo.',
    winProb: 0.42,
    drawProb: 0.14,
    netWorthVolatility: 0.14,
    netWorthBias: -0.005,
  },
  equilibrado: {
    id: 'equilibrado',
    label: 'Equilibrado',
    description: 'Sem grandes apostas em nenhuma direção.',
    winProb: 0.4,
    drawProb: 0.26,
    netWorthVolatility: 0.05,
    netWorthBias: 0.008,
  },
}

// Os 7 clubes que o jogador NÃO escolheu viram os rivais da liga, cada um
// carregando seu próprio escudo (cores) para a tabela e telas de clube.
export function initRivals(startingNetWorth, chosenClubId) {
  return CLUBS.filter((c) => c.id !== chosenClubId).map((c) => ({
    id: c.id,
    name: c.name,
    club: c,
    style: c.style,
    netWorth: startingNetWorth,
    points: 0,
    wins: 0,
    draws: 0,
    losses: 0,
  }))
}

function matchOutcome(winProb, drawProb) {
  const roll = Math.random()
  if (roll < winProb) return 'win'
  if (roll < winProb + drawProb) return 'draw'
  return 'loss'
}

function styleOf(rival) {
  return STYLES[rival.style] || STYLES.equilibrado
}

// Rubber-banding leve: rivais muito atrás do jogador (em pontos) recebem um
// pequeno empurrão de chance de vitória e de crescimento financeiro; rivais
// muito à frente recebem um pequeno freio. O efeito é limitado (no máximo
// ±8 pontos percentuais) para não anular o impacto das decisões do jogador,
// só evitar que o jogo fique morno depois de uma disparada cedo demais.
function rubberBandFactor(rivalPoints, playerPoints) {
  const diff = playerPoints - rivalPoints
  const factor = Math.max(-0.08, Math.min(0.08, diff * 0.01))
  return factor
}

// Evolui cada rival por rodada: resultado esportivo (pontos) e variação
// de patrimônio, de acordo com o estilo do clube, com um ajuste leve de
// equilíbrio de jogo baseado na diferença de pontos para o jogador.
export function evolveRivals(rivals, playerPoints = 0) {
  return rivals.map((r) => {
    const style = styleOf(r)
    const band = rubberBandFactor(r.points, playerPoints)
    const winProb = Math.max(0.1, Math.min(0.75, style.winProb + band))
    const outcome = matchOutcome(winProb, style.drawProb)
    const pointsGained = outcome === 'win' ? 3 : outcome === 'draw' ? 1 : 0

    const pct = style.netWorthBias + band * 0.3 + (Math.random() * 2 - 1) * style.netWorthVolatility
    const nextNetWorth = Math.max(1_000_000, Math.round(r.netWorth * (1 + pct)))

    return {
      ...r,
      netWorth: nextNetWorth,
      lastDelta: nextNetWorth - r.netWorth,
      points: r.points + pointsGained,
      wins: r.wins + (outcome === 'win' ? 1 : 0),
      draws: r.draws + (outcome === 'draw' ? 1 : 0),
      losses: r.losses + (outcome === 'loss' ? 1 : 0),
      lastOutcome: outcome,
    }
  })
}

export function resetRivalPointsForNewSeason(rivals) {
  return rivals.map((r) => ({ ...r, points: 0, wins: 0, draws: 0, losses: 0 }))
}

export function buildFinancialRanking(playerNetWorth, rivals, playerName = 'Seu clube', playerClub = null) {
  const table = [
    { id: 'you', name: playerName, netWorth: playerNetWorth, isPlayer: true, club: playerClub },
    ...rivals.map((r) => ({ id: r.id, name: r.name, netWorth: r.netWorth, isPlayer: false, club: r.club })),
  ]
  table.sort((a, b) => b.netWorth - a.netWorth)
  return table.map((row, i) => ({ ...row, position: i + 1 }))
}

export function buildLeagueTable(playerStats, rivals, playerName = 'Seu clube', playerClub = null) {
  const table = [
    { id: 'you', name: playerName, isPlayer: true, club: playerClub, ...playerStats },
    ...rivals.map((r) => ({
      id: r.id,
      name: r.name,
      isPlayer: false,
      club: r.club,
      points: r.points,
      wins: r.wins,
      draws: r.draws,
      losses: r.losses,
      style: styleOf(r).label,
    })),
  ]
  table.sort((a, b) => b.points - a.points)
  return table.map((row, i) => ({ ...row, position: i + 1 }))
}
