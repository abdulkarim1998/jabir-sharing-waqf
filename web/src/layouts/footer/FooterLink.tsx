import { useLocation } from 'react-router-dom'
import { HeaderProps } from '../header/Header'
import { Link } from 'react-router-dom'

const FooterLink = ({ links }: HeaderProps): JSX.Element => {
  const { pathname } = useLocation()
  const path = `${window.location.origin}/waqf${pathname}`

  return (
    <div className="flex flex-col gap-2">
      {links?.map((link, index) => {
        const to = `${window.location.origin}${link.to}`
        return (
          <Link
            key={index}
            to={to}
            className={path === to ? '!underline' : undefined}
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}

export default FooterLink
