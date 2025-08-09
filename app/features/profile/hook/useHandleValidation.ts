import { useState } from 'react';

import { HandleCharacterSchema, HandleSchema } from '../schema';

export function useHandleValidation() {
  const [handle, setHandle] = useState('');
  const [clientError, setClientError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const result = HandleCharacterSchema.safeParse(newValue);

    if (!result.success) {
      setClientError(result.error.issues[0].message);
    } else {
      setClientError('');
    }

    const sanitizedValue = newValue.replace(/[^a-zA-Z0-9_]/g, '');
    setHandle(sanitizedValue);
  };

  const handleInputBlur = () => {
    if (handle.length > 0) {
      const result = HandleSchema.pick({ handle: true }).safeParse({ handle });
      if (!result.success) {
        setClientError(result.error.issues[0].message);
      } else {
        setClientError('');
      }
    }
  };

  return {
    handle,
    clientError,
    handleInputChange,
    handleInputBlur,
  };
}
