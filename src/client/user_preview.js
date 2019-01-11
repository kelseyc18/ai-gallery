import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

import bobaImage from './boba.png';

export default function UserPreview(props) {
  const { user } = props;
  const { username, imagePath } = user;
  return (
    <div className={css(styles.previewContainer)}>
      <Link to={`/profile/${username}`}>
        <img className={css(styles.profileImage)} src={imagePath || bobaImage} alt="profile" />
      </Link>
      <Link to={`/profile/${username}`}>
        <div className={css(styles.appAuthor)}>{username}</div>
      </Link>
    </div>
  );
}

UserPreview.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    imagePath: PropTypes.string,
  }),
};

const styles = StyleSheet.create({
  previewContainer: {
    width: 64,
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
  },

  profileImage: {
    height: 64,
    width: 64,
    borderRadius: 2,
    marginBottom: 2,
  },

  appAuthor: {
    color: '#58585a',
    fontSize: 14,
    fontWeight: 'bold',
    ':hover': {
      textDecoration: 'underline',
    },
  },
});
