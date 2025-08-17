import useUser from '@/context/user'
import { Project } from '@/interfaces'
import { fetcher } from '@/lib'
import useSWR from 'swr'

const useProject = (projectId?: string) => {
  const { axiosServer: axios } = useUser()
  const { data, mutate, isLoading, isValidating, error } = useSWR(
    projectId ? `projects/${projectId}` : null,
    (url: string) => fetcher<Project>(axios, url)
  )

  return {
    data,
    mutate,
    isLoading,
    isValidating,
    error,
  }
}

export default useProject
