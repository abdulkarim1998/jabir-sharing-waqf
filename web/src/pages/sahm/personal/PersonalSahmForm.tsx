import { Center } from '@mantine/core'
import WaqfStepper from '@/components/stepper/WaqfStepper'
import Payment from '@/components/payment/Payment'
import useDonation from '@/components/form/context'
import DonorForm from '@/components/form/DonorForm'

const PersonalSahmForm = (): JSX.Element => {
  const { activeStep } = useDonation()

  return (
    <>
      <Center>
        <WaqfStepper />
      </Center>
      {activeStep === 1 && <DonorForm />}
      {activeStep === 2 && <Payment />}
    </>
  )
}

export default PersonalSahmForm
