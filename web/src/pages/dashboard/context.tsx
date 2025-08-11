import React, { ReactNode, useContext, useState } from 'react'

interface DataInput {
  from: Date
  to: Date
}

interface DashboardContextValue {
  value: DataInput | null
  setValue: React.Dispatch<React.SetStateAction<DataInput | null>>
}

const currentDate = new Date()
const toDate = new Date()
toDate.setDate(currentDate.getDate() + 30)

const DashboardContext = React.createContext<DashboardContextValue>({
  value: undefined,
  setValue: undefined,
})

export interface ProviderProps {
  children: ReactNode
}

const DashboardProvider = ({ children }: ProviderProps) => {
  const [value, setValue] = useState<DataInput>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
  })
  return (
    <DashboardContext.Provider
      value={{
        value,
        setValue,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  return useContext(DashboardContext)
}

export default DashboardProvider
