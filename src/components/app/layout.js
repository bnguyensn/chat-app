import React from 'react';
import './layout.css';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <h1>Header</h1>
        <a href="/">Home</a>
      </div>
      <div className="flex flex-col items-center w-full">
        <h1>Body</h1>
        <div>{children}</div>
      </div>
      <div className="w-full">
        <h1>Footer</h1>
      </div>
    </div>
  );
};

export default Layout;
