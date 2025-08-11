import {
  TextInput,
  Button,
  Text,
  Group,
  Center,
  NumberInput,
} from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'
import useStyles from './Form.styles'
import useWaqfType from '@/hooks/useWaqfType'
import useDonation, { WaqfTypeMapping } from './context'
import { WaqfType } from '@/interfaces'

const DonorForm = (): JSX.Element => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const { projectId: id } = useParams()
  const { data: waqfTypes } = useWaqfType()
  const { donorForm, setActiveStep, waqfType } = useDonation()
  const arabicWaqfName = WaqfTypeMapping[waqfType].arabic

  const handleSubmit = () => {
    setActiveStep(2)
  }

  const prefix =
    waqfType === WaqfType.ramadan || waqfType === WaqfType.personal
      ? 'است'
      : 'بيانا'

  const suffix =
    waqfType === WaqfType.ramadan
      ? 'مارة وقف رمضان'
      : waqfType === WaqfType.personal
      ? 'مارة وقف شخصي'
      : 'ت المُهدي'

  return (
    <form onSubmit={donorForm.onSubmit(handleSubmit)}>
      <Center className={classes.center}>
        <div className={classes.formContainer}>
          <Text className={classes.title}>
            <span className={classes.underline}>{prefix}</span>
            {suffix}
          </Text>
          <NumberInput
            label="عدد الأسهم الوقفية"
            aria-label="Number of Sahm"
            rightSectionProps={{
              style: {
                left: 0,
                right: 'auto',
              },
            }}
            w="90%"
            min={1}
            required
            className={classes.textInput}
            {...donorForm.getInputProps('numberOfSaham')}
          />
          <Text size={12} miw="9.4rem" color="#392C45">
            قيمة كل سهم وقفي
            <span style={{ fontWeight: 'bold' }}>
              {' '}
              {
                waqfTypes?.find((type) => type.name === arabicWaqfName)
                  ?.fixedAmount
              }{' '}
              ريال عماني
            </span>
          </Text>

          <TextInput
            label="الاسم"
            type="string"
            w="90%"
            className={classes.textInput}
            aria-label="Name of The Giver"
            placeholder="الاسم"
            {...donorForm.getInputProps('donorName')}
          />

          <TextInput
            label="رقم الهاتف"
            type="number"
            w="90%"
            className={classes.textInput}
            aria-label="Phone Number of The Giver"
            placeholder="رقم الهاتف"
            {...donorForm.getInputProps('donorPhoneNumber')}
          />

          <TextInput
            label="البريد الإلكتروني"
            type="string"
            w="90%"
            className={classes.textInput}
            aria-label="Email of The Giver"
            placeholder="البريد الإلكتروني"
            {...donorForm.getInputProps('donorEmail')}
          />
        </div>

        <Group className={classes.donorBtnGroup}>
          <Button
            variant="outline"
            onClick={() => navigate(`/project/id/${id}/waqfType`)}
            className={classes.backBtn}
          >
            رجوع
          </Button>
          <Button type="submit" className={classes.nextBtn}>
            التالي
          </Button>
        </Group>
      </Center>
    </form>
  )
}

export default DonorForm
