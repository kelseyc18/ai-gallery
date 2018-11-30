import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

import puppyImage from './puppy.png';
import bobaImage from './boba.png';
import './app.css';

export default function GalleryApp(props) {
  const { project } = props;
  const profileImage = project.author.imagePath;

  return (
    <div className={css(styles.galleryApp)}>
      <Link to={`/project/${project.id}`}>
        <img className={css(styles.appImage)} src={project.imagePath || puppyImage} alt="project" />
      </Link>
      <div className={css(styles.descriptionContainer)}>
        <Link to={`/profile/${project.author.username}`} className={css(styles.profileImage)}>
          <img className={css(styles.profileImage)} src={profileImage || bobaImage} alt="profile" />
        </Link>
        <div className={css(styles.textDescription)}>
          <Link to={`/project/${project.id}`}>
            <p className={css(styles.appTitle)}>{project.title}</p>
          </Link>
          <Link to={`/profile/${project.author.username}`}>
            <p className={css(styles.appAuthor)}>{project.author.username}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

GalleryApp.propTypes = {
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
    width: 160,
    height: 160,
    borderRadius: 5,
  },

  descriptionContainer: {
    marginTop: 2,
    display: 'flex',
    alignItems: 'center',
  },

  textDescription: {
    display: 'flex',
    marginLeft: 8,
    flexDirection: 'column',
  },

  appTitle: {
    fontWeight: 800,
    fontSize: 16,
    color: '#128ba8',
    ':hover': {
      color: '#105fa8',
    },
  },

  profileImage: {
    height: 30,
    width: 30,
    borderRadius: 2,
  },

  appAuthor: {
    color: '#58585a',
    fontSize: 12,
    ':hover': {
      textDecoration: 'underline',
    },
  },
});
