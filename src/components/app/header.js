import React from 'react';
import { Link } from 'gatsby';
import { useAppState } from '../../store';
import Avatar from './avatar';
import { retrieveFromStorage } from '../../auth/storage';
import endpoints from '../../auth/endpoints.json';

export default function Header() {
  const appState = useAppState();

  console.log('Header rendered:');
  console.log(appState);

  const user = appState.auth.user;
  const provider = retrieveFromStorage('authProvider');
  const avatarUrl = user && user[endpoints[provider].userDetailsAvatarField];

  return (
    <header className="flex justify-center p-4 bg-gray-600">
      <h1 className="mx-8">
        <Link to="/">GitHub OAuth App</Link>
      </h1>
      <Avatar src={avatarUrl} />
    </header>
  );
}
