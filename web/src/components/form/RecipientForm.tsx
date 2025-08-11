import { Button, Text, Group, Center, Pagination } from '@mantine/core'
import useStyles from './Form.styles'
import { WaqfType } from '@/interfaces'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import SingleRecipientForm from './SingleRecipientForm'
import useDonation, { initialRecipient } from './context'

const RecipientForm = (): JSX.Element => {
  const { classes } = useStyles()

  const [currentStep, setCurrentStep] = useState(1)
  const { recipientForms, waqfType, setActiveStep } = useDonation()

  const addGift = () => {
    recipientForms.insertListItem('recipients', initialRecipient(waqfType))
    setCurrentStep((current) => current + 1)
  }

  const handleSubmit = () => {
    setActiveStep(3)
  }

  return (
    <form onSubmit={recipientForms.onSubmit(handleSubmit)}>
      <Center className={classes.center}>
        <div className={classes.formContainer}>
          <Group position="apart" mr="3rem">
            <Text className={classes.title}>
              <span style={{ textDecoration: 'underline' }}>بيانا</span>ت المهدى
              إليه (اختياري)
            </Text>
            {waqfType === WaqfType.gift || waqfType === WaqfType.eidGift ? (
              <Button
                rightIcon={<IconPlus size="0.8rem" />}
                w={105}
                h={35}
                component="a"
                target="_blank"
                rel="noopener noreferrer"
                onClick={addGift}
                variant="outline"
                className={classes.addGiftBtn}
                styles={(theme) => ({
                  root: {
                    color: '#392C45',
                    fontSize: 14,
                    borderRadius: 8,
                    justifyContent: 'flex-start',
                    border: '0.50px black solid',
                    '&:not([data-disabled])': theme.fn.hover({
                      backgroundColor: theme.fn.darken('#F4F4F4', 0.05),
                    }),
                  },
                  rightIcon: {
                    marginLeft: 0,
                  },
                })}
              >
                إضافة هدية
              </Button>
            ) : null}
          </Group>
          {recipientForms.values.recipients.map((recipient, index) => (
            <SingleRecipientForm
              key={index}
              index={index}
              currentStep={currentStep}
              recipient={recipient}
            />
          ))}
          <Pagination
            total={recipientForms.values.recipients.length}
            color="cyan"
            size="xs"
            radius="xs"
            value={currentStep}
            onChange={(newStep) => {
              setCurrentStep(newStep)
            }}
          />
        </div>
      </Center>

      <Group
        className={`${classes.btnGroup} ${
          waqfType === WaqfType.gift || waqfType === WaqfType.eidGift
            ? classes.mulRecipientBtnGroup
            : classes.recipientBtnGroup
        }`}
      >
        <Button
          variant="outline"
          className={classes.backBtn}
          onClick={() => setActiveStep(1)}
        >
          رجوع
        </Button>
        <Button type="submit" className={classes.nextBtn}>
          التالي
        </Button>
      </Group>
    </form>
  )
}

export default RecipientForm
