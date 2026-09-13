import { formatBRL } from '../game/format'
import { ACHIEVEMENTS } from '../game/achievements'
import ShareCardButton from './ShareCardButton'

export default function FinalReport({ state, club, position, totalClubs, netWorth, seasonName, onRestart }) {
  const totalRevenue = state.history.reduce((s, h) => s + h.revenue, 0)
  const totalCost = state.history.reduce((s, h) => s + h.fixedCost + h.bonusCost, 0)
  const squadValue = state.squad.reduce((s, p) => s + p.marketValue, 0)
  const unlockedBadges = (state.badges || []).map((id) => ACHIEVEMENTS[id]).filter(Boolean)

  return (
    <div className="min-h-screen bg-pitch-dark flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-chalk text-ink rounded-sm p-8">
        <p className="font-display uppercase tracking-wide text-xs text-pitch mb-1">Fim de jornada</p>
        <h2 className="font-display text-3xl mb-1">Extrato final do clube</h2>
        <p className="font-display text-gold text-sm mb-6">{state.financialTitle || 'Estagiário Financeiro'}</p>

        <div className="space-y-3 font-body text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-ink/60">Caixa em mãos</span>
            <span className="font-display">{formatBRL(state.cash)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Valor do elenco</span>
            <span className="font-display">{formatBRL(squadValue)}</span>
          </div>
          <div className="flex justify-between border-t border-ink/15 pt-3">
            <span className="text-ink/60">Patrimônio total</span>
            <span className="font-display text-lg text-pitch">{formatBRL(netWorth)}</span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="text-ink/60">Índice de Saúde Financeira final</span>
            <span className="font-display">{state.financialHealthScore}/100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Receita acumulada</span>
            <span className="font-display">{formatBRL(totalRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Despesa acumulada</span>
            <span className="font-display">{formatBRL(totalCost)}</span>
          </div>
        </div>

        <div className="border-t border-ink/15 pt-4 mb-4">
          <p className="font-display text-sm mb-2">
            Conquistas desbloqueadas ({unlockedBadges.length}/{Object.keys(ACHIEVEMENTS).length})
          </p>
          <div className="flex flex-wrap gap-2">
            {unlockedBadges.map((b) => (
              <span key={b.id} className="text-[11px] font-body bg-gold/15 text-ink/80 px-2 py-1 rounded-sm">
                🏆 {b.name}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-ink/15 pt-4 mb-6">
          <p className="font-display text-sm mb-2">Conceitos aprendidos ({state.unlockedConcepts.length}/15)</p>
          <p className="text-ink/60 text-xs font-body leading-relaxed">
            Você passou pelos fundamentos de orçamento, risco e retorno, estrutura de
            capital, análise de investimento e planejamento de longo prazo, tudo
            aplicado a decisões reais de um clube de futebol.
          </p>
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-pitch text-chalk font-display uppercase tracking-wide text-sm py-3 rounded-sm hover:bg-pitch-light transition-colors"
        >
          Jogar novamente
        </button>

        <div className="mt-4">
          <ShareCardButton
            club={club}
            financialTitle={state.financialTitle || 'Estagiário Financeiro'}
            financialHealthScore={state.financialHealthScore}
            points={state.points}
            position={position}
            totalClubs={totalClubs}
            netWorth={netWorth}
            seasonName={seasonName}
            label="Baixar cartão de resultado final"
          />
        </div>
      </div>
    </div>
  )
}
