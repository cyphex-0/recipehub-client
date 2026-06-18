import { useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiImage, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'sonner'
import { useAuth } from '../../providers/AuthProvider'

const Register = () => {
  const { registerWithEmail, loginWithGoogle, dbUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  if (dbUser) return <Navigate to={from} replace />
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      
      const res = await registerWithEmail(data.name, data.email, data.password, data.photoURL || '')
      if (!res?.ok) {
        toast.error(res?.message || 'Registration failed')
        return
      }
      toast.success('Account created!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      toast.loading('Redirecting to Google...', { id: 'google-oauth' })
      sessionStorage.setItem('oauth_pending', 'true')
      await loginWithGoogle()
    } catch (err) {
      toast.dismiss('google-oauth')
      toast.error(err.message || 'Google sign-in failed')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-base-100 rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-3">
              <span className="text-3xl">✨</span>
            </div>
            <h1 className="text-3xl font-display font-bold">Join RecipeHub</h1>
            <p className="text-sm text-base-content/60 mt-1">
              Create your free account in seconds
            </p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="btn btn-outline w-full gap-2 mb-4"
          >
            <FcGoogle className="text-xl" />
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div className="divider text-xs">OR</div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`input input-bordered w-full pl-10 ${
                    errors.name ? 'input-error' : ''
                  }`}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'At least 2 characters' },
                  })}
                />
              </div>
              {errors.name && (
                <span className="text-error text-xs mt-1">{errors.name.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Photo URL</span>
              </label>
              <div className="relative">
                <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className={`input input-bordered w-full pl-10 ${
                    errors.photoURL ? 'input-error' : ''
                  }`}
                  {...register('photoURL', {
                    required: 'Photo URL is required',
                  })}
                />
              </div>
              {errors.photoURL && (
                <span className="text-error text-xs mt-1">{errors.photoURL.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input input-bordered w-full pl-10 ${
                    errors.email ? 'input-error' : ''
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                  })}
                />
              </div>
              {errors.email && (
                <span className="text-error text-xs mt-1">{errors.email.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-10 pr-10 ${
                    errors.password ? 'input-error' : ''
                  }`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                      message: 'Must include 1 uppercase & 1 lowercase letter',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-xs mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-base-content/60 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
