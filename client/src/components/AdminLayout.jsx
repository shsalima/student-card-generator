import { useState } from 'react'

const links = [
  ['dashboard', 'Tableau de bord', '▦'],
  ['students', 'Étudiants', '♙'],
  ['import', 'Importer les données', '⇧'],
  ['validation', 'Validation des photos', '✓'],
]

function AdminLayout({ activePage, onNavigate, onStudent, onLogout, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-[#123b36] px-5 py-6 text-white transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 border-b border-white/10 pb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#b6cb20] text-xl font-black text-[#123b36]">FP</div>
          <div>
            <p className="font-bold">Cartes étudiants</p>
            <p className="text-xs text-emerald-100/70">Espace administration</p>
          </div>
        </div>
        <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-widest text-emerald-100/50">Navigation</p>
        <nav className="space-y-1">
          {links.map(([id, label, icon]) => (
            <button key={id} onClick={() => { onNavigate(id); setOpen(false) }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${activePage === id ? 'bg-white/15 text-white' : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'}`}>
              <span className="w-5 text-center text-lg">{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 border-t border-white/10 pt-5">
          <button onClick={onStudent} className="mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-emerald-100/70 hover:bg-white/10 hover:text-white">♙ Espace étudiant</button>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-emerald-100/70 hover:bg-white/10 hover:text-white">↪ Se déconnecter</button>
        </div>
      </aside>
      {open && <button aria-label="Fermer le menu" className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="lg:pl-72">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
          <button className="text-2xl lg:hidden" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">☰</button>
          <div className="hidden sm:block"><p className="text-sm text-slate-500">Faculté Polydisciplinaire de Béni Mellal</p><p className="font-semibold text-slate-800">Université Sultan Moulay Slimane</p></div>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-semibold">Administrateur</p><p className="text-xs text-slate-500">Données de démonstration</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dce9a0] font-bold text-[#123b36]">AD</div></div>
        </header>
        <main className="mx-auto max-w-[1440px] p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
