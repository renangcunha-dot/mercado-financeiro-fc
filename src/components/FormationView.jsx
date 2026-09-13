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

// Gol encostado exatamente na linha de fundo do campo (y=20 topo, y=580 base),
// sem o vão que existia antes. A rede usa uma hachura mais fina para não
// competir visualmente com a grama.
function Goal({ flip }) {
  const x = 200
  const y = flip ? 580 : 2
  return (
    <g>
      <rect x={x - 34} y={y} width="68" height="18" fill={`url(#net-${flip ? 'b' : 't'})`} />
      <rect x={x - 34} y={y} width="68" height="18" fill="none" stroke="#F5F0E6" strokeWidth="2.5" />
    </g>
  )
}

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

// Técnico reduzido (antes estava grande demais) e com um banco atrás dele,
// para dar contexto de área técnica em vez de uma figura solta.
function Coach() {
  return (
    <g transform="translate(432,480) scale(0.62)">
      <text
        x="0"
        y="-118"
        textAnchor="middle"
        fontFamily="DejaVu Sans Condensed, sans-serif"
        fontWeight="bold"
        fontSize="15"
        fill="#F5F0E6"
        opacity="0.45"
      >
        TÉCNICO
      </text>
      {/* banco atrás do técnico */}
      <rect x="-46" y="-6" width="92" height="14" rx="2" fill="#1a130d" stroke="#3a2c1e" strokeWidth="2" />
      <path d="M -46 -6 L -38 -34 L 38 -34 L 46 -6 Z" fill="#1a130d" opacity="0.9" />
      {/* técnico */}
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

// Torcedor estilizado com braços erguidos e cachecol, para dar sensação de
// "torcida cantando" em vez de só pontinhos genéricos. Cada um tem uma cor
// de cachecol diferente para variar.
function SingingFan({ x, y, scale = 1, scarfColor }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <circle cx="0" cy="0" r="3.2" fill="#e3c9a8" />
      <path d="M -3.2 1 L 3.2 1 L 2.2 8 L -2.2 8 Z" fill={scarfColor} />
      <line x1="-3" y1="1.5" x2="-6.5" y2="-3.5" stroke="#e3c9a8" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="3" y1="1.5" x2="6.5" y2="-3.5" stroke="#e3c9a8" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="0" cy="0.6" r="0.9" fill="#3a2416" />
    </g>
  )
}

const FAN_SPOTS = [
  { x: 90, y: 12, color: '#C9A227' },
  { x: 210, y: 10, color: '#B33A3A' },
  { x: 330, y: 13, color: '#7FCB9E' },
  { x: 12, y: 150, color: '#B33A3A' },
  { x: 12, y: 320, color: '#C9A227' },
  { x: 12, y: 480, color: '#7FCB9E' },
  { x: 150, y: 630, color: '#C9A227' },
  { x: 270, y: 632, color: '#B33A3A' },
]

// Textura de arquibancada: linhas de "cabeças" com leve deslocamento entre
// fileiras (como uma multidão real, não uma grade repetitiva), mais um
// gradiente escurecendo os cantos para dar profundidade.
function StandTexture() {
  const rowColors = ['#C9A227', '#F5F0E6', '#7a1220', '#1B5E3F', '#8a7a5a']
  const rows = []
  for (let r = 0; r < 16; r++) {
    const y = r * 41 + 10
    const offset = r % 2 === 0 ? 0 : 11
    const dots = []
    for (let c = 0; c < 24; c++) {
      const x = c * 22 + offset
      const color = rowColors[(r * 7 + c * 3) % rowColors.length]
      dots.push(<circle key={c} cx={x} cy={y} r="4.2" fill={color} opacity="0.55" />)
    }
    rows.push(<g key={r}>{dots}</g>)
  }
  return <g>{rows}</g>
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
        <defs>
          <pattern id="net-t" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 0 L6 6 M6 0 L0 6" stroke="#F5F0E6" strokeWidth="0.5" opacity="0.5" />
          </pattern>
          <pattern id="net-b" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 0 L6 6 M6 0 L0 6" stroke="#F5F0E6" strokeWidth="0.5" opacity="0.5" />
          </pattern>
          <radialGradient id="standShade" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor="#241d16" stopOpacity="0" />
            <stop offset="100%" stopColor="#0c0906" stopOpacity="0.75" />
          </radialGradient>
        </defs>

        {/* Fundo da arquibancada */}
        <rect width="510" height="640" fill="#241d16" />
        <StandTexture />
        <rect width="510" height="640" fill="url(#standShade)" />
        {FAN_SPOTS.map((f, i) => (
          <SingingFan key={i} x={f.x} y={f.y} scarfColor={f.color} scale={1.3} />
        ))}

        {/* Campo, encostado sem vão no gol */}
        <g transform="translate(30,20)">
          {/* grama com listras de corte alternadas, para parecer gramado de verdade */}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={i}
              x={20 + i * 45}
              y="20"
              width="45"
              height="560"
              fill={i % 2 === 0 ? '#0F3D2E' : '#12432F'}
            />
          ))}
          <rect x="20" y="20" width="360" height="560" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.95" />

          <line x1="20" y1="300" x2="380" y2="300" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <circle cx="200" cy="300" r="50" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <circle cx="200" cy="300" r="2.5" fill="#F5F0E6" opacity="0.7" />

          <rect x="120" y="20" width="160" height="80" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <rect x="160" y="20" width="80" height="35" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <path d="M 150 100 A 50 50 0 0 0 250 100" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />

          <rect x="120" y="500" width="160" height="80" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <rect x="160" y="545" width="80" height="35" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <path d="M 150 500 A 50 50 0 0 1 250 500" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />

          <path d="M 20 30 A 10 10 0 0 0 30 20" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <path d="M 370 20 A 10 10 0 0 0 380 30" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <path d="M 20 570 A 10 10 0 0 1 30 580" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />
          <path d="M 380 570 A 10 10 0 0 1 370 580" fill="none" stroke="#F5F0E6" strokeWidth="2" opacity="0.7" />

          <CornerFlag x={20} y={20} outX={20} outY={6} color="#C9A227" />
          <CornerFlag x={380} y={20} outX={380} outY={6} color="#C9A227" />
          <CornerFlag x={20} y={580} outX={20} outY={594} color="#C9A227" />
          <CornerFlag x={380} y={580} outX={380} outY={594} color="#C9A227" />

          <Goal flip={false} />
          <Goal flip={true} />

          <Coach />

          {xi.map((slot, i) => (
            <g key={i} transform={`translate(${slot.x},${slot.y})`}>
              <ellipse cx="0" cy="22" rx="16" ry="4" fill="#000" opacity="0.25" />
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
                  y="35"
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

      {bench.length > 0 && (
        <div>
          <p className="text-chalk/40 text-[11px] font-display uppercase tracking-wide mb-2">
            Banco de reservas ({bench.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {bench.map((p) => (
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
      )}
    </div>
  )
}
