// Cada formação define: distribuição de posições em campo (para o desenho
// do FormationView), e um pequeno efeito de risco-retorno próprio, somado
// ao efeito da postura tática (ofensivo/equilibrado/defensivo). Formações
// mais ofensivas (4-3-3) arriscam mais o elenco; mais compactas (3-5-2)
// protegem o elenco mas têm teto de ataque menor.

export const FORMATIONS = {
  '4-4-2': {
    id: '4-4-2',
    label: '4-4-2 · Equilíbrio',
    description: 'Formação clássica, sem viés claro de risco.',
    winChanceDelta: 0,
    injuryChance: 0,
    slots: [
      { role: 'Goleiro', x: 200, y: 545 },
      { role: 'Lateral', x: 55, y: 430 },
      { role: 'Zagueiro', x: 150, y: 450 },
      { role: 'Zagueiro', x: 250, y: 450 },
      { role: 'Lateral', x: 345, y: 430 },
      { role: 'Meio-campo', x: 60, y: 300 },
      { role: 'Meio-campo', x: 160, y: 320 },
      { role: 'Meio-campo', x: 240, y: 320 },
      { role: 'Meio-campo', x: 340, y: 300 },
      { role: 'Atacante', x: 140, y: 160 },
      { role: 'Atacante', x: 260, y: 160 },
    ],
  },
  '4-3-3': {
    id: '4-3-3',
    label: '4-3-3 · Ofensiva',
    description: 'Mais um atacante em campo: mais chance de vitória, mais desgaste do elenco.',
    winChanceDelta: 0.05,
    injuryChance: 0.05,
    slots: [
      { role: 'Goleiro', x: 200, y: 545 },
      { role: 'Lateral', x: 55, y: 430 },
      { role: 'Zagueiro', x: 150, y: 450 },
      { role: 'Zagueiro', x: 250, y: 450 },
      { role: 'Lateral', x: 345, y: 430 },
      { role: 'Meio-campo', x: 120, y: 300 },
      { role: 'Meio-campo', x: 200, y: 320 },
      { role: 'Meio-campo', x: 280, y: 300 },
      { role: 'Atacante', x: 90, y: 160 },
      { role: 'Atacante', x: 200, y: 130 },
      { role: 'Atacante', x: 310, y: 160 },
    ],
  },
  '3-5-2': {
    id: '3-5-2',
    label: '3-5-2 · Controle',
    description: 'Domínio de meio-campo, defesa mais enxuta: protege o elenco, teto de ataque menor.',
    winChanceDelta: 0.02,
    injuryChance: -0.03,
    slots: [
      { role: 'Goleiro', x: 200, y: 545 },
      { role: 'Zagueiro', x: 110, y: 450 },
      { role: 'Zagueiro', x: 200, y: 465 },
      { role: 'Zagueiro', x: 290, y: 450 },
      { role: 'Meio-campo', x: 40, y: 320 },
      { role: 'Meio-campo', x: 130, y: 340 },
      { role: 'Meio-campo', x: 200, y: 300 },
      { role: 'Meio-campo', x: 270, y: 340 },
      { role: 'Meio-campo', x: 360, y: 320 },
      { role: 'Atacante', x: 150, y: 160 },
      { role: 'Atacante', x: 250, y: 160 },
    ],
  },
}

export const FORMATION_LIST = Object.values(FORMATIONS)
