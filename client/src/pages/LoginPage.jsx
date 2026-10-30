import { useState } from 'react'

function LoginPage({ onLogin, onStudent }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (!identifier.trim() || !password) { setError('Veuillez renseigner votre identifiant et votre mot de passe.'); return }
    setError('') ; onLogin()
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#123b36] p-5">
    <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
      <div className="hidden bg-[#174e45] p-12 text-white lg:flex lg:flex-col lg:justify-between"><div><div className="mb-12 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b6cb20] text-xl font-black text-[#123b36]">FP</div><p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#b6cb20]">Université Sultan Moulay Slimane</p><h1 className="text-4xl font-bold leading-tight">Vos cartes étudiantes, simplement.</h1><p className="mt-5 max-w-sm text-emerald-100/75">Une plateforme centralisée pour gérer, valider et générer les cartes de la Faculté Polydisciplinaire de Béni Mellal.</p></div><p className="text-sm text-emerald-100/50">© 2026 Faculté Polydisciplinaire de Béni Mellal</p></div>
      <div className="p-7 sm:p-12"><div className="mb-10 lg:hidden"><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#b6cb20] font-black text-[#123b36]">FP</div><p className="text-xs font-bold uppercase tracking-widest text-[#15806e]">Université Sultan Moulay Slimane</p></div><p className="text-sm font-semibold text-[#15806e]">Espace administration</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Bienvenue</h2><p className="mt-2 text-sm text-slate-500">Connectez-vous pour accéder à votre tableau de bord.</p>
        <form className="mt-8 space-y-5" onSubmit={submit}><label className="block text-sm font-medium text-slate-700">Email ou identifiant<input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#15806e] focus:ring-4 focus:ring-emerald-100" placeholder="admin@fpbm.ma" /></label><label className="block text-sm font-medium text-slate-700">Mot de passe<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#15806e] focus:ring-4 focus:ring-emerald-100" placeholder="••••••••" /></label>{error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<button className="w-full rounded-xl bg-[#15806e] py-3.5 font-semibold text-white transition hover:bg-[#123b36]">Se connecter</button></form>
        <div className="mt-8 border-t border-slate-100 pt-6 text-center"><p className="text-xs text-slate-500">Vous êtes étudiant ?</p><button onClick={onStudent} className="mt-2 text-sm font-semibold text-[#15806e] hover:underline">Accéder à mon espace étudiant →</button></div><p className="mt-8 rounded-lg bg-amber-50 p-3 text-center text-xs text-amber-700">Interface de démonstration — authentification non connectée.</p>
      </div>
    </div>
  </main>
}
export default LoginPage
