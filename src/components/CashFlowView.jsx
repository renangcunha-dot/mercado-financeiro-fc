import { formatBRL } from '../game/format'

export default function CashFlowView({ history, cash }) {
  const recent = [...history].slice(-8).reverse()

  const totals = history.reduce(
    (acc, h) => ({
      ticket: acc.ticket + (h.ticketRevenue || 0),
      merch: acc.merch + (h.merchRevenue || 0),
      sponsor: acc.sponsor + (h.sponsorRevenue || 0),
      salaries: acc.salaries + (h.fixedCost || 0),
      staff: acc.staff + (h.staffCost || 0),
      bonus: acc.bonus + (h.bonusCost || 0),
      debt: acc.debt + (h.debtInterest || 0) + (h.dueInstallments || 0),
    }),
    { ticket: 0, merch: 0, sponsor: 0, salaries: 0, staff: 0, bonus: 0, debt: 0 }
  )

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-sm text-chalk/70 uppercase tracking-wide mb-2">
          Resumo acumulado da temporada
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-chalk/15 rounded-sm p-3">
            <p className="text-chalk/40 text-[10px] font-body uppercase">Bilheteria</p>
            <p className="font-display text-pitch-light text-sm">{formatBRL(totals.ticket)}</p>
          </div>
          <div className="border border-chalk/15 rounded-sm p-3">
            <p className="text-chalk/40 text-[10px] font-body uppercase">Merchandising</p>
            <p className="font-display text-pitch-light text-sm">{formatBRL(totals.merch)}</p>
          </div>
          <div className="border border-chalk/15 rounded-sm p-3">
            <p className="text-chalk/40 text-[10px] font-body uppercase">Patrocínio</p>
            <p className="font-display text-pitch-light text-sm">{formatBRL(totals.sponsor)}</p>
          </div>
          <div className="border border-chalk/15 rounded-sm p-3">
            <p className="text-chalk/40 text-[10px] font-body uppercase">Salários do elenco</p>
            <p className="font-display text-risk text-sm">-{formatBRL(totals.salaries)}</p>
          </div>
          <div className="border border-chalk/15 rounded-sm p-3">
            <p className="text-chalk/40 text-[10px] font-body uppercase">Estrutura (staff/estádio)</p>
            <p className="font-display text-risk text-sm">-{formatBRL(totals.staff)}</p>
          </div>
          <div className="border border-chalk/15 rounded-sm p-3">
            <p className="text-chalk/40 text-[10px] font-body uppercase">Dívida e parcelas</p>
            <p className="font-display text-risk text-sm">-{formatBRL(totals.debt)}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="font-display text-sm text-chalk/70 uppercase tracking-wide mb-2">
          Últimas rodadas
        </p>
        <div className="space-y-2">
          {recent.length === 0 && (
            <p className="text-chalk/50 text-sm font-body">Jogue a primeira rodada para ver o extrato aqui.</p>
          )}
          {recent.map((h) => (
            <div key={h.round} className="border border-chalk/15 rounded-sm p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-display text-xs text-chalk/60">Rodada {h.round}</span>
                <span className={`font-display text-sm ${h.netCashFlow >= 0 ? 'text-pitch-light' : 'text-risk'}`}>
                  {h.netCashFlow >= 0 ? '+' : ''}
                  {formatBRL(h.netCashFlow)}
                </span>
              </div>
              <p className="text-chalk/40 text-[11px] font-body">
                Receita {formatBRL(h.revenue)} · Despesas {formatBRL((h.fixedCost || 0) + (h.staffCost || 0) + (h.bonusCost || 0))}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-chalk/15 pt-3 flex justify-between items-center">
        <span className="font-body text-sm text-chalk/60">Caixa atual</span>
        <span className="font-display text-lg text-gold">{formatBRL(cash)}</span>
      </div>
    </div>
  )
}
