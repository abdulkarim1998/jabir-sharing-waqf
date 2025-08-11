import { Input, Container } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useStyles } from './SearchBar.styles'
import { useSearchParams } from 'react-router-dom'

const SearchBar = (): JSX.Element => {
  const { classes } = useStyles()
  const [searchParams, setSearchParams] = useSearchParams()

  const handleChange = (newParams: string) => {
    setSearchParams(newParams ? { s: newParams } : {})
  }

  return (
    <Container className={classes.container}>
      <Input
        placeholder="ابحث.."
        variant="filled"
        radius="sm"
        icon={<IconSearch size={18} />}
        className={classes.search}
        value={searchParams.get('s') ?? ''}
        onChange={(e) => {
          handleChange(e.target.value)
        }}
      />
    </Container>
  )
}

export default SearchBar
