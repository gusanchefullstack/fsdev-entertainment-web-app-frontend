import { useState, type ReactNode } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router';
import { ApiError } from '../../api/ApiClient';
import { AuthForm } from '../../components/AuthForm/AuthForm';
import { AuthLayout } from '../../components/AuthLayout/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { friendlyMessage } from '../../lib/errorMessages';
import { safeReturnTo } from '../../lib/safeReturnTo';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { useAuthFormState } from '../LoginPage/useAuthFormState';

const EMPTY = "Can't be empty";
const MIN_PASSWORD_LENGTH = 8;

export function SignUpPage() {
  useDocumentTitle('Sign Up');
  const { status, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawReturnTo = searchParams.get('returnTo');
  const returnTo = safeReturnTo(rawReturnTo);
  const form = useAuthFormState({ email: '', password: '', repeatPassword: '' });
  const [formError, setFormError] = useState<ReactNode>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === 'signedIn' && !submitting) return <Navigate to={returnTo} replace />;

  const loginHref = rawReturnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : '/login';

  const submit = async () => {
    form.setSubmitCount((count) => count + 1);
    setFormError(null);
    const { email, password, repeatPassword } = form.values;
    const errors = {
      email: email.trim() ? undefined : EMPTY,
      password: !password
        ? EMPTY
        : password.length < MIN_PASSWORD_LENGTH
          ? 'Must be at least 8 characters'
          : undefined,
      repeatPassword: !repeatPassword ? EMPTY : repeatPassword !== password ? "Passwords don't match" : undefined,
    };
    form.setErrors(errors);
    if (errors.email || errors.password || errors.repeatPassword) return;

    setSubmitting(true);
    try {
      await signUp(email.trim(), password);
      navigate(returnTo, { replace: true });
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      if (apiError?.fields) form.setErrors(apiError.fields);
      if (apiError?.code === 'EMAIL_TAKEN') {
        setFormError(
          <>
            {friendlyMessage('EMAIL_TAKEN')}
            <Link to={loginHref}>Login</Link>
          </>,
        );
      } else if (apiError?.code !== 'VALIDATION_ERROR') {
        setFormError(friendlyMessage(apiError?.code ?? 'INTERNAL_ERROR'));
      }
      form.setSubmitCount((count) => count + 1);
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthForm
        title="Sign Up"
        fields={[
          { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email', value: form.values.email, error: form.errors.email },
          { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', value: form.values.password, error: form.errors.password },
          { name: 'repeatPassword', label: 'Repeat password', type: 'password', autoComplete: 'new-password', value: form.values.repeatPassword, error: form.errors.repeatPassword },
        ]}
        submitLabel="Create an account"
        submitting={submitting}
        formError={formError}
        submitCount={form.submitCount}
        onChange={form.change}
        onSubmit={submit}
        footer={
          <>
            <span>Already have an account?</span>
            <Link to={loginHref}>Login</Link>
          </>
        }
      />
    </AuthLayout>
  );
}
