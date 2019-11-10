import React from 'react';
import { AppProvider } from '../store';
import Layout from '../components/app/layout';
import Auth from '../components/auth/auth';
import StateDisplay from '../components/state/stateDisplay';

export default function Index() {
  return (
    <Layout>
      <AppProvider>
        <Auth />
        <StateDisplay />
      </AppProvider>
    </Layout>
  );
}
