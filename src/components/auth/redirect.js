import React, { useEffect } from 'react';
import { useAppDispatch } from '../../store';
import { requestAccessToken } from '../../auth';
import { retrieveFromStorage } from '../../auth/storage';

export default function RedirectComponent() {
  const appDispatch = useAppDispatch();

  useEffect(() => {
    const queryParams = new URL(location.href).searchParams;
    if (!queryParams.has('code') || !queryParams.has('state')) {
      throw new Error('Unexpected redirect URL');
    }

    requestAccessToken(
      {
        provider: retrieveFromStorage('authProvider'),
        code: queryParams.get('code'),
        state: queryParams.get('state'),
      },
      appDispatch
    );
  }, []);

  return <div />;
}
