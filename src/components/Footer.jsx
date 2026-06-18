import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content mt-20">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">🍳</span>
              <span className="text-2xl font-display font-bold">RecipeHub</span>
            </div>
            <p className="text-sm text-neutral-content/80 leading-relaxed">
              Discover, share, and cook delicious recipes from food lovers around the world.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { icon: <FaFacebookF />, href: '#' },
                { icon: <FaTwitter />, href: '#' },
                { icon: <FaInstagram />, href: '#' },
                { icon: <FaYoutube />, href: '#' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all"
                  aria-label="social"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-neutral-content/80">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><Link to="/browse-recipes" className="hover:text-primary">Browse Recipes</Link></li>
              <li><Link to="/dashboard/add-recipe" className="hover:text-primary">Add Recipe</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-neutral-content/80">
              <li><Link to="/login" className="hover:text-primary">Login</Link></li>
              <li><Link to="/register" className="hover:text-primary">Register</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-neutral-content/80">
              <li>📧 hello@recipehub.com</li>
              <li>📍 Dhaka, Bangladesh</li>
              <li>📞 +880 1234 567 890</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-neutral-content/60">
          © {new Date().getFullYear()} RecipeHub. All rights reserved. Made with ❤️
        </div>
      </div>
    </footer>
  )
}

export default Footer
