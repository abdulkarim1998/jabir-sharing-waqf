import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  card: {
    display: 'grid',
    height: '100%',
    gridTemplateRows: 'repeat(2, 1fr)',
    backgroundColor: '#F4F4F4',
    [theme.fn.smallerThan('xs')]: {
      gridTemplateRows: 'repeat(1, 1fr)',
    },
  },

  logo: { width: '15%', paddingBottom: theme.spacing.xs, marginLeft: 1 },
  name: {
    fontSize: 14,
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
  title: {
    fontSize: 14,
    color: '#255274',
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
  description: {
    color: '#3F4254',
    fontSize: 14,
  },

  group: {
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
  divider: {
    width: '100%',
    height: 1,
    [theme.fn.smallerThan('lg')]: {
      marginTop: '1rem',
    },
    [theme.fn.smallerThan('md')]: {
      marginTop: 1,
    },
    [theme.fn.smallerThan('sm')]: {
      marginTop: '1rem',
    },
  },

  heartBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 20px)',
    justifyItems: 'center',
  },

  progress: {
    height: 10,
    '> div:first-of-type': { paddingTop: '0.1rem' },
  },

  statsTitle: { color: '#A7A9AC', fontWeight: 'bold', fontSize: 12 },

  stats: { color: '#53B4AE', fontWeight: 'bold', fontSize: theme.spacing.sm },

  btn: {
    color: 'white',
    backgroundColor: '#255274',
    marginTop: theme.spacing.md,
    fontSize: 14,
    borderRadius: 8,
    height: 48,
    '&:hover': {
      color: 'white',
      backgroundColor: '#1F4460',
    },
  },
}))
