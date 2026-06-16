import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AdminLayout from '../../../components/AdminLayout'
import api from '../../../api/axios'

function ScreeningEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [films, setFilms] = useState([])
    const [rooms, setRooms] = useState([])
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        id_film: '', id_room: '', date: '', time: '', seats_remaining: ''
    })

    useEffect(() => {
        const load = async () => {
            const [screeningRes, filmsRes, roomsRes] = await Promise.all([
                api.get(`/screenings/${id}`),
                api.get('/films'),
                api.get('/rooms')
            ])
            const s = screeningRes.data
            setForm({
                id_film: s.id_film,
                id_room: s.id_room,
                date: s.date,
                time: s.time,
                seats_remaining: s.seats_remaining
            })
            setFilms(filmsRes.data)
            setRooms(roomsRes.data)
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
            await api.put(`/screenings/${id}`, form)
            navigate('/admin/screenings')
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur.')
        }
    }

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
    const labelClass = "block text-sm font-medium text-gray-700 mb-1"

    return (
        <AdminLayout>
            <div className="flex items-center gap-4 mb-6">
                <Link to="/admin/screenings" className="text-gray-500 hover:text-gray-700">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-title)' }}>
                    Modifier la séance
                </h1>
            </div>
            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className={labelClass}>Film *</label>
                        <select name="id_film" value={form.id_film} onChange={handleChange} required className={inputClass}>
                            <option value="">-- Sélectionner un film --</option>
                            {films.map(f => (
                                <option key={f.id_film} value={f.id_film}>{f.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className={labelClass}>Salle *</label>
                        <select name="id_room" value={form.id_room} onChange={handleChange} required className={inputClass}>
                            <option value="">-- Sélectionner une salle --</option>
                            {rooms.map(r => (
                                <option key={r.id_room} value={r.id_room}>{r.name} ({r.capacity} places)</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Date *</label>
                        <input name="date" type="date" value={form.date} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Heure *</label>
                        <input name="time" type="time" value={form.time} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div className="col-span-2">
                        <label className={labelClass}>Places disponibles *</label>
                        <input name="seats_remaining" type="number" value={form.seats_remaining} onChange={handleChange} required min="0" className={inputClass} />
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button type="submit" className="px-6 py-2 text-white text-sm font-medium rounded" style={{ background: 'var(--color-accent)' }}>
                        Enregistrer
                    </button>
                    <Link to="/admin/screenings" className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded">
                        Annuler
                    </Link>
                </div>
            </form>
        </AdminLayout>
    )
}

export default ScreeningEdit