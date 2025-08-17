import useUser from '@/context/user'
import { Project } from '@/interfaces'
import { fetcher } from '@/lib'
import { useState } from 'react'
import useSWR from 'swr'

const useProjects = (orgId?: string) => {
  const { axiosServer: axios } = useUser()
  const { data, mutate, isLoading, isValidating, error } = useSWR(
    orgId ? `projects/organization/${orgId}` : null,
    (url) => fetcher<Project[]>(axios, url)
  )
  const [isSaving, setIsSaving] = useState(false)

  const deleteProject = async (projectId: string) => {
    try {
      setIsSaving(true)
      await axios.delete(`/projects/${projectId}`)
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
      await axios.put(`/projects/${projectID}`, projNoId)
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
      // Include organizationId in the project data for creation
      const projectWithOrgId = { ...projNoId, organizationId: orgId }
      await axios.post(`/projects`, projectWithOrgId)
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
