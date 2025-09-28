import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import TodosList from './pages/TodosList'
import TodoDetail from './pages/TodoDetail'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  return !isAuthenticated ? <>{children}</> : <Navigate to="/todos" replace />
}

function LegacyTodoRedirect() {
  const { id } = useParams<{ id: string }>()
  return <Navigate to={`/app/todos/${id ?? ''}`} replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Landing />} />
        
        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } />
        
        {/* Private routes */}
        <Route path="/app" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/app/todos" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="todos" element={<TodosList />} />
          <Route path="todos/:id" element={<TodoDetail />} />
        </Route>
        
        {/* Redirect old routes */}
        <Route path="/dashboard" element={<Navigate to="/app/todos" replace />} />
        <Route path="/todos" element={<Navigate to="/app/todos" replace />} />
        <Route path="/todos/:id" element={<LegacyTodoRedirect />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
