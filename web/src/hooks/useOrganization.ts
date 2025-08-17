import useUser from '@/context/user'
import { Organization } from '@/interfaces'
import { fetcher } from '@/lib'
import useSWR from 'swr'

const useOrganization = (organizationId?: string) => {
  const { axiosServer: axios } = useUser()
  const { data, mutate, isLoading, isValidating, error } = useSWR(
    organizationId ? `organizations/${organizationId}` : null,
    (url: string) => fetcher<Organization>(axios, url)
  )

  return {
    data,
    mutate,
    isLoading,
    isValidating,
    error,
  }
}

export default useOrganization
