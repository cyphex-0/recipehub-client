import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  FiBook, FiHeart, FiShoppingBag, FiPlusCircle, FiTrendingUp, FiEye,
} from 'react-icons/fi'
import { motion } from 'framer-motion'
import api from '../../utils/api'
import { useAuth } from '../../providers/AuthProvider'
import Loader from '../../components/Loader'

const StatCard = ({ icon, label, value, color, to }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <Link
      to={to || '#'}
      className="card-hover bg-base-100 rounded-2xl p-5 shadow-md flex items-center gap-4"
    >
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-base-content/60">{label}</p>
      </div>
    </Link>
  </motion.div>
)

const Overview = () => {
  const { dbUser } = useAuth()
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: async () => (await api.get('/users/me/stats')).data,
  })

  const { data: myRecipesData } = useQuery({
    queryKey: ['my-recipes', { limit: 3 }],
    queryFn: async () => (await api.get('/recipes/me?limit=3')).data,
  })
  const myRecipes = myRecipesData?.recipes || []

  if (isLoading) return <Loader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">
          Welcome back, {dbUser?.name?.split(' ')[0] || 'Chef'} 👋
        </h1>
        <p className="text-base-content/60 text-sm mt-1">
          Here's what's cooking in your kitchen.
        </p>
      </div>

      {}
      {!dbUser?.isPremium && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-warning/20 to-primary/20 border border-warning/40 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            <div>
              <p className="font-bold">Upgrade to Premium</p>
              <p className="text-xs text-base-content/60">
                Add unlimited recipes & unlock all premium recipes.
              </p>
            </div>
          </div>
          <Link to="/dashboard/profile" className="btn btn-warning btn-sm">
            Go Premium
          </Link>
        </motion.div>
      )}

      {}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<FiBook />}
          label="My Recipes"
          value={stats.recipeCount ?? 0}
          color="bg-gradient-to-br from-primary to-rose-600"
          to="/dashboard/my-recipes"
        />
        <StatCard
          icon={<FiHeart />}
          label="Favorites"
          value={stats.favoritesCount ?? 0}
          color="bg-gradient-to-br from-pink-500 to-rose-500"
          to="/dashboard/favorites"
        />
        <StatCard
          icon={<FiShoppingBag />}
          label="Purchased"
          value={stats.purchasedCount ?? 0}
          color="bg-gradient-to-br from-accent to-emerald-600"
          to="/dashboard/purchased"
        />
        <StatCard
          icon={<FiTrendingUp />}
          label="Total Likes"
          value={stats.totalLikes ?? 0}
          color="bg-gradient-to-br from-secondary to-orange-500"
        />
      </div>

      {}
      <div className="bg-base-100 rounded-2xl p-6 shadow-md">
        <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link to="/dashboard/add-recipe" className="btn btn-primary gap-2">
            <FiPlusCircle /> Add Recipe
          </Link>
          <Link to="/browse-recipes" className="btn btn-outline gap-2">
            <FiEye /> Browse Recipes
          </Link>
          <Link to="/dashboard/profile" className="btn btn-outline gap-2">
            Edit Profile
          </Link>
        </div>
      </div>

      {}
      <div className="bg-base-100 rounded-2xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Recent Recipes</h2>
          <Link
            to="/dashboard/my-recipes"
            className="text-sm text-primary font-semibold"
          >
            See all
          </Link>
        </div>
        {myRecipes.length === 0 ? (
          <p className="text-sm text-base-content/60 py-6 text-center">
            You haven't added any recipes yet.{' '}
            <Link
              to="/dashboard/add-recipe"
              className="text-primary font-semibold"
            >
              Add one now
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-3">
            {myRecipes.map((r) => (
              <li
                key={r._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-base-200 hover:bg-base-300 transition"
              >
                <img
                  src={r.recipeImage || 'https://placehold.co/100'}
                  alt={r.recipeName}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{r.recipeName}</p>
                  <p className="text-xs text-base-content/60 capitalize">
                    {r.category} • {r.likesCount || 0} likes
                  </p>
                </div>
                <Link
                  to={`/recipe/${r._id}`}
                  className="btn btn-sm btn-ghost"
                >
                  <FiEye />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Overview
