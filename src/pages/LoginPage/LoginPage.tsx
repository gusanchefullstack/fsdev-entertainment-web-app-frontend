import { useState, type ReactNode } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router';
import { ApiError } from '../../api/ApiClient';
import { AuthForm } from '../../components/AuthForm/AuthForm';
import { AuthLayout } from '../../components/AuthLayout/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { friendlyMessage } from '../../lib/errorMessages';
import { safeReturnTo } from '../../lib/safeReturnTo';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { useAuthFormState } from './useAuthFormState';

const EMPTY = "Can't be empty";

export function LoginPage() {
  useDocumentTitle('Login');
  const { status, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get('returnTo'));
  const form = useAuthFormState({ email: '', password: '' });
  const [formError, setFormError] = useState<ReactNode>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === 'signedIn' && !submitting) return <Navigate to={returnTo} replace />;

  const submit = async () => {
    form.setSubmitCount((count) => count + 1);
    setFormError(null);
    const errors = {
      email: form.values.email.trim() ? undefined : EMPTY,
      password: form.values.password ? undefined : EMPTY,
    };
    form.setErrors(errors);
    if (errors.email || errors.password) return;

    setSubmitting(true);
    try {
      await signIn(form.values.email.trim(), form.values.password);
      navigate(returnTo, { replace: true });
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      if (apiError?.code === 'VALIDATION_ERROR' && apiError.fields) {
        form.setErrors(apiError.fields);
        form.setSubmitCount((count) => count + 1);
      } else {
        setFormError(friendlyMessage(apiError?.code ?? 'INTERNAL_ERROR'));
        if (apiError?.code === 'INVALID_CREDENTIALS') {
          form.setValues((current) => ({ ...current, password: '' }));
        }
      }
      setSubmitting(false);
    }
  };

  const signUpHref = `/sign-up?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <AuthLayout>
      <AuthForm
        title="Login"
        fields={[
          { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email', value: form.values.email, error: form.errors.email },
          { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password', value: form.values.password, error: form.errors.password },
        ]}
        submitLabel="Login to your account"
        submitting={submitting}
        formError={formError}
        submitCount={form.submitCount}
        onChange={form.change}
        onSubmit={submit}
        footer={
          <>
            <span>Don’t have an account?</span>
            <Link to={signUpHref}>Sign Up</Link>
          </>
        }
      />
    </AuthLayout>
  );
}
