// Cada tática altera a chance de vitória, o multiplicador de bônus pago
// aos jogadores e a chance de um evento de lesão. Isso transforma "jogar
// a rodada" numa decisão real de risco-retorno, não um clique único.

export const TACTICS = {
  ofensivo: {
    id: 'ofensivo',
    name: 'Ofensivo',
    description: 'Mais chance de vitória e bônus maior, mas desgasta o elenco.',
    winChanceDelta: 0.15,
    bonusMultiplier: 1.5,
    injuryChance: 0.22,
    concept: 'risco_retorno',
  },
  equilibrado: {
    id: 'equilibrado',
    name: 'Equilibrado',
    description: 'Perfil intermediário de risco e retorno.',
    winChanceDelta: 0,
    bonusMultiplier: 1,
    injuryChance: 0.08,
  },
  defensivo: {
    id: 'defensivo',
    name: 'Defensivo',
    description: 'Menos chance de vitória e bônus menor, mas protege o elenco.',
    winChanceDelta: -0.12,
    bonusMultiplier: 0.6,
    injuryChance: 0.02,
  },
}

export const TACTIC_LIST = Object.values(TACTICS)
