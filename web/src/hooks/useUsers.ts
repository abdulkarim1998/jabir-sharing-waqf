import useUser from '@/context/user'
import { User } from '@/interfaces'
import { fetcher } from '@/lib'
import { useState } from 'react'
import useSWR, { KeyedMutator } from 'swr'

interface UsersHook {
  data: User[]
  orgaUser: User[]
  mutate: KeyedMutator<User[]>
  isLoading: boolean
  isValidating: boolean
  error: boolean
  deleteUser: (userId: string) => Promise<void>
  updateUser: (user: User) => Promise<void>
  addUser: (user: User) => Promise<void>
  addUserToOrg: (userId: string) => Promise<void>
  deleteUserFromOrg: (userId: string) => Promise<void>
  isSaving: boolean
}

const useUsers = (orgId?: string): UsersHook => {
  const { axiosServer: axios } = useUser()
  const { data, mutate, isLoading, isValidating, error } = useSWR(
    `users`,
    (url) => fetcher<User[]>(axios, url)
  )
  const [isSaving, setIsSaving] = useState(false)

  const deleteUser = async (userId: string) => {
    try {
      setIsSaving(true)
      await axios.delete(`users/${userId}`)
      await mutate()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateUser = async (user: User) => {
    try {
      setIsSaving(true)
      await axios.put(`/users/${user.id}`, user)
      await mutate()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const addUser = async (user: User) => {
    try {
      setIsSaving(true)
      await axios.post(`/users`, {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
      })
      await mutate()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const { data: orgaUser, mutate: mutateOrgUser } = useSWR(
    orgId && `organizations/${orgId}/users`,
    (url) => fetcher<User[]>(axios, url)
  )

  const addUserToOrg = async (userId: string) => {
    try {
      setIsSaving(true)
      await axios.post(`/Organizations/${orgId}/${userId}`)
      await mutateOrgUser()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const deleteUserFromOrg = async (userId: string) => {
    try {
      setIsSaving(true)
      await axios.delete(`organizations/${orgId}/${userId}`)
      await mutateOrgUser()
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
    deleteUser,
    updateUser,
    addUser,
    orgaUser,
    addUserToOrg,
    deleteUserFromOrg,
    isSaving,
  }
}

export default useUsers
