import { OrganizationCardData } from '@/interfaces'
import { Text, Group, ActionIcon, Divider, Box } from '@mantine/core'
import { IconMapPin } from '@tabler/icons-react'
import Instagram from '@/assets/icons/Instagram'
import Twitter from '@/assets/icons/Twitter'
import { useStyles } from './FoundationInfo.styles'
import { Link } from 'react-router-dom'

interface Props {
  data: OrganizationCardData
}

const SmallScreenView = ({ data }: Props): JSX.Element => {
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
    <Group className={classes.hiddenDesktop}>
      <Box className={classes.imgBox}>
        <img src={data.logo} className={classes.logo} />
      </Box>
      <Box className={classes.titleDescriptionBox}>
        <Text className={classes.title}>{data.name}</Text>

        <div className={classes.locationDiv}>
          <ActionIcon size="xs" ml={5} style={{ alignItems: 'center' }}>
            <IconMapPin color="#F4F4F4" />
          </ActionIcon>
          <Text color="#F4F4F4" size={14}>
            {data.location}
          </Text>
        </div>

        <Divider color="#E8E8E8" mt="xs" className={classes.divider} />

        <Text className={classes.description}>{data.description}</Text>
      </Box>

      <Box className={classes.socialMediaInfo}>
        <Text size={14}>{data.email}</Text>
        <Text size={14}>{data.phone}</Text>
        <Text size={14}>{data.website}</Text>
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

export default SmallScreenView
