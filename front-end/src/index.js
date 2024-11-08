import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Adjust the path if necessary
import './index.css'; // Include your CSS file
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
