import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Plus } from 'lucide-react'
import AdminLayout from '../../../components/AdminLayout'
import api from '../../../api/axios'

function FilmsList() {
    const [films, setFilms] = useState([])

    useEffect(() => {
        const load = async () => {
            const res = await api.get('/films')
            setFilms(res.data)
        }
        load()
    }, [])

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce film ?')) return
        await api.delete(`/films/${id}`)
        setFilms(films.filter(f => f.id_film !== id))
    }

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: '"Archivo Black", sans-serif' }}>
                    Films
                </h1>
                <Link
                    to="/admin/films/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
                    style={{ background: '#17286D' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1e3a8a'}
                    onMouseLeave={e => e.currentTarget.style.background = '#17286D'}
                >
                    <Plus size={16} />
                    Ajouter un film
                </Link>
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#1a2238] shadow-lg">
                <table className="w-full min-w-[640px] text-sm text-gray-200">
                    <thead className="bg-[#222d4a] text-gray-300 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-4 sm:px-6 py-4 text-left font-semibold">Affiche</th>
                            <th className="px-4 sm:px-6 py-4 text-left font-semibold">Titre</th>
                            <th className="px-4 sm:px-6 py-4 text-left font-semibold">Catégorie</th>
                            <th className="px-4 sm:px-6 py-4 text-left font-semibold">Durée</th>
                            <th className="px-4 sm:px-6 py-4 text-left font-semibold">Statut</th>
                            <th className="px-4 sm:px-6 py-4 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {films.map(film => (
                            <tr
                                key={film.id_film}
                                className="transition-colors hover:bg-white/5"
                            >
                                <td className="px-4 sm:px-6 py-3">
                                    {film.poster ? (
                                        <img
                                            src={`http://127.0.0.1:8000/storage/${film.poster}`}
                                            alt={film.title}
                                            className="w-11 h-16 object-cover rounded-md ring-1 ring-white/10"
                                        />
                                    ) : (
                                        <div className="w-11 h-16 bg-white/5 rounded-md flex items-center justify-center text-gray-500 text-[10px] ring-1 ring-white/10">
                                            N/A
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 sm:px-6 py-3 font-medium text-white whitespace-nowrap">
                                    {film.title}
                                </td>
                                <td className="px-4 sm:px-6 py-3 text-gray-400 whitespace-nowrap">
                                    {film.category?.name || '—'}
                                </td>
                                <td className="px-4 sm:px-6 py-3 text-gray-400 whitespace-nowrap">
                                    {film.duration_min ? `${film.duration_min} min` : '—'}
                                </td>
                                <td className="px-4 sm:px-6 py-3">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${film.status === 'showing'
                                            ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/20'
                                            : 'bg-orange-500/10 text-orange-300 ring-orange-400/20'
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${film.status === 'showing' ? 'bg-emerald-400' : 'bg-orange-400'
                                                }`}
                                        />
                                        {film.status === 'showing' ? "À l'affiche" : 'À venir'}
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 py-3">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            to={`/admin/films/${film.id_film}/edit`}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#7c5cff] hover:bg-[#7c5cff]/10 transition-colors"
                                            title="Modifier"
                                        >
                                            <Pencil size={15} />
                                            <span className="hidden sm:inline text-xs font-medium">Modifier</span>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(film.id_film)}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={15} />
                                            <span className="hidden sm:inline text-xs font-medium">Supprimer</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {films.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    Aucun film pour le moment.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </AdminLayout>
    )
}

export default FilmsList 