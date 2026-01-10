import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import taskService from '../services/taskService'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsData, tasksData] = await Promise.all([
        taskService.getStats(),
        taskService.getTasks({ limit: 5, sortBy: 'createdAt', order: 'desc' }),
      ])

      setStats(statsData.data)
      setRecentTasks(tasksData.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (task) => {
    try {
      await taskService.updateTask(task._id, { status: 'completed' })
      toast.success('Task marked as completed!')
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  const handleToggleCancel = async (task) => {
    try {
      await taskService.updateTask(task._id, { status: 'cancelled' })
      toast.success('Task cancelled')
      fetchDashboardData()
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
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to renew task')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || colors.pending
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600',
    }
    return colors[priority] || colors.medium
  }

  const getCardBackgroundColor = (status) => {
    const colors = {
      pending: 'bg-orange-50 border-orange-200',
      'in-progress': 'bg-blue-50 border-blue-200',
      completed: 'bg-green-50 border-green-200',
      cancelled: 'bg-gray-100 border-gray-200',
    }
    return colors[status] || 'bg-white border-gray-200'
  }

  if (loading) return <Loading />

  const statusStats = stats?.byStatus?.reduce((acc, item) => {
    acc[item._id] = item.count
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-1 text-gray-600">Here's what's happening with your tasks today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0">
          <div className="card bg-white overflow-hidden shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats?.total || 0}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card bg-white overflow-hidden shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-2xl font-bold text-gray-900">{statusStats?.pending || 0}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card bg-white overflow-hidden shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd className="text-2xl font-bold text-gray-900">{statusStats?.['in-progress'] || 0}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card bg-white overflow-hidden shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-2xl font-bold text-gray-900">{statusStats?.completed || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="mt-8 px-4 sm:px-0">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
              <Link to="/tasks" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                View all →
              </Link>
            </div>

            {recentTasks.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                <div className="mt-6">
                  <Link to="/tasks/create" className="btn-primary">
                    Create Task
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div 
                    key={task._id} 
                    className={`rounded-lg p-4 hover:shadow-md transition-shadow border-2 ${getCardBackgroundColor(task.status)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        {task.description && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
