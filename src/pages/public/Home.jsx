import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  FiSearch, FiBookOpen, FiHeart, FiUsers, FiAward, FiZap,
  FiCheckCircle, FiPlayCircle
} from 'react-icons/fi'
import { FaUtensils, FaLeaf, FaFire } from 'react-icons/fa'
import api from '../../utils/api'
import RecipeCard from '../../components/RecipeCard'
import Loader from '../../components/Loader'
import { useAuth } from '../../providers/AuthProvider'

const Home = () => {
  const { dbUser } = useAuth()
  
  const { data: featuredData, isLoading: loadingFeatured } = useQuery({
    queryKey: ['featured-recipes'],
    queryFn: async () => (await api.get('/recipes/featured')).data,
  })

  const { data: popularData, isLoading: loadingPopular } = useQuery({
    queryKey: ['popular-recipes'],
    queryFn: async () => (await api.get('/recipes?limit=6&sort=-likesCount')).data,
  })

  const featuredRecipes = featuredData || []
  const popularRecipes = popularData?.recipes || []

  const categories = useMemo(() => [
    { name: 'Breakfast', icon: <FaUtensils />, color: 'from-orange-400 to-red-500' },
    { name: 'Vegan', icon: <FaLeaf />, color: 'from-green-400 to-emerald-500' },
    { name: 'Spicy', icon: <FaFire />, color: 'from-red-500 to-rose-600' },
    { name: 'Desserts', icon: <FiAward />, color: 'from-pink-400 to-purple-500' },
  ], [])

  const features = useMemo(() => [
    {
      icon: <FiBookOpen />,
      title: 'Browse Recipes',
      desc: 'Discover thousands of curated recipes from home cooks worldwide.',
    },
    {
      icon: <FiHeart />,
      title: 'Save Favorites',
      desc: 'Bookmark recipes you love and build your personal collection.',
    },
    {
      icon: <FiUsers />,
      title: 'Community',
      desc: 'Share your own creations and connect with fellow foodies.',
    },
    {
      icon: <FiAward />,
      title: 'Premium Content',
      desc: 'Unlock exclusive recipes from professional chefs.',
    },
  ], [])

  return (
    <div>
      {}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-base-100 to-accent/10" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="container-app relative z-10 grid lg:grid-cols-2 gap-10 items-center pt-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              🍳 Welcome to RecipeHub
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
              Cook with <span className="gradient-text">Confidence</span>,<br />
              Share with <span className="gradient-text">Joy</span>.
            </h1>
            <p className="text-lg text-base-content/70 mb-8 max-w-xl">
              Discover thousands of mouthwatering recipes, save your favorites, and share
              your own creations with a community of passionate home cooks.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/browse-recipes" className="btn btn-primary btn-lg gap-2">
                <FiSearch /> Browse Recipes
              </Link>
              <Link
                to="/dashboard/add-recipe"
                className="btn btn-outline btn-lg gap-2"
              >
                <FiPlayCircle /> Share a Recipe
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-10">
              <div>
                <p className="text-3xl font-bold text-primary">10k+</p>
                <p className="text-xs text-base-content/60">Recipes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">5k+</p>
                <p className="text-xs text-base-content/60">Cooks</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">50+</p>
                <p className="text-xs text-base-content/60">Cuisines</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"
                alt="Cooking"
                loading="lazy"
                className="rounded-3xl shadow-2xl w-full"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 glass bg-base-100/80 p-4 rounded-2xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                    <FiHeart />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/60">Saved Today</p>
                    <p className="font-bold">+24% this week</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {}
      <section className="py-20 container-app">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge badge-primary badge-outline mb-2">Categories</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Explore by Category
          </h2>
          <p className="text-base-content/70">
            From quick breakfasts to gourmet dinners — find your next favorite.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/browse-recipes?category=${cat.name.toLowerCase()}`}
                className="card-hover bg-base-100 rounded-2xl p-6 text-center shadow-md group"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform`}
                >
                  {cat.icon}
                </div>
                <h3 className="font-bold">{cat.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {}
      <section className="py-20 bg-base-200">
        <div className="container-app">
          <div className="flex flex-wrap items-end justify-between mb-10 gap-4">
            <div>
              <span className="badge badge-primary badge-outline mb-2">Top Rated</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Featured Recipes
              </h2>
              <p className="text-base-content/70 mt-2">
                Our community's most loved creations.
              </p>
            </div>
            <Link to="/browse-recipes" className="btn btn-primary">
              See all
            </Link>
          </div>

          {loadingFeatured ? (
            <Loader />
          ) : featuredRecipes.length === 0 ? (
            <p className="text-center text-base-content/60 py-12">
              No featured recipes yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecipes.map((r) => (
                <RecipeCard key={r._id} recipe={r} />
              ))}
            </div>
          )}
        </div>
      </section>

      {}
      <section className="py-20 bg-base-100">
        <div className="container-app">
          <div className="flex flex-wrap items-end justify-between mb-10 gap-4">
            <div>
              <span className="badge badge-secondary badge-outline mb-2">Trending</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Popular Recipes
              </h2>
              <p className="text-base-content/70 mt-2">
                Most liked recipes by our community right now.
              </p>
            </div>
            <Link to="/browse-recipes?sort=most-liked" className="btn btn-secondary">
              See all
            </Link>
          </div>

          {loadingPopular ? (
            <Loader />
          ) : popularRecipes.length === 0 ? (
            <p className="text-center text-base-content/60 py-12">
              No recipes yet. Be the first to add one!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularRecipes.map((r) => (
                <RecipeCard key={r._id} recipe={r} />
              ))}
            </div>
          )}
        </div>
      </section>

      {}
      <section className="py-20 container-app">
        <div className="text-center mb-12">
          <span className="badge badge-primary badge-outline mb-2">Why us</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Why Cooks Love RecipeHub
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-base-100 p-6 rounded-2xl shadow-md card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-base-content/70">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {}
      <section className="py-20 container-app">
        <div className="bg-gradient-to-br from-primary via-rose-600 to-accent text-white rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_50%)]" />
          <div className="relative z-10">
            <FiZap className="text-5xl mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Ready to Start Cooking?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of home cooks sharing, rating, and celebrating delicious food.
            </p>
            <Link
              to={dbUser ? "/dashboard" : "/register"}
              className="btn btn-lg bg-white text-primary border-none hover:bg-base-200"
            >
              <FiCheckCircle /> {dbUser ? "Go to Dashboard" : "Get Started Free"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
