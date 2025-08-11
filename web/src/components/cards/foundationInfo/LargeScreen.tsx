import { OrganizationCardData } from '@/interfaces'
import { Text, Group, Grid, Divider, Box } from '@mantine/core'
import { IconMapPin } from '@tabler/icons-react'
import Instagram from '@/assets/icons/Instagram'
import Twitter from '@/assets/icons/Twitter'
import { useStyles } from './FoundationInfo.styles'
import { Link } from 'react-router-dom'

interface Props {
  data: OrganizationCardData
}

const LargeScreenView = ({ data }: Props): JSX.Element => {
  const { classes } = useStyles()
  const socials = [
    {
      icon: <Twitter className={classes.socialMediaIcon} />,
      link: data.twitter,
    },
    {
      icon: <Instagram className={classes.socialMediaIcon} />,
      link: data.instagram,
    },
  ]
  return (
    <Group position="apart" className={classes.hiddenMobile}>
      <Box className={classes.imgBox}>
        <img src={data.logo} className={classes.logo} />
      </Box>
      <Grid style={{ flexGrow: 1 }}>
        <Grid.Col span={12}>
          <Text className={classes.title}>{data.name}</Text>

          <div className={classes.locationDiv}>
            <IconMapPin color="#F4F4F4" size={15} className={classes.mapIcon} />
            <Text size={14} color="#F4F4F4">
              {data.location}
            </Text>
          </div>

          <Divider color="#E8E8E8" mt="xs" />

          <Text className={classes.description}>{data.description}</Text>
        </Grid.Col>
      </Grid>

      <Box>
        <Text color="#F4F4F4">{data.email}</Text>
        <Text color="#F4F4F4">{data.phone}</Text>
        <Text color="#F4F4F4">{data.website}</Text>
        <Group>
          {socials.map((social) => (
            <Link to={social.link} key={social.link}>
              {social.icon}
            </Link>
          ))}
        </Group>
      </Box>
    </Group>
  )
}

export default LargeScreenView
