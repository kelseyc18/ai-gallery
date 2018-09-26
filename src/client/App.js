import React from 'react';
import { Route, Link } from 'react-router-dom';

import GalleryContainer from './gallery_container';
import ProjectDetail from './project_detail';
import './app.css';
import logo from './logo.png';

export default function App() {
  return (
    <div>
      <div className="header-container">
        <div className="header">
          <Link to="/">
            <img className="logo" src={logo} alt="logo" />
          </Link>
          <Link to="/">
            <h1 className="header-title">Project Gallery</h1>
          </Link>
        </div>
      </div>

      <Route exact path="/" component={GalleryContainer} />
      <Route path="/project/:projectId" component={ProjectDetail} />
    </div>
  );
}
