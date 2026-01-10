import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import taskService from '../services/taskService'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    page: 1,
    limit: 10,
  })
  const [pagination, setPagination] = useState(null)

  console.log('Tasks component rendered, showModal:', showModal, 'loading:', loading, 'tasks:', tasks.length)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    console.log('Fetching tasks with filters:', filters)
    fetchTasks()
  }, [filters])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await taskService.getTasks(filters)
      setTasks(data.data || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error('Failed to load tasks:', error)
      toast.error(error.response?.data?.message || 'Failed to load tasks')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    reset({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
    })
    setShowModal(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    reset({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    })
    setShowModal(true)
  }

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id)
        toast.success('Task deleted successfully')
        fetchTasks()
      } catch (error) {
        toast.error('Failed to delete task')
      }
    }
  }

  const handleToggleComplete = async (task) => {
    try {
      await taskService.updateTask(task._id, { status: 'completed' })
      toast.success('Task marked as completed!')
      fetchTasks()
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  const handleToggleCancel = async (task) => {
    try {
      await taskService.updateTask(task._id, { status: 'cancelled' })
      toast.success('Task cancelled')
      fetchTasks()
    } catch (error) {
      toast.error('Failed to cancel task')
    }
  }

  const handleRenewTask = async (task) => {
    try {
      await taskService.updateTask(task._id, { 
        status: 'pending',
        dueDate: null 
      })
      toast.success('Task renewed and set to pending!')
      fetchTasks()
    } catch (error) {
      toast.error('Failed to renew task')
    }
  }

  const onSubmit = async (data) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, data)
        toast.success('Task updated successfully')
      } else {
        await taskService.createTask(data)
        toast.success('Task created successfully')
      }
      setShowModal(false)
      fetchTasks()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'badge-pending',
      'in-progress': 'badge-in-progress',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled',
    }
    return colors[status] || 'badge-pending'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'badge-low',
      medium: 'badge-medium',
      high: 'badge-high',
      urgent: 'badge-urgent',
    }
    return colors[priority] || 'badge-medium'
  }

  const getCardBackgroundColor = (status) => {
    const colors = {
      pending: 'bg-orange-50 border-orange-200',
      'in-progress': 'bg-blue-50 border-blue-200',
      completed: 'bg-green-50 border-green-200',
      cancelled: 'bg-red-50 border-red-200',
    }
    return colors[status] || 'bg-white border-gray-200'
  }

  if (loading && tasks.length === 0) return <Loading />

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <Link to="/tasks/create" className="btn-primary">
              + Create Task
            </Link>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search tasks..."
                className="input"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <select
                className="input"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                className="input"
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <button
                onClick={() => setFilters({ search: '', status: '', priority: '', page: 1, limit: 10 })}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="card text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task._id} 
                  className={`card hover:shadow-lg transition-shadow border-2 ${getCardBackgroundColor(task.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="mt-2 text-gray-600">{task.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className={`badge ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`badge ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="badge bg-purple-100 text-purple-800">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      {/* Status Toggle Buttons - Only show for pending/in-progress tasks */}
                      {(task.status === 'pending' || task.status === 'in-progress') && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleComplete(task)}
                            className="btn-primary px-3 py-1 text-sm"
                            title="Mark as Complete"
                          >
                            ✓ Complete
                          </button>
                          <button
                            onClick={() => handleToggleCancel(task)}
                            className="btn-danger px-3 py-1 text-sm"
                            title="Cancel Task"
                          >
                            ✗ Cancel
                          </button>
                        </div>
                      )}
                      
                      {/* Renew Button - Only show for completed tasks */}
                      {task.status === 'completed' && (
                        <button
                          onClick={() => handleRenewTask(task)}
                          className="btn-primary px-3 py-1 text-sm"
                          title="Renew Task"
                        >
                          🔄 Renew
                        </button>
                      )}

                      {/* Edit and Delete Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="btn-secondary px-3 py-1 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="btn-danger px-3 py-1 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasMore}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {showModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 transition-opacity" 
              style={{ opacity: 0.75 }}
              onClick={() => setShowModal(false)}
              aria-hidden="true"
            ></div>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* Modal panel */}
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title*</label>
                      <input
                        type="text"
                        className={`input mt-1 ${errors.title ? 'border-red-500' : ''}`}
                        {...register('title', {
                          required: 'Title is required',
                          minLength: { value: 3, message: 'Title must be at least 3 characters' },
                          maxLength: { value: 100, message: 'Title must not exceed 100 characters' },
                        })}
                      />
                      {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows="3"
                        className="input mt-1"
                        {...register('description', {
                          maxLength: { value: 500, message: 'Description must not exceed 500 characters' },
                        })}
                      ></textarea>
                      {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select className="input mt-1" {...register('status')}>
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select className="input mt-1" {...register('priority')}>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Due Date</label>
                      <input
                        type="date"
                        className="input mt-1"
                        {...register('dueDate')}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="btn-primary w-full sm:w-auto sm:ml-3">
                    {editingTask ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks
