import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './Components/login/Start';
import Signup from './Components/login/Signup';
import Login from './Components/login/Login';
import SearchPage from './Components/main/SearchPage';
import Tours from './Components/main/Tours';
import TourDetails from './Components/main/TourDetails';
import ForgotPassword from './Components/login/ForgotPassword';
import ResetPassword from './Components/login/ResetPassword';
import Admin from './Components/Admin/Admin';
import UserManagement from './Components/Admin/UserManagement';
import LocationManagement from './Components/Admin/LocationManagement';
import ProtectedAdminRoute from './Components/utils/ProtectedAdminRoute';
import { AuthProvider } from './Components/utils/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public/General Pages */}
          <Route path="/" element={<Start />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/searchpage" element={<SearchPage />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetails />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            }
          >
            <Route path="users" element={<UserManagement />} />
            <Route path="locations" element={<LocationManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;