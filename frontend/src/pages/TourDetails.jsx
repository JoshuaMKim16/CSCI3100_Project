import React, { useState, useEffect } from 'react';
import {Container, Row, Col, Form, ListGroup} from 'reactstrap';
import {useParams} from 'react-router-dom'
import '../styles/tour-details.css'; // Reuse the existing styles

const TourDetails = () => {
  const {id} = useParams();
  const [location, setLocation] = useState([]);
  const [error, setError] = useState(null);

  // Fetch locations from the backend
  const fetchLocationByID = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/locations/${id}`);
      console.log(response);
      if(!response.ok){
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      };
      const data = await response.json();
      console.log(data);
      setLocation(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to load location details.');
    }}

    useEffect(() => {
        if(id){
            fetchLocationByID(id);
        }
    }, [id]);

    const [imageSrc, setImageSrc] = useState(null)
        useEffect(() => {
          const loadImage = async () => {
            try {
              const imageModule = await import(`../assets/site_data/${location.picture}`)
              setImageSrc(imageModule.default)
            } catch (error) {
              console.error('Error loading the image:', error)
            }
          }
          loadImage();
        })

        return (
            <div className="p-4">
              <h1 className="text-2xl font-bold mb-4">Location Details</h1>
        
              {/* Display error message if any */}
              {error && <p className="text-red-500">{error}</p>}
        
              {/* Render location details */}
              {location ? (
                <div className="p-4 border border-gray-300 rounded-md shadow-md">
                  <h2 className="text-xl font-semibold">{location.name}</h2>
                  <p className="text-gray-600">Address: {location.address}</p>
                  <p className="text-gray-600">
                    Description: {location.description || 'No description available'}
                  </p>
                </div>
              ) : (
                !error && <p className="text-gray-500">Loading location details...</p>
              )}
            </div>
          );
}

export default TourDetails