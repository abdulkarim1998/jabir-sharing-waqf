import { FoundationProfileProps } from '@/interfaces'
import {
  Text,
  Card,
  Group,
  BackgroundImage,
  Box,
  Progress,
  Button,
} from '@mantine/core'
import { IconArrowNarrowLeft } from '@tabler/icons-react'
import OrganizationProfile from '@/assets/svg/OrganizationProfile.svg'
import user from '@/assets/svg/user.svg'
import heart from '@/assets/svg/heart.svg'
import { useNavigate } from 'react-router-dom'
import { useStyles } from './FoundationInfo.styles'
import LargeScreenView from './LargeScreen'
import SmallScreenView from './SmallScreen'
import useOrganizationCard from '@/hooks/useOrganizationCard'

const FoundationInfo = ({
  data,
  isSelected,
  donors,
  totalValue,
  numOfProjects,
}: FoundationProfileProps): JSX.Element => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()
  const { data: donations } = useOrganizationCard<number>(
    `organizations/donations/${data.id}/total`
  )
  const percentagePaid = (donations / totalValue) * 100

  return (
    <BackgroundImage
      src={OrganizationProfile}
      rel="preload"
      className={classes.background}
    >
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

      <Group position="apart" className={classes.cardsGroup}>
        <Card shadow="sm" className={cx(classes.card, classes.topMobileCard)}>
          {isSelected && (
            <>
              <LargeScreenView data={data} />
              <SmallScreenView data={data} />
            </>
          )}
        </Card>

        <Card
          shadow="sm"
          w="27rem"
          className={cx(classes.card, classes.bottomMobileCard)}
        >
          {isSelected && (
            <>
              <Group position="apart" className={classes.statsGroup}>
                <Group spacing="xs">
                  <img src={user} rel="preload" alt="Person" />
                  <Text color="#F4F4F4" size={14} pt={6}>
                    {donors !== 2
                      ? `${donors ? donors.toLocaleString() : 0} `
                      : ''}
                    {donors === 2
                      ? 'مساهمَين'
                      : donors
                      ? donors > 2 && donors < 11
                        ? 'مساهمين'
                        : 'مساهم'
                      : 'مساهم'}
                  </Text>
                </Group>

                <Group spacing="xs">
                  <img src={heart} rel="preload" alt="Heart" />
                  <Text color="#F4F4F4" size={14} pt={6}>
                    {numOfProjects !== 2
                      ? `${numOfProjects ? numOfProjects.toLocaleString() : 0} `
                      : ''}
                    {numOfProjects === 2
                      ? 'مشروعين'
                      : numOfProjects
                      ? numOfProjects > 2 && numOfProjects < 11
                        ? 'مشاريع'
                        : 'مشروع'
                      : 'مشروع'}
                  </Text>
                </Group>
              </Group>

              <Progress
                mt="md"
                value={percentagePaid}
                label={percentagePaid ? `${percentagePaid.toFixed(0)}%` : ''}
                color="#53B4AE"
                size="0.8rem"
                className={classes.progress}
              />

              <Group position="apart" mt="xs">
                <Text className={classes.statsTitle}>المبالغ المدفوعة</Text>
                <Text className={classes.statsTitle}>قيمة المشاريع</Text>
              </Group>
              <Group position="apart">
                <Text className={classes.stats}>
                  {donations ? donations.toLocaleString() : 0} ر.ع
                </Text>
                <Text className={classes.stats}>
                  {totalValue ? totalValue.toLocaleString() : 0} ر.ع
                </Text>
              </Group>
            </>
          )}
        </Card>
      </Group>
    </BackgroundImage>
  )
}

export default FoundationInfo
