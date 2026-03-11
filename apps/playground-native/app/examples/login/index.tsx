import { useState } from 'react';
import {
  Flex,
  Text,
  Heading,
  TextField,
  Button,
  Card,
  Checkbox,
  Spinner,
  Callout,
  ThemeProvider,
} from 'radix-native-ui';
import { InfoIcon } from 'lucide-react-native';
import { PageBody, PageContainer, PageHeader, PageHeading } from '@/components/PageSection';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

function LoginForm({ onLogin, onForgotPassword, onSignUp }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await onLogin(email, password);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card size={4} style={{ maxWidth: 400, width: '100%' }} variant={'soft'}>
      <Flex direction="column" gap={4}>
        {/* Header */}
        <Flex direction="column" gap={1} align="center">
          <Heading size={5}>Welcome back</Heading>
          <Text color="gray" size={2}>
            Sign in to your account
          </Text>
        </Flex>

        {/* Error Alert */}
        {errors.email && (
          <Callout.Root variant="soft" color="red">
            <Callout.Icon>
              <InfoIcon />
            </Callout.Icon>
            <Callout.Text>
              Error occurred
            </Callout.Text>
          </Callout.Root>
        )}

        {/* Form */}
        <Flex direction="column" gap={12}>
          {/* Email Field */}
          <Flex direction="column" gap={1}>
            <Text size={2} weight="medium">
              Email
            </Text>
            <TextField
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={errors.email ? { borderColor: 'red' } : undefined}
            />
            {errors.email && (
              <Text color="red" size={1}>
                {errors.email}
              </Text>
            )}
          </Flex>

          {/* Password Field */}
          <Flex direction="column" gap={1}>
            <Text size={2} weight="medium">
              Password
            </Text>
            <TextField
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              style={errors.password ? { borderColor: 'red' } : undefined}
            />
            {errors.password && (
              <Text color="red" size={1}>
                {errors.password}
              </Text>
            )}
          </Flex>

          {/* Remember Me & Forgot Password */}
          <Flex direction="row" justify="space-between" align="center">
            <Checkbox label={'Remember me'} checked={rememberMe} onCheckedChange={setRememberMe} />
            <Button variant="ghost" size={1} onPress={onForgotPassword}>
              Forgot password?
            </Button>
          </Flex>

          {/* Submit Button */}
          <Button size={3} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <Flex direction="row" gap={2} align="center">
                <Spinner size={'small'} />
                <Text>Signing in...</Text>
              </Flex>
            ) : (
              'Sign In'
            )}
          </Button>
        </Flex>

        {/* Sign Up Link */}
        <Flex direction="row" align={'center'} justify="center">
          <Text size={2} color="gray">
            Don&apos;t have an account?
          </Text>
          <Button variant="ghost" size={1} onPress={onSignUp}>
            Sign up
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}

export default function App() {
  const handleLogin = async (email: string, password: string) => {
    // Call your authentication API
    console.log('Login:', { email, password });
  };

  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Login Example</PageHeading>
      </PageHeader>
      <PageBody>
        <Flex flex={1} justify="center" align="center" padding={4}>
          <LoginForm
            onLogin={handleLogin}
            onForgotPassword={() => console.log('Forgot password')}
            onSignUp={() => console.log('Sign up')}
          />
        </Flex>
      </PageBody>
    </PageContainer>
  );
}
