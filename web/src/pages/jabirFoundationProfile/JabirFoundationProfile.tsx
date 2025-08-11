import useOrganizations from '@/hooks/useOrganizations'
import FoundationProfile from '../foundationProfile/FoundationProfile'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const JabirFoundationProfile = (): JSX.Element => {
  const { data, isLoading, error } = useOrganizations()
  const navigate = useNavigate()

  // Jabir Foundation must have جابر in its name for us to distinguish it from the rest
  const jf = useMemo(
    () => data?.find((organizations) => organizations.name.includes('جابر')),
    [data]
  )

  if ((!jf && !isLoading) || error) {
    navigate('/', { replace: true })
  }

  return <FoundationProfile foundationId={jf?.id} />
}

export default JabirFoundationProfile
