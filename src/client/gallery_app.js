import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

import puppyImage from './puppy.png';
import './app.css';

export default function GalleryContainer(props) {
  const { project } = props;

  return (
    <div className={css(styles.galleryApp)}>
      <Link to={`/project/${project._id}`}>
        <img className={css(styles.appImage)} src={puppyImage} alt="project" />
      </Link>
      <div className={css(styles.descriptionContainer)}>
        <Link to={`/project/${project._id}`}>
          <p className={css(styles.appTitle)}>{project.title}</p>
        </Link>
        <a href="http://appinventor.mit.edu/">
          <p className={css(styles.appAuthor)}>{project.authorId}</p>
        </a>
      </div>
    </div>
  );
}

GalleryContainer.propTypes = {
  project: PropTypes.any.isRequired, // eslint-disable-line
};

const styles = StyleSheet.create({
  galleryApp: {
    border: 'solid #dddddd 1px',
    borderRadius: 10,
    backgroundColor: 'white',
    marginRight: 20,
    marginBottom: 20,
    padding: 10,
    width: 160,
  },

  appImage: {
    margin: 'auto',
    width: '100%',
  },

  descriptionContainer: {
    marginTop: 2,
  },

  appTitle: {
    fontWeight: 800,
    fontSize: 16,
    color: '#128ba8',
    ':hover': {
      color: '#105fa8',
    },
  },

  appAuthor: {
    color: '#58585a',
  },
});
