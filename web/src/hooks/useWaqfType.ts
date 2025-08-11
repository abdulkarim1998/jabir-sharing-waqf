import useUser from '@/context/user'
import { WaqfTypes } from '@/interfaces'
import { fetcher } from '@/lib'
import useSWR from 'swr'

const useWaqfType = () => {
  const { axiosServer: axios } = useUser()
  const { data, isLoading, error } = useSWR(`waqfType`, (url: string) =>
    fetcher<WaqfTypes[]>(axios, url)
  )

  return {
    data,
    isLoading,
    error,
  }
}

export default useWaqfType
