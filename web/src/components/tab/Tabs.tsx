import { Grid, Tabs } from '@mantine/core'
import OrgCard from '@/components/cards/OrganizationCard'
import ProjectCard from '@/components/cards/ProjectCard'
import SearchBar from '@/components/searchBar/SearchBar'
import { useStyles } from './Tabs.styles'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { OrganizationCardData } from '@/interfaces'
import useOrganizationCard from '@/hooks/useOrganizationCard'
import useProjectCard from '@/hooks/useProjectCard'

const WaqfTabs = (): JSX.Element => {
  const { classes } = useStyles()
  const [searchParams] = useSearchParams()
  const search = useMemo(() => searchParams.get('s') || '', [searchParams])
  const { data: organizations } =
    useOrganizationCard<OrganizationCardData[]>(`organizations`)
  const { data: projects } = useProjectCard()

  const filteredOrg = useMemo(
    () =>
      search
        ? organizations.filter((org) =>
            org.name.toLowerCase().includes(search.toLowerCase())
          )
        : organizations,
    [search, organizations]
  )
  const filteredProj = useMemo(
    () =>
      search
        ? projects.filter((project) =>
            project.title.toLowerCase().includes(search.toLowerCase())
          )
        : projects,
    [search, projects]
  )

  return (
    <Tabs defaultValue="organizations" color="#255274">
      <Tabs.List>
        <Tabs.Tab value="organizations" className={classes.activeTab}>
          المؤسسات الوقفية
        </Tabs.Tab>
        <Tabs.Tab value="projects" className={classes.activeTab}>
          المشاريع الوقفية
        </Tabs.Tab>
      </Tabs.List>

      <SearchBar />
      <Tabs.Panel value="organizations" key="organizations">
        <Grid gutter="lg" mt="xs">
          {filteredOrg?.length > 0 ? (
            filteredOrg.map((data) => (
              <Grid.Col key={data.id} xs={12} sm={6} md={4} lg={4}>
                <OrgCard data={data} />
              </Grid.Col>
            ))
          ) : (
            <p>لم يتم العثور على نتائج.</p>
          )}
        </Grid>
      </Tabs.Panel>

      <Tabs.Panel value="projects" key="projects">
        <Grid gutter="lg" mt="xs">
          {filteredProj?.length > 0 ? (
            filteredProj?.map((data) => (
              <Grid.Col key={data.id} xs={12} sm={6} md={4} lg={4}>
                <ProjectCard
                  project={data}
                  orgLogo={
                    organizations?.find((org) => org.id === data.organizationId)
                      ?.logo
                  }
                  showLogoAndName
                  marginTop="0"
                />
              </Grid.Col>
            ))
          ) : (
            <p>لم يتم العثور على نتائج.</p>
          )}
        </Grid>
      </Tabs.Panel>
    </Tabs>
  )
}

export default WaqfTabs
