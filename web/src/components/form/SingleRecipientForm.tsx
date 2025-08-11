import { TextInput, Text, Textarea } from '@mantine/core'
import useStyles from './Form.styles'
import { Recipient } from '@/interfaces'
import useDonation from './context'
import { useState } from 'react'

interface SingleRecipientFormProps {
  index: number
  currentStep: number
  recipient: Recipient
}

const SingleRecipientForm = ({
  index,
  currentStep,
}: SingleRecipientFormProps): JSX.Element => {
  const { classes } = useStyles()
  const { recipientForms } = useDonation()
  const max = 100
  const [charsRemaining, setCharsRemaining] = useState(max)

  const handleChange = (e) => {
    setCharsRemaining(max - e.target.value.length)
    if (charsRemaining <= 1) {
      return
    }
    recipientForms.setFieldValue(
      `recipients.${index}.messageText`,
      e.target.value
    )
  }

  return (
    <div
      style={{
        width: '100%',
        transform: `translateX(${(index - currentStep + 1) * 100}%)`,
        transition: 'transform 0.3s ease',
        display: index === currentStep - 1 ? 'block' : 'none',
      }}
    >
      <TextInput
        label="الاسم"
        type="string"
        w="90%"
        className={classes.textInput}
        aria-label="Name of The Recipient"
        placeholder="الاسم"
        {...recipientForms?.getInputProps(`recipients.${index}.recipientName`)}
      />
      <TextInput
        label="رقم الهاتف"
        type="number"
        w="90%"
        className={classes.textInput}
        aria-label="Phone Number of The Recipient"
        placeholder="رقم الهاتف"
        {...recipientForms?.getInputProps(`recipients.${index}.recipientPhone`)}
      />
      <TextInput
        label="البريد الإلكتروني"
        type="string"
        w="90%"
        className={classes.textInput}
        aria-label="Email of The Recipient"
        placeholder="البريد الإلكتروني"
        {...recipientForms?.getInputProps(
          `recipients.${index}.recipientAddress`
        )}
      />
      <Textarea
        label="الرسالة النصية (يمكنك تغيير النص)"
        w="90%"
        className={classes.textInput}
        aria-label="Message"
        placeholder="نص الرسالة النصية.."
        {...recipientForms?.getInputProps(`recipients.${index}.messageText`)}
        onChange={handleChange}
      />
      <Text align="right" className={classes.remainingChars}>
        عدد الحروف المتبقية {charsRemaining}/{max}
      </Text>
    </div>
  )
}

export default SingleRecipientForm
