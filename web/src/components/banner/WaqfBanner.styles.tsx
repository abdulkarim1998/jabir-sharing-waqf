import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    marginBottom: '2rem',
    '::after': {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '90%',
      content: '""',
      backgroundImage: 'radial-gradient( #255274 100%, #F4F4F4 5% )',
      opacity: 0.8,
      WebkitMaskImage:
        '-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))',
      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
    },
    [theme.fn.smallerThan('md')]: {
      '::after': {
        height: '30vh',
      },
    },
    [theme.fn.smallerThan('sm')]: {
      '::after': {
        height: '20vh',
      },
    },
  },

  videoContainer: {
    position: 'relative',
  },
  textContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'absolute',
    gap: theme.spacing.sm,
    zIndex: 1,
    top: '50%',
    left: 0,
    right: 0,
    transform: 'translateY(-50%)',
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
  video: { flexShrink: 0 },
  logo: {
    [theme.fn.smallerThan('md')]: {
      width: '15%',
    },
  },
  title: {
    color: '#FFF',
    textAlign: 'right',
    fontWeight: 'bold',
    letterSpacing: '0.01rem',
    lineHeight: '1.5rem',
    fontStyle: 'normal',
    [theme.fn.largerThan('md')]: {
      fontSize: '1.75rem',
    },
    [theme.fn.smallerThan('sm')]: {
      fontSize: '0.8rem',
    },
    [theme.fn.smallerThan('xs')]: {
      fontSize: '0.7rem',
    },
  },
  subTitle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 400,
    fontSize: '1rem',
    letterSpacing: '0.01rem',
    lineHeight: '1.25rem',
    fontStyle: 'normal',
    [theme.fn.smallerThan('sm')]: {
      fontSize: '0.8rem',
    },
    [theme.fn.smallerThan('xs')]: {
      fontSize: '0.6rem',
    },
  },
  divider: {
    borderTopColor: 'white',
    width: '12.875rem',
    height: '0.1rem',
    borderTopWidth: 2,

    [theme.fn.smallerThan('md')]: {
      width: '10rem',
    },
    [theme.fn.smallerThan('sm')]: {
      width: '10rem',
    },
    [theme.fn.smallerThan('xs')]: {
      width: '5rem',
    },
  },
  vector: {
    objectFit: 'cover',
    bottom: 0,
    position: 'absolute',
    width: '100%',
    height: '14rem',
    [theme.fn.smallerThan('lg')]: {
      height: '10rem',
    },
    [theme.fn.smallerThan('md')]: {
      height: '5rem',
    },
  },
}))
