import { createContext, useContext, useReducer, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    case 'LOGOUT':
      localStorage.removeItem('token')
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      }
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      }
    case 'LOAD_USER_FAILURE':
      localStorage.removeItem('token')
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const response = await api.get('/auth/me')
          dispatch({ type: 'LOAD_USER_SUCCESS', payload: response.data.data })
        } catch (error) {
          dispatch({ type: 'LOAD_USER_FAILURE' })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }
    
    loadUser()
  }, [state.token])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data })
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data })
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      }
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (userData) => {
    dispatch({ type: 'LOAD_USER_SUCCESS', payload: userData })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
