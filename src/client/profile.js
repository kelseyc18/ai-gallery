import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';

import GalleryApp from './gallery_app';
import UserPreview from './user_preview';
import ProfileHeader from './profile_header';
import { getUserByUsername, addUserFollowing, removeUserFollowing } from './redux/actions';

class Profile extends Component {
  componentDidMount() {
    const { match, getUserByUsername } = this.props;
    getUserByUsername(match.params.username);
  }

  componentDidUpdate(prevProps) {
    const { match, getUserByUsername } = this.props;
    const { username } = match.params;

    if (username !== prevProps.match.params.username) {
      getUserByUsername(username);
    }
  }

  isFollowing() {
    const { user, loggedInUser } = this.props;

    if (loggedInUser) {
      return user.Followers.filter(follower => follower.id === loggedInUser.id).length > 0;
    }
    return false;
  }

  render() {
    const { user, loggedInUser } = this.props;

    if (!user) {
      return (
        <div className={css(styles.userDoesNotExist)}>
          The profile for that user cannot be found.
        </div>
      );
    }

    const {
      username,
      projects,
      FavoriteProjects,
      Followees,
      Followers,
    } = user;

    return (
      <div className={css(styles.galleryContainer)}>
        <ProfileHeader user={user} loggedInUser={loggedInUser} />
        {projects.length > 0 && (
          <div className={css(styles.profileSection)}>
            <div className={css(styles.header)}>
              <span>{`Shared Apps (${projects.length})`}</span>
              <Link to={`/profile/${username}/projects`} className={css(styles.viewAllLink)}>
                View All
              </Link>
            </div>
            <div className={css(styles.sectionBody)}>
              {projects.map(project => (
                <GalleryApp project={project} key={project.id} className={css(styles.galleryApp)} />
              ))}
            </div>
          </div>
        )}
        {FavoriteProjects.length > 0 && (
          <div className={css(styles.profileSection)}>
            <div className={css(styles.header)}>
              <span>{`Favorite Projects (${FavoriteProjects.length})`}</span>
              <Link to={`/profile/${username}/favorites`} className={css(styles.viewAllLink)}>
                View All
              </Link>
            </div>
            <div className={css(styles.sectionBody)}>
              {FavoriteProjects.slice(0, 5).map(project => (
                <GalleryApp project={project} key={project.id} />
              ))}
            </div>
          </div>
        )}
        {Followees.length > 0 && (
          <div className={css(styles.profileSection)}>
            <div className={css(styles.header)}>
              <span>{`Following (${Followees.length})`}</span>
              <Link to={`/profile/${username}/following`} className={css(styles.viewAllLink)}>
                View All
              </Link>
            </div>
            <div className={css(styles.sectionBody)}>
              {Followees.map(followee => (
                <UserPreview user={followee} key={followee.id} />
              ))}
            </div>
          </div>
        )}
        {Followers.length > 0 && (
          <div className={css(styles.profileSection)}>
            <div className={css(styles.header)}>
              <span>{`Followers (${Followers.length})`}</span>
              <Link to={`/profile/${username}/followers`} className={css(styles.viewAllLink)}>
                View All
              </Link>
            </div>
            <div className={css(styles.sectionBody)}>
              {Followers.map(follower => (
                <UserPreview user={follower} key={follower.id} />
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
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    name: PropTypes.string,
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    ).isRequired,
    imagePath: PropTypes.string,
    bio: PropTypes.string,
    Followees: PropTypes.arrayOf(
      PropTypes.shape({
        username: PropTypes.string.isRequired,
      }),
    ),
    Followers: PropTypes.arrayOf(
      PropTypes.shape({
        username: PropTypes.string.isRequired,
      }),
    ),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
  }),
  getUserByUsername: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

const styles = StyleSheet.create({
  galleryContainer: {
    display: 'flex',
    margin: 'auto',
    marginTop: 100,
    marginBottom: 20,
    maxWidth: 850,
    paddingLeft: 20,
    flexDirection: 'column',
  },

  profileSection: {
    marginTop: 10,
    marginBottom: 10,
  },

  sectionBody: {
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

  userDoesNotExist: {
    textAlign: 'center',
    marginTop: 100,
  },
});

const mapStateToProps = state => ({
  user: state.selectedProfile,
  loggedInUser: state.loggedInUser,
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
