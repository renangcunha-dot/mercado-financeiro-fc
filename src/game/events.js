// Eventos aleatórios. Cada evento tem duas escolhas com efeitos financeiros
// diferentes, muitas vezes ligadas a um conceito já ensinado, reforçando o
// aprendizado através de uma decisão real, não de repetição de texto.
// "minSeason" evita que eventos avançados apareçam cedo demais.

export const EVENT_POOL = [
  {
    id: 'patrocinio_extra',
    minSeason: 1,
    title: 'Proposta de patrocínio relâmpago',
    description:
      'Uma marca local oferece um patrocínio pontual para estampar a camisa por uma rodada.',
    choices: [
      {
        label: 'Aceitar (+receita imediata, exposição menor a longo prazo)',
        effect: (state) => ({ ...state, cash: state.cash + 350_000 }),
        outcome: 'Você aceitou. O caixa recebeu um reforço imediato.',
      },
      {
        label: 'Recusar (manter identidade visual, sem ganho agora)',
        effect: (state) => state,
        outcome: 'Você recusou. Nenhuma mudança no caixa desta rodada.',
      },
    ],
  },
  {
    id: 'lesao_jogador',
    minSeason: 2,
    title: 'Lesão de jogador-chave',
    description:
      'Seu jogador mais valioso sofreu uma lesão muscular e precisa de tratamento.',
    concept: 'diversificacao',
    requiresSquad: true,
    choices: [
      {
        label: 'Tratamento rápido e caro (custo alto agora, volta em 1 rodada)',
        effect: (state) => ({ ...state, cash: state.cash - 250_000 }),
        outcome: 'Tratamento acelerado concluído, custo debitado do caixa.',
      },
      {
        label: 'Tratamento padrão (mais barato, jogador perde valor de mercado)',
        effect: (state) => {
          if (state.squad.length === 0) return state
          const target = [...state.squad].sort((a, b) => b.marketValue - a.marketValue)[0]
          const squad = state.squad.map((p) =>
            p.id === target.id ? { ...p, marketValue: Math.round(p.marketValue * 0.85) } : p
          )
          return { ...state, squad }
        },
        outcome: 'Tratamento padrão. O jogador perdeu valor de mercado por ficar tempo parado.',
      },
    ],
  },
  {
    id: 'proposta_rival',
    minSeason: 2,
    title: 'Proposta de compra de um rival',
    description: 'Um clube rival oferece 20% acima do valor de mercado por um dos seus jogadores.',
    concept: 'custo_oportunidade',
    requiresSquad: true,
    choices: [
      {
        label: 'Vender o jogador mais valioso com ágio',
        effect: (state) => {
          if (state.squad.length === 0) return state
          const target = [...state.squad].sort((a, b) => b.marketValue - a.marketValue)[0]
          const sellPrice = Math.round(target.marketValue * 1.2)
          return {
            ...state,
            cash: state.cash + sellPrice,
            squad: state.squad.filter((p) => p.id !== target.id),
          }
        },
        outcome: 'Venda concluída com ágio de 20% sobre o valor de mercado.',
      },
      {
        label: 'Recusar e manter o elenco',
        effect: (state) => state,
        outcome: 'Proposta recusada. O jogador segue no elenco.',
      },
    ],
  },
  {
    id: 'multa_fiscal',
    minSeason: 3,
    title: 'Multa por atraso administrativo',
    description: 'Uma pendência burocrática gerou uma multa inesperada.',
    concept: 'reserva_emergencia',
    choices: [
      {
        label: 'Pagar à vista',
        effect: (state) => ({ ...state, cash: state.cash - 300_000 }),
        outcome: 'Multa quitada à vista.',
      },
      {
        label: 'Parcelar (gera dívida futura)',
        effect: (state) => ({ ...state, cash: state.cash - 100_000, debt: (state.debt || 0) + 250_000 }),
        outcome: 'Multa parcelada. Parte dela virou dívida para as próximas rodadas.',
      },
    ],
  },
  {
    id: 'bonus_torcida',
    minSeason: 1,
    title: 'Recorde de público',
    description: 'A torcida lotou o estádio na última rodada, gerando receita extra de bilheteria.',
    choices: [
      {
        label: 'Reinvestir tudo no elenco (some ao caixa)',
        effect: (state) => ({ ...state, cash: state.cash + 220_000 }),
        outcome: 'Receita extra somada ao caixa disponível.',
      },
      {
        label: 'Guardar como reserva de emergência',
        effect: (state) => ({
          ...state,
          cash: state.cash + 220_000,
          emergencyFund: (state.emergencyFund || 0) + 220_000,
        }),
        outcome: 'Valor destinado à reserva de emergência do clube.',
      },
    ],
  },
]

export function pickEvent(seasonId, hasSquad) {
  const eligible = EVENT_POOL.filter(
    (e) => e.minSeason <= seasonId && (!e.requiresSquad || hasSquad)
  )
  if (eligible.length === 0) return null
  return eligible[Math.floor(Math.random() * eligible.length)]
}

// Chance de evento por rodada. Cresce um pouco a cada temporada para manter
// o ritmo mais tenso conforme o jogo avança.
export function shouldTriggerEvent(seasonId) {
  const baseChance = 0.35
  const chance = Math.min(0.6, baseChance + seasonId * 0.04)
  return Math.random() < chance
}
