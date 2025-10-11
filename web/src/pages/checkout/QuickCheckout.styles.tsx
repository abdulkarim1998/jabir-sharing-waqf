import { createStyles } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  container: {
    paddingTop: '5rem',
    paddingBottom: '5rem',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paper: {
    backgroundColor: '#bdc4c9',
    padding: '3rem',
    [theme.fn.smallerThan('sm')]: {
      padding: theme.spacing.lg,
    },
  },

  logo: {
    marginBottom: theme.spacing.md,
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#255274',
    marginBottom: theme.spacing.xs,
    [theme.fn.smallerThan('sm')]: {
      fontSize: 24,
    },
  },

  amount: {
    fontSize: 36,
    fontWeight: 700,
    color: '#1B4332',
    marginTop: theme.spacing.xs,
    [theme.fn.smallerThan('sm')]: {
      fontSize: 28,
    },
  },

  label: {
    fontSize: 16,
    fontWeight: 600,
    color: '#255274',
    marginBottom: 8,
    display: 'block',
  },

  input: {
    '& input': {
      fontSize: 18,
      fontWeight: 500,
      padding: '12px 16px',
      borderRadius: 8,
      border: '2px solid #E5E5E5',
      transition: 'border-color 0.2s',
      '&:focus': {
        borderColor: '#255274',
      },
    },
  },

  submitBtn: {
    backgroundColor: '#255274',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 700,
    height: 56,
    borderRadius: 8,
    marginTop: theme.spacing.md,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#1F4460',
      transform: 'translateY(-2px)',
    },
    '&:disabled': {
      backgroundColor: '#C8D8E3',
      color: '#8B8B8B',
    },
  },

  cancelBtn: {
    color: '#255274',
    fontSize: 16,
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'underline',
    },
  },

  modal: {
    '& .mantine-Modal-modal': {
      borderRadius: 16,
    },
  },

  successIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    fontWeight: 700,
    marginTop: theme.spacing.md,
  },

  successTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#255274',
  },

  successMessage: {
    fontSize: 18,
    color: '#666666',
  },

  successAmount: {
    fontSize: 32,
    fontWeight: 700,
    color: '#4CAF50',
    marginTop: theme.spacing.xs,
  },
}))

export default useStyles

