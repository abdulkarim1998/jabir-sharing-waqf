import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  stepper: {
    top: 50,
    position: 'absolute',
    width: '80%',
    [theme.fn.smallerThan('sm')]: { width: '70%' },
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#392C45',
    '&.completed': { color: '#53B4AE' },
    'div: last-of-type': {
      marginLeft: 0,
      fontSize: 13,
      [theme.fn.smallerThan('sm')]: { fontSize: 12 },
      [theme.fn.smallerThan('xs')]: { fontSize: 10 },
    },
  },
}))
