import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Menu, X } from 'lucide-react'

function AdminLayout({ children }) {
    const { logout, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const onClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [])

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const navItems = [
        { to: '/admin', label: 'Tableau de bord', exact: true },
        { to: '/admin/categories', label: 'Catégories' },
        { to: '/admin/films', label: 'Films' },
        { to: '/admin/rooms', label: 'Salles' },
        { to: '/admin/screenings', label: 'Séances' },
        { to: '/admin/bookings', label: 'Réservations' },
    ]

    const isActive = (item) =>
        item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)

    const linkBase = {
        textDecoration: 'none',
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.95rem',
        padding: '0.4rem 0',
        position: 'relative',
        transition: 'color 0.2s',
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0f1729' }}>
            <nav style={{
                background: '#1a2238',
                padding: '0 1.5rem',
                height: '72px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
            }}>
                {/* Logo */}
                <div style={{ lineHeight: 1.1 }}>
                    <div style={{
                        color: 'white',
                        fontFamily: '"Archivo Black", sans-serif',
                        fontSize: '1.4rem',
                        letterSpacing: '-0.05em',
                    }}>BAOBAB</div>
                    <div style={{
                        color: '#9aafd4',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 300,
                        fontSize: '0.78rem',
                        letterSpacing: '0.8em',
                        marginTop: '2px',
                    }}>CINÉMA</div>
                </div>

                {/* Nav links — caché sur mobile */}
                <div className="hidden md:flex" style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    gap: '2.5rem',
                    alignItems: 'center',
                }}>
                    {navItems.map((item) => {
                        const active = isActive(item)
                        return (
                            <Link key={item.to} to={item.to} style={{
                                ...linkBase,
                                color: active ? '#ffffff' : '#8a94a8',
                                fontWeight: active ? 600 : 400,
                            }}>
                                {item.label}
                                {active && (
                                    <span style={{
                                        position: 'absolute',
                                        left: 0, right: 0, bottom: '-4px',
                                        height: '2px',
                                        background: 'oklch(54.6% 0.245 262.881)',
                                        borderRadius: '2px',
                                    }} />
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* Droite : user menu + hamburger */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                    {/* User menu — caché sur mobile */}
                    <div className="hidden md:block" style={{ position: 'relative' }} ref={menuRef}>
                        <button onClick={() => setMenuOpen((v) => !v)} style={{
                            background: 'transparent', border: 'none', color: 'white',
                            fontFamily: '"Inter", sans-serif', fontSize: '0.95rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.4rem 0.6rem',
                        }}>
                            {user?.first_name || 'Utilisateur'}
                            <span style={{ fontSize: '0.7rem', transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                        </button>

                        {menuOpen && (
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                                background: '#2a3654', borderRadius: '8px', minWidth: '200px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.4)', overflow: 'hidden', zIndex: 100,
                            }}>
                                <Link to="/admin/profile" onClick={() => setMenuOpen(false)} style={{
                                    display: 'block', padding: '0.85rem 1.2rem', color: 'white',
                                    textDecoration: 'none', fontFamily: '"Inter", sans-serif', fontSize: '0.95rem',
                                }}>Profil</Link>
                                <button onClick={handleLogout} style={{
                                    display: 'block', width: '100%', textAlign: 'left',
                                    padding: '0.85rem 1.2rem', background: 'transparent', border: 'none',
                                    color: 'white', fontFamily: '"Inter", sans-serif', fontSize: '0.95rem', cursor: 'pointer',
                                }}>Se déconnecter</button>
                            </div>
                        )}
                    </div>

                    {/* Hamburger — visible sur mobile */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileOpen(v => !v)}
                        style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '0.4rem' }}
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Menu mobile */}
            {mobileOpen && (
                <div className="md:hidden" style={{
                    background: '#1a2238', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    padding: '1rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
                }}>
                    {navItems.map(item => (
                        <Link key={item.to} to={item.to}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                color: isActive(item) ? 'white' : '#8a94a8',
                                textDecoration: 'none', padding: '0.6rem 0',
                                fontFamily: '"Inter", sans-serif', fontSize: '0.95rem',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                fontWeight: isActive(item) ? 600 : 400,
                            }}>
                            {item.label}
                        </Link>
                    ))}
                    <button onClick={handleLogout} style={{
                        background: 'transparent', border: 'none', color: '#8a94a8',
                        textAlign: 'left', padding: '0.6rem 0', fontFamily: '"Inter", sans-serif',
                        fontSize: '0.95rem', cursor: 'pointer', marginTop: '0.5rem',
                    }}>Se déconnecter</button>
                </div>
            )}

            <main style={{ padding: '2rem', color: 'white' }}>
                {children}
            </main>
        </div>
    )
}

export default AdminLayout