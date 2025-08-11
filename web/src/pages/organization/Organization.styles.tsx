import { createStyles, em } from '@mantine/core'

export const useStyles = createStyles(() => ({
  bannerContainer: { maxWidth: '100vw', paddingLeft: 0, paddingRight: 0 },
  tabsContainer: {
    width: '90%',
    paddingLeft: 0,
    paddingRight: 0,
    marginRight: 'auto',
    marginLeft: 'auto',

    [`@media (min-width: ${em(1700)})`]: {
      width: '83%',
    },
    [`@media (min-width: ${em(2137)})`]: {
      width: '80%',
    },
    [`@media (min-width: ${em(2432)})`]: {
      width: '70%',
    },
  },
}))
