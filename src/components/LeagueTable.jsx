import { formatBRL } from '../game/format'
import ClubCrest from './ClubCrest'

export default function LeagueTable({ leagueTable, financialRanking }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-sm text-chalk/70 uppercase tracking-wide mb-2">
          Tabela do campeonato
        </p>
        <div className="border border-chalk/15 rounded-sm overflow-hidden">
          <div className="bg-pitch-dark/60 px-3 py-2 grid grid-cols-[2rem_1.5rem_1fr_2rem_2rem_2rem_2.5rem] gap-1 text-[10px] font-display uppercase tracking-wide text-chalk/50">
            <span>#</span>
            <span></span>
            <span>Clube</span>
            <span className="text-center">V</span>
            <span className="text-center">E</span>
            <span className="text-center">D</span>
            <span className="text-center">Pts</span>
          </div>
          {leagueTable.map((row) => (
            <div
              key={row.id}
              className={`px-3 py-2 grid grid-cols-[2rem_1.5rem_1fr_2rem_2rem_2rem_2.5rem] gap-1 items-center border-t border-chalk/10 ${
                row.isPlayer ? 'bg-gold/10' : ''
              }`}
            >
              <span className="font-display text-chalk/60 text-xs">{row.position}º</span>
              <ClubCrest club={row.club} size={20} />
              <span className={`font-body text-xs truncate ${row.isPlayer ? 'text-gold' : 'text-chalk/80'}`}>
                {row.name}
              </span>
              <span className="text-center font-body text-xs text-chalk/70">{row.wins}</span>
              <span className="text-center font-body text-xs text-chalk/70">{row.draws}</span>
              <span className="text-center font-body text-xs text-chalk/70">{row.losses}</span>
              <span className="text-center font-display text-xs text-chalk">{row.points}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="font-display text-sm text-chalk/70 uppercase tracking-wide mb-2">
          Ranking financeiro (patrimônio)
        </p>
        <div className="border border-chalk/15 rounded-sm overflow-hidden">
          {financialRanking.map((row) => (
            <div
              key={row.id}
              className={`px-4 py-3 flex items-center gap-3 border-t border-chalk/10 first:border-t-0 ${
                row.isPlayer ? 'bg-gold/10' : ''
              }`}
            >
              <span className="font-display text-chalk/60 text-sm w-6">{row.position}º</span>
              <ClubCrest club={row.club} size={24} />
              <span className={`font-body text-sm flex-1 ${row.isPlayer ? 'text-gold' : 'text-chalk/80'}`}>
                {row.name}
              </span>
              <span className="font-display text-sm text-chalk">{formatBRL(row.netWorth)}</span>
            </div>
          ))}
        </div>
        <p className="text-chalk/40 text-[11px] font-body mt-2 leading-relaxed">
          Repare: liderar o campeonato e liderar o ranking financeiro nem sempre é o mesmo clube.
          Um time pode vencer partidas e ainda assim gerir mal o dinheiro.
        </p>
      </div>
    </div>
  )
}
