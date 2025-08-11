import { createStyles, em } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  bgImageWrapper: {
    position: 'relative',
  },

  hiddenMobile: {
    position: 'absolute',
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
    [`@media (min-height: ${em(885)})`]: {
      height: '100vh',
    },
  },

  gradientOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(rgba(57, 44, 69, 0.60), rgba(57, 44, 69, 0.60))',
    zIndex: 0,
  },

  contentWrapper: {
    position: 'relative',
    zIndex: 1,
  },

  backBtnBox: {
    position: 'absolute',
    right: 40,
    top: '2rem',
    [theme.fn.smallerThan('md')]: {
      top: 20,
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

  gridContainer: { maxWidth: '70rem', marginBottom: '5rem', marginTop: '5rem' },

  optionsContainer: {
    [`@media (min-height: ${em(1024)})`]: {
      height: '52vh',
    },
  },

  justifyCenter: {
    justifyContent: 'center',
    [`@media (min-height: ${em(1000)})`]: {
      marginTop: '12%',
    },
  },

  imageWrapper: {
    position: 'relative',
    height: ' 40vh',
    top: 0,
    left: 0,
    '::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(rgba(57, 44, 69, 0.60),rgba(57, 44, 69, 0.60))',
    },
  },

  bannerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
  },

  textContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'absolute',
    gap: '0.2rem',
    zIndex: 1,
    top: '30%',
    left: 0,
    right: 0,
  },

  title: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'right',
    fontWeight: 'bold',
    letterSpacing: '0.01rem',
    lineHeight: '1.5rem',
    fontStyle: 'normal',
  },

  hiddenDesktop: {
    backgroundColor: '#EBE8E8',
    zIndex: 2,
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },
}))
