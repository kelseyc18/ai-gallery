import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';

import GalleryApp from './gallery_app';
import { getUserByUsername } from './redux/actions';
import bobaImage from './boba.png';

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

    const {
      username, name, projects, imagePath, bio, FavoriteProjects,
    } = user;

    return (
      <div className={css(styles.galleryContainer)}>
        <div className={css(styles.profileContainer)}>
          <img className={css(styles.profileImage)} src={imagePath || bobaImage} alt="profile" />
          <div className={css(styles.profileTextContainer)}>
            <Link to={`/profile/${username}`}>
              <p className={css(styles.username)}>{username}</p>
            </Link>
            <p>{name}</p>
            <p className={css(styles.bio)}>{bio || `This is ${name}'s bio!`}</p>
          </div>
        </div>
        {projects.length > 0 && (
          <div className={css(styles.profileProjectSection)}>
            <div className={css(styles.header)}>
              <span>{`Shared Apps (${projects.length})`}</span>
              <Link to={`/profile/${username}/projects`} className={css(styles.viewAllLink)}>
                View All
              </Link>
            </div>
            <div className={css(styles.projectContainer)}>
              {projects.map(project => (
                <GalleryApp project={project} key={project.id} />
              ))}
            </div>
          </div>
        )}
        {FavoriteProjects.length > 0 && (
          <div className={css(styles.profileProjectSection)}>
            <div className={css(styles.header)}>
              <span>{`Favorite Projects (${FavoriteProjects.length})`}</span>
              <Link to={`/profile/${username}/favorites`} className={css(styles.viewAllLink)}>
                View All
              </Link>
            </div>
            <div className={css(styles.projectContainer)}>
              {FavoriteProjects.slice(0, 5).map(project => (
                <GalleryApp project={project} key={project.id} />
              ))}
            </div>
          </div>
        )}
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
    imagePath: PropTypes.string,
    bio: PropTypes.string,
  }),
};

const styles = StyleSheet.create({
  galleryContainer: {
    display: 'flex',
    margin: 'auto',
    marginTop: 100,
    maxWidth: 850,
    paddingLeft: 20,
    flexDirection: 'column',
  },

  profileContainer: {
    display: 'flex',
    background: 'white',
    width: '100%',
    borderRadius: 10,
  },

  profileImage: {
    height: 72,
    width: 72,
    borderRadius: 5,
    margin: 10,
  },

  profileTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
  },

  username: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#58585a',
    ':hover': {
      textDecoration: 'underline',
    },
  },

  bio: {
    marginTop: 5,
  },

  profileProjectSection: {
    marginTop: 20,
  },

  projectContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fef1e6',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    border: '#F88D34 1.5px solid',
    borderTop: 0,
    padding: 10,
  },

  header: {
    backgroundColor: '#F88D34',
    fontWeight: 'bold',
    fontSize: 18,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },

  viewAllLink: {
    fontSize: 14,
    color: '#128ba8',
    ':hover': {
      textDecoration: 'underline',
    },
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
