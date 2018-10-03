import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';

import GalleryApp from './gallery_app';
import { getUserByUsername } from './redux/actions';

class Profile extends Component {
  componentDidMount() {
    const username = this.props.match.params.username; // eslint-disable-line
    this.props.getUserByUsername(username); // eslint-disable-line
  }

  render() {
    const { user } = this.props;

    if (!user) {
      return <p>That user does not exist.</p>;
    }

    const { username, name, projects } = user;

    return (
      <div className={css(styles.galleryContainer)}>
        <div className={css(styles.profileContainer)}>
          <Link to={`/profile/${username}`}>
            <p className={css(styles.username)}>{username}</p>
          </Link>
          <p>{name}</p>
        </div>
        <p className={css(styles.header)}>{`Apps created by ${username}`}</p>
        <div className={css(styles.projectContainer)}>
          {projects.map(project => (
            <GalleryApp project={project} key={project._id} />
          ))}
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string,
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }),
};

const styles = StyleSheet.create({
  galleryContainer: {
    display: 'flex',
    margin: 'auto',
    marginTop: 100,
    maxWidth: 1000,
    paddingLeft: 20,
    flexDirection: 'column',
  },

  profileContainer: {
    background: 'white',
    width: '100%',
    padding: 10,
    borderRadius: 10,
  },

  username: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#58585a',
  },

  projectContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
  },

  header: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 30,
  },
});

const mapStateToProps = state => ({
  user: state.selectedProfile,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getUserByUsername,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
