import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import taskService from '../services/taskService'

const CreateTask = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await taskService.createTask(data)
      toast.success('Task created successfully!')
      navigate('/tasks')
    } catch (error) {
      console.error('Create task error:', error)
      toast.error(error.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/tasks')}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tasks
          </button>
        </div>

        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                placeholder="Enter task title"
                {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 3, message: 'Title must be at least 3 characters' },
                  maxLength: { value: 100, message: 'Title must not exceed 100 characters' },
                })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows="4"
                className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
                placeholder="Enter task description"
                {...register('description', {
                  maxLength: { value: 500, message: 'Description must not exceed 500 characters' },
                })}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select className="select select-bordered w-full" {...register('status')}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  {/* <option value="completed">Completed</option> */}
                  {/* <option value="cancelled">Cancelled</option> */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select className="select select-bordered w-full" {...register('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                {...register('dueDate')}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTask
