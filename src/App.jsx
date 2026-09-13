import { useEffect, useState } from 'react'
import {
  createInitialState,
  currentSeason,
  currentClub,
  buyPlayer,
  buyPlayerFinanced,
  sellPlayer,
  simulateRound,
  isSeasonComplete,
  advanceToNextSeason,
  unlockConcept,
  playerNetWorth,
  signSponsor,
} from './game/gameEngine'
import { buildFinancialRanking, buildLeagueTable } from './game/rivals'
import { pickEvent, shouldTriggerEvent } from './game/events'
import { applyInvestment } from './game/investment'
import { generateRivalBid } from './game/bidWar'
import { generateSponsorOffers } from './game/sponsorship'
import { FORMATIONS } from './game/formations'
import { playWin, playLoss, playDraw, playAchievement, isMuted, setMuted } from './game/sound'
import {
  readSlotRaw,
  writeSlot,
  deleteSlot,
  isValidSave,
  migrateLegacyIfNeeded,
  slotSummaries,
} from './game/saveSlots'
import { CLUBS } from './data/clubs'
import { CONCEPTS } from './data/concepts'
import Ticker from './components/Ticker'
import PlayerCard from './components/PlayerCard'
import ConceptCard from './components/ConceptCard'
import RoundSummary from './components/RoundSummary'
import FinalReport from './components/FinalReport'
import LeagueTable from './components/LeagueTable'
import ProfileView from './components/ProfileView'
import FormationView from './components/FormationView'
import CashFlowView from './components/CashFlowView'
import EventModal from './components/EventModal'
import TacticModal from './components/TacticModal'
import FormationModal from './components/FormationModal'
import InvestmentModal from './components/InvestmentModal'
import BidWarModal from './components/BidWarModal'
import SponsorModal from './components/SponsorModal'
import ClubSelect from './components/ClubSelect'
import OnboardingModal from './components/OnboardingModal'
import SaveSlotSelect from './components/SaveSlotSelect'

const PHASES = {
  IDLE: 'idle',
  SPONSOR: 'sponsor',
  FORMATION: 'formation',
  TACTIC: 'tactic',
  INVESTMENT: 'investment',
  EVENT: 'event',
}

