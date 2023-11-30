import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'


function MyComponent() {
  const [barcode, setBarcode] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordSubmit = (isPasswordCorrect) => {
    setIsAuthenticated(isPasswordCorrect);
  };

  if (isAuthenticated) {
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      try {
        const servers = ['http://192.168.2.217:8080', 'http://192.168.2.96:8080', 'http://192.168.3.39:8080'];
      
        const requests = servers.map(async (server) => {
          const response = await axios.post(`${server}/cbsa`, { barcode }, {
            headers: {
              'Content-Type': 'application/json' // Set the request header for JSON data
            }
          });
      
          const { message, error } = response.data;
          if (error) {
            return { errorMessage: error, responseMessage: '' };
          } else {
            return { errorMessage: '', responseMessage: message };
          }
        });
      
        const results = await Promise.all(requests);
      
        results.forEach(({ errorMessage, responseMessage }) => {
          if (errorMessage) {
            setErrorMessage(errorMessage);
            setResponseMessage('');
          } else {
            setErrorMessage('');
            setResponseMessage(responseMessage);
          }
        });
      } catch (error) {
        setErrorMessage(`Unable to send request to the API Servers. Please contact Insix. ${error.message}`);
        console.error(error); // Handle the error
      } 
    };
  
    const handleBarcodeChange = (event) => {
      setBarcode(event.target.value);
    };
  
    return (
      <div className="container">
        <h2>ADD CBSA to Conveyor</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="barcodeInput">Barcode:</label>
            <input
              type="text"
              className="form-control"
              id="barcodeInput"
              value={barcode}
              onChange={handleBarcodeChange}
            />
          </div>
          <br></br>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        {responseMessage && (
          <div className="mt-4 alert alert-success">
            <strong>Response:</strong> {responseMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 alert alert-danger">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}
      </div>
    );
  } else {
    // Show the password prompt
    return <PasswordPrompt onPasswordSubmit={handlePasswordSubmit} />;
  }
}


const PasswordPrompt = ({ onPasswordSubmit }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform password validation
    if (password === '9804' || password === '2410') {
      onPasswordSubmit(true); // Call the parent component's callback to grant access
    } else {
      // Handle incorrect password case
      setPassword('');
      alert('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Please enter the administrator password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};


export default MyComponent;