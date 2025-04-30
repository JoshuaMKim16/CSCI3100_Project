// /src/Components/Admin/LocationManagement.jsx
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import './Admin.css';

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');

  const fetchLocations = async () => {
    try {
      const response = await Axios.get('http://localhost:3000/api/locations');
      setLocations(response.data);
    } catch (err) {
      setError('Error fetching locations.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="admin-section">
      <h2>Location Management</h2>
      {error && <div className="error-message">{error}</div>}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            {/* Add more columns if needed */}
          </tr>
        </thead>
        <tbody>
          {locations.map(location => (
            <tr key={location._id}>
              <td>{location._id}</td>
              <td>{location.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LocationManagement;