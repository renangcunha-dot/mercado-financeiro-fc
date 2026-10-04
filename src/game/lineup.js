// Escalação tática: o jogador escolhe quais 11 dos 22 jogadores do elenco
// começam a rodada titulares, respeitando as posições exigidas pela
// formação escolhida. Só os titulares entram em risco de lesão na rodada;
// escalar um time mais fraco que o melhor possível (p.ex. poupar um
// titular caro) reduz a chance de vitória — o trade-off é proposital.

// Quantos jogadores de cada posição a formação exige, derivado dos slots.
export function requiredCounts(formation) {
  const counts = {}
  for (const slot of formation.slots) {
    counts[slot.role] = (counts[slot.role] || 0) + 1
  }
  return counts
}

// Sugestão de escalação: os jogadores de maior valor de mercado em cada
// posição. Serve de ponto de partida no modal, que o jogador pode ajustar.
export function autoBestLineup(squad, formation) {
  const counts = requiredCounts(formation)
  const used = new Set()
  const ids = []
  for (const role of Object.keys(counts)) {
    const pool = squad
      .filter((p) => p.position === role && !used.has(p.id))
      .sort((a, b) => b.marketValue - a.marketValue)
    for (let i = 0; i < counts[role] && i < pool.length; i++) {
      used.add(pool[i].id)
      ids.push(pool[i].id)
    }
  }
  return ids
}

// Uma escalação está completa quando, para cada posição exigida pela
// formação, o número de titulares escolhidos bate com o que é exigido (ou
// com o máximo disponível no elenco, se o elenco tiver menos jogadores
// naquela posição do que a formação pede).
export function isLineupComplete(squad, formation, startingIds) {
  const counts = requiredCounts(formation)
  const chosen = squad.filter((p) => startingIds.includes(p.id))
  return Object.entries(counts).every(([role, needed]) => {
    const available = squad.filter((p) => p.position === role).length
    const target = Math.min(needed, available)
    return chosen.filter((p) => p.position === role).length === target
  })
}

// Distância (em chance de vitória) entre a escalação escolhida e o melhor
// time possível pelo valor de mercado dos titulares. 0 = escalou o time
// mais forte disponível; quanto mais fraca a escalação, maior a penalidade.
export function lineupStrengthDelta(squad, formation, startingIds) {
  const bestIds = autoBestLineup(squad, formation)
  const bestPlayers = squad.filter((p) => bestIds.includes(p.id))
  const chosenPlayers = squad.filter((p) => startingIds.includes(p.id))
  if (bestPlayers.length === 0 || chosenPlayers.length === 0) return 0
  const bestAvg = bestPlayers.reduce((sum, p) => sum + p.marketValue, 0) / bestPlayers.length
  const chosenAvg = chosenPlayers.reduce((sum, p) => sum + p.marketValue, 0) / chosenPlayers.length
  const ratio = Math.min(1, chosenAvg / bestAvg)
  return (ratio - 1) * 0.15
}

// Encaixa os titulares escolhidos nos slots visuais da formação (para o
// FormationView), agrupando por posição e preenchendo na ordem dos slots.
export function buildLineupSlots(squad, formation, startingIds) {
  const byRole = {}
  for (const id of startingIds) {
    const player = squad.find((p) => p.id === id)
    if (!player) continue
    byRole[player.position] = byRole[player.position] || []
    byRole[player.position].push(player)
  }
  const used = new Set()
  return formation.slots.map((slot) => {
    const pool = byRole[slot.role] || []
    const player = pool.find((p) => !used.has(p.id))
    if (player) used.add(player.id)
    return { ...slot, player: player || null }
  })
}
