import { useState, useEffect } from 'react'
import { Check, X, Trash2 } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api/axios'

function BookingsList() {
    const [bookings, setBookings] = useState([])

    useEffect(() => {
        const load = async () => {
            const res = await api.get('/bookings')
            setBookings(res.data)
        }
        load()
    }, [])

    const fetchBookings = async () => {
        const res = await api.get('/bookings')
        setBookings(res.data)
    }

    const handleStatus = async (id, status) => {
        await api.put(`/bookings/${id}`, { status })
        fetchBookings()
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette réservation ?')) return
        await api.delete(`/bookings/${id}`)
        fetchBookings()
    }

    const statusStyle = {
        pending:   'bg-orange-100 text-orange-700',
        confirmed: 'bg-green-100 text-green-700',
        expired:   'bg-gray-100 text-gray-500',
        cancelled: 'bg-red-100 text-red-600',
    }

    const statusLabel = {
        pending:   'En attente',
        confirmed: 'Confirmée',
        expired:   'Expirée',
        cancelled: 'Annulée',
    }

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-title)' }}>Réservations</h1>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Client</th>
                            <th className="px-4 py-3 text-left">Film</th>
                            <th className="px-4 py-3 text-left">Séance</th>
                            <th className="px-4 py-3 text-left">Places</th>
                            <th className="px-4 py-3 text-left">Statut</th>
                            <th className="px-4 py-3 text-left">Expire le</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map(b => (
                            <tr key={b.id_booking} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">
                                    {b.user?.first_name} {b.user?.last_name}
                                    <div className="text-xs text-gray-400">{b.user?.email}</div>
                                </td>
                                <td className="px-4 py-3">{b.screening?.film?.title || '—'}</td>
                                <td className="px-4 py-3 text-gray-500">
                                    {b.screening?.date} à {b.screening?.time}
                                    <div className="text-xs text-gray-400">{b.screening?.room?.name}</div>
                                </td>
                                <td className="px-4 py-3">{b.seats_count}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[b.status]}`}>
                                        {statusLabel[b.status]}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 text-xs">
                                    {b.expires_at ? new Date(b.expires_at).toLocaleString('fr-FR') : '—'}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        {b.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleStatus(b.id_booking, 'confirmed')}
                                                    className="p-1.5 rounded hover:bg-green-50 text-green-600" title="Confirmer">
                                                    <Check size={15} />
                                                </button>
                                                <button onClick={() => handleStatus(b.id_booking, 'cancelled')}
                                                    className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Annuler">
                                                    <X size={15} />
                                                </button>
                                            </>
                                        )}
                                        <button onClick={() => handleDelete(b.id_booking)}
                                            className="p-1.5 rounded hover:bg-red-50 text-red-400" title="Supprimer">
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

export default BookingsList