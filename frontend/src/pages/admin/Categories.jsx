import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api/axios'

function Categories() {
    const [categories, setCategories] = useState([])
    const [name, setName] = useState('')
    const [editId, setEditId] = useState(null)
    const [error, setError] = useState('')

    const fetchCategories = async () => {
        const res = await api.get('/categories')
        setCategories(res.data)
    }

    useEffect(() => {
        const load = async () => {
            const res = await api.get('/categories')
            setCategories(res.data)
        }
        load()
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            if (editId) {
                await api.put(`/categories/${editId}`, { name })
            } else {
                await api.post('/categories', { name })
            }
            setName('')
            setEditId(null)
            fetchCategories()
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur.')
        }
    }

    const handleEdit = (cat) => {
        setEditId(cat.id_category)
        setName(cat.name)
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette catégorie ?')) return
        await api.delete(`/categories/${id}`)
        fetchCategories()
    }

    return (
        <AdminLayout>
            <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-title)' }}>Catégories</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom de la catégorie"
                    required
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
                />
                <button type="submit" style={{ padding: '0.5rem 1rem', background: '#17286D', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {editId ? 'Modifier' : 'Ajouter'}
                </button>
                {editId && (
                    <button type="button" onClick={() => { setEditId(null); setName('') }} style={{ padding: '0.5rem 1rem', background: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Annuler
                    </button>
                )}
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nom</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(cat => (
                        <tr key={cat.id_category} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '0.75rem' }}>{cat.name}</td>
                            <td style={{ padding: '0.75rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button onClick={() => handleEdit(cat)} style={{ padding: '0.3rem 0.8rem', background: '#0A0F2C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Modifier
                                </button>
                                <button onClick={() => handleDelete(cat.id_category)} style={{ padding: '0.3rem 0.8rem', background: '#c0392b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
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

export default Categories