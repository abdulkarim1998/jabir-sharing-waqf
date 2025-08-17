import { Organization } from '@/interfaces'
import {
  useMantineTheme,
  Text,
  Card,
  Button,
  Group,
  Progress,
  Box,
  Divider,
} from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { person, heart } from '@/assets'
import { useStyles } from './OrganizationCard.styles'
import useOrganizationCard from '@/hooks/useOrganizationCard'

interface CardComponentProps {
  data: Organization
}

const OrgCard = ({ data }: CardComponentProps): JSX.Element => {
  const theme = useMantineTheme()
  const { classes } = useStyles()
  const navigate = useNavigate()

  const { data: projNum } = useOrganizationCard<number>(
    `organizations/projects/${data.id}/count`
  )

  const { data: totalValue } = useOrganizationCard<number>(
    `organizations/projects/${data.id}/totalvalue`
  )

  const { data: donors } = useOrganizationCard<number>(
    `organizations/donors/${data.id}/count`
  )

  const { data: donations } = useOrganizationCard<number>(
    `organizations/donations/${data.id}/total`
  )

  const percentagePaid = totalValue && donations && totalValue > 0 ? (donations / totalValue) * 100 : 0

  return (
    <Card className={classes.card} p="2rem">
      <Group mb={theme.spacing.xs} spacing={theme.spacing.xs}>
        <img src={data.logo || ''} className={classes.logo} />
        <Box>
          <Text color="dimmed" className={classes.name}>
            اسم المؤسسة
          </Text>
          <Text className={classes.title}>{data.name}</Text>
        </Box>
      </Group>

      <Text className={classes.description}>{data.description || ''}</Text>

      <Divider color="#E8E8E8" className={classes.divider} />

      <Group className={classes.group} spacing="xs">
        <img src={person} rel="preload" alt="Person" />
        <Text color="#255274" size={14}>
          {donors !== 2 ? `${donors ? donors.toLocaleString() : 0} ` : ''}{' '}
          {donors === 2
            ? 'مساهمَين'
            : donors
            ? donors > 2 && donors < 11
              ? 'مساهمين'
              : 'مساهم'
            : 'مساهم'}
        </Text>
      </Group>
      <Group mt="xs" mb="xs" spacing="xs">
        <Box className={classes.heartBox}>
          <img src={heart} rel="preload" alt="Heart" />
        </Box>

        <Text color="#255274" size={14}>
          {projNum !== 2 ? `${projNum ? projNum.toLocaleString() : 0} ` : ''}
          {projNum === 2
            ? 'مشروعين'
            : projNum
            ? projNum > 2 && projNum < 11
              ? 'مشاريع'
              : 'مشروع'
            : 'مشروع'}
        </Text>
      </Group>

      <Progress
        value={Math.min(percentagePaid || 0, 100)}
        label={percentagePaid > 0 ? `${Math.min(percentagePaid, 100).toFixed(0)}%` : '0%'}
        color="#53B4AE"
        size="0.8rem"
        className={classes.progress}
      />
      <Group position="apart" mt="xs" mb="xs">
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
      <Button
        variant="light"
        fullWidth
        className={classes.btn}
        onClick={() => {
          navigate(`/organizations/id/${data.id}`)
        }}
      >
        ملف المؤسسة
      </Button>
    </Card>
  )
}

export default OrgCard
