import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FiSearch, FiTrash2, FiShield, FiShieldOff, FiSlash } from 'react-icons/fi'
import { FaCrown } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import { toast } from 'sonner'
import api from '../../utils/api'
import Loader from '../../components/Loader'
import { useAuth } from '../../providers/AuthProvider'

const ManageUsers = () => {
  const { dbUser, refreshUser } = useAuth()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, page],
    queryFn: async () =>
      (
        await api.get('/admin/users', {
          params: { search, page, limit: 10 },
        })
      ).data,
  })

  const toggleRole = useMutation({
    mutationFn: ({ id, role }) => api.patch(`/admin/users/${id}/role`, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
    onError: () => toast.error('Role update failed'),
  })

  const togglePremium = useMutation({
    mutationFn: ({ id, isPremium }) =>
      api.patch(`/admin/users/${id}/premium`, { isPremium }),
    onSuccess: async (_, variables) => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      if (variables.id === dbUser?._id) {
        await refreshUser()
      }
    },
  })

  const toggleBlock = useMutation({
    mutationFn: ({ id, isBlocked }) =>
      api.patch(`/admin/users/${id}/block`, { isBlocked }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Block status updated')
    },
  })

  const removeUser = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      Swal.fire('Removed', 'User has been deleted', 'success')
    },
  })

  const confirmDelete = (user) => {
    Swal.fire({
      title: `Remove ${user.name}?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E63946',
      confirmButtonText: 'Yes, remove',
    }).then((r) => {
      if (r.isConfirmed) removeUser.mutate(user._id)
    })
  }

  if (isLoading) return <Loader />

  const users = data?.users || []
  const pages = data?.pages || 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Manage Users</h1>
        <p className="text-sm text-base-content/60 mt-1">
          {data?.total ?? 0} registered users
        </p>
      </div>

      <div className="bg-base-100 rounded-2xl shadow-md p-4">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="input input-bordered w-full pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.email === dbUser?.email
                const cannotModify = isSelf || u.role === 'admin'
                return (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover"
                  >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full">
                          {u.photoURL ? (
                            <img src={u.photoURL} alt={u.name} />
                          ) : (
                            <div className="bg-primary text-white flex items-center justify-center w-full h-full">
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold">{u.name}</p>
                    </div>
                  </td>
                  <td className="text-sm">{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === 'admin' ? 'badge-warning' : 'badge-ghost'
                      } capitalize`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1 items-start">
                      {u.isPremium ? (
                        <span className="badge badge-primary gap-1">
                          <FaCrown /> Premium
                        </span>
                      ) : (
                        <span className="badge badge-ghost">Free</span>
                      )}
                      {u.isBlocked && (
                        <span className="badge badge-error gap-1">
                          <FiSlash /> Blocked
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-sm">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          toggleRole.mutate({
                            id: u._id,
                            role: u.role === 'admin' ? 'user' : 'admin',
                          })
                        }
                        disabled={cannotModify}
                        className="btn btn-xs btn-ghost"
                        title={u.role === 'admin' ? 'Demote' : 'Promote'}
                      >
                        {u.role === 'admin' ? <FiShieldOff /> : <FiShield />}
                      </button>
                      <button
                        onClick={() =>
                          togglePremium.mutate({
                            id: u._id,
                            isPremium: !u.isPremium,
                          })
                        }
                        className="btn btn-xs btn-ghost"
                        title="Toggle premium"
                      >
                        <FaCrown />
                      </button>
                      <button
                        onClick={() =>
                          toggleBlock.mutate({
                            id: u._id,
                            isBlocked: !u.isBlocked,
                          })
                        }
                        disabled={cannotModify}
                        className={`btn btn-xs btn-ghost ${u.isBlocked ? 'text-success' : 'text-error'}`}
                        title={u.isBlocked ? 'Unblock' : 'Block'}
                      >
                        <FiSlash />
                      </button>
                      <button
                        onClick={() => confirmDelete(u)}
                        disabled={cannotModify}
                        className="btn btn-xs btn-ghost text-error"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </motion.tr>
                )
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-base-content/50 py-6">
                    No users found
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

export default ManageUsers
