import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AdminLayout from '../../../components/AdminLayout'
import api from '../../../api/axios'

function FilmEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [error, setError] = useState('')
    const [posterFile, setPosterFile] = useState(null)
    const [currentPoster, setCurrentPoster] = useState(null)
    const [form, setForm] = useState({
        title: '', synopsis: '', duration_min: '',
        actors: '', release_date: '', status: 'coming_soon', id_category: ''
    })

    useEffect(() => {
        const load = async () => {
            const [filmRes, catsRes] = await Promise.all([
                api.get(`/films/${id}`),
                api.get('/categories')
            ])
            const film = filmRes.data
            setCurrentPoster(film.poster)
            setForm({
                title: film.title,
                synopsis: film.synopsis || '',
                duration_min: film.duration_min || '',
                actors: film.actors || '',
                release_date: film.release_date || '',
                status: film.status,
                id_category: film.id_category || ''
            })
            setCategories(catsRes.data)
        }
        load()
    }, [id])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const formData = new FormData()
            Object.keys(form).forEach(key => {
                if (form[key] !== '') formData.append(key, form[key])
            })
            if (posterFile) formData.append('poster', posterFile)
            formData.append('_method', 'PUT')
            await api.post(`/films/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            navigate('/admin/films')
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur.')
        }
    }

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
    const labelClass = "block text-sm font-medium text-gray-700 mb-1"

    return (
        <AdminLayout>
            <div className="flex items-center gap-4 mb-6">
                <Link to="/admin/films" className="text-gray-500 hover:text-gray-700">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-title)' }}>
                    Modifier le film
                </h1>
            </div>
            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className={labelClass}>Titre *</label>
                        <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Catégorie</label>
                        <select name="id_category" value={form.id_category} onChange={handleChange} className={inputClass}>
                            <option value="">-- Aucune --</option>
                            {categories.map(cat => (
                                <option key={cat.id_category} value={cat.id_category}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Statut *</label>
                        <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                            <option value="coming_soon">À venir</option>
                            <option value="showing">À l'affiche</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Durée (min)</label>
                        <input name="duration_min" type="number" value={form.duration_min} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Date de sortie</label>
                        <input name="release_date" type="date" value={form.release_date} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="col-span-2">
                        <label className={labelClass}>Acteurs</label>
                        <input name="actors" value={form.actors} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="col-span-2">
                        <label className={labelClass}>Synopsis</label>
                        <textarea name="synopsis" value={form.synopsis} onChange={handleChange} rows={4} className={inputClass} />
                    </div>
                    <div className="col-span-2">
                        <label className={labelClass}>Affiche</label>
                        {currentPoster && (
                            <img
                                src={`http://127.0.0.1:8000/storage/${currentPoster}`}
                                alt="Affiche actuelle"
                                className="w-16 h-24 object-cover rounded mb-2"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPosterFile(e.target.files[0])}
                            className={inputClass}
                        />
                        <p className="text-xs text-gray-400 mt-1">Laisser vide pour conserver l'affiche actuelle.</p>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button type="submit" className="px-6 py-2 text-white text-sm font-medium rounded" style={{ background: 'var(--color-accent)' }}>
                        Enregistrer
                    </button>
                    <Link to="/admin/films" className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded">
                        Annuler
                    </Link>
                </div>
            </form>
        </AdminLayout>
    )
}

export default FilmEdit