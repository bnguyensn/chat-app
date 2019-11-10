import React from 'react';
import Button from '../app/button';
import { requestAuthentication } from '../../auth';

export default function Auth() {
  const startLogin = () => {
    requestAuthentication('github', {
      login: 'bnguyensn',
    });
  };

  return (
    <div className="m-4 p-4">
      <h2>Auth component</h2>
      <Button onClick={startLogin}>LOG IN</Button>
    </div>
  );
}
