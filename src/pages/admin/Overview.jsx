import { useQuery } from '@tanstack/react-query'
import { FiUsers, FiBookOpen, FiFlag, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import { FaCrown } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import Loader from '../../components/Loader'

const StatCard = ({ icon, label, value, color, trend, to }) => {
  const Card = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-base-100 rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl ${color}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className="text-xs text-success font-semibold flex items-center gap-1">
            <FiTrendingUp /> {trend}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold mt-4">{value}</p>
      <p className="text-sm text-base-content/60 mt-1">{label}</p>
    </motion.div>
  )
  return to ? <Link to={to}>{Card}</Link> : Card
}

const Overview = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/admin/stats')).data,
  })

  if (isLoading) return <Loader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Admin Overview</h1>
        <p className="text-sm text-base-content/60 mt-1">
          Platform-wide analytics at a glance.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FiUsers />}
          label="Total Users"
          value={data?.totalUsers ?? 0}
          color="bg-blue-500"
          trend={12}
          to="/dashboard/manage-users"
        />
        <StatCard
          icon={<FiBookOpen />}
          label="Total Recipes"
          value={data?.totalRecipes ?? 0}
          color="bg-primary"
          trend={8}
          to="/dashboard/manage-recipes"
        />
        <StatCard
          icon={<FaCrown />}
          label="Premium Users"
          value={data?.premiumUsers ?? 0}
          color="bg-yellow-500"
          to="/dashboard/manage-users"
        />
        <StatCard
          icon={<FiDollarSign />}
          label="Total Revenue"
          value={`$${data?.totalRevenue?.toFixed(2) ?? '0.00'}`}
          color="bg-emerald-500"
          trend={15}
          to="/dashboard/transactions"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-base-100 rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiFlag className="text-error" /> Pending Reports
          </h2>
          <div className="text-center py-6">
            <p className="text-5xl font-bold text-error">
              {data?.pendingReports ?? 0}
            </p>
            <p className="text-sm text-base-content/60 mt-2">
              recipes awaiting moderation
            </p>
            <Link to="/dashboard/reports" className="btn btn-sm btn-primary mt-4">
              Review Reports
            </Link>
          </div>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {(data?.recentActivity || []).slice(0, 6).map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="flex-1">{a.text}</p>
                <span className="text-xs text-base-content/50">
                  {new Date(a.at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {(!data?.recentActivity || data.recentActivity.length === 0) && (
              <p className="text-sm text-base-content/50 text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="bg-base-100 rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Top Recipes</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Recipe</th>
                <th>Category</th>
                <th>Likes</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {(data?.topRecipes || []).map((r) => (
                <tr key={r._id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded">
                          <img src={r.recipeImage} alt={r.recipeName} />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold line-clamp-1">{r.recipeName}</p>
                        <p className="text-xs text-base-content/50">
                          by {r.authorName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="capitalize">{r.category}</td>
                  <td>{r.likesCount}</td>
                  <td>
                    <span className="text-warning">★</span>{' '}
                    {r.averageRating?.toFixed(1) ?? '—'}
                  </td>
                </tr>
              ))}
              {(!data?.topRecipes || data.topRecipes.length === 0) && (
                <tr>
                  <td colSpan="4" className="text-center text-base-content/50 py-6">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Overview
