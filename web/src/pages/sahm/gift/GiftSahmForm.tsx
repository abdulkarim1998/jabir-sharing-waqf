import { Center } from '@mantine/core'
import WaqfStepper from '@/components/stepper/WaqfStepper'
import Payment from '@/components/payment/Payment'
import DonorForm from '@/components/form/DonorForm'
import RecipientForm from '@/components/form/RecipientForm'
import useDonation from '@/components/form/context'

const GiftSahmForm = (): JSX.Element => {
  const { activeStep } = useDonation()

  return (
    <>
      <Center>
        <WaqfStepper />
      </Center>
      {activeStep === 1 && <DonorForm />}
      {activeStep === 2 && <RecipientForm />}
      {activeStep === 3 && <Payment />}
    </>
  )
}

export default GiftSahmForm
