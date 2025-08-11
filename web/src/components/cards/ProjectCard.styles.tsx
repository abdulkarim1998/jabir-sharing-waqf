import { createStyles } from '@mantine/core'

const useStyles = createStyles((theme) => {
  const fontStyle = {
    fontSize: 14,
    [theme.fn.smallerThan('lg')]: {
      fontSize: 12,
    },
    [theme.fn.smallerThan('md')]: {
      fontSize: 13,
    },
    [theme.fn.smallerThan('sm')]: {
      fontSize: 14,
    },
    [theme.fn.smallerThan('xs')]: {
      fontSize: 11,
    },
  }

  const btnTextStyle = {
    fontSize: 14,
    [theme.fn.largerThan('md') && theme.fn.smallerThan('lg')]: {
      fontSize: theme.spacing.xs,
    },
    [theme.fn.smallerThan('md')]: {
      fontSize: 12,
    },
    [theme.fn.smallerThan('sm')]: {
      fontSize: 14,
    },
    [theme.fn.smallerThan('xs')]: { fontSize: 13 },
  }

  return {
    card: {
      display: 'grid',
      height: '100%',
      backgroundColor: '#F4F4F4',
      borderRadius: 10,
      gridTemplateRows: 'repeat(2, 1fr)',

      [theme.fn.smallerThan('xs')]: {
        gridTemplateRows: 'repeat(1, 1fr)',
      },
    },
    head: {
      marginBottom: theme.spacing.xs,
      display: 'grid',
      gridTemplateColumns: '20% 1fr',
      alignContent: 'space-between',
    },

    name: {
      ...fontStyle,
    },
    title: {
      color: '#255274',
      ...fontStyle,
    },
    description: {
      color: '#3F4254',
      fontSize: 14,
      lineHeight: theme.lineHeight,
    },
    divider: {
      background: '#E8E8E8',
      width: '100%',
      height: 1,
      [theme.fn.smallerThan('xs')]: {
        marginTop: 20,
      },
    },
    progress: {
      height: 10,
      marginTop: '1.2rem',
      '> div:first-of-type': { paddingTop: '0.1rem' },
    },

    statsTitle: { color: '#A7A9AC', fontWeight: 'bold', fontSize: 12 },
    stats: { color: '#53B4AE', fontWeight: 400, fontSize: 14 },
    logo: {
      maxWidth: '90%',
    },
    input: {
      height: 48,
      '> input:first-of-type': {
        height: 48,
        fontSize: 14,
        [theme.fn.smallerThan('lg')]: {
          fontSize: 12,
        },
        [theme.fn.smallerThan('md')]: {
          fontSize: 12,
        },
        [theme.fn.smallerThan('sm')]: {
          fontSize: 14,
        },
        [theme.fn.smallerThan('xs')]: {
          fontSize: 10,
        },
      },
    },
    rialOm: {
      display: 'block',
      textAlign: 'right',
      color: '#255274',
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 16,
      letterSpacing: 0.16,
      wordWrap: 'break-word',
    },
    project: {
      [theme.fn.largerThan('md') && theme.fn.smallerThan('lg')]: {
        fontSize: theme.spacing.xs,
      },
      [theme.fn.smallerThan('md')]: { fontSize: 11.5 },
    },

    quickDonateBtn: {
      color: '#255274',
      backgroundColor: '#C8D8E3',
      borderRadius: 8,
      height: 48,
      ':disabled, .mantine-rtl-zaz804[data-disabled] ': {
        backgroundColor: '#C8D8E3',
      },
      '&:hover': {
        color: '#255274',
        backgroundColor: '#B4C3CE',
      },
      ...btnTextStyle,
    },
    waqfBtn: {
      marginTop: '1rem',
      color: 'white',
      backgroundColor: '#255274',
      borderRadius: 8,
      height: 48,
      '&:hover': {
        color: 'white',
        backgroundColor: '#1F4460',
      },
      '> div:first-of-type > span:first-of-type': { paddingTop: 3 },
      ...btnTextStyle,
    },
  }
})

export default useStyles
