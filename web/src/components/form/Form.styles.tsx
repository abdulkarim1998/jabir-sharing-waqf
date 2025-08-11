import { createStyles } from '@mantine/core'

const useStyles = createStyles((theme) => {
  const buttonStyle = {
    marginTop: theme.spacing.md,
    fontSize: 14,
    color: '#F4F4F4',
    borderRadius: 8,
    width: 105,
    height: 48,

    [theme.fn.smallerThan('xs')]: { marginTop: 0 },
  }

  return {
    center: {
      marginLeft: '3rem',
      [theme.fn.smallerThan('md')]: {
        display: 'flex',
        alignContent: 'center',
        flexDirection: 'column',
        marginTop: '6rem',
        width: '90vw',
      },
      [theme.fn.smallerThan('xs')]: {
        marginTop: '5rem',
        marginLeft: 0,
        width: '70vw',
      },
    },
    formContainer: {
      display: 'flex',
      alignContent: 'center',
      flexDirection: 'column',
      width: '100%',
      [theme.fn.smallerThan('md')]: { height: '50vh' },
    },
    title: { fontSize: 14, fontWeight: 'bold', color: '#392C45' },

    underline: { textDecoration: 'underline' },

    addGiftBtn: {
      [theme.fn.smallerThan('sm')]: { width: '6rem', fontSize: 12 },
    },

    textInput: {
      marginTop: 12,
      borderRadius: 8,
      'label: first-of-type': { color: '#392C45', fontWeight: 400 },
      [theme.fn.smallerThan('xs')]: { width: '100%' },
      width: '100%',
    },

    remainingChars: {
      marginRight: '3rem',
      fontSize: 12,
      color: '#A7A9AC',
      [theme.fn.smallerThan('md')]: { marginRight: '4rem' },

      [theme.fn.smallerThan('xs')]: { marginRight: 0 },
    },

    paymentBoxTitle: { fontSize: 14, color: '#392C45', marginTop: 7 },

    paymentSubTitle: { color: '#392C45', minWidth: '9.4rem', fontSize: 12 },

    paymentTextBox: {
      backgroundColor: '#f1f3f5',
      height: '2.25rem',
      borderRadius: 8,
      paddingTop: 7,
      paddingLeft: 11,
      color: '#392C45',
      fontSize: 14,
      marginTop: 3,
      border: '0.50px #A7A9AC solid',
      opacity: 0.8,
      width: '90%',
      [theme.fn.smallerThan('xs')]: { width: '100%' },
    },

    divider: { width: '90%', marginTop: '1.5rem', marginbottom: '1.5rem' },

    btnGroup: {
      right: '3rem',
      position: 'absolute',
      bottom: '2rem',
      marginBottom: '2rem',
      justifyContent: 'end',

      [theme.fn.smallerThan('md')]: {
        right: '10%',
        bottom: 0,
        position: 'relative',
        marginTop: '4rem',
      },
      [theme.fn.smallerThan('xs')]: { marginTop: '5rem', right: '0%' },
    },

    recipientBtnGroup: {
      [theme.fn.smallerThan('xs')]: {
        marginTop: '5rem',
      },
    },

    mulRecipientBtnGroup: {
      [theme.fn.smallerThan('xs')]: {
        marginTop: '10rem',
      },
    },

    donorBtnGroup: {
      right: '3rem',
      position: 'absolute',
      bottom: '2rem',
      marginBottom: '2rem',

      [theme.fn.smallerThan('md')]: {
        right: '10%',
        bottom: 0,
        position: 'relative',
        marginBottom: '1.5rem',
        marginLeft: 'auto',
        marginTop: '0.5rem',
      },
      [theme.fn.smallerThan('xs')]: { marginTop: '4rem', right: '0%' },
    },

    nextBtn: {
      ...buttonStyle,
      backgroundColor: '#392C45',
      '&:hover': {
        color: '#F4F4F4',
        backgroundColor: '#271E30',
      },
    },

    backBtn: {
      ...buttonStyle,
      backgroundColor: '#A7A9AC',
      borderColor: '#A7A9AC',
      '&:hover': {
        color: '#F4F4F4',
        backgroundColor: '#8F9296',
      },
    },
  }
})

export default useStyles
