import { randomNationality } from '../data/nameBank'

const POSITIONS = ['Goleiro', 'Zagueiro', 'Lateral', 'Meio-campo', 'Atacante']

let uidCounter = 0
function nextId() {
  uidCounter += 1
  return `pl${uidCounter}`
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

// Valor de mercado segue uma curva simples por idade: sobe até os 26-27
// anos e cai depois, com ruído aleatório para variedade.
function marketValueForAge(age) {
  const peak = 27
  const distanceFromPeak = Math.abs(age - peak)
  const base = 12_000_000 - distanceFromPeak * 700_000
  const noise = randomBetween(0.6, 1.5)
  return Math.max(800_000, Math.round(base * noise))
}

function riskProfileForAge(age) {
  if (age <= 21) return 'alto'
  if (age <= 29) return 'medio'
  return 'baixo'
}

function potentialRangeFor(age) {
  if (age <= 21) return [-35, 90]
  if (age <= 29) return [-15, 25]
  return [-12, 6]
}

export function generatePlayer(position, usedNames) {
  let name
  let nationality
  let attempts = 0
  do {
    nationality = randomNationality()
    const first = nationality.first[Math.floor(Math.random() * nationality.first.length)]
    const last = nationality.last[Math.floor(Math.random() * nationality.last.length)]
    name = `${first} ${last}`
    attempts += 1
  } while (usedNames.has(name) && attempts < 20)
  usedNames.add(name)

  const age = Math.round(randomBetween(17, 35))
  const marketValue = marketValueForAge(age)
  const fixedSalary = Math.round(marketValue * randomBetween(0.018, 0.028))
  const bonusPerWin = Math.round(fixedSalary * randomBetween(0.05, 0.12))

  return {
    id: nextId(),
    name,
    nationality: nationality.country,
    position,
    age,
    marketValue,
    fixedSalary,
    bonusPerWin,
    riskProfile: riskProfileForAge(age),
    potentialRange: potentialRangeFor(age),
    hot: Math.random() < 0.06,
  }
}

// Gera um elenco completo de 22 jogadores com distribuição de posição
// realista: 3 goleiros, 8 defensores (zagueiros + laterais), 7 meio-campistas,
// 4 atacantes.
export function generateSquad(usedNames) {
  const distribution = [
    ...Array(3).fill('Goleiro'),
    ...Array(4).fill('Zagueiro'),
    ...Array(4).fill('Lateral'),
    ...Array(7).fill('Meio-campo'),
    ...Array(4).fill('Atacante'),
  ]
  return distribution.map((pos) => generatePlayer(pos, usedNames))
}

// Gera o mercado internacional (jogadores livres/transferíveis, não
// vinculados a nenhum clube), usado como fonte de contratação para todos.
export function generateTransferMarket(count, usedNames) {
  const players = []
  for (let i = 0; i < count; i++) {
    const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)]
    players.push(generatePlayer(position, usedNames))
  }
  return players
}
