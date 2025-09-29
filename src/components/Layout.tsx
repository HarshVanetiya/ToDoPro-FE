import { useEffect } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LogOut, CheckSquare, User, BarChart3, List } from 'lucide-react'
import { RootState } from '@/store'
import { setUser, logoutSuccess, setLoading, clearSkipAuthCheck } from '@/store/authSlice'
import { authApi } from '@/lib/api'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoading, skipAuthCheck, token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Skip auth check if user just logged in successfully
    if (skipAuthCheck) {
      dispatch(clearSkipAuthCheck())
      return
    }

    // Only fetch user if we don't already have one and we have a token
    if (!user && token) {
      const fetchUser = async () => {
        try {
          dispatch(setLoading(true))
          const response = await authApi.me()
          if (response.data?.user) {
            dispatch(setUser(response.data.user))
          }
        } catch (error: any) {
          // Only reset auth state if it's a real authentication error
          // Don't reset on network errors or other temporary issues
          if (error.status === 401 || error.status === 403) {
            dispatch(setUser(null))
          }
        } finally {
          dispatch(setLoading(false))
        }
      }

      // Add a small delay to allow token to be stored properly after login
      const timeoutId = setTimeout(fetchUser, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [dispatch, skipAuthCheck, user, token])

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // Ignore logout errors
    } finally {
      dispatch(logoutSuccess())
      navigate('/login')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const navigation = [
    { name: 'Todos', href: '/app/todos', icon: List, current: location.pathname.startsWith('/app/todos') },
    { name: 'Analytics', href: '/app/analytics', icon: BarChart3, current: location.pathname === '/app/analytics' },
    { name: 'Profile', href: '/app/profile', icon: User, current: location.pathname === '/app/profile' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/app/todos" className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                  <CheckSquare className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">ToDoPro</h1>
                </div>
              </Link>
              
              {/* Navigation */}
              <nav className="hidden md:flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.current
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
