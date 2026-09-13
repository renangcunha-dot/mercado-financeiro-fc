import { formatBRL } from '../game/format'

export default function RoundSummary({ entry, eventOutcome, onContinue }) {
  if (!entry) return null
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-ink/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-chalk text-ink rounded-sm p-6 shadow-2xl">
        <p className="font-display uppercase tracking-wide text-xs text-pitch mb-1">
          Rodada {entry.round} · {entry.tactic} ·{' '}
          {entry.outcome === 'win' ? 'Vitória' : entry.outcome === 'draw' ? 'Empate' : 'Derrota'}
        </p>
        <h3 className="font-display text-2xl mb-4">Extrato da rodada</h3>
        {entry.injuryEvent && (
          <p className="text-xs font-body bg-risk/15 border border-risk/30 rounded-sm px-3 py-2 mb-4 text-risk">
            {entry.injuryEvent.playerName} se contundiu durante a rodada e perdeu valor de mercado.
          </p>
        )}
        {eventOutcome && (
          <p className="text-xs font-body bg-gold/15 border border-gold/30 rounded-sm px-3 py-2 mb-4 text-ink/80">
            {eventOutcome}
          </p>
        )}
        <div className="space-y-2 font-body text-sm">
          <div className="flex justify-between">
            <span className="text-ink/60">Receita (bilheteria + patrocínio)</span>
            <span className="text-pitch">+{formatBRL(entry.revenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Folha salarial (custo fixo)</span>
            <span className="text-risk">-{formatBRL(entry.fixedCost)}</span>
          </div>
          {entry.bonusCost > 0 && (
            <div className="flex justify-between">
              <span className="text-ink/60">Bônus por vitória (custo variável)</span>
              <span className="text-risk">-{formatBRL(entry.bonusCost)}</span>
            </div>
          )}
          {entry.debtInterest > 0 && (
            <div className="flex justify-between">
              <span className="text-ink/60">Juros sobre dívida</span>
              <span className="text-risk">-{formatBRL(entry.debtInterest)}</span>
            </div>
          )}
          {entry.dueInstallments > 0 && (
            <div className="flex justify-between">
              <span className="text-ink/60">Parcela de financiamento</span>
              <span className="text-risk">-{formatBRL(entry.dueInstallments)}</span>
            </div>
          )}
          <div className="border-t border-ink/15 pt-2 flex justify-between font-display text-base">
            <span>Saldo da rodada</span>
            <span className={entry.netCashFlow >= 0 ? 'text-pitch' : 'text-risk'}>
              {entry.netCashFlow >= 0 ? '+' : ''}
              {formatBRL(entry.netCashFlow)}
            </span>
          </div>
        </div>
        <button
          onClick={onContinue}
          className="mt-6 w-full bg-pitch text-chalk font-display uppercase tracking-wide text-sm py-3 rounded-sm hover:bg-pitch-light transition-colors"
        >
          Próxima rodada
        </button>
      </div>
    </div>
  )
}
