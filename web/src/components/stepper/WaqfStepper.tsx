import { Stepper, clsx } from '@mantine/core'
import { useStyles } from './WaqfStepper.styles'
import StyledStepper from './StyledStepper'
import { WaqfType } from '@/interfaces'
import useDonation from '../form/context'

const giftSteps = [
  { label: 'نوع السهم' },
  { label: 'بيانات المُهدي' },
  { label: 'بيانات المهدى إليه' },
  { label: 'الدفع' },
]

const WaqfStepper = (): JSX.Element => {
  const { classes } = useStyles()
  const { waqfType, activeStep, setActiveStep } = useDonation()

  const waqfSteps = new Map([
    [
      WaqfType.personal,
      [
        { label: 'نوع السهم' },
        { label: 'استمارة وقف شخصي' },
        { label: 'الدفع' },
      ],
    ],
    [
      WaqfType.ramadan,
      [
        { label: 'نوع السهم' },
        { label: 'استمارة وقف رمضان' },
        { label: 'الدفع' },
      ],
    ],
    [WaqfType.gift, giftSteps],
    [WaqfType.motherGift, giftSteps],
    [WaqfType.eidGift, giftSteps],
  ])
  const steps = waqfSteps.get(waqfType) || []

  return (
    <StyledStepper
      color="#53B4AE"
      active={activeStep}
      iconSize={32}
      onStepClick={setActiveStep}
      allowNextStepsSelect={false}
      className={classes.stepper}
    >
      {steps.map((step, index) => (
        <Stepper.Step
          key={index}
          label={step.label}
          className={clsx(classes.steps, index < activeStep && 'completed')}
        />
      ))}
    </StyledStepper>
  )
}

export default WaqfStepper
