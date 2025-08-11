import useUser from '@/context/user'
import useSWR from 'swr'
import { fetcher } from '@/lib'

interface UseOrganizationProps<T> {
  data: T
  error: T
}

const useOrganizationCard = <Type>(
  apiEndpoint: string
): UseOrganizationProps<Type> => {
  const { axiosServer: axios } = useUser()

  const { data, error } = useSWR(apiEndpoint, (url: string) =>
    fetcher<Type>(axios, url)
  )

  return { data, error }
}

export default useOrganizationCard
