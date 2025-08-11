import { AspectRatio, Box, Divider, Text } from '@mantine/core'
import waqfVid from '@/assets/Waqf.mov'
import waqflogoWhite from '@/assets/svg/waqflogoWhite.svg'
import vector from '@/assets/svg/vector.svg'
import { useStyles } from './WaqfBanner.styles'

const WaqfBanner = (): JSX.Element => {
  const { classes } = useStyles()

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.videoContainer}>
        <AspectRatio ratio={16 / 9} mah="90vh">
          <video
            rel="preload"
            autoPlay
            muted
            playsInline
            loop
            className={classes.video}
          >
            <source src={waqfVid} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <Box>
            <img
              src={vector}
              alt="Vector"
              rel="preload"
              className={classes.vector}
            />
          </Box>
        </AspectRatio>
      </Box>
      <Box className={classes.textContainer}>
        <img src={waqflogoWhite} alt="Waqf Logo" className={classes.logo} />
        <Text className={classes.title}>البوابة العمانية للشراكة الوقفية</Text>

        <Divider color="#E8E8E8" className={classes.divider} />

        <Text className={classes.subTitle}>
          شركاء في الوقف .. شركاء في الإحسان
        </Text>
      </Box>
    </Box>
  )
}

export default WaqfBanner
