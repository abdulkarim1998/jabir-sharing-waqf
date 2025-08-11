import { createStyles } from '@mantine/core'

export const useStyles = createStyles(() => ({
  activeTab: {
    '&[data-active], &:active, &[data-active]:hover, &[data-active]:active': {
      fontWeight: 'bold',
      color: '#255274',
      borderColor: '#255274',
    },
  },
}))
