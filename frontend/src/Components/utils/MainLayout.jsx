import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../utils/Navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default MainLayout;