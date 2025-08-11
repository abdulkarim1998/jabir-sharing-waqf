import { useState } from 'react'
import { Button, Box, Text, Center, Paper, Grid } from '@mantine/core'
import { formImage, hands, yellowLabel } from '@/assets'
import { waqfCards } from '@/pages/type'
import WaqfCard from '@/components/cards/WaqfCard'
import { useStyles } from './WaqfOptions.styles'
import PersonalSahmForm from '../sahm/personal/PersonalSahmForm'
import GiftSahmForm from '../sahm/gift/GiftSahmForm'
import { WaqfType } from '@/interfaces'
import { useNavigate, useParams } from 'react-router-dom'
import { DonationProvider } from '@/components/form/context'

const isPersonal = (waqfType: WaqfType) =>
  waqfType === WaqfType.personal || waqfType === WaqfType.ramadan

const WaqfOptions = ({ waqfType }: { waqfType?: WaqfType }): JSX.Element => {
  const { classes } = useStyles()
  const { projectId: id } = useParams()
  const [selectedWaqfType, setSelectedWaqfType] = useState<WaqfType | null>(
    waqfType
  )
  const navigate = useNavigate()

  const handleNext = () => {
    if (selectedWaqfType) {
      navigate(`/project/id/${id}/waqfType/${selectedWaqfType}`)
    }
  }

  return (
    <>
      <Paper radius="md" withBorder className={classes.paper}>
        <div className={classes.div}>
          <Box className={classes.backgroundColorBox}>
            {waqfType ? (
              <DonationProvider waqfType={waqfType}>
                {isPersonal(waqfType) ? <PersonalSahmForm /> : <GiftSahmForm />}
              </DonationProvider>
            ) : (
              <>
                <Center className={classes.labelContainer}>
                  <img
                    src={yellowLabel}
                    alt="Yellow Label"
                    rel="preload"
                    className={classes.yellowLabel}
                  />
                  <Text className={classes.textAboveLabel}>قف سهما</Text>
                </Center>
                <Text className={classes.chooseSahmText}>
                  <span className={classes.underline}>اختر</span> نوع السهم
                </Text>

                <Center>
                  <Grid className={classes.justifyCenter}>
                    {waqfCards.map((data) => (
                      <Grid.Col key={data.id} md={5.5} lg={5.4}>
                        <WaqfCard
                          waqf={data}
                          setSelectedWaqfType={setSelectedWaqfType}
                          selectedWaqfType={selectedWaqfType}
                        />
                      </Grid.Col>
                    ))}
                  </Grid>
                </Center>
                <Box className={classes.nextBtnBox}>
                  <Button
                    variant="light"
                    size="md"
                    className={classes.nextBtn}
                    disabled={!selectedWaqfType}
                    onClick={handleNext}
                  >
                    التالي
                  </Button>
                </Box>
              </>
            )}
          </Box>

          <Box className={classes.imageWrapper}>
            <img src={formImage} alt="Form Image" rel="preload" />
            <Center className={classes.leftTextContainer}>
              <img src={hands} alt="Hands with heart" rel="preload" />
              <Text className={classes.title}>شركاء في الوقف..</Text>
              <Text className={classes.title}>شركاء في الإحسان...</Text>
            </Center>
          </Box>
        </div>
      </Paper>

      {/* Mobile Screen */}
      <div className={classes.hiddenDesktop}>
        <Box className={classes.box}>
          {waqfType ? (
            <DonationProvider waqfType={waqfType}>
              {isPersonal(waqfType) ? <PersonalSahmForm /> : <GiftSahmForm />}
            </DonationProvider>
          ) : (
            <>
              <Center className={classes.labelContainer}>
                <img
                  src={yellowLabel}
                  alt="Yellow Label"
                  rel="preload"
                  className={classes.yellowLabel}
                />
                <Text className={classes.textAboveLabel}>قف سهما</Text>
              </Center>
              <Text className={classes.chooseSahmText}>
                <span className={classes.underline}>اختر</span> نوع السهم
              </Text>

              <Center>
                <Grid className={classes.mobileGrid}>
                  {waqfCards.map((data) => (
                    <Grid.Col key={data.id} xs={4} sm={4.5} md={5}>
                      <WaqfCard
                        waqf={data}
                        setSelectedWaqfType={setSelectedWaqfType}
                        selectedWaqfType={selectedWaqfType}
                      />
                    </Grid.Col>
                  ))}
                </Grid>
              </Center>
              <Box className={classes.nextBtnBox}>
                <Button
                  variant="light"
                  size="md"
                  className={classes.nextBtn}
                  disabled={!selectedWaqfType}
                  onClick={handleNext}
                >
                  التالي
                </Button>
              </Box>
            </>
          )}
        </Box>
      </div>
    </>
  )
}

export default WaqfOptions
