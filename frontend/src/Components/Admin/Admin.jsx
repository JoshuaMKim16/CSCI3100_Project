// /src/Components/Admin/Admin.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  return (
    <div className="admin-main">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Please choose one of the options below.</p>
      <nav>
        <ul>
          <li>
            <Link to="/admin/users">Manage Users</Link>
          </li>
          <li>
            <Link to="/admin/locations">Manage Locations</Link>
          </li>
        </ul>
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;