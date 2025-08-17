import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'

export const axios = axiosStatic.create({ baseURL: '/api/' })

// API Response wrapper interface
interface APIResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export const fetcher = async <T>(axiosServer: AxiosInstance, url: string) => {
  const { data }: AxiosResponse<APIResponse<T>> = await axiosServer.get(url)
  
  if (!data.success) {
    throw new Error(data.error || 'API request failed')
  }
  
  return data.data as T
}
