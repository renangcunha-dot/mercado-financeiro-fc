// Efeitos sonoros curtos gerados via Web Audio API. Nenhum arquivo de
// áudio externo é necessário. Respeita a preferência de som do jogador
// (guardada em localStorage) e falha em silêncio se o navegador bloquear
// áudio antes de qualquer interação do usuário.

const MUTE_KEY = 'mercado-financeiro-fc-muted'

export function isMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

export function setMuted(muted) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
  } catch {
    /* ignora ambientes sem localStorage */
  }
}

let ctx = null
function getContext() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null
    ctx = new AudioContextClass()
  }
  return ctx
}

function playTone({ freq, duration = 0.15, delay = 0, type = 'sine', volume = 0.08 }) {
  if (isMuted()) return
  const audioCtx = getContext()
  if (!audioCtx) return
  try {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = volume
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    const start = audioCtx.currentTime + delay
    gain.gain.setValueAtTime(volume, start)
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
    osc.start(start)
    osc.stop(start + duration)
  } catch {
    /* ambientes sem suporte a áudio simplesmente não tocam som */
  }
}

export function playWin() {
  playTone({ freq: 523.25, duration: 0.12 })
  playTone({ freq: 659.25, duration: 0.16, delay: 0.1 })
  playTone({ freq: 783.99, duration: 0.22, delay: 0.2 })
}

export function playLoss() {
  playTone({ freq: 300, duration: 0.18, type: 'triangle' })
  playTone({ freq: 220, duration: 0.28, delay: 0.12, type: 'triangle' })
}

export function playDraw() {
  playTone({ freq: 392, duration: 0.18, type: 'sine' })
}

export function playAchievement() {
  playTone({ freq: 660, duration: 0.1 })
  playTone({ freq: 880, duration: 0.1, delay: 0.08 })
  playTone({ freq: 1108.73, duration: 0.28, delay: 0.16 })
}

export function playClick() {
  playTone({ freq: 440, duration: 0.05, volume: 0.05 })
}
