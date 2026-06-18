import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiShoppingBag, FiStar } from 'react-icons/fi'
import { motion } from 'framer-motion'
import api from '../../utils/api'
import Loader from '../../components/Loader'

const MyPurchased = () => {
  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['my-purchased'],
    queryFn: async () => (await api.get('/users/me/purchases')).data,
  })

  if (isLoading) return <Loader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <FiShoppingBag className="text-primary" /> My Purchased Recipes
        </h1>
        <p className="text-sm text-base-content/60 mt-1">
          Premium recipes you have unlocked.
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="bg-base-100 rounded-2xl shadow-md p-12 text-center">
          <FiShoppingBag className="text-6xl text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
          <p className="text-base-content/60 mb-6">
            Buy premium recipes to access them anytime.
          </p>
          <Link to="/browse-recipes" className="btn btn-primary">
            Browse Premium Recipes
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((r, i) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-base-100 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Link to={`/recipe/${r._id}`} className="block">
                <div className="aspect-video bg-base-200 overflow-hidden relative">
                  <img
                    src={r.recipeImage}
                    alt={r.recipeName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 badge badge-success gap-1">
                    <FiStar /> Owned
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/recipe/${r._id}`}>
                  <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary">
                    {r.recipeName}
                  </h3>
                </Link>
                <p className="text-xs text-base-content/60 capitalize mt-1">
                  {r.category} · {r.cuisineType}
                </p>
                <p className="text-sm text-base-content/70 mt-2">
                  Paid: <span className="font-semibold">${r.price}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyPurchased
