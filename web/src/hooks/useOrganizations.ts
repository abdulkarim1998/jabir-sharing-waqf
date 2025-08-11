import useUser from '@/context/user'
import { Organization } from '@/interfaces'
import { fetcher } from '@/lib'
import { useState } from 'react'
import useSWR from 'swr'

const useOrganizations = () => {
  const { axiosServer: axios } = useUser()
  const { data, mutate, isLoading, isValidating, error } = useSWR(
    `organizations`,
    (url) => fetcher<Organization[]>(axios, url)
  )
  const [isSaving, setIsSaving] = useState(false)

  const deleteOrganization = async (orgId: string) => {
    try {
      setIsSaving(true)
      await axios.delete(`organizations/${orgId}`)
      await mutate()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateOrganization = async (org: Organization, OrgId: string) => {
    try {
      setIsSaving(true)
      const { ...orgNoId } = org
      await axios.put(`organizations/${OrgId}`, orgNoId)
      await mutate()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const addOrganization = async (org: Organization) => {
    try {
      setIsSaving(true)
      const { ...orgNoId } = org
      await axios.post(`organizations`, orgNoId)
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
    deleteOrganization,
    updateOrganization,
    addOrganization,
    isSaving,
  }
}

export default useOrganizations
