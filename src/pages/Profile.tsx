import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { User, Lock, Mail, Calendar, Shield, Save, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RootState } from '@/store'
import { authApi } from '@/lib/api'
import { setUser } from '@/store/authSlice'

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError('')
    setProfileMessage('')

    try {
      console.log('👤 [PROFILE] Updating profile with data:', profileData)
      
      // Call the backend API to update profile
      const response = await authApi.updateProfile(profileData)
      
      console.log('👤 [PROFILE] Profile update response:', response)
      
      // Update the local Redux state with the updated user data
      if (response.data?.user) {
        dispatch(setUser(response.data.user))
      }
      
      setProfileMessage('Profile updated successfully!')
    } catch (error: any) {
      console.error('❌ [PROFILE] Profile update error:', error)
      setProfileError(error.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError('')
    setPasswordMessage('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      setPasswordLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      setPasswordLoading(false)
      return
    }

    try {
      await authApi.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setPasswordMessage('Password updated successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                {profileMessage && (
                  <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                    {profileMessage}
                  </div>
                )}
                {profileError && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    {profileError}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={profileLoading} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {profileLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Password Update */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Change Password</span>
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                {passwordMessage && (
                  <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                    {passwordMessage}
                  </div>
                )}
                {passwordError && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="pl-10 pr-10"
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="pl-10 pr-10"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pl-10 pr-10"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={passwordLoading} className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Account Information</span>
            </CardTitle>
            <CardDescription>
              View your account details and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Account Created</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email Status</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${user?.isEmailVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm text-gray-900">
                      {user?.isEmailVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">User ID</Label>
                  <p className="text-sm text-gray-900 font-mono mt-1">{user?.id}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-500">Account Type</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-900">Free Account</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
