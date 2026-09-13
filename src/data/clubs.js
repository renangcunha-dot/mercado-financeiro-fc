// 20 clubes fictícios. O jogador escolhe um para jogar; os outros 19 viram
// rivais controlados por IA na liga. Cores e nomes são inteiramente
// inventados — qualquer semelhança com clubes reais é só estética de
// "clube de futebol genérico", não uma reprodução de marca registrada.

export const CLUBS = [
  { id: 'santista', name: 'Clube Santista', short: 'CST', colors: ['#0a4d2e', '#f5c400'], country: 'Brasil', style: 'equilibrado' },
  { id: 'porto-real', name: 'Porto Real EC', short: 'PRE', colors: ['#7a1220', '#f5f0e6'], country: 'Brasil', style: 'agressivo' },
  { id: 'alvorada', name: 'Alvorada FC', short: 'ALV', colors: ['#1c3d8f', '#f5f0e6'], country: 'Brasil', style: 'conservador' },
  { id: 'monte-azul', name: 'Monte Azul AC', short: 'MAZ', colors: ['#123c69', '#f2a900'], country: 'Brasil', style: 'especulador' },
  { id: 'britannia', name: 'Britannia United', short: 'BRU', colors: ['#c8102e', '#1a1a1a'], country: 'Inglaterra', style: 'agressivo' },
  { id: 'castilla', name: 'Real Castilla CF', short: 'RCC', colors: ['#f2a900', '#7a1220'], country: 'Espanha', style: 'equilibrado' },
  { id: 'lyon-nord', name: 'Lyon Nord FC', short: 'LYN', colors: ['#1c1c8f', '#f5f0e6'], country: 'França', style: 'conservador' },
  { id: 'batavia', name: 'Batávia SC', short: 'BAT', colors: ['#e8720c', '#1a1a1a'], country: 'Holanda', style: 'especulador' },
  { id: 'cordilheira', name: 'Atlético Cordilheira', short: 'ACR', colors: ['#5b2a86', '#f5f0e6'], country: 'Argentina', style: 'agressivo' },
  { id: 'litoral', name: 'União Litoral', short: 'ULI', colors: ['#0f5c8a', '#f5f0e6'], country: 'Uruguai', style: 'especulador' },
  { id: 'ferroviario', name: 'Ferroviário do Vale', short: 'FDV', colors: ['#3d3d3d', '#f2a900'], country: 'Brasil', style: 'conservador' },
  { id: 'serrano', name: 'Grêmio Serrano', short: 'GRS', colors: ['#0a4d2e', '#ffffff'], country: 'Brasil', style: 'equilibrado' },
  { id: 'fronteira', name: 'Comercial Fronteira', short: 'CFR', colors: ['#8f1c1c', '#f5f0e6'], country: 'Argentina', style: 'conservador' },
  { id: 'ilhas', name: 'Náutico das Ilhas', short: 'NDI', colors: ['#123c69', '#f2a900'], country: 'Portugal', style: 'agressivo' },
  { id: 'independente', name: 'Independente Norte', short: 'IND', colors: ['#1a1a1a', '#c8102e'], country: 'Uruguai', style: 'especulador' },
  { id: 'rhein-tal', name: 'Rhein Tal FC', short: 'RTF', colors: ['#1a1a1a', '#c9a227'], country: 'Alemanha', style: 'agressivo' },
  { id: 'lombardia', name: 'Lombardia Calcio', short: 'LBC', colors: ['#0a3d91', '#f5f0e6'], country: 'Itália', style: 'equilibrado' },
  { id: 'flandres', name: 'Flandres United', short: 'FLU', colors: ['#f2a900', '#1a1a1a'], country: 'Bélgica', style: 'conservador' },
  { id: 'andes', name: 'Deportivo Andes', short: 'DAN', colors: ['#c8102e', '#1a1a1a'], country: 'Chile', style: 'especulador' },
  { id: 'azteca', name: 'Club Azteca', short: 'CAZ', colors: ['#0a6e31', '#c8102e'], country: 'México', style: 'agressivo' },
]

export function clubById(id) {
  return CLUBS.find((c) => c.id === id)
}
