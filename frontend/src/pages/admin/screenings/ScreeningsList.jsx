import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Plus } from 'lucide-react'
import AdminLayout from '../../../components/AdminLayout'
import api from '../../../api/axios'

function ScreeningsList() {
    const [screenings, setScreenings] = useState([])

    useEffect(() => {
        const load = async () => {
            const res = await api.get('/screenings')
            setScreenings(res.data)
        }
        load()
    }, [])

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette séance ?')) return
        await api.delete(`/screenings/${id}`)
        setScreenings(screenings.filter(s => s.id_screening !== id))
    }

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-title)' }}>Séances</h1>
                <Link to="/admin/screenings/create"
                    className="flex items-center gap-2 px-4 py-2 rounded text-white text-sm font-medium"
                    style={{ background: 'var(--color-accent)' }}>
                    <Plus size={16} /> Ajouter une séance
                </Link>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Film</th>
                            <th className="px-4 py-3 text-left">Salle</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Heure</th>
                            <th className="px-4 py-3 text-left">Places restantes</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {screenings.map(s => (
                            <tr key={s.id_screening} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{s.film?.title || '—'}</td>
                                <td className="px-4 py-3 text-gray-500">{s.room?.name || '—'}</td>
                                <td className="px-4 py-3 text-gray-500">{s.date}</td>
                                <td className="px-4 py-3 text-gray-500">{s.time}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.seats_remaining > 10 ? 'bg-green-100 text-green-700' : s.seats_remaining > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                        {s.seats_remaining} places
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <Link to={`/admin/screenings/${s.id_screening}/edit`}
                                            className="p-1.5 rounded hover:bg-gray-100 text-gray-600">
                                            <Pencil size={15} />
                                        </Link>
                                        <button onClick={() => handleDelete(s.id_screening)}
                                            className="p-1.5 rounded hover:bg-red-50 text-red-500">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    )
}

export default ScreeningsList