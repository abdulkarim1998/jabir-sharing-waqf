import useUser from '@/context/user'
import { Project, Organization } from '@/interfaces'
import { fetcher } from '@/lib'
import useSWR from 'swr'

interface APIResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

interface WaqfData {
  project: Project | null
  organization: Organization | null
  isLoading: boolean
  error: any
}

const useWaqfData = (projectId?: string): WaqfData => {
  const { axiosServer: axios } = useUser()
  
  // First, get the project data
  const { data: projectResponse, error: projectError, isLoading: projectLoading } = useSWR(
    projectId ? `projects/${projectId}` : null,
    (url: string) => fetcher<APIResponse<Project>>(axios, url)
  )

  // Extract organization ID from project data
  const organizationId = projectResponse?.success && projectResponse.data 
    ? (projectResponse.data as any).organization_id || (projectResponse.data as any).organizationId 
    : null

  // Then get the organization data using the extracted organization ID
  const { data: organizationResponse, error: organizationError, isLoading: organizationLoading } = useSWR(
    organizationId ? `organizations/${organizationId}` : null,
    (url: string) => fetcher<APIResponse<Organization>>(axios, url)
  )

  const isLoading = projectLoading || organizationLoading
  const error = projectError || organizationError

  const project = projectResponse?.success ? projectResponse.data : null
  const organization = organizationResponse?.success ? organizationResponse.data : null

  return {
    project,
    organization,
    isLoading,
    error,
  }
}

export default useWaqfData