export default function App() {
  const [activeSlot, setActiveSlot] = useState(null)
  const [slotList, setSlotList] = useState(() => {
    migrateLegacyIfNeeded()
    return slotSummaries()
  })
  const [state, setState] = useState(null)
  const [activeConcept, setActiveConcept] = useState(null)
  const [roundEntry, setRoundEntry] = useState(null)
  const [eventOutcome, setEventOutcome] = useState(null)
  const [phase, setPhase] = useState(PHASES.IDLE)
  const [chosenTactic, setChosenTactic] = useState('equilibrado')
  const [pendingBid, setPendingBid] = useState(null)
  const [pendingEvent, setPendingEvent] = useState(null)
  const [tab, setTab] = useState('mercado')
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)
  const [muted, setMutedState] = useState(isMuted)

  useEffect(() => {
    if (state && activeSlot) writeSlot(activeSlot, state)
  }, [state, activeSlot])

  function handleToggleMute() {
    const next = !muted
    setMuted(next)
    setMutedState(next)
  }

  // ---- Tela 1: escolha de slot de save ----
  if (activeSlot === null) {
    return (
      <SaveSlotSelect
        summaries={slotList}
        onContinue={(n) => {
          const parsed = readSlotRaw(n)
          setState(isValidSave(parsed) ? { ...parsed, scenariosTriedThisSeason: new Set() } : null)
          setActiveSlot(n)
        }}
        onNewGame={(n) => {
          setState(null)
          setActiveSlot(n)
        }}
        onDelete={(n) => {
          deleteSlot(n)
          setSlotList(slotSummaries())
        }}
      />
    )
  }

  // ---- Tela 2: escolha de clube (slot vazio ou reiniciado) ----
  if (!state) {
    return (
      <ClubSelect
        onSelect={(clubId) => setState(createInitialState(clubId))}
        onBack={() => {
          setSlotList(slotSummaries())
          setActiveSlot(null)
        }}
      />
    )
  }

  const season = currentSeason(state)
  const club = currentClub(state)

  function maybeShowConcept(conceptId) {
    if (!conceptId) return
    if (!state.unlockedConcepts.includes(conceptId)) {
      setActiveConcept(CONCEPTS[conceptId])
      setState((s) => unlockConcept(s, conceptId))
    }
  }

  function handleBuy(playerId) {
    const player = state.market.find((p) => p.id === playerId)
    if (player?.hot) {
      setPendingBid({ player, rivalOffer: generateRivalBid(player) })
      return
    }
    const result = buyPlayer(state, playerId)
    if (result.ok) setState(result.state)
    maybeShowConcept(result.concept)
  }

  function handleCoverBid() {
    const result = buyPlayer(state, pendingBid.player.id, pendingBid.rivalOffer)
    if (result.ok) setState(result.state)
    setPendingBid(null)
    maybeShowConcept('custo_oportunidade')
  }

  function handleFinanceBid() {
    const result = buyPlayerFinanced(state, pendingBid.player.id)
    if (result.ok) setState(result.state)
    setPendingBid(null)
    maybeShowConcept('valor_presente_futuro')
  }

  function handleWalkAwayBid() {
    setState((s) => ({ ...s, market: s.market.filter((p) => p.id !== pendingBid.player.id) }))
    setPendingBid(null)
  }

  function handleSell(playerId) {
    const result = sellPlayer(state, playerId)
    if (result.ok) {
      setState(result.state)
      maybeShowConcept(result.concept)
    }
  }

  // ---- Fluxo de rodada: patrocínio (só 1x/temporada) -> formação -> tática -> investimento -> evento -> simulação ----
  function startRoundFlow() {
    setPhase(state.sponsorship === null ? PHASES.SPONSOR : PHASES.FORMATION)
  }

  function handleChooseSponsor(offer) {
    setState((s) => signSponsor(s, offer))
    setPhase(PHASES.FORMATION)
  }

  function handleChooseFormation(formationId) {
    setState((s) => ({ ...s, formationId }))
    setPhase(PHASES.TACTIC)
  }

  function handleChooseTactic(tacticId) {
    setChosenTactic(tacticId)
    setPhase(PHASES.INVESTMENT)
  }

  function handleChooseInvestment(optionId) {
    let nextState = state
    if (optionId) {
      const marketPlayers = state.market
      nextState = applyInvestment(state, optionId, marketPlayers)
      setState(nextState)
    }
    const seasonId = currentSeason(nextState).id
    if (shouldTriggerEvent(seasonId)) {
      const event = pickEvent(seasonId, nextState.squad.length > 0)
      if (event) {
        setPendingEvent(event)
        setPhase(PHASES.EVENT)
        return
      }
    }
    setPhase(PHASES.IDLE)
    runRound(nextState)
  }

  function handleChooseEvent(choice) {
    const stateAfterEvent = choice.effect(state)
    setEventOutcome(choice.outcome)
    if (pendingEvent?.concept) maybeShowConcept(pendingEvent.concept)
    setPendingEvent(null)
    setPhase(PHASES.IDLE)
    runRound(stateAfterEvent)
  }

  function runRound(baseState) {
    const nextState = simulateRound(baseState, chosenTactic, baseState.formationId)
    const lastEntry = nextState.history[nextState.history.length - 1]
    setState(nextState)
    setRoundEntry(lastEntry)
    maybeShowConcept('receita_despesa')
    if (chosenTactic !== 'equilibrado') maybeShowConcept('risco_retorno')

    if (lastEntry.outcome === 'win') playWin()
    else if (lastEntry.outcome === 'draw') playDraw()
    else playLoss()
    if (nextState.newlyUnlockedBadges?.length > 0) {
      setTimeout(() => playAchievement(), 500)
    }
  }

  function handleCloseRoundSummary() {
    setRoundEntry(null)
    setEventOutcome(null)
    if (isSeasonComplete(state)) {
      setState((s) => advanceToNextSeason(s))
    }
  }

  function handleRestart() {
    deleteSlot(activeSlot)
    setState(null)
    setTab('mercado')
    setShowRestartConfirm(false)
  }

  function handleSwitchSlot() {
    setSlotList(slotSummaries())
    setActiveSlot(null)
  }

  if (state.gameOver) {
    const netWorth = playerNetWorth(state)
    const leagueTable = buildLeagueTable(
      { points: state.points, wins: state.wins, draws: state.draws, losses: state.losses },
      state.rivals,
      club.name,
      club
    )
    const position = leagueTable.find((r) => r.isPlayer)?.position
    return (
      <FinalReport
        state={state}
        club={club}
        position={position}
        totalClubs={CLUBS.length}
        netWorth={netWorth}
        seasonName={season.name}
        onRestart={handleRestart}
      />
    )
  }

  const marketPlayers = state.market
  const netWorth = playerNetWorth(state)
  const financialRanking = buildFinancialRanking(netWorth, state.rivals, club.name, club)
  const leagueTable = buildLeagueTable(
    { points: state.points, wins: state.wins, draws: state.draws, losses: state.losses },
    state.rivals,
    club.name,
    club
  )
  const yourLeaguePosition = leagueTable.find((r) => r.isPlayer)?.position
  const sponsorOffers = generateSponsorOffers(season.id)
  const currentFormation = FORMATIONS[state.formationId] || FORMATIONS['4-4-2']

  const tabs = [
    { id: 'mercado', label: `Mercado (${marketPlayers.length})` },
    { id: 'elenco', label: `Elenco (${state.squad.length})` },
    { id: 'campo', label: 'Time em campo' },
    { id: 'liga', label: `Liga (${yourLeaguePosition}º/${CLUBS.length})` },
    { id: 'fluxo', label: 'Fluxo de caixa' },
    { id: 'perfil', label: 'Perfil' },
  ]

  return (
    <div className="min-h-screen bg-pitch-dark font-body pb-24">
      <Ticker
        season={season}
        round={state.round}
        cash={state.cash}
        streak={state.streak}
        financialTitle={state.financialTitle || 'Estagiário Financeiro'}
        points={state.points}
        club={club}
        onRestart={() => setShowRestartConfirm(true)}
        onSwitchSlot={handleSwitchSlot}
        muted={muted}
        onToggleMute={handleToggleMute}
      />

      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`font-display text-xs uppercase tracking-wide px-4 py-2 rounded-sm whitespace-nowrap ${
                tab === t.id ? 'bg-gold text-ink' : 'bg-transparent text-chalk/60 border border-chalk/20'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'mercado' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {marketPlayers.map((p) => (
              <PlayerCard key={p.id} player={p} actionLabel="Contratar" onAction={() => handleBuy(p.id)} />
            ))}
          </div>
        )}

        {tab === 'elenco' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {state.squad.length === 0 && (
              <p className="text-chalk/50 text-sm font-body col-span-2">
                Seu elenco está vazio. Vá ao mercado e contrate seu primeiro jogador.
              </p>
            )}
            {state.squad.map((p) => (
              <PlayerCard key={p.id} player={p} actionLabel="Vender" onAction={() => handleSell(p.id)} />
            ))}
          </div>
        )}

        {tab === 'campo' && <FormationView squad={state.squad} formation={currentFormation} />}

        {tab === 'liga' && <LeagueTable leagueTable={leagueTable} financialRanking={financialRanking} />}

        {tab === 'fluxo' && <CashFlowView history={state.history} cash={state.cash} />}

        {tab === 'perfil' && (
          <ProfileView
            score={state.financialHealthScore}
            title={state.financialTitle || 'Estagiário Financeiro'}
            badges={state.badges || []}
            history={state.history}
            club={club}
            points={state.points}
            position={yourLeaguePosition}
            totalClubs={CLUBS.length}
            netWorth={netWorth}
            seasonName={season.name}
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-pitch-dark border-t border-chalk/10">
        <button
          onClick={startRoundFlow}
          disabled={state.squad.length === 0}
          className="w-full bg-pitch-light text-chalk font-display uppercase tracking-wide text-sm py-4 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pitch transition-colors"
        >
          Jogar rodada {Math.min(state.round, season.rounds)}
        </button>
      </div>

      <ConceptCard concept={activeConcept} onClose={() => setActiveConcept(null)} />
      <OnboardingModal
        open={!state.seenOnboarding}
        clubName={club.name}
        onDismiss={() => setState((s) => ({ ...s, seenOnboarding: true }))}
      />
      <SponsorModal open={phase === PHASES.SPONSOR} offers={sponsorOffers} onChoose={handleChooseSponsor} />
      <FormationModal open={phase === PHASES.FORMATION} onChoose={handleChooseFormation} />
      <TacticModal open={phase === PHASES.TACTIC} onChoose={handleChooseTactic} />
      <InvestmentModal open={phase === PHASES.INVESTMENT} state={state} onChoose={handleChooseInvestment} />
      <EventModal event={phase === PHASES.EVENT ? pendingEvent : null} onChoose={handleChooseEvent} />
      <BidWarModal
        bid={pendingBid}
        onCoverBid={handleCoverBid}
        onFinance={handleFinanceBid}
        onWalkAway={handleWalkAwayBid}
      />
      <RoundSummary entry={roundEntry} eventOutcome={eventOutcome} onContinue={handleCloseRoundSummary} />
      {showRestartConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-chalk text-ink rounded-sm p-6 shadow-2xl">
            <h3 className="font-display text-xl mb-2">Reiniciar o jogo?</h3>
            <p className="font-body text-sm text-ink/60 mb-5">
              Todo o progresso deste slot (elenco, caixa, pontos, conquistas) será perdido e você
              volta para a escolha de clube.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="flex-1 border border-ink/20 font-display text-xs uppercase tracking-wide py-3 rounded-sm hover:bg-ink/5"
              >
                Cancelar
              </button>
              <button
                onClick={handleRestart}
                className="flex-1 bg-risk text-chalk font-display text-xs uppercase tracking-wide py-3 rounded-sm hover:opacity-90"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
