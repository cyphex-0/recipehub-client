import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FiHeart, FiTrash2 } from 'react-icons/fi'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import Loader from '../../components/Loader'

const MyFavorites = () => {
  const qc = useQueryClient()

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['my-favorites'],
    queryFn: async () => (await api.get('/favorites')).data,
  })

  const unfavorite = useMutation({
    mutationFn: (recipeId) => api.delete(`/favorites/${recipeId}`),
    onMutate: async (recipeId) => {
      await qc.cancelQueries({ queryKey: ['my-favorites'] })
      const prev = qc.getQueryData(['my-favorites'])
      qc.setQueryData(['my-favorites'], (old = []) =>
        old.filter((r) => r._id !== recipeId)
      )
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      qc.setQueryData(['my-favorites'], ctx.prev)
      toast.error('Could not remove favorite')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard-overview'] })
      toast.success('Removed from favorites')
    },
  })

  if (isLoading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <FiHeart className="text-error" /> My Favorites
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            {recipes.length} saved {recipes.length === 1 ? 'recipe' : 'recipes'}
          </p>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="bg-base-100 rounded-2xl shadow-md p-12 text-center">
          <FiHeart className="text-6xl text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-base-content/60 mb-6">
            Save recipes you love for quick access.
          </p>
          <Link to="/browse-recipes" className="btn btn-primary">
            Browse Recipes
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
                <div className="aspect-video bg-base-200 overflow-hidden">
                  <img
                    src={r.recipeImage}
                    alt={r.recipeName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
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
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-semibold text-primary">
                    {r.isPremium ? `$${r.price}` : 'Free'}
                  </span>
                  <button
                    onClick={() => unfavorite.mutate(r._id)}
                    className="btn btn-sm btn-ghost text-error gap-1"
                    disabled={unfavorite.isPending}
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyFavorites
