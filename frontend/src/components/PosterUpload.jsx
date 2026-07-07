import { ImageIcon } from 'lucide-react'

function PosterUpload({ currentPoster, onChange, hint }) {
    return (
        <div className="flex items-center gap-4">
            {currentPoster ? (
                <img
                    src={currentPoster}
                    alt="Affiche actuelle"
                    className="h-24 w-16 shrink-0 rounded-md object-cover"
                    style={{ border: '1px solid var(--admin-border)' }}
                />
            ) : (
                <div
                    className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: 'var(--admin-surface2)', border: '1px solid var(--admin-border)' }}
                >
                    <ImageIcon size={18} style={{ color: 'var(--admin-muted)' }} />
                </div>
            )}

            <div className="flex flex-1 flex-col gap-1.5">
                <input
                    type="url"
                    value={currentPoster || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://exemple.com/affiche.jpg"
                    className="admin-input w-full rounded-xl border px-4 py-3 text-[15px] outline-none"
                    style={{ backgroundColor: 'var(--admin-surface2)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                />
                <span className="text-xs" style={{ color: 'var(--admin-muted)' }}>
                    {hint || "URL de l'image de l'affiche."}
                </span>
            </div>
        </div>
    )
}

export default PosterUpload
