import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Helper functions for localStorage persistence
const loadAuthState = (): Partial<AuthState> => {
  try {
    const serializedState = localStorage.getItem('authState')
    if (serializedState === null) {
      return {}
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return {}
  }
}

const saveAuthState = (state: AuthState) => {
  try {
    const serializedState = JSON.stringify({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
    })
    localStorage.setItem('authState', serializedState)
  } catch (err) {
    // Ignore write errors
  }
}

interface User {
  id: string
  name: string
  email: string
  isEmailVerified: boolean
  createdAt: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  skipAuthCheck: boolean // Flag to skip auth check after login
}

const persistedState = loadAuthState()

const initialState: AuthState = {
  isAuthenticated: persistedState.isAuthenticated || false,
  user: persistedState.user || null,
  isLoading: false,
  skipAuthCheck: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.user = action.payload
      state.isLoading = false
      state.skipAuthCheck = true // Skip auth check after successful login
      saveAuthState(state)
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.isLoading = false
      saveAuthState(state)
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.isLoading = false
      state.skipAuthCheck = false
      localStorage.removeItem('authState') // Clear persisted state on logout
    },
    clearSkipAuthCheck: (state) => {
      state.skipAuthCheck = false
    },
  },
})

export const { setLoading, loginSuccess, logoutSuccess, setUser, clearSkipAuthCheck } = authSlice.actions
export default authSlice.reducer
