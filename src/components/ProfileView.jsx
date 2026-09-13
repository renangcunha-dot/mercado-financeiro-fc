import { ACHIEVEMENTS } from '../game/achievements'
import NetWorthChart from './NetWorthChart'
import ShareCardButton from './ShareCardButton'

function ScoreRing({ score }) {
  const color = score >= 75 ? 'text-pitch-light' : score >= 50 ? 'text-gold' : 'text-risk'
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className={`font-display text-5xl ${color}`}>{score}</div>
      <p className="text-chalk/50 text-[11px] font-body uppercase tracking-wide mt-1">
        Índice de Saúde Financeira
      </p>
    </div>
  )
}

export default function ProfileView({
  score,
  title,
  badges,
  history,
  club,
  points,
  position,
  totalClubs,
  netWorth,
  seasonName,
}) {
  const unlockedIds = new Set(badges)
  return (
    <div className="space-y-6">
      <div className="border border-chalk/15 rounded-sm bg-pitch-dark/40">
        <ScoreRing score={score} />
        <div className="border-t border-chalk/10 px-4 py-3 text-center">
          <p className="font-display text-gold text-lg">{title}</p>
          <p className="text-chalk/40 text-[11px] font-body">Seu cargo evolui junto com o índice</p>
        </div>
      </div>

      <div className="border border-chalk/15 rounded-sm p-4">
        <NetWorthChart history={history} />
      </div>

      <div>
        <p className="font-display text-sm text-chalk/70 uppercase tracking-wide mb-2">
          Conquistas ({unlockedIds.size}/{Object.keys(ACHIEVEMENTS).length})
        </p>
        <div className="grid grid-cols-1 gap-2">
          {Object.values(ACHIEVEMENTS).map((a) => {
            const unlocked = unlockedIds.has(a.id)
            return (
              <div
                key={a.id}
                className={`border rounded-sm p-3 ${
                  unlocked ? 'border-gold/40 bg-gold/10' : 'border-chalk/10 opacity-40'
                }`}
              >
                <p className={`font-display text-sm ${unlocked ? 'text-gold' : 'text-chalk/60'}`}>
                  {unlocked ? '🏆' : '🔒'} {a.name}
                </p>
                <p className="text-chalk/50 text-xs font-body mt-1">{a.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <p className="font-display text-sm text-chalk/70 uppercase tracking-wide mb-2">
          Compartilhar progresso
        </p>
        <ShareCardButton
          club={club}
          financialTitle={title}
          financialHealthScore={score}
          points={points}
          position={position}
          totalClubs={totalClubs}
          netWorth={netWorth}
          seasonName={seasonName}
          label="Gerar cartão do progresso atual"
        />
      </div>
    </div>
  )
}
