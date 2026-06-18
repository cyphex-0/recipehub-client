import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FiUpload, FiPlus, FiX, FiImage } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import Loader from '../../components/Loader'

const CATEGORIES = [
  'breakfast', 'lunch', 'dinner', 'dessert', 'vegan', 'vegetarian',
  'snacks', 'beverages', 'seafood', 'bakery',
]
const CUISINES = [
  'Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese', 'Thai',
  'French', 'American', 'Mediterranean', 'Korean', 'Middle Eastern', 'Other',
]
const DIFFICULTIES = ['easy', 'medium', 'hard']

const AddRecipe = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const qc = useQueryClient()
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const { register, handleSubmit, control, formState: { errors }, setValue, watch, reset } =
    useForm({
      defaultValues: {
        recipeName: '',
        category: 'lunch',
        cuisineType: 'Other',
        difficultyLevel: 'easy',
        preparationTime: 30,
        servings: 2,
        ingredients: [{ value: '' }],
        instructions: [{ value: '' }],
        price: 0,
        isPremium: false,
      },
    })

  const { fields: ingFields, append: addIng, remove: removeIng } =
    useFieldArray({ control, name: 'ingredients' })
  const { fields: insFields, append: addIns, remove: removeIns } =
    useFieldArray({ control, name: 'instructions' })

  const { isLoading: loadingRecipe } = useQuery({
    queryKey: ['edit-recipe', id],
    queryFn: async () => {
      const { data } = await api.get(`/recipes/${id}`)
      reset({
        recipeName: data.recipeName,
        category: data.category,
        cuisineType: data.cuisineType,
        difficultyLevel: data.difficultyLevel || data.difficulty,
        preparationTime: data.preparationTime,
        servings: data.servings || 2,
        ingredients: data.ingredients?.map((v) => ({ value: typeof v === 'string' ? v : `${v.quantity || ''} ${v.item}` })) || [{ value: '' }],
        instructions: data.instructions?.map((v) => ({ value: v })) || [{ value: '' }],
        price: data.price || 0,
        isPremium: data.isPremium || false,
      })
      setImageUrl(data.recipeImage || '')
      return data
    },
    enabled: isEdit,
  })

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const key = import.meta.env.VITE_IMGBB_KEY
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${key}`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()
      if (data.success) {
        setImageUrl(data.data.url)
        setValue('recipeImage', data.data.url)
        toast.success('Image uploaded')
      } else {
        toast.error('Upload failed')
      }
    } catch {
      toast.error('Image upload error')
    } finally {
      setUploading(false)
    }
  }

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? api.put(`/recipes/${id}`, payload) : api.post('/recipes', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-recipes'] })
      qc.invalidateQueries({ queryKey: ['recipes'] })
      qc.invalidateQueries({ queryKey: ['dashboard-overview'] })
      toast.success(isEdit ? 'Recipe updated' : 'Recipe published!')
      navigate('/dashboard/my-recipes')
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || 'Failed to save recipe'),
  })

  const onSubmit = (data) => {
    if (!imageUrl) {
      toast.error('Please upload a recipe image')
      return
    }
    const ingredients = data.ingredients.map((i) => i.value).filter(Boolean)
    const instructions = data.instructions.map((i) => i.value).filter(Boolean)
    if (ingredients.length === 0) return toast.error('Add at least one ingredient')
    if (instructions.length === 0) return toast.error('Add at least one step')

    const payload = {
      ...data,
      recipeImage: imageUrl,
      ingredients,
      instructions,
      price: Number(data.price) || 0,
      preparationTime: Number(data.preparationTime),
      servings: Number(data.servings),
    }
    mutation.mutate(payload)
  }

  if (loadingRecipe) return <Loader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">
          {isEdit ? 'Edit Recipe' : 'Add New Recipe'}
        </h1>
        <p className="text-sm text-base-content/60 mt-1">
          {isEdit ? 'Update your recipe details.' : 'Share your culinary creation.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-base-100 rounded-2xl shadow-md p-6 space-y-6">
        {}
        <div>
          <label className="label">
            <span className="label-text font-semibold">Recipe Image</span>
          </label>
          <div className="flex items-start gap-4">
            <div className="w-32 h-32 rounded-xl bg-base-200 overflow-hidden flex items-center justify-center border-2 border-dashed border-base-300">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <FiImage className="text-3xl text-base-content/40" />
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full"
                disabled={uploading}
              />
              <p className="text-xs text-base-content/60 mt-2">
                {uploading ? 'Uploading to ImgBB...' : 'Max 5MB. JPG/PNG. Stored on ImgBB.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Recipe Name</span>
            </label>
            <input
              type="text"
              placeholder="Creamy Tuscan Chicken"
              className={`input input-bordered ${errors.recipeName ? 'input-error' : ''}`}
              {...register('recipeName', { required: 'Required', minLength: 3 })}
            />
            {errors.recipeName && (
              <span className="text-error text-xs mt-1">{errors.recipeName.message}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Category</span>
            </label>
            <select className="select select-bordered" {...register('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Cuisine</span>
            </label>
            <select className="select select-bordered" {...register('cuisineType')}>
              {CUISINES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Difficulty</span>
            </label>
            <select className="select select-bordered" {...register('difficultyLevel')}>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d} className="capitalize">{d}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Prep Time (minutes)</span>
            </label>
            <input
              type="number"
              min="1"
              className="input input-bordered"
              {...register('preparationTime', { required: true, min: 1 })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Servings</span>
            </label>
            <input
              type="number"
              min="1"
              className="input input-bordered"
              {...register('servings', { required: true, min: 1 })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Price (USD)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input input-bordered"
              {...register('price')}
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                {...register('isPremium')}
              />
              <span className="label-text font-semibold">
                ⭐ Premium recipe (premium members only)
              </span>
            </label>
          </div>
        </div>

        {}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="label-text font-semibold">Ingredients</label>
            <button
              type="button"
              onClick={() => addIng({ value: '' })}
              className="btn btn-sm btn-outline gap-1"
            >
              <FiPlus /> Add
            </button>
          </div>
          <div className="space-y-2">
            {ingFields.map((f, i) => (
              <div key={f.id} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 2 cups flour"
                  className="input input-bordered flex-1"
                  {...register(`ingredients.${i}.value`)}
                />
                {ingFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIng(i)}
                    className="btn btn-ghost btn-square text-error"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="label-text font-semibold">Instructions</label>
            <button
              type="button"
              onClick={() => addIns({ value: '' })}
              className="btn btn-sm btn-outline gap-1"
            >
              <FiPlus /> Add Step
            </button>
          </div>
          <div className="space-y-2">
            {insFields.map((f, i) => (
              <div key={f.id} className="flex gap-2">
                <span className="flex-shrink-0 w-8 h-12 bg-primary text-white rounded-lg flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <textarea
                  rows={2}
                  placeholder="Describe step..."
                  className="textarea textarea-bordered flex-1"
                  {...register(`instructions.${i}.value`)}
                />
                {insFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIns(i)}
                    className="btn btn-ghost btn-square text-error self-start mt-2"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={mutation.isLoading || uploading}
        >
          {mutation.isLoading
            ? 'Saving...'
            : isEdit
            ? 'Update Recipe'
            : 'Publish Recipe'}
        </button>
      </form>
    </div>
  )
}

export default AddRecipe
