import React, { createContext, useContext, PropsWithChildren } from 'react'
import { Project, Organization } from '@/interfaces'

interface WaqfDataContextValue {
  project: Project | null
  organization: Organization | null
}

const WaqfDataContext = createContext<WaqfDataContextValue | undefined>(undefined)

export const WaqfDataProvider = ({ 
  children, 
  project, 
  organization 
}: PropsWithChildren<{
  project: Project | null
  organization: Organization | null
}>) => {
  return (
    <WaqfDataContext.Provider value={{ project, organization }}>
      {children}
    </WaqfDataContext.Provider>
  )
}

export const useWaqfDataContext = (): WaqfDataContextValue => {
  const context = useContext(WaqfDataContext)
  if (context === undefined) {
    throw new Error('useWaqfDataContext must be used within a WaqfDataProvider')
  }
  return context
}

export default WaqfDataContext
