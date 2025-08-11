import { Container, Box, Modal, Space } from '@mantine/core'
import Page from '@/layouts/Page'
import WaqfBanner from '@/components/banner/WaqfBanner'
import WaqfTabs from '@/components/tab/Tabs'
import { useStyles } from './Organization.styles'
import { useEffect, useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useLocation } from 'react-router-dom'

const Organization = (): JSX.Element => {
  const { classes } = useStyles()
  const [openedSuccess, setOpenedSuccess] = useState(false)
  const [openedFail, setOpenedFail] = useState(false)
  const { search } = useLocation()

  useEffect(() => {
    const urlParams = new URLSearchParams(search)
    const paymentStatus = urlParams.get('payment')

    if (paymentStatus === 'success') {
      setOpenedSuccess(true)
    } else if (paymentStatus === 'fail') {
      setOpenedFail(true)
    }
  }, [search])

  const closeSuccessModal = () => {
    setOpenedSuccess(false)
  }

  const closeFailModal = () => {
    setOpenedFail(false)
  }

  return (
    <Page>
      <Container className={classes.bannerContainer}>
        {
          // TODO: refactor the modals with the new design once it's ready
        }
        <Modal.Root opened={openedFail} onClose={closeFailModal}>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header>
              <Modal.Title
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#BC9B6A',
                  fontWeight: 'bold',
                  gap: 10,
                }}
              >
                <IconAlertTriangle size="1.5rem" />
                عذراً، يبدو أن هناك مشكلة!
              </Modal.Title>

              <Modal.CloseButton />
            </Modal.Header>
            <Modal.Body style={{ color: '#BC9B6A' }}>حاول مرة أخرى</Modal.Body>
          </Modal.Content>
        </Modal.Root>
        <Modal.Root opened={openedSuccess} onClose={closeSuccessModal}>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header>
              <Modal.Title style={{ color: '#53B4AE', fontWeight: 'bold' }}>
                إكتمال الوقف
              </Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>
            <Modal.Body style={{ color: '#255274' }}>
              هنيئا لك تمامك للوقف ودخولك في فريق المنفقين الذين قال اللَّه
              عنهم:
              <Space h="xs" />
              (مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ
              كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ
              مِّائَةُ حَبَّةٍ ۗ وَاللَّهُ يُضَاعِفُ لِمَن يَشَاءُ ۗ وَاللَّهُ
              وَاسِعٌ عَلِيمٌ)
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
        <WaqfBanner />
      </Container>
      <Container maw={1536} className={classes.tabsContainer}>
        <Box>
          <WaqfTabs />
        </Box>
      </Container>
    </Page>
  )
}

export default Organization
