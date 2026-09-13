export default function ConceptCard({ concept, onClose }) {
  if (!concept) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-chalk text-ink border-l-4 border-gold rounded-sm p-6 shadow-2xl">
        <p className="font-display uppercase tracking-wide text-xs text-pitch mb-1">
          Conceito desbloqueado
        </p>
        <h3 className="font-display text-2xl mb-3">{concept.name}</h3>
        <p className="font-body text-sm text-ink/80 leading-relaxed">{concept.explanation}</p>
        <button
          onClick={onClose}
          className="mt-5 w-full bg-pitch text-chalk font-display uppercase tracking-wide text-sm py-3 rounded-sm hover:bg-pitch-light transition-colors"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}
