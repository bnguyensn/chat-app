import React, { useEffect } from 'react';
import { useAppDispatch, useAppState } from '../store/appContext';
import Layout from '../components/app/layout';
import checkRedirect from '../auth/redirect';
import Button from '../components/app/button';
import { requestAuthCode } from '../auth';

export default function Index() {
  const appState = useAppState();
  const appDispatch = useAppDispatch();

  useEffect(() => {
    checkRedirect('github', appDispatch);
  });

  const handleLogIn = () => {
    requestAuthCode('github');
  };

  return (
    <Layout>
      <div>user: {appState}</div>
      <Button onClick={handleLogIn}>LOG IN</Button>
    </Layout>
  );
}
