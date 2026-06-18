import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center container-app pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
          className="text-9xl mb-4"
        >
          🍳
        </motion.div>
        <h1 className="text-7xl font-display font-bold gradient-text mb-3">404</h1>
        <h2 className="text-2xl font-bold mb-2">Recipe Not Found</h2>
        <p className="text-base-content/60 mb-6">
          Oops! The page you're looking for has been eaten or never existed. Let's get you
          back to the kitchen.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn btn-primary gap-2">
            <FiHome /> Back to Home
          </Link>
          <Link to="/browse-recipes" className="btn btn-outline gap-2">
            <FiSearch /> Browse Recipes
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
