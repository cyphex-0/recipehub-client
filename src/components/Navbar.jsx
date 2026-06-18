import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiUser, FiLogOut, FiSun, FiMoon } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../providers/AuthProvider'
import { useTheme } from '../hooks/useTheme'
import { toast } from 'sonner'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/browse-recipes', label: 'Browse' },
]

const Navbar = () => {
  const { user, dbUser, logout, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out')
      navigate('/')
    } catch {
      toast.error('Logout failed')
    }
    setOpen(false)
  }

  const avatarUrl =
    dbUser?.image ||
    user?.image ||
    `https://ui-avatars.com/api/?name=${dbUser?.name || user?.email}&background=E63946&color=fff`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-base-100/95 backdrop-blur-md shadow-md'
          : 'bg-base-100/70 backdrop-blur-sm'
      }`}
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <span className="text-white text-xl">🍳</span>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold gradient-text">RecipeHub</h1>
              <p className="text-[10px] text-base-content/60 -mt-1">Share & Cook</p>
            </div>
          </Link>

          {}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? 'text-primary' : 'text-base-content/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative inline-block">
                    {link.label}
                    {isActive && (
                      <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary rounded-full" />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full hover:bg-base-200 transition-colors"
            >
              {theme === 'recipelight' ? <FiMoon /> : <FiSun />}
            </button>

            {loading ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-base-300 animate-pulse"></div>
                <div className="w-16 h-8 rounded-lg bg-base-300 animate-pulse"></div>
                <div className="w-20 h-8 rounded-lg bg-base-300 animate-pulse"></div>
              </div>
            ) : user ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={avatarUrl} alt="avatar" />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-56 border border-base-300"
                >
                  <li className="menu-title">
                    <span className="truncate">{dbUser?.name || user.displayName || user.email}</span>
                  </li>
                  <li>
                    <Link to="/dashboard">📊 Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/dashboard/profile">👤 Profile</Link>
                  </li>
                  {dbUser?.role === 'admin' && (
                    <li>
                      <Link to="/dashboard/manage-users">👑 Admin Panel</Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="text-error">
                      <FiLogOut /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg hover:bg-base-200"
              aria-label="Open menu"
            >
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-base-300"
            >
              <ul className="flex flex-col gap-1 py-4">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2.5 rounded-lg ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'hover:bg-base-200'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
                {!loading && !user && (
                  <>
                    <li>
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 rounded-lg hover:bg-base-200"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 rounded-lg bg-primary text-white"
                      >
                        Register
                      </Link>
                    </li>
                  </>
                )}
                {!loading && user && (
                  <>
                    <li>
                      <Link
                        to="/dashboard"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 rounded-lg hover:bg-base-200"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 rounded-lg hover:bg-base-200"
                      >
                        👤 Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 rounded-lg text-error hover:bg-base-200"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Navbar
