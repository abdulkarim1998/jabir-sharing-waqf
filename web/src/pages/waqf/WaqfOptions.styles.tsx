import { createStyles, em } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  paper: {
    padding: '2rem',
    maxWidth: '100%',
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  div: { display: 'flex', flexGrow: 1 },

  backgroundColorBox: {
    position: 'relative',
    backgroundColor: '#EBE8E8',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    paddingTop: '10rem',
    width: '100vw',
    [theme.fn.smallerThan('md')]: {
      paddingTop: '4rem',
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      top: 0,
    },
  },

  labelContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
    transform: 'translateY(-25%)',
  },

  yellowLabel: {
    position: 'relative',
    [theme.fn.smallerThan('md')]: {
      width: 133.5,
    },
  },

  textAboveLabel: {
    fontSize: 28,
    position: 'absolute',
    paddingBottom: 14,
    color: '#392C45',
    fontWeight: 'bold',
    [theme.fn.smallerThan('md')]: {
      fontSize: 22,
      paddingBottom: 12,
    },
  },

  chooseSahmText: {
    position: 'relative',
    color: '#392C45',
    fontWeight: 700,
    fontSize: 14,
    left: 33,
    marginBottom: 10,
    [theme.fn.smallerThan('md')]: {
      left: 2,
      marginTop: 12,
    },
  },

  underline: { textDecoration: 'underline' },

  justifyCenter: {
    justifyContent: 'center',
  },

  nextBtnBox: {
    display: 'grid',
    marginRight: '1.3rem',
    justifyContent: 'end',
    marginTop: '4rem',
    [theme.fn.smallerThan('md')]: {
      marginRight: '0.3rem',
      marginTop: '3rem',
      marginBottom: '3rem',
    },
  },
  nextBtn: {
    color: 'white',
    backgroundColor: '#392C45',
    fontSize: 14,
    borderRadius: 8,
    width: 105,
    height: 48,
    '&:hover': {
      color: 'white',
      backgroundColor: '#271E30',
    },
  },

  imageWrapper: {
    flex: 1,
    position: 'relative',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    '::after': {
      borderBottomRightRadius: 8,
      borderTopRightRadius: 8,
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(rgba(57, 44, 69, 0.60),rgba(57, 44, 69, 0.60))',
    },
    [theme.fn.smallerThan('md')]: {
      height: '20%',
    },
  },

  leftTextContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'absolute',
    gap: theme.spacing.sm,
    zIndex: 1,
    top: '42%',
    left: 0,
    right: 0,
    [theme.fn.smallerThan('md')]: {
      gap: theme.spacing.xs,
    },
    [theme.fn.smallerThan('sm')]: {
      gap: theme.spacing.xs,
    },
    [theme.fn.smallerThan('xs')]: {
      gap: '0.2rem',
    },
  },
  title: {
    fontSize: 28,
    color: '#FFF',
    textAlign: 'right',
    fontWeight: 'bold',
    letterSpacing: '0.01rem',
    lineHeight: '1.5rem',
    fontStyle: 'normal',
    [theme.fn.largerThan('md')]: {
      fontSize: '1.75rem',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },

  box: {
    [theme.fn.smallerThan('md')]: {
      marginTop: '1rem',
    },
    [theme.fn.smallerThan('sm')]: {
      marginTop: '3rem',
    },
    [`@media (min-width: ${em(769)})`]: {
      marginTop: '3rem',
    },
  },

  mobileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    justifyContent: 'center',
    alignContent: 'center',
  },
}))
