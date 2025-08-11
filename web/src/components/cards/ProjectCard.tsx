import {
  Text,
  Card,
  Button,
  Group,
  Progress,
  Box,
  useMantineTheme,
  Input,
  Divider,
} from '@mantine/core'
import { ProjectCardProps } from '@/interfaces'
import { useNavigate } from 'react-router-dom'
import useStyles from './ProjectCard.styles'
import { useState } from 'react'
import useFinancialStatus from '@/hooks/useFinancialStatus'
import usePayment from '@/hooks/usePayment'
import useWaqfType from '@/hooks/useWaqfType'

const ProjectCard = ({
  project,
  showLogoAndName,
  orgLogo,
  marginTop,
}: ProjectCardProps): JSX.Element => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const [sahm, setSahm] = useState('')
  const isInvalid = sahm.length > 0 && parseInt(sahm) <= 0
  const { data: financialStatus } = useFinancialStatus(project.id)
  const { data: waqfTypes } = useWaqfType()
  const waqfTypeId = waqfTypes?.find((type) => type.name === 'personal')?.id
  const { donate } = usePayment(project.id, waqfTypeId)
  const overValue = financialStatus?.totalDonatedAmount > project.value

  const percentagePaid =
    (financialStatus?.totalDonatedAmount / project.value) * 100

  const handleSubmit = () => {
    donate({
      projectId: project.id,
      waqfTypeId: waqfTypeId,
      amount: sahm,
      donorName: '',
      donorEmail: '',
      donorPhoneNumber: '',
      numberOfSaham: parseInt(sahm),
      waqfType: 1,
      giftDetails: [],
    })
  }

  return (
    <Card shadow="sm" p="2rem" className={classes.card}>
      {showLogoAndName ? (
        <>
          <Group spacing={theme.spacing.xs} className={classes.head}>
            <img
              key={project.id}
              src={orgLogo}
              className={classes.logo}
              alt="شعار المؤسسة"
            />

            <Box>
              <Text color="dimmed" className={classes.name}>
                اسم المشروع
              </Text>
              <Text className={classes.title}>{project.title}</Text>
            </Box>
          </Group>
          <Text mt="1.2rem" className={classes.description}>
            {project.description}
          </Text>
        </>
      ) : (
        <>
          <Text className={classes.title}>{project.title}</Text>
          <Text mt="0.5rem" className={classes.description}>
            {project.description}
          </Text>
        </>
      )}

      <Divider color="#E8E8E8" className={classes.divider} mt={marginTop} />

      <Progress
        value={percentagePaid}
        label={percentagePaid ? `${percentagePaid.toFixed(0)}%` : ''}
        color="#53B4AE"
        size="0.9rem"
        className={classes.progress}
      />

      <Group position="apart" mt="xs">
        <Text className={classes.statsTitle}>المبالغ المدفوعة</Text>
        <Text className={classes.statsTitle}>المبالغ المتبقية</Text>
        <Text className={classes.statsTitle}>قيمة المشروع</Text>
      </Group>
      <Group position="apart">
        {financialStatus ? (
          <>
            <Text className={classes.stats}>
              {financialStatus.totalDonatedAmount?.toLocaleString()} ر.ع
            </Text>
            <Text className={classes.stats}>
              {overValue
                ? 0
                : financialStatus.remainingAmount?.toLocaleString()}
              ر.ع
            </Text>
          </>
        ) : (
          0
        )}

        <Text className={classes.stats}>
          {project.value?.toLocaleString()} ر.ع
        </Text>
      </Group>

      <Group position="apart" mt="lg" grow>
        <Input
          type="number"
          name="sahm number"
          size="md"
          radius={8}
          height={48}
          placeholder="أدخل مبلغ التبرع"
          className={classes.input}
          rightSection={<Text className={classes.rialOm}>ر.ع</Text>}
          onChange={(e) => {
            setSahm(e.target.value)
          }}
          error={isInvalid}
          disabled={overValue}
        />

        <Button
          variant="light"
          size="md"
          disabled={sahm.length === 0 || isInvalid || overValue}
          className={classes.quickDonateBtn}
          onClick={() => handleSubmit()}
        >
          التبرع السريع
        </Button>
      </Group>
      <Button
        variant="light"
        fullWidth
        size="md"
        className={classes.waqfBtn}
        onClick={() => navigate(`/project/id/${project.id}/waqfType`)}
        disabled={overValue}
      >
        {overValue ? 'تم إكمال المبلغ ' : ' قف سهما'}
      </Button>
    </Card>
  )
}

export default ProjectCard
