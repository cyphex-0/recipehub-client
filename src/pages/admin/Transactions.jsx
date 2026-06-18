import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FiDollarSign, FiDownload } from 'react-icons/fi'
import { motion } from 'framer-motion'
import api from '../../utils/api'
import Loader from '../../components/Loader'

const Transactions = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['admin-transactions', page],
    queryFn: async () =>
      (await api.get('/admin/transactions', { params: { page, limit: 15 } }))
        .data,
  })

  const exportCSV = () => {
    if (!data?.transactions) return
    const rows = [
      ['User', 'Email', 'Type', 'Amount', 'Status', 'Date'],
      ...data.transactions.map((t) => [
        t.userName,
        t.userEmail,
        t.type,
        t.amount,
        t.status,
        new Date(t.createdAt).toISOString(),
      ]),
    ]
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) return <Loader />

  const txns = data?.transactions || []
  const pages = data?.pages || 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <FiDollarSign className="text-success" /> Transactions
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            {data?.total ?? 0} total transactions
          </p>
        </div>
        <button onClick={exportCSV} className="btn btn-sm btn-outline gap-1">
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-base-100 rounded-2xl shadow-md p-5">
          <p className="text-sm text-base-content/60">Total Revenue</p>
          <p className="text-2xl font-bold text-success mt-1">
            ${data?.totalRevenue?.toFixed(2) ?? '0.00'}
          </p>
        </div>
        <div className="bg-base-100 rounded-2xl shadow-md p-5">
          <p className="text-sm text-base-content/60">Recipe Purchases</p>
          <p className="text-2xl font-bold mt-1">
            {data?.recipeCount ?? 0}
          </p>
        </div>
        <div className="bg-base-100 rounded-2xl shadow-md p-5">
          <p className="text-sm text-base-content/60">Premium Subs</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {data?.premiumCount ?? 0}
          </p>
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t, i) => (
                <motion.tr
                  key={t._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover"
                >
                  <td>
                    <div>
                      <p className="font-semibold">{t.userName}</p>
                      <p className="text-xs text-base-content/50">
                        {t.userEmail}
                      </p>
                    </div>
                  </td>
                  <td className="capitalize">
                    {t.type === 'premium' ? '⭐ Premium' : '🍳 Recipe'}
                  </td>
                  <td className="font-semibold">${t.amount?.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        t.status === 'completed'
                          ? 'badge-success'
                          : t.status === 'refunded'
                          ? 'badge-warning'
                          : 'badge-ghost'
                      } capitalize`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="text-sm">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                </motion.tr>
              ))}
              {txns.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-base-content/50 py-6">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="join flex justify-center p-4">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`join-item btn btn-sm ${
                  page === i + 1 ? 'btn-primary' : ''
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions
