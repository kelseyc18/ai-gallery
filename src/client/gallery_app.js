import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import puppyImage from './puppy.png';
import './app.css';

export default function GalleryContainer(props) {
  const { project } = props;

  return (
    <div className="gallery-app">
      <Link to={`/project/${project.projectId}`}>
        <img className="app-image" src={puppyImage} alt="project" />
      </Link>
      <div className="app-description-container">
        <Link to={`/project/${project.projectId}`}>
          <p className="app-title">{project.title}</p>
        </Link>
        <a href="http://appinventor.mit.edu/">
          <p className="app-author">{project.authorId}</p>
        </a>
      </div>
    </div>
  );
}

GalleryContainer.propTypes = {
  project: PropTypes.any.isRequired // eslint-disable-line
};
