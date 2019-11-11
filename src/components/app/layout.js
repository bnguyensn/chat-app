import React from 'react';
import './layout.css';
import Header from './header';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col items-center">
      <Header />
      <div className="flex flex-col items-center w-full">
        <h1>Body</h1>
        <div>{children}</div>
      </div>
      <div className="w-full">
        <h1>Footer</h1>
      </div>
    </div>
  );
}
