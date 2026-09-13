import { useState } from 'react'
import ClubCrest from './ClubCrest'

export default function SaveSlotSelect({ summaries, onContinue, onNewGame, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(null)

  return (
    <div className="min-h-screen bg-pitch-dark flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <p className="font-display uppercase tracking-wide text-xs text-gold text-center mb-2">
          Mercado Financeiro FC
        </p>
        <h1 className="font-display text-3xl text-chalk text-center mb-8">Escolha um slot de save</h1>

        <div className="space-y-3">
          {summaries.map((s) => (
            <div key={s.slot} className="border border-chalk/15 rounded-sm p-4 bg-chalk/5">
              {s.exists ? (
                <div className="flex items-center gap-4">
                  <ClubCrest club={s.club} size={44} />
                  <div className="flex-1">
                    <p className="font-display text-chalk text-base">{s.club.name}</p>
                    <p className="text-chalk/40 text-xs font-body">
                      {s.gameOver ? 'Jornada concluída' : `${s.seasonName} · Rodada ${s.round}`}
                    </p>
                  </div>
                  <button
                    onClick={() => onContinue(s.slot)}
                    className="bg-gold text-ink font-display text-xs uppercase tracking-wide px-4 py-2 rounded-sm hover:bg-gold-light transition-colors"
                  >
                    Continuar
                  </button>
                  {confirmDelete === s.slot ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          onDelete(s.slot)
                          setConfirmDelete(null)
                        }}
                        className="text-risk text-xs font-display uppercase px-2 py-2 border border-risk/40 rounded-sm hover:bg-risk/10"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-chalk/40 text-xs font-display uppercase px-2 py-2 border border-chalk/20 rounded-sm hover:bg-chalk/5"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(s.slot)}
                      title="Apagar save"
                      className="text-chalk/30 hover:text-risk border border-chalk/15 hover:border-risk/40 rounded-sm w-9 h-9 flex items-center justify-center transition-colors"
                    >
                      🗑
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-chalk/50 text-base">Slot {s.slot}</p>
                    <p className="text-chalk/30 text-xs font-body">Vazio</p>
                  </div>
                  <button
                    onClick={() => onNewGame(s.slot)}
                    className="border border-gold text-gold font-display text-xs uppercase tracking-wide px-4 py-2 rounded-sm hover:bg-gold/10 transition-colors"
                  >
                    Novo jogo
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-chalk/40 text-xs font-body text-center mt-8">
          Cada slot guarda um jogo completo e independente, jogue com clubes diferentes sem
          perder o progresso um do outro.
        </p>
      </div>
    </div>
  )
}
