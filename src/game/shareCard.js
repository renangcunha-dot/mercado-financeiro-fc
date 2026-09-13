// Desenha um cartão de resultado 1080x1350 (proporção de post de rede
// social) usando a Canvas API do navegador, no mesmo estilo visual do
// jogo, e devolve uma URL de imagem PNG pronta para download.

export function generateShareCard({ club, financialTitle, financialHealthScore, points, position, totalClubs, netWorth, seasonName }) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1350
  const ctx = canvas.getContext('2d')

  // fundo
  ctx.fillStyle = '#0A2A20'
  ctx.fillRect(0, 0, 1080, 1350)
  ctx.fillStyle = '#C9A227'
  ctx.fillRect(0, 0, 1080, 10)
  ctx.fillRect(0, 1340, 1080, 10)

  // escudo simplificado
  const [primary, secondary] = club.colors
  ctx.save()
  ctx.translate(540, 220)
  ctx.beginPath()
  ctx.moveTo(-92, -100)
  ctx.lineTo(92, -100)
  ctx.lineTo(92, -20)
  ctx.bezierCurveTo(92, 40, 40, 80, 0, 96)
  ctx.bezierCurveTo(-40, 80, -92, 40, -92, -20)
  ctx.closePath()
  ctx.fillStyle = primary
  ctx.fill()
  ctx.lineWidth = 6
  ctx.strokeStyle = secondary
  ctx.stroke()
  ctx.fillStyle = secondary
  ctx.font = 'bold 52px "DejaVu Sans Condensed", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(club.short, 0, 18)
  ctx.restore()

  ctx.fillStyle = '#F5F0E6'
  ctx.textAlign = 'center'
  ctx.font = 'bold 46px "DejaVu Sans Condensed", sans-serif'
  ctx.fillText(club.name, 540, 400)
  ctx.fillStyle = 'rgba(245,240,230,0.5)'
  ctx.font = '28px "DejaVu Sans", sans-serif'
  ctx.fillText(seasonName, 540, 445)

  // score central
  ctx.fillStyle = '#E0C158'
  ctx.font = 'bold 220px "DejaVu Sans Condensed", sans-serif'
  ctx.fillText(String(financialHealthScore), 540, 730)
  ctx.fillStyle = 'rgba(245,240,230,0.6)'
  ctx.font = '26px "DejaVu Sans", sans-serif'
  ctx.fillText('ÍNDICE DE SAÚDE FINANCEIRA', 540, 780)

  ctx.fillStyle = '#C9A227'
  ctx.font = 'bold 40px "DejaVu Sans Condensed", sans-serif'
  ctx.fillText(financialTitle, 540, 850)

  // linha divisória
  ctx.strokeStyle = 'rgba(245,240,230,0.2)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(240, 910)
  ctx.lineTo(840, 910)
  ctx.stroke()

  // stats
  const stats = [
    [`${position}º / ${totalClubs}`, 'POSIÇÃO NA LIGA'],
    [`${points} pts`, 'PONTOS'],
    [netWorth, 'PATRIMÔNIO'],
  ]
  const colWidth = 1080 / 3
  stats.forEach(([value, label], i) => {
    const x = colWidth * i + colWidth / 2
    ctx.fillStyle = '#F5F0E6'
    ctx.font = 'bold 34px "DejaVu Sans Condensed", sans-serif'
    ctx.fillText(value, x, 985)
    ctx.fillStyle = 'rgba(245,240,230,0.45)'
    ctx.font = '18px "DejaVu Sans", sans-serif'
    ctx.fillText(label, x, 1015)
  })

  ctx.fillStyle = 'rgba(245,240,230,0.35)'
  ctx.font = 'bold 22px "DejaVu Sans Condensed", sans-serif'
  ctx.fillText('MERCADO FINANCEIRO FC', 540, 1250)

  return canvas.toDataURL('image/png')
}

export function downloadShareCard(dataUrl, filename = 'meu-resultado-mercado-financeiro-fc.png') {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}
