import { TACTIC_LIST } from '../game/tactics'

export default function TacticModal({ open, onChoose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-chalk text-ink rounded-sm p-6 shadow-2xl">
        <p className="font-display uppercase tracking-wide text-xs text-pitch mb-1">Antes da rodada</p>
        <h3 className="font-display text-2xl mb-4">Escolha a postura tática</h3>
        <div className="space-y-2">
          {TACTIC_LIST.map((t) => (
            <button
              key={t.id}
              onClick={() => onChoose(t.id)}
              className="w-full text-left border border-ink/15 hover:border-pitch hover:bg-pitch/5 rounded-sm p-3 transition-colors"
            >
              <p className="font-display text-base">{t.name}</p>
              <p className="font-body text-xs text-ink/60 mt-1">{t.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
