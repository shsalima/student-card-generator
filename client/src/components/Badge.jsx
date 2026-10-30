const styles = {
  'En attente': 'bg-amber-50 text-amber-700 ring-amber-200',
  Acceptée: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Refusée: 'bg-rose-50 text-rose-700 ring-rose-200',
}

function Badge({ children }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[children] || 'bg-slate-100 text-slate-600 ring-slate-200'}`}>
      {children}
    </span>
  )
}

export default Badge
