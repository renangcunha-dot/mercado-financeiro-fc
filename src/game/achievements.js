// Conquistas recompensam comportamento financeiro correto, não só vencer
// partidas. Isso é o gancho de retenção estilo game (badges), mas alinhado
// ao objetivo de ensino: a lista deliberadamente mistura marcos esportivos
// e financeiros para deixar claro que são eixos diferentes.

export const ACHIEVEMENTS = {
  primeira_venda_lucro: {
    id: 'primeira_venda_lucro',
    name: 'Visão de mercado',
    description: 'Vendeu um jogador por um valor acima do que pagou.',
  },
  zero_divida_temporada: {
    id: 'zero_divida_temporada',
    name: 'Casa em ordem',
    description: 'Terminou uma temporada sem nenhuma dívida em aberto.',
  },
  reserva_construida: {
    id: 'reserva_construida',
    name: 'Colchão de segurança',
    description: 'Construiu uma reserva de emergência relevante para o tamanho do clube.',
  },
  saude_financeira_diretor: {
    id: 'saude_financeira_diretor',
    name: 'Nível Diretor',
    description: 'Atingiu Índice de Saúde Financeira de 75 ou mais.',
  },
  lider_pontos: {
    id: 'lider_pontos',
    name: 'Ponta da tabela',
    description: 'Terminou uma temporada na liderança do campeonato.',
  },
  campeao_sem_saude: {
    id: 'campeao_sem_saude',
    name: 'Sucesso frágil',
    description: 'Liderou o campeonato com Índice de Saúde Financeira abaixo de 50 — a lição central do jogo.',
  },
  todos_conceitos: {
    id: 'todos_conceitos',
    name: 'Glossário completo',
    description: 'Desbloqueou todos os 15 conceitos financeiros do jogo.',
  },
}

// Recebe o estado já atualizado (após uma rodada ou troca de temporada) e
// retorna a lista de badges que deveriam estar desbloqueados a essa altura,
// junto com quais são NOVOS em relação ao que já estava salvo.
export function evaluateAchievements(state, context = {}) {
  const unlocked = new Set(state.badges || [])
  const newly = []

  function unlock(id) {
    if (!unlocked.has(id)) {
      unlocked.add(id)
      newly.push(id)
    }
  }

  if (context.soldWithProfit) unlock('primeira_venda_lucro')
  if (context.seasonEndedWithZeroDebt) unlock('zero_divida_temporada')
  if ((state.emergencyFund || 0) >= 3_000_000) unlock('reserva_construida')
  if ((context.financialHealthScore || 0) >= 75) unlock('saude_financeira_diretor')
  if (context.seasonEndedLeadingTable) unlock('lider_pontos')
  if (context.seasonEndedLeadingTable && (context.financialHealthScore || 0) < 50) {
    unlock('campeao_sem_saude')
  }
  if (state.unlockedConcepts?.length >= 15) unlock('todos_conceitos')

  return { badges: Array.from(unlocked), newly }
}
