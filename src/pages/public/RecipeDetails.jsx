import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  FiClock, FiUsers, FiHeart, FiFlag, FiStar, FiArrowLeft,
  FiCheckCircle, FiShoppingCart, FiLock, FiMessageSquare,
} from 'react-icons/fi'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import api from '../../utils/api'
import { useAuth } from '../../providers/AuthProvider'
import Loader from '../../components/Loader'

const ReportModal = ({ open, onClose, onSubmit, loading }) => {
  const [reason, setReason] = useState('Spam')
  const [details, setDetails] = useState('')

  if (!open) return null
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-3">Report this recipe</h3>
        <label className="form-control mb-3">
          <span className="label-text mb-1">Reason</span>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="select select-bordered"
          >
            <option>Spam</option>
            <option>Offensive Content</option>
            <option>Copyright Issue</option>
            <option>Misleading Information</option>
            <option>Other</option>
          </select>
        </label>
        <label className="form-control mb-4">
          <span className="label-text mb-1">Details</span>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            className="textarea textarea-bordered"
            placeholder="Tell us what's wrong..."
          />
        </label>
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            onClick={() => onSubmit({ reason, details })}
            className="btn btn-error"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  )
}

const RecipeDetails = () => {
  const { id } = useParams()
  const { user, dbUser } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [showReport, setShowReport] = useState(false)

  const { data: recipe = {}, isLoading } = useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => (await api.get(`/recipes/${id}`)).data,
    enabled: !!id,
  })

  
  const likeMutation = useMutation({
    mutationFn: () => api.post(`/recipes/${id}/like`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipe', id] })
      toast.success('Recipe liked!')
    },
    onError: () => toast.error('Failed to like'),
  })

  
  const favoriteMutation = useMutation({
    mutationFn: () => api.post(`/favorites/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipe', id] })
      qc.invalidateQueries({ queryKey: ['favorites'] })
      toast.success('Added to favorites')
    },
    onError: () => toast.error('Failed to add favorite'),
  })

  
  const [rating, setRating] = useState(0)
  const ratingMutation = useMutation({
    mutationFn: (r) => api.post(`/recipes/${id}/rate`, { rating: r }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipe', id] })
      toast.success('Rating submitted')
    },
  })

  
  const purchaseMutation = useMutation({
    mutationFn: () => api.post('/payments/checkout', { recipeId: id }),
    onSuccess: (res) => {
      window.location.href = res.data.url
    },
    onError: () => toast.error('Payment failed to initialize'),
  })

  
  const reportMutation = useMutation({
    mutationFn: (payload) =>
      api.post(`/reports`, { ...payload, recipeId: id }),
    onSuccess: () => {
      setShowReport(false)
      Swal.fire({
        icon: 'success',
        title: 'Report Submitted',
        text: 'Thanks for helping keep RecipeHub clean.',
        confirmButtonColor: '#E63946',
      })
    },
    onError: () => toast.error('Failed to submit report'),
  })

  if (isLoading) return <Loader />
  if (!recipe || !recipe.recipeName) {
    return (
      <div className="container-app py-32 text-center">
        <h2 className="text-2xl font-bold">Recipe not found</h2>
        <Link to="/browse-recipes" className="btn btn-primary mt-4">
          Back to Browse
        </Link>
      </div>
    )
  }

  const isLocked =
    recipe.isPremium && !dbUser?.isPremium && !recipe.isPurchased

  const hasPurchased =
    dbUser?.isPremium ||
    recipe.isPurchased ||
    dbUser?.email === recipe.authorEmail

  return (
    <div className="container-app py-24">
      <Link
        to="/browse-recipes"
        className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-primary mb-6"
      >
        <FiArrowLeft /> Back to recipes
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-100 rounded-3xl shadow-lg overflow-hidden"
          >
            <div className="relative h-72 md:h-96">
              <img
                src={recipe.recipeImage}
                alt={recipe.recipeName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="badge badge-primary text-white capitalize">
                  {recipe.category}
                </span>
                {recipe.isPremium && (
                  <span className="badge badge-warning text-white">⭐ Premium</span>
                )}
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                {recipe.recipeName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/70 mb-6">
                <span className="flex items-center gap-1">
                  <FiClock /> {recipe.preparationTime} min
                </span>
                <span className="flex items-center gap-1">
                  <FiUsers /> {recipe.servings || 2} servings
                </span>
                <span className="capitalize"> {recipe.cuisineType}</span>
                <span className="capitalize badge badge-outline">
                  {recipe.difficultyLevel || recipe.difficulty}
                </span>
              </div>

              {}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => likeMutation.mutate()}
                  className="btn btn-sm btn-outline gap-1"
                >
                  <FiHeart /> {recipe.likesCount || 0}
                </button>
                <button
                  onClick={() => favoriteMutation.mutate()}
                  className="btn btn-sm btn-outline gap-1"
                >
                  <FiCheckCircle /> Favorite
                </button>
                <button
                  onClick={() => setShowReport(true)}
                  className="btn btn-sm btn-outline btn-error gap-1"
                >
                  <FiFlag /> Report
                </button>
                {recipe.price > 0 && !hasPurchased && (
                  <button
                    onClick={() => purchaseMutation.mutate()}
                    className="btn btn-sm btn-primary gap-1"
                    disabled={purchaseMutation.isLoading}
                  >
                    <FiShoppingCart /> Buy for ${recipe.price}
                  </button>
                )}
              </div>

              {}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-base-content/60">Rate:</span>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setRating(s)
                      ratingMutation.mutate(s)
                    }}
                    className={`text-2xl transition-colors ${
                      s <= (rating || recipe.userRating || 0)
                        ? 'text-warning'
                        : 'text-base-300'
                    }`}
                  >
                    <FiStar fill="currentColor" />
                  </button>
                ))}
                {recipe.averageRating > 0 && (
                  <span className="text-sm text-base-content/60 ml-2">
                    ({recipe.averageRating.toFixed(1)} avg, {recipe.ratingsCount || 0})
                  </span>
                )}
              </div>

              {}
              <section className="mb-6">
                <h2 className="text-xl font-display font-bold mb-3">Ingredients</h2>
                {isLocked ? (
                  <div className="bg-base-200 p-6 rounded-2xl text-center">
                    <FiLock className="text-4xl mx-auto mb-2 text-primary" />
                    <p className="font-semibold">Premium content locked</p>
                    <p className="text-sm text-base-content/60 mb-3">
                      Become a premium member or buy this recipe to view.
                    </p>
                    <Link to="/dashboard/profile" className="btn btn-primary btn-sm">
                      Go Premium
                    </Link>
                  </div>
                ) : (
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {(recipe.ingredients || []).map((ing, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-lg text-sm"
                      >
                        <span className="text-primary">•</span>
                        {typeof ing === 'string' ? ing : `${ing.quantity || ''} ${ing.item}`}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {}
              <section>
                <h2 className="text-xl font-display font-bold mb-3">Instructions</h2>
                {isLocked ? (
                  <p className="text-base-content/60 italic">
                    🔒 Subscribe to view step-by-step instructions.
                  </p>
                ) : (
                  <ol className="space-y-3">
                    {(recipe.instructions || []).map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </span>
                        <p className="pt-1 text-base-content/80">{step}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </div>
          </motion.div>
        </div>

        {}
        <aside>
          <div className="bg-base-100 rounded-2xl shadow-md p-6 sticky top-24">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-base-300">
              <img
                src={recipe.authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipe.authorName || 'Chef')}`}
                alt={recipe.authorName}
                className="w-12 h-12 rounded-full ring-2 ring-primary"
              />
              <div>
                <p className="font-bold">{recipe.authorName || 'Unknown'}</p>
                <p className="text-xs text-base-content/60">Recipe Author</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/60">Category</span>
                <span className="font-semibold capitalize">{recipe.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Cuisine</span>
                <span className="font-semibold capitalize">{recipe.cuisineType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Difficulty</span>
                <span className="font-semibold capitalize">{recipe.difficultyLevel || recipe.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Prep Time</span>
                <span className="font-semibold">{recipe.preparationTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Likes</span>
                <span className="font-semibold">{recipe.likesCount || 0}</span>
              </div>
            </div>

            {!user && (
              <Link
                to="/login"
                className="btn btn-primary btn-block mt-6"
              >
                Login to interact
              </Link>
            )}
          </div>
        </aside>
      </div>

      <ReportModal
        open={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={(p) => reportMutation.mutate(p)}
        loading={reportMutation.isLoading}
      />
    </div>
  )
}

export default RecipeDetails
