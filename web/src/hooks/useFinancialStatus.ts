import useUser from '@/context/user'
import { FinancialStatus } from '@/interfaces'
import { fetcher } from '@/lib'
import useSWR from 'swr'

const useFinancialStatus = (projectId?: string) => {
  const { axiosServer: axios } = useUser()
  const { data, isLoading, error } = useSWR(
    `organizations/projects/${projectId}/financialStatus`,
    (url: string) => fetcher<FinancialStatus>(axios, url)
  )

  return {
    data,
    isLoading,
    error,
  }
}

export default useFinancialStatus
