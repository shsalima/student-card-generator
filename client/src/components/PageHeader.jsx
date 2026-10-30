function PageHeader({ eyebrow = 'Administration', title, description, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#15806e]">{eyebrow}</p><h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>{description && <p className="mt-2 text-sm text-slate-500">{description}</p>}</div>
      {action}
    </div>
  )
}
export default PageHeader
