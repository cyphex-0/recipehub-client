import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FiFlag, FiCheck, FiX, FiEye } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import api from '../../utils/api'
import Loader from '../../components/Loader'

const Reports = () => {
  const qc = useQueryClient()
  const [filter, setFilter] = useState('pending')

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['admin-reports', filter],
    queryFn: async () => (await api.get(`/admin/reports?status=${filter}`)).data,
  })

  const resolve = useMutation({
    mutationFn: ({ id, action }) =>
      api.patch(`/admin/reports/${id}`, { action }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-reports'] }),
  })

  const handleAction = (report, action) => {
    Swal.fire({
      title: `${action === 'dismiss' ? 'Dismiss' : 'Remove recipe'}?`,
      text: report.recipeName,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: action === 'dismiss' ? 'Dismiss' : 'Remove Recipe',
    }).then((r) => {
      if (r.isConfirmed) {
        resolve.mutate({ id: report._id, action })
      }
    })
  }

  if (isLoading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <FiFlag className="text-error" /> Reports
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Review and moderate user reports
          </p>
        </div>
        <div className="join">
          {['pending', 'resolved', 'dismissed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`join-item btn btn-sm ${
                filter === s ? 'btn-primary' : ''
              } capitalize`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-base-100 rounded-2xl shadow-md p-12 text-center">
          <FiFlag className="text-6xl text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No {filter} reports</h3>
          <p className="text-base-content/60">All clear!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r, i) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-base-100 rounded-2xl shadow-md p-5"
            >
              <div className="flex items-start gap-4">
                <div className="avatar">
                  <div className="w-16 h-16 rounded">
                    <img src={r.recipeImage} alt={r.recipeName} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold">{r.recipeName}</h3>
                      <p className="text-xs text-base-content/60 mt-0.5">
                        Reported by {r.reporterName} ·{' '}
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`badge ${
                        r.status === 'pending'
                          ? 'badge-error'
                          : r.status === 'resolved'
                          ? 'badge-success'
                          : 'badge-ghost'
                      } capitalize`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="bg-base-200 rounded-lg p-3 mt-3">
                    <p className="text-sm font-semibold">Reason:</p>
                    <p className="text-sm text-base-content/80 mt-1">
                      {r.reason}
                    </p>
                    {r.description && (
                      <p className="text-xs text-base-content/60 mt-2">
                        {r.description}
                      </p>
                    )}
                  </div>
                  {r.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <Link
                        to={`/recipe/${r.recipeId}`}
                        className="btn btn-sm btn-ghost gap-1"
                      >
                        <FiEye /> View
                      </Link>
                      <button
                        onClick={() => handleAction(r, 'dismiss')}
                        className="btn btn-sm btn-ghost gap-1"
                      >
                        <FiX /> Dismiss
                      </button>
                      <button
                        onClick={() => handleAction(r, 'remove')}
                        className="btn btn-sm btn-error gap-1"
                      >
                        <FiCheck /> Remove Recipe
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reports
