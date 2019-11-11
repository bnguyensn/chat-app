import React from 'react';
import { Link } from 'gatsby';
import { useAppState } from '../../store';
import Avatar from './avatar';

export default function Header() {
  const appState = useAppState();
  const { user = {} } = appState;
  const { avatar_url } = user;

  return (
    <header className="flex justify-center p-4 bg-gray-600">
      <h1 className="mx-8">
        <Link to="/">GitHub OAuth App</Link>
      </h1>
      <Avatar src={avatar_url} />
    </header>
  );
}
