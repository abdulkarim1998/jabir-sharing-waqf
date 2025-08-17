import useSWR from 'swr'
import { fetcher, axios } from '@/lib'

interface UseOrganizationProps<T> {
  data: T
  error: T
}

const useOrganizationCard = <Type>(
  apiEndpoint: string
): UseOrganizationProps<Type> => {

  const { data, error } = useSWR(apiEndpoint, (url: string) =>
    fetcher<Type>(axios, url)
  )

  return { data, error }
}

export default useOrganizationCard
