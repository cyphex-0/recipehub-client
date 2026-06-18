import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FiSearch, FiTrash2, FiEye, FiStar } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import api from '../../utils/api'
import Loader from '../../components/Loader'

const ManageRecipes = () => {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-recipes', search, page],
    queryFn: async () =>
      (
        await api.get('/admin/recipes', {
          params: { search, page, limit: 10 },
        })
      ).data,
  })

  const remove = useMutation({
    mutationFn: (id) => api.delete(`/admin/recipes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-recipes'] }),
  })

  const toggleFeature = useMutation({
    mutationFn: ({ id, isFeatured }) =>
      api.patch(`/admin/recipes/${id}/feature`, { isFeatured }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-recipes'] }),
  })

  const confirmDelete = (r) => {
    Swal.fire({
      title: 'Delete recipe?',
      text: r.recipeName,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E63946',
      confirmButtonText: 'Delete',
    }).then((res) => {
      if (res.isConfirmed) remove.mutate(r._id)
    })
  }

  if (isLoading) return <Loader />

  const recipes = data?.recipes || []
  const pages = data?.pages || 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Manage Recipes</h1>
        <p className="text-sm text-base-content/60 mt-1">
          {data?.total ?? 0} recipes on platform
        </p>
      </div>

      <div className="bg-base-100 rounded-2xl shadow-md p-4">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input
            type="text"
            placeholder="Search recipes..."
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
                <th>Recipe</th>
                <th>Category</th>
                <th>Creator</th>
                <th>Premium</th>
                <th>Likes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((r) => (
                <motion.tr
                  key={r._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover"
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded">
                          <img src={r.recipeImage} alt={r.recipeName} />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold line-clamp-1">{r.recipeName}</p>
                        <p className="text-xs text-base-content/50">
                          ${r.price || 'Free'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="capitalize">{r.category}</td>
                  <td className="text-sm">{r.authorName}</td>
                  <td>
                    <div className="flex flex-col gap-1 items-start">
                      {r.isPremium ? (
                        <span className="badge badge-primary">Premium</span>
                      ) : (
                        <span className="badge badge-ghost">Free</span>
                      )}
                      {r.isFeatured && (
                        <span className="badge badge-warning gap-1">
                          <FiStar /> Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{r.likesCount ?? 0}</td>
                  <td>
                    <div className="flex gap-1">
                      <Link
                        to={`/recipe/${r._id}`}
                        className="btn btn-xs btn-ghost"
                        title="View"
                      >
                        <FiEye />
                      </Link>
                      <button
                        onClick={() =>
                          toggleFeature.mutate({
                            id: r._id,
                            isFeatured: !r.isFeatured,
                          })
                        }
                        className={`btn btn-xs btn-ghost ${
                          r.isFeatured ? 'text-warning' : 'text-base-content/50'
                        }`}
                        title={r.isFeatured ? 'Unfeature' : 'Feature'}
                      >
                        <FiStar />
                      </button>
                      <button
                        onClick={() => confirmDelete(r)}
                        className="btn btn-xs btn-ghost text-error"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {recipes.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-base-content/50 py-6">
                    No recipes found
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

export default ManageRecipes
