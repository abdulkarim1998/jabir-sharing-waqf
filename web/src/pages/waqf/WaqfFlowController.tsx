import {
  Container,
  Grid,
  BackgroundImage,
  Button,
  Box,
  Center,
  Text,
  Loader,
} from '@mantine/core'
import WaqfOptions from './WaqfOptions'
import { formBgImage, formImage, hands } from '@/assets'
import { IconArrowNarrowLeft } from '@tabler/icons-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStyles } from './WaqfFlowController.styles'
import { WaqfType } from '@/interfaces'
import useWaqfData from '@/hooks/useWaqfData'

const WaqfFlowController = ({
  waqfType,
}: {
  waqfType?: WaqfType
}): JSX.Element => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const { projectId } = useParams()
  
  // Fetch project and organization data concurrently
  const { project, organization, isLoading, error } = useWaqfData(projectId)

  // Show loading state
  if (isLoading) {
    return (
      <Box className={classes.bgImageWrapper}>
        <BackgroundImage
          src={formBgImage}
          rel="preload"
          className={classes.hiddenMobile}
        >
          <Box className={classes.gradientOverlay} />
          <Box className={classes.contentWrapper}>
            <Container className={classes.gridContainer}>
              <Center style={{ height: '50vh' }}>
                <Loader size="lg" />
              </Center>
            </Container>
          </Box>
        </BackgroundImage>
        <div className={classes.hiddenDesktop}>
          <Center style={{ height: '50vh' }}>
            <Loader size="lg" />
          </Center>
        </div>
      </Box>
    )
  }

  // Show error state
  if (error) {
    return (
      <Box className={classes.bgImageWrapper}>
        <BackgroundImage
          src={formBgImage}
          rel="preload"
          className={classes.hiddenMobile}
        >
          <Box className={classes.gradientOverlay} />
          <Box className={classes.contentWrapper}>
            <Container className={classes.gridContainer}>
              <Center style={{ height: '50vh' }}>
                <Text color="red">خطأ في تحميل البيانات</Text>
              </Center>
            </Container>
          </Box>
        </BackgroundImage>
        <div className={classes.hiddenDesktop}>
          <Center style={{ height: '50vh' }}>
            <Text color="red">خطأ في تحميل البيانات</Text>
          </Center>
        </div>
      </Box>
    )
  }

  return (
    <Box className={classes.bgImageWrapper}>
      {/* Large Screen */}
      <BackgroundImage
        src={formBgImage}
        rel="preload"
        className={classes.hiddenMobile}
      >
        <Box className={classes.gradientOverlay} />

        <Box className={classes.backBtnBox}>
          <Button
            variant="subtle"
            className={classes.backBtnContainer}
            onClick={() => navigate('/')}
          >
            <span className={classes.backBtnText}>رجوع</span>
            <IconArrowNarrowLeft className={classes.arrowIcon} />
          </Button>
        </Box>
        <Box className={classes.contentWrapper}>
          <Container className={classes.gridContainer}>
            <Grid gutter="lg" className={classes.justifyCenter}>
              <WaqfOptions waqfType={waqfType} project={project} organization={organization} />
            </Grid>
          </Container>
        </Box>
      </BackgroundImage>

      {/* Small Screen */}
      <div className={classes.hiddenDesktop}>
        <Box className={classes.imageWrapper}>
          <Box className={classes.backBtnBox}>
            <Button
              variant="subtle"
              className={classes.backBtnContainer}
              onClick={() => navigate('/')}
            >
              <span className={classes.backBtnText}>رجوع</span>
              <IconArrowNarrowLeft className={classes.arrowIcon} />
            </Button>
          </Box>
          <img
            src={formImage}
            alt="Form Image"
            rel="preload"
            className={classes.bannerImage}
          />
          <Center className={classes.textContainer}>
            <img src={hands} alt="Hands with heart" rel="preload" />
            <Text mt={12} className={classes.title}>
              شركاء في الوقف..
            </Text>
            <Text className={classes.title}>شركاء في الإحسان...</Text>
          </Center>
        </Box>

        <Box className={classes.contentWrapper}>
          <Container className={classes.optionsContainer}>
            <Grid gutter="lg" className={classes.justifyCenter}>
              <WaqfOptions waqfType={waqfType} project={project} organization={organization} />
            </Grid>
          </Container>
        </Box>
      </div>
    </Box>
  )
}

export default WaqfFlowController
