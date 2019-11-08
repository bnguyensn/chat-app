import React from 'react';
import './layout.css';
import { AppProvider } from '../../store/appContext';

const Layout = ({ children }) => {
  return <AppProvider>{children}</AppProvider>;
};

export default Layout;
