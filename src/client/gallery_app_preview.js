import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom';

import puppyImage from './puppy.png';

export default function GalleryAppPreview(props) {
  const { project, author } = props;

  return (
    <div className={css(styles.container)}>
      <Link to={`/project/${project.id}`}>
        <img
          className={css(styles.thumbnail)}
          src={project.imagePath || puppyImage}
          alt={project.title}
        />
      </Link>
      <div className={css(styles.rightSide)}>
        <Link to={`/project/${project.id}`}>
          <div className={css(styles.appTitle)}>{project.title}</div>
        </Link>
        <Link to={`/profile/${author.username}`}>
          <div className={css(styles.appAuthor)}>{author.username}</div>
        </Link>
      </div>
    </div>
  );
}

GalleryAppPreview.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  author: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginTop: 10,
    marginBottom: 10,
  },

  appTitle: {
    fontWeight: 'bold',
    color: '#128ba8',
    ':hover': {
      color: '#105fa8',
    },
  },

  appAuthor: {
    color: '#58585a',
  },

  thumbnail: {
    width: 40,
    height: 40,
  },

  rightSide: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
  },
});
