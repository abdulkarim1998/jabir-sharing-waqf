import HeaderLink from './HeaderLink'
import Hamburger from 'hamburger-react'
import { useState } from 'react'
import clsx from 'clsx'
import JabirFoundationLogo from '@/assets/svg/Logo.svg'
import useUser from '@/context/user'
import '../tailwind.scss'

export interface HeaderProps {
  links?: { to: string; label: string }[]
}

const Header = ({ links }: HeaderProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false)
  const { logout, login, user } = useUser()

  return (
    <div className="tailwind-default">
      <div className="bg-[#F3F3F3] flex w-screen">
        <div className="flex justify-between w-full max-w-screen-2xl py-4 items-center mx-auto px-8">
          <div className="flex gap-16 items-center">
            <a href="/">
              <img src={JabirFoundationLogo} />
            </a>
            <div className="hidden lg:block">
              <HeaderLink links={links} />
            </div>
          </div>
          <button
            className="!text-[#F4F4F4] !bg-[#BC9B6A] !py-[0.81rem] xl:!px-7 lg:!px-3 rounded-lg hidden lg:block hover:!bg-[#AF9062] transition-all"
            onClick={() => (user ? logout() : login())}
          >
            {!user ? 'تسجيل الدخول' : 'تسجيل الخروج'}
          </button>
          <div className="block lg:hidden">
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'transition-all ease-in absolute z-20 bg-[#F3F3F3] border-t-[#BC9B6A]/20 border-t-2 overflow-hidden w-full lg:hidden pt-3 flex flex-col items-center justify-between',
          isOpen
            ? user
              ? 'h-[422px] opacity-100'
              : 'h-[350px] opacity-100'
            : 'h-0 opacity-0'
        )}
      >
        <HeaderLink links={links} />
        <button
          className="!text-[#F4F4F4] !bg-[#BC9B6A] !p-2 !m-4 rounded-lg hover:!bg-[#AF9062] transition-all"
          onClick={() => (user ? logout() : login())}
        >
          {!user ? 'تسجيل الدخول' : 'تسجيل الخروج'}
        </button>
      </div>
    </div>
  )
}

export default Header
