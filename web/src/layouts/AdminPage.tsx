import { ReactNode } from 'react'
import Header from './header/Header'
import Footer from './footer/Footer'
import { Box } from '@mantine/core'
import './tailwind.scss'
import useUser from '@/context/user'

interface PageProps {
  children: ReactNode
}

const AdminPage = ({ children }: PageProps): JSX.Element => {
  const { user } = useUser()

  const links_1 = [
    { to: '/', label: 'الرئيسية' },
    { to: '/about', label: 'حول المؤسسة' },
    { to: '/boardmember', label: 'مجلس الإدارة' },
    { to: '/about-waqf', label: 'الوقف' },
    { to: '/jf', label: 'وقف المؤسسة' },
    { to: '/', label: 'بوابة الشراكة الوقفية' },
    { to: '/dashboard', label: 'التقارير' },
    { to: '/organization', label: 'المؤسسات' },
    user?.role == 'admin' && { to: '/user', label: 'المستخدمين' },
  ]
  const links_2 = [
    { to: '/', label: 'الرئيسية' },
    { to: '/about', label: 'حول المؤسسة' },
    { to: '/boardmember', label: 'مجلس الإدارة' },
    { to: '/about-waqf', label: 'الوقف' },
    { to: '/jf', label: 'وقف المؤسسة' },
    { to: '/', label: 'بوابة الشراكة الوقفية' },
    { to: '/dashboard', label: 'التقارير' },
  ]

  const links = user ? links_1 : links_2

  return (
    <Box className="tailwind-default">
      <Header links={links} />
      <Box className="max-w-screen-2xl mx-auto px-8 min-h-screen">
        {children}
      </Box>
      <Footer links={links} />
    </Box>
  )
}

export default AdminPage
