import { Container, Grid, Text, Divider, Loader } from '@mantine/core'
import Page from '@/layouts/Page'
import { useParams } from 'react-router-dom'
import ProjectCard from '@/components/cards/ProjectCard'
import FoundationInfo from '@/components/cards/foundationInfo/FoundationInfo'
import { OrganizationCardData } from '@/interfaces'
import useOrganizationCard from '@/hooks/useOrganizationCard'
import useProjectCard from '@/hooks/useProjectCard'
import { useStyles } from '@/components/cards/foundationInfo/FoundationInfo.styles'

const FoundationProfile = ({
  foundationId,
}: {
  foundationId?: string
}): JSX.Element => {
  const { organizationId } = useParams()
  const id = organizationId ?? foundationId
  const { classes } = useStyles()
  const { data: organization } = useOrganizationCard<OrganizationCardData>(
    `organizations/${id}`
  )
  const { data: donors } = useOrganizationCard<number>(
    `organizations/donors/${id}/count`
  )
  const { data: projects } = useProjectCard(id)
  const { data: numOfProjects } = useOrganizationCard<number>(
    `organizations/projects/${id}/count`
  )
  const { data: totalValue } = useOrganizationCard<number>(
    `organizations/projects/${id}/totalValue`
  )

  if (!organization) {
    return <Loader />
  }

  return (
    <Page>
      <Container maw="100vw" px={0}>
        <Grid>
          <Grid.Col pt={0} key={organization.id}>
            <FoundationInfo
              key={organization.id}
              data={organization}
              donors={donors}
              numOfProjects={numOfProjects}
              totalValue={totalValue}
              isSelected={organization.id === id}
            />

            <Grid.Col className={classes.projectCardsContainer}>
              <Text size={14} color="#787878">
                مشاريع المؤسسة
                <span style={{ color: '#392C45', fontWeight: '400' }}>
                  {' '}
                  ( {numOfProjects} )
                </span>
              </Text>

              <Divider
                color="#E8E8E8"
                mt="xs"
                mb="lg"
                style={{ border: '1px #D9D9D9 solid' }}
              />
              <Grid gutter="lg">
                {projects?.map((project) => (
                  <Grid.Col key={project.id} xs={12} sm={6} md={4} lg={4}>
                    <ProjectCard
                      key={project.id}
                      project={project}
                      orgLogo={null}
                      showLogoAndName={false}
                      marginTop="1rem"
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </Grid.Col>
          </Grid.Col>
        </Grid>
      </Container>
    </Page>
  )
}

export default FoundationProfile
