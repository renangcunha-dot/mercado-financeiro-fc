import { CLUBS, clubById } from '../data/clubs'
import { SEASONS } from '../data/seasons'

export const SLOT_COUNT = 3
const LEGACY_KEY = 'mercado-financeiro-fc'

export function slotKey(n) {
  return `mercado-financeiro-fc-slot-${n}`
}

export function readSlotRaw(n) {
  try {
    const raw = localStorage.getItem(slotKey(n))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function isValidSave(parsed) {
  return (
    !!parsed &&
    typeof parsed.clubId === 'string' &&
    CLUBS.some((c) => c.id === parsed.clubId) &&
    Array.isArray(parsed.rivals) &&
    parsed.rivals.length === CLUBS.length - 1
  )
}

export function writeSlot(n, state) {
  try {
    localStorage.setItem(slotKey(n), JSON.stringify(state))
  } catch {
    /* localStorage indisponível (modo privado, cota cheia etc): sem crash */
  }
}

export function deleteSlot(n) {
  try {
    localStorage.removeItem(slotKey(n))
  } catch {
    /* ignora */
  }
}

// Migração de continuidade: se existir um progresso salvo no formato antigo
// (de antes dos slots) e o slot 1 ainda estiver vazio, aproveita ele em vez
// de descartar o progresso do jogador.
export function migrateLegacyIfNeeded() {
  try {
    const legacyRaw = localStorage.getItem(LEGACY_KEY)
    if (!legacyRaw) return
    const slot1Raw = localStorage.getItem(slotKey(1))
    if (slot1Raw) return
    const parsed = JSON.parse(legacyRaw)
    if (isValidSave(parsed)) {
      localStorage.setItem(slotKey(1), legacyRaw)
    }
  } catch {
    /* ignora progresso legado corrompido */
  }
}

export function slotSummaries() {
  const list = []
  for (let n = 1; n <= SLOT_COUNT; n++) {
    const parsed = readSlotRaw(n)
    if (parsed && isValidSave(parsed)) {
      const club = clubById(parsed.clubId)
      const season = SEASONS[parsed.seasonIndex] || SEASONS[0]
      list.push({
        slot: n,
        exists: true,
        club,
        seasonName: season.name,
        round: parsed.round,
        gameOver: !!parsed.gameOver,
      })
    } else {
      list.push({ slot: n, exists: false })
    }
  }
  return list
}
