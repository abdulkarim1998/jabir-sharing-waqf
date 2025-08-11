import { createStyles, em } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  background: {
    position: 'relative',
    marginBottom: '2rem',
    objectFit: 'cover',
    width: '100vw',
    height: '60vh',
    '::before': {
      position: 'absolute',
      bottom: 0,
      width: '100vw',
      height: '100%',
      content: '""',
      transformOrigin: '0 0',
      backgroundImage:
        'linear-gradient(0deg, #255274 0%, rgba(0, 0, 0, 0) 100%)',
    },
    [theme.fn.smallerThan('lg')]: {
      height: '30rem',
    },
    [theme.fn.smallerThan('sm')]: {
      height: '41rem',
    },
  },

  backBtnBox: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '90%',
    maxWidth: 1536,
    display: 'flex',
    flexDirection: 'row-reverse',
    [theme.fn.smallerThan('md')]: {
      top: 5,
      right: 10,
      left: 'unset',
      zIndex: 3,
    },
  },

  backBtnContainer: {
    display: 'flex',
    border: 'none',
    '&:hover': {
      color: '#E4A430',
      background: 'transparent',
    },
    'div:first-of-type': {
      marginTop: '1rem',
      [theme.fn.largerThan('xl')]: {
        marginTop: '5rem',
      },
      [theme.fn.largerThan('md')]: {
        marginTop: '2rem',
      },
    },
  },

  backBtnText: {
    fontSize: 14,
    color: 'white',
    marginRight: theme.spacing.xs,
    '&:hover': {
      color: '#E4A430',
      background: 'transparent',
      border: 'none',
    },
  },

  arrowIcon: {
    color: 'white',
    background: 'transparent',
    border: 'none',
    '&:hover': {
      color: '#E4A430',
      background: 'transparent',
      border: 'none',
    },
  },

  cardsGroup: {
    top: '20%',
    position: 'relative',
    justifyContent: 'center',
    [theme.fn.smallerThan('md')]: {
      top: '10%',
    },
    [theme.fn.smallerThan('sm')]: {
      gap: '10%',
      top: '8%',
    },
  },

  topMobileCard: {
    [`@media (min-width: ${em(2230)})`]: {
      width: '37%',
    },
    [theme.fn.smallerThan('sm')]: { width: '90%', height: '24.25rem' },
  },

  bottomMobileCard: {
    [`@media (min-width: ${em(990)})and (max-width: ${em(1028)})`]: {
      width: '37%',
    },
    [theme.fn.smallerThan('sm')]: {
      width: '90%',
      height: '8.5rem',
      paddingTop: 0,
    },
  },

  card: {
    padding: theme.spacing.lg,
    width: '56vw',
    background: 'rgba(244.37, 244.37, 244.37, 0.40)',
    borderRadius: 10,
    backdropFilter: 'blur(60px)',
    marginBottom: theme.spacing.lg,
    height: '10.8rem',
    display: 'grid',
    [theme.fn.smallerThan('md')]: {
      width: '80%',
      height: '10rem',
    },
  },

  statsGroup: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: 15,
    },
    [theme.fn.largerThan('sm')]: {
      marginTop: 17,
    },
    [theme.fn.largerThan('xl')]: {
      marginTop: 15,
    },
  },

  progress: {
    height: 10,
    '> div:first-of-type': { paddingTop: '0.1rem' },
  },

  statsTitle: { color: '#F4F4F4', fontWeight: 400, fontSize: 12 },

  stats: { color: '#F4F4F4', fontWeight: 400, fontSize: 14 },

  details: {
    gap: '2rem',
    alignItems: 'center',
  },

  hiddenMobile: {
    flexWrap: 'nowrap',
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    justifyContent: 'center',
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  imgBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: 92,
    height: 92,
    display: 'grid',
    alignItems: 'center',
    alignContent: 'center',
    [`@media (min-width: ${em(2230)})`]: {
      maxWidth: '4vw',
    },
  },

  projectCardsContainer: {
    marginRight: 'auto',
    marginLeft: 'auto',
    width: '90%',
    maxWidth: 1536,

    [`@media (min-width: ${em(1700)})`]: {
      width: '83%',
    },
    [`@media (min-width: ${em(2137)})`]: {
      width: '80%',
    },
    [`@media (min-width: ${em(2432)})`]: {
      width: '73%',
    },
  },

  logo: {
    padding: '1rem',
    maxWidth: '100%',
  },

  titleDescriptionBox: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  title: {
    color: '#F4F4F4',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.16,
    wordWrap: 'break-word',
    [theme.fn.smallerThan('sm')]: {
      fontSize: 15,
    },
    [theme.fn.largerThan('sm')]: {
      fontSize: 17,
    },
    [theme.fn.smallerThan('lg') || theme.fn.largerThan('lg')]: {
      fontSize: 14,
    },

    [theme.fn.largerThan('xl')]: {
      fontSize: 18,
    },
  },

  locationDiv: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 5,
    [theme.fn.smallerThan('sm')]: {
      marginTop: 2,
    },
  },

  mapIcon: { marginRight: 5 },

  divider: { [theme.fn.smallerThan('sm')]: { width: '70vw' } },

  description: {
    width: '100%',
    color: '#F4F4F4',
    marginTop: theme.spacing.xs,
    fontSize: 14,
    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs,
      paddingLeft: 5,
      paddingRight: 5,
      fontSize: 14,
      textAlign: 'center',
    },
  },

  socialMediaInfo: {
    color: '#F4F4F4',
    fontsize: 14,
    [theme.fn.smallerThan('sm')]: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  socialMediaIcon: { '> path': { fill: 'white' } },
}))
