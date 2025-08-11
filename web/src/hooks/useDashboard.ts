import useUser from '@/context/user'
import {
  DashboardCard,
  Donation,
  DonationsByWaqfType,
  MonthlyDonors,
} from '@/interfaces'
import { fetcher } from '@/lib'
import { useDashboard } from '@/pages/dashboard/context'
import useSWR from 'swr'

interface DashboardHook {
  cardData: DashboardCard[]
  donation: Donation[]
  monthlyDonors: MonthlyDonors[]
  donationsByWaqfType: DonationsByWaqfType[]
  error: boolean
}

const useDashboardData = (): DashboardHook => {
  const { axiosServer: axios } = useUser()
  const { value } = useDashboard()

  const from = value.from && new Date(value.from).toISOString().split('T')[0]
  const to = value.to && new Date(value.to).toISOString().split('T')[0]

  const { data: cardData } = useSWR(
    `/Dashbord?startDate=${from}&endDate=${to}`,
    (url) => fetcher<DashboardCard[]>(axios, url)
  )

  const { data: donation } = useSWR(
    `/Dashbord/donation?startDate=${from}&endDate=${to}`,
    (url) => fetcher<Donation[]>(axios, url)
  )

  const { data: monthlyDonors } = useSWR(
    `/Dashbord/monthly-donors?startDate=${from}&endDate=${to}`,
    (url) => fetcher<MonthlyDonors[]>(axios, url)
  )

  const { data: donationsByWaqfType } = useSWR(
    `/Dashbord/donations-by-waqftype?startDate=${from}&endDate=${to}`,
    (url) => fetcher<DonationsByWaqfType[]>(axios, url)
  )

  const error = !cardData && !donation && !monthlyDonors && !donationsByWaqfType

  return {
    cardData,
    donation,
    monthlyDonors,
    donationsByWaqfType,
    error,
  }
}

export default useDashboardData
