import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
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
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.isLoading = false
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.isLoading = false
    },
  },
})

export const { setLoading, loginSuccess, logoutSuccess, setUser } = authSlice.actions
export default authSlice.reducer
