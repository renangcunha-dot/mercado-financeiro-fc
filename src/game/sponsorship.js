// A cada temporada, 3 propostas de patrocínio são oferecidas, com
// trade-offs reais: valor fixo maior e garantido vs. valor menor com
// bônus condicionado a desempenho esportivo (risco-retorno aplicado a
// receita, não só a jogadores).

export function generateSponsorOffers(seasonId) {
  const scale = 1 + seasonId * 0.25
  return [
    {
      id: 'fixo-conservador',
      sponsorName: 'Banco Cordilheira',
      description: 'Valor fixo garantido todas as rodadas, sem depender de resultado.',
      perRoundValue: Math.round(180_000 * scale),
      winBonus: 0,
    },
    {
      id: 'hibrido',
      sponsorName: 'Distribuidora Vale Forte',
      description: 'Valor fixo menor, mas paga bônus extra a cada vitória.',
      perRoundValue: Math.round(100_000 * scale),
      winBonus: Math.round(140_000 * scale),
    },
    {
      id: 'performance',
      sponsorName: 'TechSports Corp',
      description: 'Quase todo o valor depende de vitórias. Alto risco, alto potencial.',
      perRoundValue: Math.round(30_000 * scale),
      winBonus: Math.round(260_000 * scale),
    },
  ]
}

export function sponsorRevenueForRound(sponsorship, won) {
  if (!sponsorship) return 0
  return sponsorship.perRoundValue + (won ? sponsorship.winBonus : 0)
}
