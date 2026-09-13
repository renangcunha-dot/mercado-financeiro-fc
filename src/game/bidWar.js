// Jogadores marcados como "hot" no mercado geram concorrência real: um
// rival oferece um ágio, e o usuário precisa decidir se cobre a oferta
// (pagando mais) ou desiste e deixa o rival levar o jogador. Isso tira a
// compra do "clique único" e cria uma decisão de custo de oportunidade
// sob pressão de tempo real (o jogador some do mercado se você desistir).

export function generateRivalBid(player) {
  const premiumPct = 0.12 + Math.random() * 0.13 // 12% a 25% acima do valor de mercado
  return Math.round(player.marketValue * (1 + premiumPct))
}
