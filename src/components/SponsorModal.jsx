import { formatBRL } from '../game/format'

export default function SponsorModal({ open, offers, onChoose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-chalk text-ink rounded-sm p-6 shadow-2xl">
        <p className="font-display uppercase tracking-wide text-xs text-pitch mb-1">Nova temporada</p>
        <h3 className="font-display text-2xl mb-4">Escolha o patrocínio</h3>
        <div className="space-y-2">
          {offers.map((offer) => (
            <button
              key={offer.id}
              onClick={() => onChoose(offer)}
              className="w-full text-left border border-ink/15 hover:border-pitch hover:bg-pitch/5 rounded-sm p-3 transition-colors"
            >
              <p className="font-display text-base">{offer.sponsorName}</p>
              <p className="font-body text-xs text-ink/60 mt-1 mb-2">{offer.description}</p>
              <p className="font-body text-xs text-ink/70">
                {formatBRL(offer.perRoundValue)}/rodada fixo
                {offer.winBonus > 0 && ` + ${formatBRL(offer.winBonus)} por vitória`}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
