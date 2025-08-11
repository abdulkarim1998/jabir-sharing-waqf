import { NavigateFunction } from 'react-router-dom'

const navWithHref = (
  e: React.MouseEvent<HTMLElement>,
  link: string,
  navigate: NavigateFunction
): void => {
  e.preventDefault()
  navigate(link)
}

export default navWithHref