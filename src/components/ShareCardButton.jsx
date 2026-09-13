import { useState } from 'react'
import { generateShareCard, downloadShareCard } from '../game/shareCard'

export default function ShareCardButton({ club, financialTitle, financialHealthScore, points, position, totalClubs, netWorth, seasonName, label = 'Baixar cartão de resultado' }) {
  const [preview, setPreview] = useState(null)

  function handleGenerate() {
    const dataUrl = generateShareCard({
      club,
      financialTitle,
      financialHealthScore,
      points,
      position,
      totalClubs,
      netWorth,
      seasonName,
    })
    setPreview(dataUrl)
  }

  return (
    <div>
      <button
        onClick={handleGenerate}
        className="w-full bg-gold text-ink font-display uppercase tracking-wide text-sm py-3 rounded-sm hover:bg-gold-light transition-colors"
      >
        {label}
      </button>
      {preview && (
        <div className="mt-4 space-y-3">
          <img src={preview} alt="Cartão de resultado" className="w-full rounded-sm border border-chalk/15" />
          <button
            onClick={() => downloadShareCard(preview)}
            className="w-full border border-gold text-gold font-display uppercase tracking-wide text-xs py-2.5 rounded-sm hover:bg-gold/10 transition-colors"
          >
            Baixar imagem
          </button>
        </div>
      )}
    </div>
  )
}
