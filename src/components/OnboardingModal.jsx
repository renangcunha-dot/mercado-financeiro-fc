export default function OnboardingModal({ open, clubName, onDismiss }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-ink/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-chalk text-ink rounded-sm p-6 shadow-2xl">
        <p className="font-display uppercase tracking-wide text-xs text-pitch mb-1">Bem-vindo ao {clubName}</p>
        <h3 className="font-display text-2xl mb-4">Como funciona</h3>

        <div className="space-y-4 font-body text-sm text-ink/80">
          <div className="flex gap-3">
            <span className="font-display text-gold text-lg leading-none">1</span>
            <p>
              Seu objetivo não é só vencer partidas. É terminar as 5 temporadas com um clube
              financeiramente saudável, não só valioso no papel.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="font-display text-gold text-lg leading-none">2</span>
            <p>
              A aba <strong>Liga</strong> mostra duas tabelas separadas: pontos no campeonato e
              patrimônio financeiro. Elas podem divergir, e prestar atenção nisso é a chave do jogo.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="font-display text-gold text-lg leading-none">3</span>
            <p>
              A aba <strong>Perfil</strong> mostra seu Índice de Saúde Financeira (0 a 100). Ele mede
              a qualidade das suas decisões, não o resultado em campo.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="font-display text-gold text-lg leading-none">4</span>
            <p>
              A cada rodada você escolhe tática, investimento e às vezes negocia patrocínio ou
              disputa um jogador com um rival. Toda decisão tem um trade-off real.
            </p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="mt-6 w-full bg-pitch text-chalk font-display uppercase tracking-wide text-sm py-3 rounded-sm hover:bg-pitch-light transition-colors"
        >
          Entendi, vamos jogar
        </button>
      </div>
    </div>
  )
}
