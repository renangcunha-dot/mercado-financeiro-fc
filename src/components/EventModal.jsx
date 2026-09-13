export default function EventModal({ event, onChoose }) {
  if (!event) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-chalk text-ink rounded-sm p-6 shadow-2xl border-t-4 border-risk">
        <p className="font-display uppercase tracking-wide text-xs text-risk mb-1">
          Evento da rodada
        </p>
        <h3 className="font-display text-2xl mb-2">{event.title}</h3>
        <p className="font-body text-sm text-ink/70 mb-5 leading-relaxed">{event.description}</p>
        <div className="space-y-2">
          {event.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => onChoose(choice)}
              className="w-full text-left border border-ink/15 hover:border-pitch hover:bg-pitch/5 rounded-sm p-3 font-body text-sm transition-colors"
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
