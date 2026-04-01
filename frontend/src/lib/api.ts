import axios from 'axios'
import { API_BASE_URL } from './constants'

const api = axios.create({ baseURL: API_BASE_URL })

// Attach Clerk JWT to every request automatically
api.interceptors.request.use(async (config) => {
  try {
    const token = await window.Clerk?.session?.getToken({ skipCache: true })
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {
    // Silent fail — public routes don't need auth
  }
  return config
})

export default api
