import { useState } from 'react';

type Values<Name extends string> = Record<Name, string>;
type Errors<Name extends string> = Partial<Record<Name, string>>;

/** Shared value/error state for the Login and Sign Up forms. */
export function useAuthFormState<Name extends string>(initial: Values<Name>) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Errors<Name>>({});
  const [submitCount, setSubmitCount] = useState(0);

  const change = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  return { values, setValues, errors, setErrors, submitCount, setSubmitCount, change };
}
