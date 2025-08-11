import { Button, Text, Group, Center, Divider, Box } from '@mantine/core'
import useStyles from '../form/Form.styles'
import usePayment from '@/hooks/usePayment'
import useWaqfType from '@/hooks/useWaqfType'
import useDonation, { WaqfTypeMapping } from '../form/context'
import { useParams } from 'react-router-dom'

const Payment = (): JSX.Element => {
  const { classes } = useStyles()
  const { setActiveStep, waqfType, donorForm, recipientForms } = useDonation()
  const { projectId } = useParams()
  const { data: waqfTypes } = useWaqfType()
  const waqfTypeId = waqfTypes?.find((type) => type.name === waqfType)?.id
  const { donate } = usePayment(projectId, waqfTypeId)
  const arabicWaqfName = WaqfTypeMapping[waqfType].arabic

  const totalAmount =
    donorForm.values.numberOfSaham *
    waqfTypes?.find((type) => type.name === arabicWaqfName)?.fixedAmount

  const prevStep = () =>
    setActiveStep((current: number) => (current > 0 ? current - 1 : current))

  const handleSubmit = () => {
    const waqfNum = WaqfTypeMapping[waqfType].number

    donate({
      projectId: projectId,
      waqfTypeId: waqfTypeId,
      waqfType: waqfNum,
      ...donorForm.values,
      giftDetails:
        waqfNum === 1
          ? []
          : recipientForms.values.recipients.map((r) => ({
              ...r,
              recipientRelationship: 1,
            })),
      amount: totalAmount.toString(),
    })
  }

  return (
    <Center className={classes.center}>
      <div className={classes.formContainer}>
        <Text className={classes.title}>
          <span
            style={{
              textDecoration: 'underline',
            }}
          >
            الدف
          </span>
          ع
        </Text>

        <Text className={classes.paymentBoxTitle}>عدد الأسهم الوقفية</Text>
        <Box aria-label="Sahm Number" className={classes.paymentTextBox}>
          {donorForm.values.numberOfSaham}
        </Box>
        <Text className={classes.paymentSubTitle}>
          قيمة كل سهم
          <span style={{ fontWeight: 'bold' }}>
            {' '}
            {
              waqfTypes?.find((type) => type.name === arabicWaqfName)
                ?.fixedAmount
            }{' '}
            ريال عماني
          </span>
        </Text>

        <Text className={classes.paymentBoxTitle}>المبلغ الإجمالي</Text>
        <Box aria-label="Total Amount" className={classes.paymentTextBox}>
          {`${totalAmount} ريال عماني`}
        </Box>

        <Divider my="1.5rem" color="#A7A9AC" className={classes.divider} />
        <Text w="90%" size={14}>
          الدفع بواسطة بطاقات (الخصم المباشر) الصادرة من البنوك المحلية أو
          الدولية التي لديها فروع في سلطنة عمان (Debit Card Only).
        </Text>
      </div>

      <Group className={classes.donorBtnGroup}>
        <Button
          variant="outline"
          onClick={prevStep}
          className={classes.backBtn}
        >
          رجوع
        </Button>
        <Button
          type="submit"
          onClick={() => handleSubmit()}
          className={classes.nextBtn}
        >
          تنفيذ الوقف
        </Button>
      </Group>
    </Center>
  )
}

export default Payment
