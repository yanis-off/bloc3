import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api/axios'

function Rooms() {
    const [rooms, setRooms] = useState([])
    const [name, setName] = useState('')
    const [capacity, setCapacity] = useState('')
    const [editId, setEditId] = useState(null)
    const [error, setError] = useState('')


    const fetchRooms = async () => {
        const res = await api.get('/rooms')
        setRooms(res.data)
    }

    useEffect(() => {
        const load = async () => {
            const res = await api.get('/rooms')
            setRooms(res.data)
        }
        load()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            if (editId) {
                await api.put(`/rooms/${editId}`, { name, capacity })
            } else {
                await api.post('/rooms', { name, capacity })
            }
            setName('')
            setCapacity('')
            setEditId(null)
            fetchRooms()
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur.')
        }
    }

    const handleEdit = (room) => {
        setEditId(room.id_room)
        setName(room.name)
        setCapacity(room.capacity)
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette salle ?')) return
        try {
            await api.delete(`/rooms/${id}`)
            fetchRooms()
        } catch {
            setError('Impossible de supprimer une salle avec des séances.')
        }
    }

    return (
        <AdminLayout>
            <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-title)' }}>Salles</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom de la salle"
                    required
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
                />
                <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Capacité"
                    required
                    min="1"
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }}
                />
                <button type="submit" style={{ padding: '0.5rem 1rem', background: '#17286D', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {editId ? 'Modifier' : 'Ajouter'}
                </button>
                {editId && (
                    <button type="button" onClick={() => { setEditId(null); setName(''); setCapacity('') }} style={{ padding: '0.5rem 1rem', background: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Annuler
                    </button>
                )}
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nom</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Capacité</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map(room => (
                        <tr key={room.id_room} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '0.75rem' }}>{room.name}</td>
                            <td style={{ padding: '0.75rem' }}>{room.capacity} places</td>
                            <td style={{ padding: '0.75rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button onClick={() => handleEdit(room)} style={{ padding: '0.3rem 0.8rem', background: '#0A0F2C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Modifier
                                </button>
                                <button onClick={() => handleDelete(room.id_room)} style={{ padding: '0.3rem 0.8rem', background: '#c0392b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AdminLayout>
    )
}

export default Rooms