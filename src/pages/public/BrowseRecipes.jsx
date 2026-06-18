import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { FiSearch, FiX } from 'react-icons/fi'
import api from '../../utils/api'
import RecipeCard from '../../components/RecipeCard'
import Loader from '../../components/Loader'

const CATEGORIES = [
  'breakfast', 'lunch', 'dinner', 'dessert', 'vegan', 'vegetarian',
  'snacks', 'beverages', 'seafood', 'bakery',
]

const CATEGORIES_DISPLAY = [
  { key: '', label: 'All' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'dessert', label: 'Dessert' },
  { key: 'vegan', label: 'Vegan' },
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'snacks', label: 'Snacks' },
  { key: 'beverages', label: 'Beverages' },
  { key: 'seafood', label: 'Seafood' },
  { key: 'bakery', label: 'Bakery' },
]

const BrowseRecipes = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || ''
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(initialCategory)
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10))
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt')
  const limit = 9

  
  const queryKey = ['recipes', { search, category, page, sort }]
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page', page)
      params.set('limit', limit)
      if (search) params.set('search', search)
      if (category) params.set('category', category)
      if (sort) params.set('sort', sort)
      const { data: d } = await api.get(`/recipes?${params.toString()}`)
      return d
    },
    placeholderData: keepPreviousData,
    retry: 1,
  })

  const recipes = data?.recipes || []
  const total = data?.total || 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  
  useEffect(() => {
    const sp = new URLSearchParams()
    if (category) sp.set('category', category)
    if (search) sp.set('search', search)
    if (page > 1) sp.set('page', page)
    if (sort !== '-createdAt') sp.set('sort', sort)
    setSearchParams(sp, { replace: true })
  }, [category, search, page, sort, setSearchParams])

  
  useEffect(() => {
    setPage(1)
  }, [category, search, sort])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <div className="container-app py-24 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-3">
          Browse <span className="gradient-text">Recipes</span>
        </h1>
        <p className="text-base-content/70 max-w-xl mx-auto">
          Find your next favorite meal from our curated collection.
        </p>
      </div>

      {}
      <div className="bg-base-100 p-4 rounded-2xl shadow-md mb-6 flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes by name..."
            className="input input-bordered w-full pl-11"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-base-200 rounded-full"
            >
              <FiX />
            </button>
          )}
        </form>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="select select-bordered"
        >
          <option value="-createdAt">Newest</option>
          <option value="-averageRating">Top Rated</option>
          <option value="-likesCount">Most Liked</option>
          <option value="preparationTime">Quickest</option>
          <option value="recipeName">Name (A-Z)</option>
        </select>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES_DISPLAY.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`btn btn-sm rounded-full ${
              category === c.key ? 'btn-primary' : 'btn-outline'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <div className="text-center py-10">
          <p className="text-error font-semibold">Failed to load recipes.</p>
          <p className="text-xs text-base-content/60 mt-2 max-w-md mx-auto break-words">
            {error?.response?.data?.message ||
              error?.message ||
              'Unknown error. Check the dev server console.'}
          </p>
          <button
            onClick={() => refetch()}
            className="btn btn-sm btn-outline btn-error mt-4"
          >
            Try again
          </button>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-3">🔍</p>
          <p className="text-lg font-semibold">No recipes found</p>
          <p className="text-sm text-base-content/60 mt-2">
            Try a different category or search term.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-base-content/60 mb-4">
            Showing {recipes.length} of {total} recipes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((r) => (
              <RecipeCard key={r._id} recipe={r} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-sm"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push('...')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`dot-${i}`} className="px-2">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-sm"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BrowseRecipes
