import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

import puppyImage from './puppy.png';
import codiImage from './codi.png';
import './app.css';
import FeaturedProjectLabel from './featured_project_label';

export default function GalleryApp(props) {
  const { project, showFeatured } = props;
  const { featuredLabel } = project;
  const profileImage = project.author.imagePath;

  return (
    <div className={css(styles.galleryApp, showFeatured && styles.featuredGalleryApp)}>
      <div className={css(styles.previewContainer)}>
        <Link to={`/project/${project.id}`}>
          <img
            className={css(styles.appImage)}
            src={project.imagePath || puppyImage}
            alt="project"
          />
        </Link>
        <div className={css(styles.descriptionContainer)}>
          <Link to={`/profile/${project.author.username}`} className={css(styles.profileImage)}>
            <img
              className={css(styles.profileImage)}
              src={profileImage || codiImage}
              alt="profile"
            />
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
      {!!showFeatured && !!featuredLabel && (
        <div className={css(styles.featuredProjectLabel)}>
          <FeaturedProjectLabel label={featuredLabel} hasTopMargin={false} />
        </div>
      )}
    </div>
  );
}

GalleryApp.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    author: PropTypes.shape({
      username: PropTypes.string.isRequired,
      imagePath: PropTypes.string,
    }).isRequired,
  }),
  showFeatured: PropTypes.bool,
};

const styles = StyleSheet.create({
  galleryApp: {
    border: 'solid #dddddd 1px',
    borderRadius: 10,
    backgroundColor: 'white',
    margin: 10,
    padding: 10,
    width: 160,
  },

  featuredGalleryApp: {
    width: 500,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  previewContainer: {
    width: 160,
  },

  featuredProjectLabel: {
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'stretch',
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
    alignItems: 'flex-start',
  },

  textDescription: {
    display: 'flex',
    marginLeft: 8,
    flexDirection: 'column',
    overflow: 'hidden',
  },

  appTitle: {
    fontWeight: 800,
    fontSize: 16,
    color: '#128ba8',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
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
