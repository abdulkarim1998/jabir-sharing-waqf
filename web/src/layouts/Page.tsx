import { ReactNode } from 'react'
import { Box } from '@mantine/core'
import Header from './header/Header'
import Footer from './footer/Footer'
import useUser from '@/context/user'

interface PageProps {
  children: ReactNode
}

const Page = ({ children }: PageProps): JSX.Element => {
  const { user } = useUser()

  const links = [
    { to: '/', label: 'الرئيسية' },
    { to: '/about', label: 'حول المؤسسة' },
    { to: '/boardmember', label: 'مجلس الإدارة' },
    { to: '/about-waqf', label: 'الوقف' },
    { to: '/waqf/jf', label: 'وقف المؤسسة' },
    { to: '/waqf', label: 'بوابة الشراكة الوقفية' },
    { to: '/waqf/dashboard', label: 'التقارير' },
  ]

  if (user) {
    links.push(
      { to: '/waqf/organization', label: 'المؤسسات' },
      { to: '/waqf/user', label: 'المستخدمين' }
    )
  }

  return (
    <Box style={{ overflowX: 'hidden' }}>
      <Header links={links} />
      <Box>{children}</Box>
      <Footer links={links} />
    </Box>
  )
}

export default Page
