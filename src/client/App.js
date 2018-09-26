import React from 'react';
import GalleryContainer from './gallery_container';
import './app.css';
import logo from './logo.png';

export default function App() {
  return (
    <div>
      <div className="header-container">
        <div className="header">
          <img src={logo} alt="logo" />
          <h1 className="header-title">Project Gallery</h1>
        </div>
      </div>
      <GalleryContainer />
    </div>
  );
}
