import { Stepper, StepperProps } from '@mantine/core'

const StyledStepper = (props: StepperProps): JSX.Element => {
  return (
    <Stepper
      styles={{
        stepIcon: {
          borderWidth: 2,
        },

        separator: {
          marginLeft: -2,
          marginRight: -2,
          height: 0,
        },
        stepLabel: { marginTop: '1rem' },
      }}
      {...props}
    />
  )
}

export default StyledStepper
