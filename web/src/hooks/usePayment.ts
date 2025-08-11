import useUser from '@/context/user'
import { DonationContribution } from '@/interfaces'
import { useState } from 'react'

const usePayment = (projectId?: string, waqfTypeId?: string) => {
  const { axiosServer: axios } = useUser()
  const [isSaving, setIsSaving] = useState(false)

  const donate = async (pay: DonationContribution) => {
    try {
      console.log('pay', pay)
      setIsSaving(true)
      const response = await axios.post(
        `waqfType/waqfForm/${projectId}/${waqfTypeId}`,
        pay
      )

      window.location.replace(response.data.paymentUrl)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  return {
    donate,
    isSaving,
  }
}

export default usePayment
