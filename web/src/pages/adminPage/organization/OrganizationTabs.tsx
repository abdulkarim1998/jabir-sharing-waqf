import AdminPage from '@/layouts/AdminPage'
import AdminProjects from './projects/Projects'
import Permission from './permission/Permission'
import { Tabs } from '@mantine/core'

const OrganizationTabs = (): JSX.Element => {
  return (
    <AdminPage>
      <Tabs defaultValue="project" color="#255274" m="1rem">
        <Tabs.List
          mb="2rem"
          style={{
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          <Tabs.Tab
            value="project"
            ml="1rem"
            style={{
              marginLeft: '1rem',
            }}
          >
            المشاريع
          </Tabs.Tab>
          <Tabs.Tab value="permission">الصلاحيات</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="project">
          <AdminProjects />
        </Tabs.Panel>
        <Tabs.Panel value="permission">
          <Permission />
        </Tabs.Panel>
      </Tabs>
    </AdminPage>
  )
}

export default OrganizationTabs
