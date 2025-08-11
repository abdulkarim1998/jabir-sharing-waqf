import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
} from '@mantine/core'
import { useState } from 'react'

const LoginForm = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = () => {
    console.log(email, password)
  }

  return (
    <Container size={420} my={200}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 200,
        })}
      >
        Welcome Admin!
      </Title>
      <Paper withBorder shadow="sm" p={30} mt={30} radius="sm">
        <TextInput
          label={<p style={{ marginBottom: '0.5rem' }}>Email</p>}
          placeholder="you@mantine.dev"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <PasswordInput
          label={<p style={{ marginBottom: '0.5rem' }}>Password</p>}
          placeholder="Your password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          mt="sm"
        />
        <Button fullWidth mt="md" onClick={handleSignIn}>
          Sign in
        </Button>
      </Paper>
    </Container>
  )
}

export default LoginForm
