import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FiUser, FiMail, FiCamera, FiAward, FiEdit2 } from 'react-icons/fi'
import { FaCrown } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useAuth } from '../../providers/AuthProvider'
import api from '../../utils/api'
import Loader from '../../components/Loader'

const Profile = () => {
  const { dbUser, refreshUser } = useAuth()
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    values: {
      name: dbUser?.name || '',
      image: dbUser?.image || '',
      coverPhoto: dbUser?.coverPhoto || '',
    },
  })

  const updateProfile = useMutation({
    mutationFn: (payload) => api.put('/users/me', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] })
      refreshUser?.()
      setEditing(false)
      toast.success('Profile updated')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  })

  const upgradePremium = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/payments/premium-checkout', {
        priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
      })
      return data
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Could not start checkout')
      }
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || 'Checkout failed'),
  })

  if (!dbUser) return <Loader />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">My Profile</h1>

      {}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 rounded-2xl shadow-md overflow-hidden"
      >
        <div 
          className="h-32 sm:h-48 bg-gradient-to-r from-primary via-secondary to-accent bg-cover bg-center" 
          style={dbUser.coverPhoto ? { backgroundImage: `url(${dbUser.coverPhoto})` } : {}}
        />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 relative z-10">
            <div className="avatar -mt-16 sm:-mt-20">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full ring-4 ring-base-100 overflow-hidden bg-base-100 shadow-md">
                {dbUser.image ? (
                  <img src={dbUser.image} alt={dbUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-4xl font-bold">
                    {dbUser.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 pt-2 sm:pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold">{dbUser.name}</h2>
                {dbUser.role === 'admin' && (
                  <span className="badge badge-warning gap-1">
                    <FiAward /> Admin
                  </span>
                )}
                {dbUser.isPremium && (
                  <span className="badge badge-primary gap-1">
                    <FaCrown /> Premium
                  </span>
                )}
              </div>
              <p className="text-sm text-base-content/60 flex items-center gap-1 mt-1">
                <FiMail /> {dbUser.email}
              </p>
            </div>
            
            <div className="sm:pb-4">
              <button
                onClick={() => setEditing((v) => !v)}
                className="btn btn-sm btn-outline gap-1"
              >
                <FiEdit2 /> {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>

          {editing && (
            <form
              onSubmit={handleSubmit(updateProfile.mutate)}
              className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-base-200"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Name</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                  {...register('name', { required: 'Required', minLength: 2 })}
                />
                {errors.name && (
                  <span className="text-error text-xs mt-1">{errors.name.message}</span>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Photo URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="input input-bordered"
                  {...register('image')}
                />
              </div>
              <div className="form-control sm:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Cover Photo URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="input input-bordered"
                  {...register('coverPhoto')}
                />
              </div>
              <button
                type="submit"
                disabled={updateProfile.isLoading}
                className="btn btn-primary sm:col-span-2"
              >
                {updateProfile.isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>
      </motion.div>

      {}
      {!dbUser.isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 border border-primary/20"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-6xl"><FaCrown className="text-primary" /></div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-display font-bold">Go Premium</h3>
              <p className="text-sm text-base-content/70 mt-1">
                Unlock unlimited recipes, premium-only content, and ad-free
                browsing.
              </p>
              <ul className="text-sm mt-3 space-y-1">
                <li>✓ Unlimited recipe publishing</li>
                <li>✓ Access all premium recipes</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
            <button
              onClick={() => upgradePremium.mutate()}
              disabled={upgradePremium.isLoading}
              className="btn btn-primary btn-lg gap-2"
            >
              <FaCrown />
              {upgradePremium.isLoading ? 'Loading...' : 'Upgrade — $9.99'}
            </button>
          </div>
        </motion.div>
      )}

      {}
      <div className="bg-base-100 rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Account Details</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-base-content/60">Email</p>
            <p className="font-semibold">{dbUser.email}</p>
          </div>
          <div>
            <p className="text-base-content/60">Role</p>
            <p className="font-semibold capitalize">{dbUser.role}</p>
          </div>
          <div>
            <p className="text-base-content/60">Member Since</p>
            <p className="font-semibold">
              {new Date(dbUser.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-base-content/60">Status</p>
            <p className="font-semibold">
              {dbUser.isPremium ? 'Premium Member' : 'Free Tier'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
