import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import userService from '../services/userService'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const { user, updateUser } = useAuth()

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm()

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors },
  } = useForm()

  const newPassword = watch('newPassword')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile()
      resetProfile({
        name: data.data.name,
        email: data.data.email,
      })
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const onProfileSubmit = async (data) => {
    setUpdating(true)
    try {
      await userService.updateProfile(data)
      updateUser(data)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    setUpdating(true)
    try {
      await userService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success('Password updated successfully')
      resetPassword()
      setShowPasswordForm(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>

          {/* Profile Information */}
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`input mt-1 ${profileErrors.name ? 'border-red-500' : ''}`}
                    {...registerProfile('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                      maxLength: {
                        value: 50,
                        message: 'Name must not exceed 50 characters',
                      },
                    })}
                  />
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`input mt-1 ${profileErrors.email ? 'border-red-500' : ''}`}
                    {...registerProfile('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Type</label>
                  <div className="mt-1 px-4 py-2 bg-gray-100 rounded-lg">
                    <span className="capitalize font-medium">{user?.role || 'User'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <div className="mt-1 px-4 py-2 bg-gray-100 rounded-lg">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={updating}
                  className="btn btn-primary"
                >
                  {updating ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Password Section */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Password & Security</h2>

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="btn btn-secondary"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      className={`input mt-1 ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                      {...registerPassword('currentPassword', {
                        required: 'Current password is required',
                      })}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      className={`input mt-1 ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                      {...registerPassword('newPassword', {
                        required: 'New password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Password must contain uppercase, lowercase, and number',
                        },
                      })}
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      className={`input mt-1 ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                      {...registerPassword('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === newPassword || 'Passwords do not match',
                      })}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    type="submit"
                    disabled={updating}
                    className="btn btn-primary"
                  >
                    {updating ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false)
                      resetPassword()
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
