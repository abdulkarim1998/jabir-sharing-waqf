import { createStyles, em } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  card: {
    display: 'grid',
    borderRadius: 8,
    height: 80,
    width: 224,
    alignContent: 'center',

    [theme.fn.smallerThan('md')]: {
      width: 180,
    },
    [theme.fn.smallerThan('xs')]: {
      width: 150,
    },
    [`@media (max-width: ${em(1090)})`]: {
      width: 210,
    },
    [`@media (max-width: ${em(1055)})`]: {
      width: 190,
    },
    [`@media (max-width: ${em(1015)})`]: {
      width: 175,
    },
  },

  selectedCard: { border: '0.50px #392C45 solid' },

  unstyledButton: { textAlign: 'center' },

  title: {
    fontSize: 14,
    color: '#392C45',
    fontWeight: 400,
    paddingTop: 8,
    [theme.fn.smallerThan('md')]: {
      fontSize: 13,
    },
    [theme.fn.smallerThan('sm')]: {
      fontSize: 14,
    },
    [theme.fn.smallerThan('xs')]: {
      fontSize: 12,
    },
  },
}))
