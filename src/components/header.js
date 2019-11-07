import React from 'react';
import { Link } from 'gatsby';
import { useAppState } from '../store/appContext';

export default function Header({ siteTitle }) {
  const appState = useAppState();
  const { user } = appState;

  return (
    <header>
      <div>
        <h1>
          <Link to="/">{siteTitle}</Link>
        </h1>
      </div>
      <div>Current user: {user}</div>
    </header>
  );
}
