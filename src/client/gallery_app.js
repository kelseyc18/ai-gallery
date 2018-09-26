import React from 'react';
import PropTypes from 'prop-types';
import puppyImage from './puppy.png';
import './app.css';

export default function GalleryContainer(props) {
  const { app } = props;

  return (
    <div className="gallery-app">
      <a href="http://appinventor.mit.edu">
        <img className="app-image" src={puppyImage} alt="app" />
      </a>
      <div className="app-description-container">
        <a href="http://appinventor.mit.edu/">
          <p className="app-title">{app.title}</p>
        </a>
        <a href="http://appinventor.mit.edu/">
          <p className="app-author">{app.authorId}</p>
        </a>
      </div>
    </div>
  );
}

GalleryContainer.propTypes = {
  app: PropTypes.any.isRequired // eslint-disable-line
};
