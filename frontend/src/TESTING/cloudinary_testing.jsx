import React, { useState } from 'react';

const TestAPIs = () => {
  // States for upload functionality
  const [files, setFiles] = useState([]);
  const [uploadResults, setUploadResults] = useState([]);
  const [uploadError, setUploadError] = useState('');

  // States for fetching images
  const [allImages, setAllImages] = useState([]);
  const [specificImage, setSpecificImage] = useState(null);
  const [fetchError, setFetchError] = useState('');

  // Handle file selection for upload (allow multiple files)
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setUploadResults([]);
    setUploadError('');
  };

  // Handle the upload button click
  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadError('Please select one or more files first');
      return;
    }

    try {
      const uploadPromises = files.map((file) => {
        const formData = new FormData();
        formData.append('file', file);
        return fetch('http://localhost:3000/api/photos/upload', {
          method: 'POST',
          body: formData,
        }).then(async (response) => {
          if (!response.ok) {
            throw new Error('Upload failed');
          }
          return response.json();
        });
      });

      const results = await Promise.all(uploadPromises);
      setUploadResults(results);
      setUploadError('');
      console.log('Upload successful!', results);
    } catch (err) {
      console.error('Error uploading images:', err);
      setUploadError('Error uploading images. Please try again.');
    }
  };

  // Fetch all images from the backend
  const fetchAllImages = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/photos/');
      if (!response.ok) {
        throw new Error('Fetching all images failed');
      }
      const data = await response.json();
      setAllImages(data);
      setFetchError('');
    } catch (err) {
      console.error('Error fetching all images:', err);
      setFetchError('Error fetching all images: ' + err.message);
    }
  };

  // Fetch a specific image by filename (example: "0_AUy1YQ0cj0.jpg")
  const fetchSpecificImage = async () => {
    try {
      // Note: Adjust the filename if your backend strips the file extension.
      const response = await fetch('http://localhost:3000/api/photos/0_AUy1YQ0cj0');
      if (!response.ok) {
        throw new Error('Fetching specific image failed');
      }
      const data = await response.json();
      setSpecificImage(data);
      setFetchError('');
    } catch (err) {
      console.error('Error fetching specific image:', err);
      setFetchError('Error fetching specific image: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', textAlign: 'center' }}>
      <h1>Test Cloudinary APIs</h1>
      
      {/* Upload Section */}
      <section style={{ marginBottom: '40px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
        <h2>Upload Image(s)</h2>
        <input type="file" multiple onChange={handleFileChange} />
        <br /><br />
        <button onClick={handleUpload}>Upload</button>
        {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
        {uploadResults.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Upload Results</h3>
            {uploadResults.map((result, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <p>{result.secure_url}</p>
                <img
                  src={result.secure_url}
                  alt={`Uploaded ${index}`}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Fetch Section */}
      <section>
        <h2>Fetch Images</h2>
        {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
        <div style={{ marginBottom: '20px' }}>
          <button onClick={fetchAllImages}>Fetch All Images</button>
          <button onClick={fetchSpecificImage} style={{ marginLeft: '10px' }}>
            Fetch "0_AUy1YQ0cj0.jpg"
          </button>
        </div>

        {/* Display all images */}
        {allImages.length > 0 && (
          <div>
            <h3>All Images</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {allImages.map((image) => (
                <li key={image.public_id} style={{ marginBottom: '20px' }}>
                  <p>
                    <strong>{image.public_id}</strong>
                  </p>
                  {image.secure_url && (
                    <img
                      src={image.secure_url}
                      alt={image.public_id}
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display specific image */}
        {specificImage && (
          <div>
            <h3>Specific Image Details</h3>
            <p>
              <strong>Public ID:</strong> {specificImage.public_id}
            </p>
            {specificImage.secure_url && (
              <img
                src={specificImage.secure_url}
                alt={specificImage.public_id}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default TestAPIs;