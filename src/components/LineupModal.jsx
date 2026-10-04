import { useEffect, useState } from 'react'
import { formatBRL } from '../game/format'
import { requiredCounts, autoBestLineup, isLineupComplete } from '../game/lineup'

const POSITION_ORDER = ['Goleiro', 'Zagueiro', 'Lateral', 'Meio-campo', 'Atacante']

export default function LineupModal({ open, squad, formation, initialIds, onConfirm }) {
  const [selected, setSelected] = useState(initialIds || [])

  useEffect(() => {
    if (!open) return
    const counts = requiredCounts(formation)
    // Descarta ids de posições que a formação atual não exige (ex.: trocar
    // de 4-4-2 para 3-5-2 remove os laterais da escalação).
    const valid = (initialIds || []).filter((id) => squad.some((p) => p.id === id && counts[p.position]))
    setSelected(valid.length > 0 ? valid : autoBestLineup(squad, formation))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, formation.id])

  if (!open) return null

  const counts = requiredCounts(formation)
  const complete = isLineupComplete(squad, formation, selected)

  function toggle(player) {
    if (selected.includes(player.id)) {
      setSelected(selected.filter((id) => id !== player.id))
      return
    }
    const needed = counts[player.position] || 0
    const chosenInRole = squad.filter((p) => selected.includes(p.id) && p.position === player.position).length
    if (chosenInRole >= needed) return
    setSelected([...selected, player.id])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-chalk text-ink rounded-sm p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <p className="font-display uppercase tracking-wide text-xs text-pitch mb-1">Antes da rodada</p>
        <h3 className="font-display text-2xl mb-1">Escale o time</h3>
        <p className="font-body text-xs text-ink/60 mb-4">
          {formation.label}: escolha os titulares. Quem fica no banco não entra em campo e não corre risco de
          lesão nesta rodada.
        </p>

        <button
          onClick={() => setSelected(autoBestLineup(squad, formation))}
          className="w-full mb-4 border border-pitch text-pitch font-display text-xs uppercase tracking-wide py-2 rounded-sm hover:bg-pitch/5 transition-colors"
        >
          Escalar o time mais forte automaticamente
        </button>

        <div className="space-y-4">
          {POSITION_ORDER.filter((role) => counts[role]).map((role) => {
            const players = squad.filter((p) => p.position === role)
            const chosenCount = players.filter((p) => selected.includes(p.id)).length
            const target = Math.min(counts[role], players.length)
            return (
              <div key={role}>
                <p className="font-display text-xs uppercase tracking-wide text-ink/50 mb-2">
                  {role} ({chosenCount}/{target})
                </p>
                <div className="space-y-1">
                  {players.map((p) => {
                    const isSelected = selected.includes(p.id)
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggle(p)}
                        className={`w-full text-left border rounded-sm px-3 py-2 flex items-center justify-between transition-colors ${
                          isSelected ? 'border-pitch bg-pitch/10' : 'border-ink/15 hover:border-ink/30'
                        }`}
                      >
                        <span className="font-body text-sm">{p.name}</span>
                        <span className="font-body text-xs text-ink/50">{formatBRL(p.marketValue)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => onConfirm(selected)}
          disabled={!complete}
          className="w-full mt-5 bg-gold text-ink font-display uppercase tracking-wide text-sm py-3 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold-light transition-colors"
        >
          {complete ? 'Confirmar escalação' : 'Escolha os titulares de cada posição'}
        </button>
      </div>
    </div>
  )
}
