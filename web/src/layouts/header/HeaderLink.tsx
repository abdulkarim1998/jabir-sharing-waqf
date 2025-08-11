import { useLocation } from 'react-router-dom'
import { HeaderProps } from './Header'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

function removeTrailingSlash(str: string) {
  return str.replace(/\/+$/, '')
}

const HeaderLink = ({ links }: HeaderProps): JSX.Element => {
  const { pathname } = useLocation()

  const path = removeTrailingSlash(`${window.location.origin}/waqf${pathname}`)

  return (
    <div className="text-[#787878] text-sm flex gap-5 lg:gap-7 bg-transparent lg:flex-row flex-col items-center">
      {links?.map((link, index) => {
        const to = `${window.location.origin}${link.to}`
        return (
          <Link
            key={index}
            to={to}
            className={clsx(
              'hover:!text-[#e4a430] transition-all',
              path === to && '!underline underline-offset-8 !text-[#e4a430]'
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}

export default HeaderLink
