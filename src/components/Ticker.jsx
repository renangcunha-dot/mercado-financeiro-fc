import { formatBRL } from '../game/format'
import ClubCrest from './ClubCrest'

export default function Ticker({
  season,
  round,
  cash,
  streak,
  financialTitle,
  points,
  club,
  onRestart,
  onSwitchSlot,
  muted,
  onToggleMute,
}) {
  const isNegative = cash < 0
  return (
    <div className="w-full bg-pitch-dark border-b-2 border-gold/40 px-4 py-3 flex items-center justify-between font-display">
      <div className="flex items-center gap-3">
        <ClubCrest club={club} size={36} />
        <div>
          <p className="text-chalk/60 text-[11px] tracking-wide">{season.name}</p>
          <p className="text-chalk text-sm">
            Rodada {Math.min(round, season.rounds)} / {season.rounds}
            {streak >= 2 && <span className="text-gold ml-2">🔥 {streak}</span>}
          </p>
          <p className="text-chalk/40 text-[10px]">{financialTitle} · {points} pts</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-chalk/60 text-[11px] tracking-wide">Caixa disponível</p>
          <p className={`text-xl ${isNegative ? 'text-risk' : 'text-gold'}`}>
            {formatBRL(cash)}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={onToggleMute}
            title={muted ? 'Ativar som' : 'Silenciar'}
            className="text-chalk/40 hover:text-chalk/80 border border-chalk/20 hover:border-chalk/40 rounded-sm w-8 h-7 flex items-center justify-center text-xs transition-colors"
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={onSwitchSlot}
            title="Trocar de slot"
            className="text-chalk/40 hover:text-chalk/80 border border-chalk/20 hover:border-chalk/40 rounded-sm w-8 h-7 flex items-center justify-center text-[9px] transition-colors"
          >
            ⇄
          </button>
        </div>
        <button
          onClick={onRestart}
          title="Reiniciar jogo"
          className="flex items-center gap-1.5 text-chalk/50 hover:text-chalk/90 border border-chalk/20 hover:border-chalk/50 rounded-sm px-2.5 h-8 text-[10px] uppercase tracking-wide transition-colors"
        >
          <span className="text-sm leading-none">↺</span>
          <span className="hidden sm:inline">Reiniciar</span>
        </button>
      </div>
    </div>
  )
}
