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
    { to: '/jf', label: 'وقف المؤسسة' },
    { to: '/', label: 'بوابة الشراكة الوقفية' },
    { to: '/dashboard', label: 'التقارير' },
  ]

  if (user) {
    links.push(
      { to: '/organization', label: 'المؤسسات' },
      { to: '/user', label: 'المستخدمين' }
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
