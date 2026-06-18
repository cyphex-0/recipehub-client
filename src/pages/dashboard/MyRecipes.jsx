import { useState } from 'react'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FiEdit, FiTrash2, FiEye, FiPlusCircle } from 'react-icons/fi'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import api from '../../utils/api'
import Loader from '../../components/Loader'

const MyRecipes = () => {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const limit = 10
  
  const { data, isLoading } = useQuery({
    queryKey: ['my-recipes-all', page],
    queryFn: async () => (await api.get(`/recipes/me?page=${page}&limit=${limit}`)).data,
    placeholderData: keepPreviousData,
  })

  const recipes = data?.recipes || []
  const totalPages = data?.pages || 1

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/recipes/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-recipes'] })
      qc.invalidateQueries({ queryKey: ['my-recipes-all'] })
      qc.invalidateQueries({ queryKey: ['dashboard-overview'] })
      toast.success('Recipe deleted')
    },
    onError: () => toast.error('Failed to delete'),
  })

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Delete recipe?',
      text: `"${name}" will be removed permanently.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E63946',
      confirmButtonText: 'Yes, delete it',
    }).then((r) => {
      if (r.isConfirmed) deleteMutation.mutate(id)
    })
  }

  if (isLoading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">My Recipes</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Manage your culinary creations ({recipes.length})
          </p>
        </div>
        <Link to="/dashboard/add-recipe" className="btn btn-primary gap-2">
          <FiPlusCircle /> Add Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="bg-base-100 p-10 rounded-2xl shadow-md text-center">
          <span className="text-6xl block mb-3">🍽️</span>
          <h3 className="font-bold text-lg">No recipes yet</h3>
          <p className="text-sm text-base-content/60 mt-1 mb-4">
            Start sharing your favorite recipes with the community.
          </p>
          <Link to="/dashboard/add-recipe" className="btn btn-primary">
            Add Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200">
                <tr>
                  <th>Recipe</th>
                  <th>Category</th>
                  <th>Likes</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((r) => (
                  <tr key={r._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={r.recipeImage || 'https://placehold.co/80'}
                          alt={r.recipeName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="font-semibold">{r.recipeName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline capitalize">
                        {r.category}
                      </span>
                    </td>
                    <td>{r.likesCount || 0}</td>
                    <td className="text-xs">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <Link
                          to={`/recipe/${r._id}`}
                          className="btn btn-ghost btn-xs"
                          title="View"
                        >
                          <FiEye />
                        </Link>
                        <Link
                          to={`/dashboard/edit-recipe/${r._id}`}
                          className="btn btn-ghost btn-xs text-info"
                          title="Edit"
                        >
                          <FiEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(r._id, r.recipeName)}
                          className="btn btn-ghost btn-xs text-error"
                          title="Delete"
                          disabled={deleteMutation.isLoading}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 p-4 border-t border-base-200">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-sm"
              >
                ← Prev
              </button>
              <span className="text-sm">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-sm"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MyRecipes
