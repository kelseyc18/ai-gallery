import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

import puppyImage from './puppy.png';

export default function ProfileFeaturedProject(props) {
  const { project } = props;

  if (!project) {
    return (
      <div>
        <i>No featured project</i>
      </div>
    );
  }

  return (
    <div className={css(styles.container)}>
      <Link to={`/project/${project.id}`}>
        <img className={css(styles.appImage)} src={project.imagePath || puppyImage} alt="project" />
      </Link>
      <div className={css(styles.appTextContainer)}>
        <Link to={`/project/${project.id}`}>
          <p className={css(styles.appTitle)}>{project.title}</p>
        </Link>
        <div>{project.description}</div>
      </div>
    </div>
  );
}

ProfileFeaturedProject.propTypes = {
  project: PropTypes.shape({
    imagePath: PropTypes.string,
  }),
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },

  appImage: {
    minWidth: 160,
    width: 160,
    height: 160,
    borderRadius: 5,
  },

  appTextContainer: {
    marginLeft: 10,
    flexGrow: 1,
    fontSize: 14,
  },

  appTitle: {
    fontWeight: 800,
    fontSize: 20,
    color: '#128ba8',
    ':hover': {
      color: '#105fa8',
    },
    marginBottom: 5,
  },
});
