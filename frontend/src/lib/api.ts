import axios from 'axios'
import { API_BASE_URL } from './constants'

const api = axios.create({ baseURL: API_BASE_URL })

// Attach Clerk JWT to every request automatically
api.interceptors.request.use(async (config) => {
  const token = await window.Clerk?.session?.getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
