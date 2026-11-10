import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'

const fallbackSummary = {
  total: 2486,
  accepted: 2117,
  pending: 184,
  rejected: 185,
  completion: 85,
  recent: [
    { apogeeCode: 'ETU-2024-001', firstName: 'Amina', lastName: 'El Mansouri', field: 'Informatique', statusLabel: 'Acceptée' },
    { apogeeCode: 'ETU-2024-002', firstName: 'Youssef', lastName: 'Bennani', field: 'Économie', statusLabel: 'En attente' },
    { apogeeCode: 'ETU-2024-003', firstName: 'Sara', lastName: 'Alaoui', field: 'Droit', statusLabel: 'Refusée' },
    { apogeeCode: 'ETU-2024-004', firstName: 'Omar', lastName: 'Tazi', field: 'Informatique', statusLabel: 'Acceptée' },
  ],
}

function DashboardPage() {
  const [summary, setSummary] = useState(fallbackSummary)

  useEffect(() => {
    let active = true

    const loadSummary = async () => {
      try {
        const response = await fetch('/api/dashboard')
        if (!response.ok) {
          throw new Error('Request failed')
        }

        const payload = await response.json()
        if (active && payload?.success !== false) {
          setSummary({
            total: payload.total ?? fallbackSummary.total,
            accepted: payload.accepted ?? fallbackSummary.accepted,
            pending: payload.pending ?? fallbackSummary.pending,
            rejected: payload.rejected ?? fallbackSummary.rejected,
            completion: payload.completion ?? fallbackSummary.completion,
            recent: payload.recent ?? fallbackSummary.recent,
          })
        }
      } catch {
        if (active) {
          setSummary(fallbackSummary)
        }
      }
    }

    loadSummary()
    return () => {
      active = false
    }
  }, [])

  const recent = summary.recent?.length ? summary.recent : fallbackSummary.recent

  return <><PageHeader title="Tableau de bord" description="Vue d’ensemble de la gestion des cartes étudiantes." action={<span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">● Données de démonstration</span>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total étudiants" value={summary.total.toLocaleString('fr-FR')} detail="+8,2% depuis le dernier import" color="bg-blue-50 text-blue-700" icon="♙" /><StatCard label="Photos en attente" value={summary.pending.toLocaleString('fr-FR')} detail="À traiter cette semaine" color="bg-amber-50 text-amber-700" icon="◷" /><StatCard label="Photos acceptées" value={summary.accepted.toLocaleString('fr-FR')} detail={`${summary.completion}% du total`} color="bg-emerald-50 text-emerald-700" icon="✓" /><StatCard label="Photos refusées" value={summary.rejected.toLocaleString('fr-FR')} detail="7,4% du total" color="bg-rose-50 text-rose-700" icon="!" /></div><div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold">Dernières soumissions</h2><p className="mt-1 text-xs text-slate-500">Activité récente des étudiants</p></div><button className="text-sm font-semibold text-[#15806e]">Voir tout →</button></div><div className="space-y-1">{recent.map((student) => <div key={student.apogeeCode || student.id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-3 hover:bg-slate-50"><div className="flex min-w-0 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5efbd] text-xs font-bold text-[#15806e]">{(student.firstName || '').charAt(0)}{(student.lastName || '').charAt(0)}</div><div className="min-w-0"><p className="truncate text-sm font-semibold">{student.firstName} {student.lastName}</p><p className="truncate text-xs text-slate-500">{student.apogeeCode} · {student.field}</p></div></div><Badge>{student.statusLabel}</Badge></div>)}</div></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">Progression globale</h2><p className="mt-1 text-xs text-slate-500">État des photos importées</p><div className="mt-8 flex items-center justify-center"><div className="relative flex h-44 w-44 items-center justify-center rounded-full" style={{ background: `conic-gradient(#15806e 0 ${summary.completion}%, #f5a623 ${summary.completion}% ${Math.min(summary.completion + 7, 100)}%, #fda4af ${Math.min(summary.completion + 7, 100)}% 100%)` }}><div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white"><span className="text-3xl font-bold">{summary.completion}%</span><span className="text-xs text-slate-500">complété</span></div></div></div><div className="mt-7 grid grid-cols-3 gap-2 text-center text-xs"><div><span className="mb-1 inline-block h-2 w-2 rounded-full bg-[#15806e]" /> Acceptées</div><div><span className="mb-1 inline-block h-2 w-2 rounded-full bg-[#f5a623]" /> En attente</div><div><span className="mb-1 inline-block h-2 w-2 rounded-full bg-rose-300" /> Refusées</div></div></section></div></>
}
export default DashboardPage
