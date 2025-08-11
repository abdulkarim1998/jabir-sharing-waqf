import { createStyles } from '@mantine/core'

export const useStyles = createStyles(() => ({
  container: {
    marginTop: 25,
    marginLeft: 0,
    maxWidth: '100%',
    width: '100%',
    paddingLeft: 0,
    paddingRight: 0,
  },
  search: {
    '> div:first-of-type': {
      position: 'absolute',
      right: 0,
      left: 'unset',
    },
    'input:first-of-type': { paddingLeft: ' calc(2.25rem / 3)' },
  },
}))
