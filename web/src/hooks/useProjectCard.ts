import useUser from '@/context/user'
import { ProjectCardData } from '@/interfaces'
import { fetcher } from '@/lib'
import useSWR from 'swr'

const useProjectCard = (orgId?: string) => {
  const { axiosServer: axios } = useUser()
  const { data, mutate, isLoading, isValidating, error } = useSWR(
    orgId ? `organizations/projects/${orgId}` : `organizations/projects`,
    (url: string) => fetcher<ProjectCardData[]>(axios, url)
  )

  return {
    data,
    mutate,
    isLoading,
    isValidating,
    error,
  }
}

export default useProjectCard
