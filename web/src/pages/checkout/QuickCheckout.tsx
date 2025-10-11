import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Text,
  Button,
  Input,
  Group,
  Stack,
  Image,
  Center,
  Modal,
  Box,
} from '@mantine/core'
import { useNavigate, useLocation } from 'react-router-dom'
import { Page } from '@/layouts'
import useStyles from './QuickCheckout.styles'

const QuickCheckout = () => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Get amount from location state
  const amount = location.state?.amount || '0'
  // const projectId = location.state?.projectId || ''
  // const waqfTypeId = location.state?.waqfTypeId || ''

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\//g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '')
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(value)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\//g, '')
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setExpiryDate(value)
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCvv(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (cardNumber.length !== 16 || expiryDate.length !== 4 || cvv.length !== 3) {
      return
    }

    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setShowSuccess(true)
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/')
      }, 2000)
    }, 1500)
  }

  const isFormValid = cardNumber.length === 16 && expiryDate.length === 4 && cvv.length === 3

  return (
    <Page>
      <Container size="sm" className={classes.container}>
        <Paper shadow="md" p="xl" radius="md" className={classes.paper}>
          <Stack spacing="xl">
            {/* Sohar Islamic Logo */}
            <Center>
              <Image
                src="/sohar-islamic-logo.svg"
                alt="Sohar Islamic"
                width={200}
                fit="contain"
                className={classes.logo}
              />
            </Center>

            {/* Title and Amount */}
            <Box>
              <Text className={classes.title} align="center">
                الدفع السريع
              </Text>
              <Text className={classes.amount} align="center">
                {parseFloat(amount).toLocaleString()} ر.ع
              </Text>
            </Box>

            {/* Card Form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing="md">
                {/* Card Number */}
                <div>
                  <Text className={classes.label}>رقم البطاقة</Text>
                  <Input
                    size="lg"
                    placeholder="0000 0000 0000 0000"
                    value={formatCardNumber(cardNumber)}
                    onChange={handleCardNumberChange}
                    className={classes.input}
                    dir="ltr"
                    required
                  />
                </div>

                {/* Expiry and CVV */}
                <Group grow>
                  <div>
                    <Text className={classes.label}>تاريخ الانتهاء</Text>
                    <Input
                      size="lg"
                      placeholder="MM/YY"
                      value={formatExpiryDate(expiryDate)}
                      onChange={handleExpiryChange}
                      className={classes.input}
                      dir="ltr"
                      required
                    />
                  </div>
                  <div>
                    <Text className={classes.label}>CVV</Text>
                    <Input
                      size="lg"
                      placeholder="123"
                      value={cvv}
                      onChange={handleCvvChange}
                      className={classes.input}
                      dir="ltr"
                      type="password"
                      required
                    />
                  </div>
                </Group>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  className={classes.submitBtn}
                  disabled={!isFormValid || isProcessing}
                  loading={isProcessing}
                >
                  {isProcessing ? 'جاري المعالجة...' : 'تأكيد الدفع'}
                </Button>

                {/* Cancel Button */}
                <Button
                  variant="subtle"
                  size="md"
                  fullWidth
                  className={classes.cancelBtn}
                  onClick={() => navigate(-1)}
                  disabled={isProcessing}
                >
                  إلغاء
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>

        {/* Success Modal */}
        <Modal
          opened={showSuccess}
          onClose={() => setShowSuccess(false)}
          centered
          withCloseButton={false}
          className={classes.modal}
        >
          <Stack spacing="lg" align="center" p="md">
            <Box className={classes.successIcon}>✓</Box>
            <Text className={classes.successTitle}>تمت العملية بنجاح!</Text>
            <Text className={classes.successMessage}>
              شكراً لتبرعكم الكريم
            </Text>
            <Text className={classes.successAmount}>
              {parseFloat(amount).toLocaleString()} ر.ع
            </Text>
          </Stack>
        </Modal>
      </Container>
    </Page>
  )
}

export default QuickCheckout

