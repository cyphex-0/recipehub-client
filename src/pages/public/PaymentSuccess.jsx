import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiArrowRight, FiLoader } from 'react-icons/fi'
import api from '../../utils/api'
import Loader from '../../components/Loader'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const recipeId = searchParams.get('recipeId')
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false
    const verify = async () => {
      if (!sessionId) {
        setVerifying(false)
        return
      }
      try {
        await api.post('/payments/verify', { sessionId, recipeId })
        if (!cancelled) setSuccess(true)
      } catch {
        if (!cancelled) setSuccess(false)
      } finally {
        if (!cancelled) setVerifying(false)
      }
    }
    verify()
    return () => {
      cancelled = true
    }
  }, [sessionId, recipeId])

  return (
    <div className="min-h-screen flex items-center justify-center container-app pt-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-base-100 p-10 rounded-3xl shadow-xl text-center max-w-md w-full"
      >
        {verifying ? (
          <>
            <FiLoader className="text-6xl text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Verifying Payment...</h2>
            <p className="text-base-content/60 mt-2">Please wait a moment.</p>
            <Loader text="" />
          </>
        ) : success ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <FiCheckCircle className="text-7xl text-success mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-display font-bold mb-2">Payment Successful!</h2>
            <p className="text-base-content/60 mb-6">
              Thank you! Your recipe is now unlocked and available in your dashboard.
            </p>
            <div className="flex flex-col gap-2">
              {recipeId && (
                <Link to={`/recipe/${recipeId}`} className="btn btn-primary">
                  View Recipe
                </Link>
              )}
              <Link to="/dashboard/purchased" className="btn btn-outline gap-2">
                My Purchased <FiArrowRight />
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-error">Payment Could Not Be Verified</h2>
            <p className="text-base-content/60 mt-2 mb-6">
              Please contact support if you were charged.
            </p>
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default PaymentSuccess
