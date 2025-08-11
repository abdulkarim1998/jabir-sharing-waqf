import { Donor, Recipient, WaqfType } from '@/interfaces'
import { donorSchema, recipientsSchema } from '@/pages/sahm/validation'
import { UseFormReturnType, useForm, zodResolver } from '@mantine/form'
import React, { PropsWithChildren, useState } from 'react'

export const WaqfTypeMapping = {
  [WaqfType.ramadan]: {
    number: 1,
    arabic: 'وقف رمضان',
  },
  [WaqfType.personal]: {
    number: 1,
    arabic: 'وقف شخصي',
  },
  [WaqfType.gift]: {
    number: 2,
    arabic: 'وقف الهدية',
  },
  [WaqfType.motherGift]: {
    number: 2,
    arabic: 'هدية الأم',
  },
  [WaqfType.eidGift]: {
    number: 2,
    arabic: 'هدية العيد',
  },
}

export const initialRecipient = (waqfType: WaqfType): Recipient => {
  return {
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    messageText:
      waqfType === WaqfType.motherGift
        ? 'أمي الغالية.. أهديك سهما وقفيا دائم الخير  والعطاء، وعسى أن أوفيك بعض حقك علي، حفظك الله ورعاك'
        : '',
  }
}

interface DonationContextValue {
  waqfType: WaqfType
  donorForm: UseFormReturnType<Donor>
  recipientForms: UseFormReturnType<{ recipients: Recipient[] }>
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
}

const DonationContext = React.createContext<DonationContextValue>({
  waqfType: undefined,
  donorForm: undefined,
  recipientForms: undefined,
  activeStep: 1,
  setActiveStep: undefined,
})

export const DonationProvider = ({
  waqfType,
  children,
}: PropsWithChildren<Record<never, never>> & {
  waqfType: WaqfType
}): JSX.Element => {
  const [activeStep, setActiveStep] = useState(1)

  const recipientForms = useForm<{ recipients: Recipient[] }>({
    validate: zodResolver(recipientsSchema),
    initialValues: {
      recipients: [initialRecipient(waqfType)],
    },
  })

  const donorForm = useForm<Donor>({
    validate: zodResolver(donorSchema),

    initialValues: {
      donorName: '',
      donorPhoneNumber: '',
      donorEmail: '',
      numberOfSaham: 1,
    },
  })

  return (
    <DonationContext.Provider
      value={{
        waqfType,
        donorForm,
        recipientForms,
        activeStep,
        setActiveStep,
      }}
    >
      {children}
    </DonationContext.Provider>
  )
}

const useDonation = (): DonationContextValue =>
  React.useContext(DonationContext)

export default useDonation
