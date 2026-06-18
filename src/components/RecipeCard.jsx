import { Link } from 'react-router-dom'
import { FiClock, FiUsers, FiHeart, FiStar } from 'react-icons/fi'
import { motion } from 'framer-motion'

const RecipeCard = ({ recipe }) => {
  if (!recipe) return null

  const {
    _id,
    recipeName: name,
    recipeImage: image,
    category,
    cuisineType: cuisine,
    preparationTime: prepTime,
    likesCount: likes = 0,
    averageRating = 0,
    price = 0,
    isPremium = false,
    authorName,
    authorPhoto,
  } = recipe

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="card-hover bg-base-100 rounded-2xl overflow-hidden shadow-md group"
    >
      <Link to={`/recipe/${_id}`} className="block">
        <div className="relative h-48 overflow-hidden bg-base-300">
          <img
            src={image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600'}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600'
            }}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="badge badge-primary text-white text-xs font-semibold capitalize">
              {category}
            </span>
            {isPremium && (
              <span className="badge badge-warning text-white text-xs font-semibold">
                ⭐ Premium
              </span>
            )}
          </div>
          {price > 0 && !isPremium && (
            <div className="absolute top-3 right-3 bg-base-100/95 px-3 py-1 rounded-full text-sm font-bold text-primary">
              ${price}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-display font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          <div className="flex items-center gap-3 text-xs text-base-content/60 mb-3">
            <span className="flex items-center gap-1">
              <FiClock /> {prepTime}m
            </span>
            <span className="capitalize">🍽️ {cuisine}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-base-300">
            <div className="flex items-center gap-2">
              <img
                src={authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName || 'Chef')}&size=64`}
                alt={authorName}
                className="w-7 h-7 rounded-full ring-1 ring-base-300"
              />
              <span className="text-xs text-base-content/70 truncate max-w-[100px]">
                {authorName || 'Anonymous'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-base-content/60">
              <span className="flex items-center gap-1">
                <FiHeart className="text-primary" /> {likes}
              </span>
              {averageRating > 0 && (
                <span className="flex items-center gap-1">
                  <FiStar className="text-warning" /> {averageRating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default RecipeCard
