import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import {
  FiHome, FiBook, FiPlusCircle, FiHeart, FiShoppingBag, FiUser,
  FiUsers, FiFileText, FiFlag, FiCreditCard, FiLogOut, FiChevronLeft
} from 'react-icons/fi'
import { toast } from 'sonner'

const DashboardLayout = () => {
  const { dbUser, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = dbUser?.role === 'admin'

  const userLinks = [
    { to: '/dashboard', label: 'Overview', icon: <FiHome />, end: true },
    { to: '/dashboard/my-recipes', label: 'My Recipes', icon: <FiBook /> },
    { to: '/dashboard/add-recipe', label: 'Add Recipe', icon: <FiPlusCircle /> },
    { to: '/dashboard/favorites', label: 'Favorites', icon: <FiHeart /> },
    { to: '/dashboard/purchased', label: 'Purchased', icon: <FiShoppingBag /> },
    { to: '/dashboard/profile', label: 'Profile', icon: <FiUser /> },
  ]

  const adminLinks = [
    { to: '/dashboard/overview', label: 'Admin Overview', icon: <FiHome /> },
    { to: '/dashboard/manage-users', label: 'Manage Users', icon: <FiUsers /> },
    { to: '/dashboard/manage-recipes', label: 'Manage Recipes', icon: <FiFileText /> },
    { to: '/dashboard/reports', label: 'Reports', icon: <FiFlag /> },
    { to: '/dashboard/transactions', label: 'Transactions', icon: <FiCreditCard /> },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="container-app py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {}
          <aside className="lg:col-span-1">
            <div className="bg-base-100 rounded-2xl shadow-md p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-base-300">
                <img
                  src={dbUser?.image || `https://ui-avatars.com/api/?name=${dbUser?.name}&background=E63946&color=fff`}
                  alt={dbUser?.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary"
                />
                <div>
                  <h3 className="font-bold text-sm truncate">{dbUser?.name}</h3>
                  <p className="text-xs text-base-content/60 capitalize">
                    {isAdmin ? '👑 Admin' : dbUser?.isPremium ? '⭐ Premium' : 'User'}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {userLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-md'
                          : 'hover:bg-base-200 text-base-content/80'
                      }`
                    }
                  >
                    <span className="text-lg">{link.icon}</span>
                    {link.label}
                  </NavLink>
                ))}

                {isAdmin && (
                  <>
                    <div className="pt-4 mt-4 border-t border-base-300">
                      <p className="text-xs uppercase font-bold text-base-content/50 px-4 mb-2">
                        Admin
                      </p>
                      {adminLinks.map((link) => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              isActive
                                ? 'bg-accent text-white shadow-md'
                                : 'hover:bg-base-200 text-base-content/80'
                            }`
                          }
                        >
                          <span className="text-lg">{link.icon}</span>
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </>
                )}
              </nav>

              <div className="mt-6 pt-6 border-t border-base-300 space-y-2">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-sm text-base-content/60 hover:text-primary"
                >
                  <FiChevronLeft /> Back to Home
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-error hover:underline w-full"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          </aside>

          {}
          <section className="lg:col-span-3">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
