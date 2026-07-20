import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Barre de pagination generique pour les listes admin.
 * `meta` est l'objet meta renvoye par Laravel pour une ressource paginee
 * (current_page, last_page, total, from, to).
 */
export default function AdminPagination({ meta, onPageChange }) {
    if (!meta || meta.last_page <= 1) return null

    const { current_page, last_page, total, from, to } = meta

    const btnStyle = (disabled) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        border: '1px solid var(--admin-border)',
        backgroundColor: 'var(--admin-surface2)',
        color: disabled ? 'var(--admin-muted)' : 'var(--admin-text)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
    })

    return (
        <div
            className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3.5"
            style={{ borderColor: 'var(--admin-border)' }}
        >
            <p className="text-xs" style={{ color: 'var(--admin-muted)' }}>
                {from}–{to} sur {total}
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={current_page <= 1}
                    style={btnStyle(current_page <= 1)}
                    aria-label="Page précédente"
                >
                    <ChevronLeft size={14} />
                    Précédent
                </button>
                <span className="text-xs" style={{ color: 'var(--admin-muted)' }}>
                    Page {current_page} / {last_page}
                </span>
                <button
                    type="button"
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={current_page >= last_page}
                    style={btnStyle(current_page >= last_page)}
                    aria-label="Page suivante"
                >
                    Suivant
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    )
}