import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import AdminLayout from '../../../components/AdminLayout'
import api from '../../../api/axios'

function FilmShow() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [film, setFilm] = useState(null)

    useEffect(() => {
        const load = async () => {
            const res = await api.get(`/films/${id}`)
            setFilm(res.data)
        }
        load()
    }, [id])

    const handleDelete = async () => {
        if (!confirm('Supprimer ce film ?')) return
        await api.delete(`/films/${id}`)
        navigate('/admin/films')
    }

    if (!film) return <AdminLayout><p style={{ color: 'white' }}>Chargement...</p></AdminLayout>

    return (
        <AdminLayout>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link to="/admin/films" style={{ color: '#9aafd4', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 style={{ fontFamily: '"Archivo Black", sans-serif', color: 'white', fontSize: '1.75rem' }}>
                    {film.title}
                </h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', background: '#1a2238', borderRadius: '12px', padding: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Affiche */}
                <div>
                    {film.poster ? (
                        <img
                            src={`http://127.0.0.1:8000/storage/${film.poster}`}
                            alt={film.title}
                            style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{ width: '100%', aspectRatio: '2/3', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aafd4' }}>
                            Aucune affiche
                        </div>
                    )}
                </div>

                {/* Infos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <span style={{ color: '#9aafd4', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Catégorie</span>
                        <p style={{ color: 'white', marginTop: '0.25rem' }}>{film.category?.name || '—'}</p>
                    </div>
                    <div>
                        <span style={{ color: '#9aafd4', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Durée</span>
                        <p style={{ color: 'white', marginTop: '0.25rem' }}>{film.duration_min ? `${film.duration_min} min` : '—'}</p>
                    </div>
                    <div>
                        <span style={{ color: '#9aafd4', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Statut</span>
                        <p style={{ marginTop: '0.25rem' }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '0.3rem 0.8rem', borderRadius: '99px', fontSize: '0.8rem',
                                background: film.status === 'showing' ? 'rgba(52,211,153,0.1)' : 'rgba(251,146,60,0.1)',
                                color: film.status === 'showing' ? '#34d399' : '#fb923c',
                                border: film.status === 'showing' ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(251,146,60,0.2)',
                            }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: film.status === 'showing' ? '#34d399' : '#fb923c' }} />
                                {film.status === 'showing' ? "À l'affiche" : 'À venir'}
                            </span>
                        </p>
                    </div>
                    {film.release_date && (
                        <div>
                            <span style={{ color: '#9aafd4', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date de sortie</span>
                            <p style={{ color: 'white', marginTop: '0.25rem' }}>{new Date(film.release_date).toLocaleDateString('fr-FR')}</p>
                        </div>
                    )}
                    {film.actors && (
                        <div>
                            <span style={{ color: '#9aafd4', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Acteurs</span>
                            <p style={{ color: 'white', marginTop: '0.25rem' }}>{film.actors}</p>
                        </div>
                    )}
                    {film.synopsis && (
                        <div>
                            <span style={{ color: '#9aafd4', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Synopsis</span>
                            <p style={{ color: '#DDE6F0', marginTop: '0.25rem', lineHeight: '1.7' }}>{film.synopsis}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '1rem' }}>
                        <Link to={`/admin/films/${id}/edit`} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.65rem 1.25rem', borderRadius: '8px',
                            background: '#17286D', color: 'white', textDecoration: 'none', fontSize: '0.875rem'
                        }}>
                            <Pencil size={15} /> Modifier
                        </Link>
                        <button onClick={handleDelete} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.65rem 1.25rem', borderRadius: '8px',
                            background: 'rgba(248,113,113,0.1)', color: '#f87171',
                            border: '1px solid rgba(248,113,113,0.2)', cursor: 'pointer', fontSize: '0.875rem'
                        }}>
                            <Trash2 size={15} /> Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default FilmShow