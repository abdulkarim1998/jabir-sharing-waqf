import useUser from '@/context/user'
import { Project } from '@/interfaces'
import { fetcher } from '@/lib'
import { useState } from 'react'
import useSWR from 'swr'

const useProjects = (orgId?: string) => {
  const { axiosServer: axios } = useUser()
  const { data, mutate, isLoading, isValidating, error } = useSWR(
    orgId && `organizations/projects/${orgId}`,
    (url) => fetcher<Project[]>(axios, url)
  )
  const [isSaving, setIsSaving] = useState(false)

  const deleteProject = async (projectId: string) => {
    try {
      setIsSaving(true)
      await axios.delete(
        `/organizations/projects/${projectId}?organizationId=${orgId}`
      )
      await mutate()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateProject = async (project: Project, projectID: string) => {
    const { ...projNoId } = project
    try {
      setIsSaving(true)
      await axios.put(
        `/organizations/projects/${projectID}?organizationId=${orgId}`,
        projNoId
      )
      await mutate()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const addProject = async (project: Project) => {
    try {
      setIsSaving(true)
      const { ...projNoId } = project
      await axios.post(`/organizations/projects/${orgId}`, projNoId)
      await mutate()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  return {
    data,
    mutate,
    isLoading,
    isValidating,
    error,
    deleteProject,
    updateProject,
    addProject,
    isSaving,
  }
}

export default useProjects
