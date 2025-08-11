import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'

export const axios = axiosStatic.create({ baseURL: '/api/' })

export const fetcher = async <T>(axiosServer: AxiosInstance, url: string) => {
  const { data }: AxiosResponse<T> = await axiosServer.get(url)
  return data
}
