import React from 'react';
import Layout from '../../components/app/layout';
import { AppProvider } from '../../store';
import StateDisplay from '../../components/state/stateDisplay';
import RedirectComponent from '../../components/auth/redirect';

export default function Redirect() {
  return (
    <AppProvider>
      <Layout>
        <RedirectComponent />
        <StateDisplay />
      </Layout>
    </AppProvider>
  );
}
