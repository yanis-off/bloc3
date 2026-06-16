import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api/axios'

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: '"Archivo Black", sans-serif', color: 'white', fontSize: '1.75rem' }}>Films</h1>
                <Link to="/admin/films/create" style={{ background: '#17286D', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={16} /> Ajouter un film
                </Link>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Affiche</TableHead>
                        <TableHead>Titre</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {films.map(film => (
                        <TableRow key={film.id_film}>
                            <TableCell>
                                {film.poster ? (
                                    <img src={`http://127.0.0.1:8000/storage/${film.poster}`} alt={film.title} style={{ width: '44px', height: '64px', objectFit: 'cover', borderRadius: '6px' }} />
                                ) : (
                                    <div style={{ width: '44px', height: '64px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aafd4', fontSize: '0.65rem' }}>N/A</div>
                                )}
                            </TableCell>
                            <TableCell className="font-medium">{film.title}</TableCell>
                            <TableCell>{film.category?.name || '—'}</TableCell>
                            <TableCell>{film.duration_min ? `${film.duration_min} min` : '—'}</TableCell>
                            <TableCell>{film.status === 'showing' ? "À l'affiche" : 'À venir'}</TableCell>
                            <TableCell className="text-right">
                                <Link to={`/admin/films/${film.id_film}/edit`} style={{ marginRight: '1rem', color: '#ABC0E0', fontSize: '0.85rem' }}>Modifier</Link>
                                <button onClick={() => handleDelete(film.id_film)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>Supprimer</button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </AdminLayout>
    )
}

export default FilmsList