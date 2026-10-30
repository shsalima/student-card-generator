function StudentCard() {
  return (
    <div className="relative mx-auto aspect-[1.586/1] w-full max-w-[470px] overflow-hidden rounded-2xl bg-[#174e45] p-5 text-white shadow-xl">
      <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[24px] border-[#b6cb20]/20" />
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#b6cb20] text-xs font-black text-[#123b36]">FP</div><div><p className="text-[9px] font-bold uppercase tracking-wider text-emerald-100">Université Sultan Moulay Slimane</p><p className="text-[10px] font-semibold">Faculté Polydisciplinaire</p></div></div>
        <span className="rounded-full bg-white/10 px-2 py-1 text-[9px]">CARTE 2024–2025</span>
      </div>
      <div className="relative mt-6 flex items-center gap-4"><div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-lg bg-[#dce9a0] text-2xl font-bold text-[#15806e]">AE</div><div><p className="text-[10px] uppercase tracking-widest text-emerald-100/70">Carte étudiant</p><p className="mt-1 text-lg font-bold">Amina</p><p className="text-lg font-bold">El Mansouri</p><p className="mt-2 text-[10px] text-emerald-100/80">APO2024001 · Informatique</p></div></div>
      <div className="absolute bottom-4 right-5 grid h-10 w-10 grid-cols-3 gap-0.5 rounded bg-white p-1">{Array.from({ length: 9 }, (_, i) => <span key={i} className={i % 2 ? 'bg-[#123b36]' : 'bg-[#b6cb20]'} />)}</div>
      <p className="absolute bottom-4 left-5 text-[8px] uppercase tracking-wider text-emerald-100/60">Document officiel • FP Béni Mellal</p>
    </div>
  )
}
export default StudentCard
