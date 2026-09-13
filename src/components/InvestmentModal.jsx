import { INVESTMENT_LIST, investmentBudgetForRound } from '../game/investment'
import { formatBRL } from '../game/format'

export default function InvestmentModal({ open, state, onChoose }) {
  if (!open) return null
  const budget = investmentBudgetForRound(state)
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-chalk text-ink rounded-sm p-6 shadow-2xl">
        <p className="font-display uppercase tracking-wide text-xs text-pitch mb-1">
          Orçamento de investimento: {formatBRL(budget)}
        </p>
        <h3 className="font-display text-2xl mb-4">Onde alocar este recurso?</h3>
        <div className="space-y-2">
          {INVESTMENT_LIST.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onChoose(opt.id)}
              className="w-full text-left border border-ink/15 hover:border-pitch hover:bg-pitch/5 rounded-sm p-3 transition-colors"
            >
              <p className="font-display text-base">{opt.name}</p>
              <p className="font-body text-xs text-ink/60 mt-1">{opt.description}</p>
            </button>
          ))}
          <button
            onClick={() => onChoose(null)}
            className="w-full text-center text-ink/40 font-body text-xs py-2 hover:text-ink/70"
          >
            Não investir nesta rodada
          </button>
        </div>
      </div>
    </div>
  )
}
