import { formatBRL } from '../game/format'

const POSITION_ORDER = ['Goleiro', 'Zagueiro', 'Lateral', 'Meio-campo', 'Atacante']

function pickStartingXI(squad, formationSlots) {
  const pools = {
    Goleiro: squad.filter((p) => p.position === 'Goleiro'),
    Lateral: squad.filter((p) => p.position === 'Lateral'),
    Zagueiro: squad.filter((p) => p.position === 'Zagueiro'),
    'Meio-campo': squad.filter((p) => p.position === 'Meio-campo'),
    Atacante: squad.filter((p) => p.position === 'Atacante'),
  }
  const used = new Set()
  const slots = formationSlots.map((slot) => {
    const pool = pools[slot.role] || []
    const player = pool.find((p) => !used.has(p.id))
    if (player) used.add(player.id)
    return { ...slot, player: player || null }
  })
  return { slots, usedIds: used }
}

function Goal({ x, flip }) {
  return (
    <g>
      <rect x={x - 35} y={flip ? 600 : -18} width="70" height="18" fill="none" stroke="#F5F0E6" strokeWidth="2" />
      <pattern id={`net-${flip ? 'b' : 't'}`} width="6" height="6" patternUnits="userSpaceOnUse">
        <path d="M0 0 L6 6 M6 0 L0 6" stroke="#F5F0E6" strokeWidth="0.5" opacity="0.5" />
      </pattern>
      <rect x={x - 35} y={flip ? 600 : -18} width="70" height="18" fill={`url(#net-${flip ? 'b' : 't'})`} />
    </g>
  )
}

// Bandeirinha de escanteio: um mastro curto com uma bandeira triangular,
// além do arco de escanteio já desenhado no campo.
function CornerFlag({ x, y, outX, outY, color }) {
  return (
    <g>
      <line x1={x} y1={y} x2={outX} y2={outY} stroke="#F5F0E6" strokeWidth="1.5" />
      <path
        d={`M ${outX} ${outY} L ${outX} ${outY + (outY < y ? 6 : -6)} L ${outX + (outX < x ? -8 : 8)} ${outY + (outY < y ? 3 : -3)} Z`}
        fill={color}
      />
    </g>
  )
}

function Coach() {
  return (
    <g transform="translate(430,470)">
      <text
        x="0"
        y="-95"
        textAnchor="middle"
        fontFamily="DejaVu Sans Condensed, sans-serif"
        fontWeight="bold"
        fontSize="11"
        fill="#F5F0E6"
        opacity="0.4"
      >
        TÉCNICO
      </text>
      <circle cx="0" cy="-58" r="12" fill="#F5F0E6" opacity="0.9" />
      <path d="M -16 -46 L 16 -46 L 20 10 L -20 10 Z" fill="#0F3D2E" stroke="#C9A227" strokeWidth="2" />
      <path d="M -8 -46 L 0 -34 L 8 -46 Z" fill="#F5F0E6" opacity="0.85" />
      <path d="M -16 -40 L -30 -14" stroke="#0F3D2E" strokeWidth="7" strokeLinecap="round" />
      <path d="M 16 -40 L 26 -18" stroke="#0F3D2E" strokeWidth="7" strokeLinecap="round" />
      <rect x="18" y="-24" width="14" height="18" rx="1.5" fill="#F5F0E6" stroke="#12181B" strokeWidth="1" />
      <path d="M -8 10 L -12 42" stroke="#12181B" strokeWidth="8" strokeLinecap="round" />
      <path d="M 8 10 L 12 42" stroke="#12181B" strokeWidth="8" strokeLinecap="round" />
    </g>
  )
}

// Arquibancada com torcida: uma textura de pontos coloridos (pattern) que
// preenche toda a moldura ao redor do campo, simulando um estádio cheio.
function CrowdPattern() {
  return (
    <defs>
      <pattern id="crowd" width="14" height="12" patternUnits="userSpaceOnUse">
        <rect width="14" height="12" fill="#241d16" />
        <circle cx="2" cy="3" r="1.6" fill="#C9A227" opacity="0.8" />
        <circle cx="7" cy="7" r="1.6" fill="#F5F0E6" opacity="0.6" />
        <circle cx="11" cy="2" r="1.6" fill="#7a1220" opacity="0.7" />
        <circle cx="4" cy="10" r="1.6" fill="#1B5E3F" opacity="0.6" />
        <circle cx="12" cy="9" r="1.6" fill="#F5F0E6" opacity="0.4" />
      </pattern>
    </defs>
  )
}

