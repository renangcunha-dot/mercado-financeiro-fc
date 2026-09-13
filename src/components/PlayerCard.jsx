import { formatBRL } from '../game/format'

const riskLabel = { baixo: 'Risco baixo', medio: 'Risco médio', alto: 'Risco alto' }
const riskColor = { baixo: 'text-pitch-light', medio: 'text-gold', alto: 'text-risk' }

export default function PlayerCard({ player, actionLabel, onAction, disabled }) {
  const delta = player.lastDelta
  return (
    <div className="border border-chalk/15 bg-pitch-dark/40 rounded-sm p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-lg text-chalk leading-tight">{player.name}</p>
          <p className="text-chalk/50 text-xs font-body">
            {player.position} · {player.age} anos · {player.nationality}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {player.hot && (
            <span className="text-[10px] font-display uppercase tracking-wide text-risk">
              🔥 Disputado
            </span>
          )}
          {player.discounted && (
            <span className="text-[10px] font-display uppercase tracking-wide text-pitch-light">
              Oferta de olheiro
            </span>
          )}
          <span className={`text-[11px] font-body ${riskColor[player.riskProfile]}`}>
            {riskLabel[player.riskProfile]}
          </span>
        </div>
      </div>
      <div className="flex items-end justify-between mt-1">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-gold font-display text-base">{formatBRL(player.marketValue)}</p>
            {!!delta && (
              <span className={`text-[11px] font-display ${delta > 0 ? 'text-pitch-light' : 'text-risk'}`}>
                {delta > 0 ? '▲' : '▼'} {formatBRL(Math.abs(delta))}
              </span>
            )}
          </div>
          <p className="text-chalk/40 text-[11px] font-body">
            Salário {formatBRL(player.fixedSalary)}/rodada
          </p>
        </div>
        <button
          onClick={onAction}
          disabled={disabled}
          className="bg-gold text-ink font-display text-xs uppercase tracking-wide px-3 py-2 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold-light transition-colors"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  )
}
