import { formatBRL } from '../game/format'

export default function BidWarModal({ bid, onCoverBid, onWalkAway, onFinance }) {
  if (!bid) return null
  const { player, rivalOffer } = bid
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-chalk text-ink rounded-sm p-6 shadow-2xl border-t-4 border-gold">
        <p className="font-display uppercase tracking-wide text-xs text-gold mb-1">Disputa de mercado</p>
        <h3 className="font-display text-2xl mb-2">{player.name} está disputado</h3>
        <p className="font-body text-sm text-ink/70 mb-4 leading-relaxed">
          Um clube rival ofereceu {formatBRL(rivalOffer)} por este jogador, acima do valor de
          mercado de {formatBRL(player.marketValue)}. Se você não cobrir, o rival leva o jogador.
        </p>
        <div className="space-y-2">
          <button
            onClick={onCoverBid}
            className="w-full bg-gold text-ink font-display text-sm uppercase tracking-wide py-3 rounded-sm hover:bg-gold-light transition-colors"
          >
            Cobrir oferta à vista ({formatBRL(rivalOffer)})
          </button>
          <button
            onClick={onFinance}
            className="w-full border border-pitch text-pitch font-display text-sm uppercase tracking-wide py-3 rounded-sm hover:bg-pitch/5 transition-colors"
          >
            Financiar o valor original em parcelas
          </button>
          <button
            onClick={onWalkAway}
            className="w-full text-ink/50 font-body text-xs py-2 hover:text-ink/80"
          >
            Desistir e deixar o rival levar
          </button>
        </div>
      </div>
    </div>
  )
}
