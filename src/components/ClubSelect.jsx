import { CLUBS } from '../data/clubs'
import ClubCrest from './ClubCrest'

export default function ClubSelect({ onSelect, onBack }) {
  return (
    <div className="min-h-screen bg-pitch-dark flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {onBack && (
          <button
            onClick={onBack}
            className="text-chalk/40 hover:text-chalk/70 text-xs font-display uppercase tracking-wide mb-4"
          >
            ← Voltar aos slots
          </button>
        )}
        <p className="font-display uppercase tracking-wide text-xs text-gold text-center mb-2">
          Mercado Financeiro FC
        </p>
        <h1 className="font-display text-3xl text-chalk text-center mb-8">
          Escolha seu clube
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CLUBS.map((club) => (
            <button
              key={club.id}
              onClick={() => onSelect(club.id)}
              className="flex flex-col items-center gap-2 bg-chalk/5 hover:bg-chalk/10 border border-chalk/15 hover:border-gold rounded-sm p-4 transition-colors"
            >
              <ClubCrest club={club} size={56} />
              <p className="font-display text-chalk text-sm text-center leading-tight">{club.name}</p>
              <p className="text-chalk/40 text-[11px] font-body">{club.country}</p>
            </button>
          ))}
        </div>
        <p className="text-chalk/40 text-xs font-body text-center mt-8 max-w-md mx-auto leading-relaxed">
          Todos os {CLUBS.length} clubes começam com o mesmo orçamento e um elenco completo de 22
          jogadores. Os outros {CLUBS.length - 1} viram seus rivais na liga, cada um com um estilo de
          gestão diferente.
        </p>
      </div>
    </div>
  )
}
