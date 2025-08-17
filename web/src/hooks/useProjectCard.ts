import { ProjectCardData } from '@/interfaces'
import { fetcher, axios } from '@/lib'
import useSWR from 'swr'

const useProjectCard = (orgId?: string) => {
  const { data, mutate, isLoading, isValidating, error } = useSWR(
    orgId ? `projects/organization/${orgId}` : `projects`,
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
