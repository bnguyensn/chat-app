import React from 'react';
import Layout from '../../components/app/layout';
import { AppProvider } from '../../store';
import StateDisplay from '../../components/state/stateDisplay';
import RedirectComponent from '../../components/auth/redirect';

export default function Redirect() {
  // const accessTokenState = appState && appState.accessToken;
  //
  // useEffect(() => {
  //   console.log('Redirect renders!');
  //   console.log(`Redirect: appState:`);
  //   console.log(appState);
  //   console.log(`Redirect: dispatch:`);
  //   console.log(dispatch);
  //
  //   if (!accessTokenState && typeof dispatch === 'function') {
  //     const queryParams = new URL(location.href).searchParams;
  //
  //     if (!queryParams.has('code') || !queryParams.has('state')) {
  //       throw new Error('Unexpected redirect URL');
  //     }
  //
  //     requestAccessToken(
  //       {
  //         provider: retrieveFromStorage('authProvider'),
  //         code: queryParams.get('code'),
  //         state: queryParams.get('state'),
  //       },
  //       dispatch
  //     );
  //   }
  // }, [appState, accessTokenState, dispatch]);

  return (
    <AppProvider>
      <Layout>
        <RedirectComponent />
        <StateDisplay />
      </Layout>
    </AppProvider>
  );
}