function BenchRow({ players }) {
  if (players.length === 0) return null
  return (
    <div>
      <p className="text-chalk/40 text-[11px] font-display uppercase tracking-wide mb-2">
        Banco de reservas ({players.length})
      </p>
      <div className="flex flex-wrap gap-2">
        {players.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 bg-chalk/5 border border-chalk/15 rounded-sm px-3 py-2"
          >
            <span className="w-6 h-6 rounded-full bg-chalk/15 flex items-center justify-center text-[10px] font-display text-chalk/70">
              {p.position[0]}
            </span>
            <span className="text-chalk/80 text-xs font-body">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FormationView({ squad, formation }) {
  if (squad.length === 0) {
    return (
      <p className="text-chalk/50 text-sm font-body text-center py-10">
        Seu time em campo aparece aqui assim que você tiver jogadores no elenco.
      </p>
    )
  }

  const { slots: xi, usedIds } = pickStartingXI(squad, formation.slots)
  const bench = squad
    .filter((p) => !usedIds.has(p.id))
    .sort((a, b) => POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position))

  return (
    <div className="space-y-5">
      <svg viewBox="0 0 510 640" className="w-full rounded-sm">
        <CrowdPattern />
        {/* Arquibancada preenchendo todo o fundo */}
        <rect width="510" height="640" fill="url(#crowd)" />

        {/* Campo, deslocado para deixar a moldura de arquibancada visível */}
        <g transform="translate(30,20)">
          <rect x="20" y="20" width="360" height="560" fill="#0F3D2E" stroke="#F5F0E6" strokeWidth="2" opacity="0.95" />
          <line x1="20" y1="300" x2="380" y2="300" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <circle cx="200" cy="300" r="50" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <circle cx="200" cy="300" r="2.5" fill="#F5F0E6" opacity="0.7" />

          <rect x="120" y="20" width="160" height="80" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <rect x="160" y="20" width="80" height="35" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <path d="M 150 100 A 50 50 0 0 0 250 100" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />

          <rect x="120" y="500" width="160" height="80" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <rect x="160" y="545" width="80" height="35" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <path d="M 150 500 A 50 50 0 0 1 250 500" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />

          {/* Linhas de escanteio (arco) */}
          <path d="M 20 30 A 10 10 0 0 0 30 20" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <path d="M 370 20 A 10 10 0 0 0 380 30" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <path d="M 20 570 A 10 10 0 0 1 30 580" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <path d="M 380 570 A 10 10 0 0 1 370 580" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />

          {/* Bandeirinhas de escanteio */}
          <CornerFlag x={20} y={20} outX={20} outY={6} color="#C9A227" />
          <CornerFlag x={380} y={20} outX={380} outY={6} color="#C9A227" />
          <CornerFlag x={20} y={580} outX={20} outY={594} color="#C9A227" />
          <CornerFlag x={380} y={580} outX={380} outY={594} color="#C9A227" />

          <Goal x={200} flip={false} />
          <Goal x={200} flip={true} />

          <Coach />

          {xi.map((slot, i) => (
            <g key={i} transform={`translate(${slot.x},${slot.y})`}>
              <circle r="20" fill="#F5F0E6" stroke="#C9A227" strokeWidth="2" />
              <text
                y="4"
                textAnchor="middle"
                fontFamily="DejaVu Sans Condensed, sans-serif"
                fontWeight="bold"
                fontSize="9"
                fill="#12181B"
              >
                {slot.player ? slot.player.name.split(' ')[0].slice(0, 8) : '—'}
              </text>
              {slot.player?.lastDelta ? (
                <text
                  y="32"
                  textAnchor="middle"
                  fontFamily="DejaVu Sans Condensed, sans-serif"
                  fontWeight="bold"
                  fontSize="9"
                  fill={slot.player.lastDelta > 0 ? '#7FCB9E' : '#E27676'}
                >
                  {slot.player.lastDelta > 0 ? '▲' : '▼'} {formatBRL(Math.abs(slot.player.lastDelta))}
                </text>
              ) : null}
            </g>
          ))}
        </g>
      </svg>
      <p className="text-chalk/40 text-xs font-body text-center -mt-2">{formation.label} · 11 titulares em campo</p>

      <BenchRow players={bench} />
    </div>
  )
}
