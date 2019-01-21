import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';

import { addUserFollowing, removeUserFollowing } from './redux/actions';
import bobaImage from './boba.png';
import ProfileFeaturedProject from './profile_featured_project';

class ProfileHeader extends Component {
  isFollowing() {
    const { user, loggedInUser } = this.props;

    if (loggedInUser) {
      return user.Followers.filter(follower => follower.id === loggedInUser.id).length > 0;
    }
    return false;
  }

  render() {
    const {
      user, loggedInUser, removeUserFollowing, addUserFollowing,
    } = this.props;

    const {
      id, username, name, projects, imagePath, bio, FeaturedProject,
    } = user;

    const isLoggedInUserProfile = loggedInUser && id === loggedInUser.id;
    const isFollowing = this.isFollowing();

    const projectToFeature = FeaturedProject || (projects.length > 0 && projects.slice(-1)[0]) || null;

    return (
      <div className={css(styles.profileContainer)}>
        <div className={css(styles.profileHeader)}>
          <img className={css(styles.profileImage)} src={imagePath || bobaImage} alt="profile" />
          <div className={css(styles.profileTextContainer)}>
            <Link to={`/profile/${username}`}>
              <p className={css(styles.username)}>{username}</p>
            </Link>
            <p>{name}</p>
            {isLoggedInUserProfile && (
              <button type="button" className={css(styles.editButton)}>
                Edit Profile
              </button>
            )}
          </div>
          {!isLoggedInUserProfile && (
            <button
              type="button"
              className={css(styles.followButton)}
              disabled={!loggedInUser}
              onClick={() => {
                if (isFollowing) {
                  removeUserFollowing(loggedInUser.id, id);
                } else {
                  addUserFollowing(loggedInUser.id, id);
                }
              }}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        <div className={css(styles.profileBody)}>
          <div className={css(styles.bioContainer)}>
            <p className={css(styles.profileTitle)}>About Me</p>
            <p className={css(styles.bio)}>{bio || `This is ${name}'s bio!`}</p>
          </div>

          <div className={css(styles.featuredProjectContainer)}>
            <p className={css(styles.profileTitle)}>Featured Project</p>
            <ProfileFeaturedProject project={projectToFeature} />
          </div>
        </div>
      </div>
    );
  }
}

ProfileHeader.propTypes = {
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
  }),
  addUserFollowing: PropTypes.func.isRequired,
  removeUserFollowing: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

const styles = StyleSheet.create({
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },

  profileImage: {
    height: 72,
    width: 72,
    borderRadius: 5,
  },

  profileHeader: {
    display: 'flex',
    flexDirection: 'row',
  },

  profileTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
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

  profileBody: {
    marginTop: 10,
    borderTop: '1px black solid',
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'row',
  },

  profileTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },

  bioContainer: {
    flexGrow: 1,
  },

  featuredProjectContainer: {
    width: 400,
    padding: 10,
    border: 'solid #dddddd 1px',
    borderRadius: 10,
    backgroundColor: 'white',
  },

  followButton: {
    height: 30,
    marginLeft: 'auto',
  },

  editButton: {
    maxWidth: 100,
    marginTop: 10,
  },
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    addUserFollowing,
    removeUserFollowing,
  },
  dispatch,
);

export default connect(
  null,
  mapDispatchToProps,
)(ProfileHeader);
