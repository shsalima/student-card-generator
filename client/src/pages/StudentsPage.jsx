import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'

const statusOptions = ['Tous', 'Acceptée', 'En attente', 'Refusée']
const defaultForm = {
  cin: '',
  apogeeCode: '',
  firstName: '',
  lastName: '',
  field: '',
  status: 'pending',
  email: '',
}

function StudentsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Tous')
  const [students, setStudents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formState, setFormState] = useState(defaultForm)

  const loadStudents = async () => {
    try {
      const queryString = new URLSearchParams({ query, status: status === 'Tous' ? 'all' : status })
      const response = await fetch(`/api/students?${queryString.toString()}`)
      if (!response.ok) {
        throw new Error('Request failed')
      }

      const payload = await response.json()
      if (payload?.success !== false) {
        setStudents(payload.data ?? [])
      }
    } catch {
      setStudents([])
    }
  }

  useEffect(() => {
    loadStudents()
  }, [query, status])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cin: formState.cin,
          apogeeCode: formState.apogeeCode,
          firstName: formState.firstName,
          lastName: formState.lastName,
          field: formState.field,
          status: formState.status,
          email: formState.email,
        }),
      })

      if (!response.ok) {
        throw new Error('Create failed')
      }

      const payload = await response.json()
      setStudents((current) => [payload.data, ...current])
      setFormState(defaultForm)
      setShowForm(false)
    } catch {
      // no-op in demo mode
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/students/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Delete failed')
      }

      setStudents((current) => current.filter((student) => Number(student.id) !== Number(id)))
    } catch {
      // no-op in demo mode
    }
  }

  const rows = students.map((student) => [student.cin, student.apogeeCode, student.firstName, student.lastName, student.field, student.statusLabel, student.id])

  return <><PageHeader title="Gestion des étudiants" description="Consultez et filtrez les étudiants enregistrés." action={<button onClick={() => setShowForm((value) => !value)} className="rounded-xl bg-[#15806e] px-4 py-3 text-sm font-semibold text-white hover:bg-[#123b36]">＋ Ajouter un étudiant</button>} />{showForm && <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><input required value={formState.cin} onChange={(event) => setFormState((current) => ({ ...current, cin: event.target.value }))} placeholder="CIN" className="rounded-xl border border-slate-200 px-3 py-2.5" /><input required value={formState.apogeeCode} onChange={(event) => setFormState((current) => ({ ...current, apogeeCode: event.target.value }))} placeholder="Code Apogée" className="rounded-xl border border-slate-200 px-3 py-2.5" /><input required value={formState.firstName} onChange={(event) => setFormState((current) => ({ ...current, firstName: event.target.value }))} placeholder="Prénom" className="rounded-xl border border-slate-200 px-3 py-2.5" /><input required value={formState.lastName} onChange={(event) => setFormState((current) => ({ ...current, lastName: event.target.value }))} placeholder="Nom" className="rounded-xl border border-slate-200 px-3 py-2.5" /><input value={formState.field} onChange={(event) => setFormState((current) => ({ ...current, field: event.target.value }))} placeholder="Filière" className="rounded-xl border border-slate-200 px-3 py-2.5" /><input value={formState.email} onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))} placeholder="Email" className="rounded-xl border border-slate-200 px-3 py-2.5" /><select value={formState.status} onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2.5"><option value="pending">En attente</option><option value="accepted">Acceptée</option><option value="rejected">Refusée</option></select><div className="flex items-center gap-3 md:col-span-2 xl:col-span-3"><button type="submit" className="rounded-xl bg-[#15806e] px-4 py-2.5 font-semibold text-white">Enregistrer</button><button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-700">Annuler</button></div></form></div>}<div className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row"><div className="relative flex-1"><span className="absolute left-3 top-2.5 text-slate-400">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher par nom, CIN ou code Apogée..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#15806e]" /></div><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-3 text-sm text-slate-600 outline-none">{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['CIN', 'Code Apogée', 'Nom', 'Prénom', 'Filière', 'Statut', 'Actions'].map((head) => <th key={head} className="px-5 py-4 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row[6]} className="hover:bg-slate-50">{row.slice(0, 6).map((cell, index) => <td key={`${row[6]}-${index}`} className="whitespace-nowrap px-5 py-4 text-slate-600">{index === 5 ? <Badge>{cell}</Badge> : index === 2 || index === 3 ? <span className="font-medium text-slate-800">{cell}</span> : cell}</td>)}<td className="px-5 py-4 text-right"><button onClick={() => handleDelete(row[6])} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">Supprimer</button></td></tr>)}</tbody></table></div><p className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">{rows.length} étudiant(s) affiché(s) · données synchronisées</p></div></>
}
export default StudentsPage
