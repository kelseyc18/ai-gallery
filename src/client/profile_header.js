import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';

import {
  addUserFollowing,
  removeUserFollowing,
  editProjectOrProfile,
  cancelEditProjectOrProfile,
  updateUserProfile,
} from './redux/actions';
import bobaImage from './boba.png';
import ProfileFeaturedProject from './profile_featured_project';

class ProfileHeader extends Component {
  state = {
    id: undefined,
    name: undefined,
    bio: undefined,
    newImage: undefined,
    featuredProject: undefined,
  };

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
    this.imageRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.user && state.id !== props.user.id) {
      const { projects } = props.user;
      const defaultFeaturedProject = (projects.length > 0 && projects.slice(-1)[0]) || null;

      return {
        id: props.user.id,
        name: props.user.name,
        bio: props.user.bio,
        featuredProject: props.user.FeaturedProject || defaultFeaturedProject,
      };
    }
    return null;
  }

  resetState = () => {
    const { user } = this.props;
    const {
      id, name, bio, FeaturedProject, projects,
    } = user;
    const defaultFeaturedProject = (projects.length > 0 && projects.slice(-1)[0]) || null;

    this.setState({
      id,
      name,
      bio,
      featuredProject: FeaturedProject || defaultFeaturedProject,
    });
  };

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  };

  handleBioChange = (event) => {
    this.setState({
      bio: event.target.value,
    });
  };

  handleFeaturedProjectChange = (event) => {
    const { user } = this.props;
    const { projects } = user;
    const projectMatch = projects.filter((project) => { // eslint-disable-line
      return project.id === parseInt(event.target.value, 10);
    });
    this.setState({
      featuredProject: projectMatch[0],
    });
  };

  handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      this.setState({
        newImage: file,
      });
      const reader = new FileReader();

      reader.onloadend = () => {
        this.imageRef.current.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  handleSaveProfile = () => {
    const {
      id, name, bio, newImage, featuredProject,
    } = this.state;
    const { updateUserProfile } = this.props;

    updateUserProfile(id, name, bio, newImage, featuredProject);
  }

  isFollowing = () => {
    const { user, loggedInUser } = this.props;

    if (loggedInUser) {
      return user.Followers.filter(follower => follower.id === loggedInUser.id).length > 0;
    }
    return false;
  };

  render() {
    const {
      user,
      loggedInUser,
      removeUserFollowing,
      addUserFollowing,
      editProjectOrProfile,
      cancelEditProjectOrProfile,
      inEditMode,
    } = this.props;
    const {
      id, name, bio, featuredProject,
    } = this.state;
    const {
      username, projects, imagePath,
    } = user;

    const isLoggedInUserProfile = loggedInUser && id === loggedInUser.id;
    const isFollowing = this.isFollowing();

    return inEditMode ? (
      <div className={css(styles.profileContainer)}>
        <div className={css(styles.profileHeader)}>
          <div className={css(styles.imageContainer)}>
            <img className={css(styles.profileImage)} src={imagePath || bobaImage} alt="profile" ref={this.imageRef} />
            <button
              className={css(styles.uploadPhotoButton)}
              type="button"
              onClick={() => this.inputRef.current.click()}
            >
              Upload New Photo
            </button>
            <input type="file" className={css(styles.displayNone)} ref={this.inputRef} onChange={this.handleImageChange} />
          </div>
          <div className={css(styles.profileTextContainer)}>
            <p className={css(styles.username, styles.disabled)}>{username}</p>
            <p><input className={css(styles.edit)} value={name} placeholder="Name" onChange={this.handleNameChange} /></p>
          </div>
          {isLoggedInUserProfile && (
            <div className={css(styles.editButtonsContainer)}>
              <button type="button" className={css(styles.editButton)} onClick={this.handleSaveProfile}>
                Save
              </button>
              <button
                type="button"
                className={css(styles.editButton)}
                onClick={() => {
                  this.resetState();
                  cancelEditProjectOrProfile();
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className={css(styles.profileBody)}>
          <div className={css(styles.bioContainer)}>
            <p className={css(styles.profileTitle)}>About Me</p>
            <textarea className={css(styles.bio, styles.edit)} value={bio} placeholder="Bio" onChange={this.handleBioChange} />
          </div>

          <div className={css(styles.featuredProjectContainer)}>
            <div className={css(styles.featuredProjectHeader)}>
              <p className={css(styles.profileTitle)}>Featured Project</p>
              <select
                className={css(styles.featuredDropdown)}
                value={!!featuredProject && featuredProject.id}
                onChange={this.handleFeaturedProjectChange}
              >
                {projects.map((project) => { // eslint-disable-line
                  return <option value={project.id} key={project.id}>{project.title}</option>;
                })}
              </select>
            </div>
            <ProfileFeaturedProject project={featuredProject} />
          </div>
        </div>
      </div>
    ) : (
      <div className={css(styles.profileContainer)}>
        <div className={css(styles.profileHeader)}>
          <img className={css(styles.profileImage)} src={imagePath || bobaImage} alt="profile" />
          <div className={css(styles.profileTextContainer)}>
            <Link to={`/profile/${username}`}>
              <p className={css(styles.username)}>{username}</p>
            </Link>
            <p>{name}</p>
          </div>
          {isLoggedInUserProfile && (
            <button
              type="button"
              className={css(styles.editButtonsContainer)}
              onClick={() => editProjectOrProfile()}
            >
              Edit Profile
            </button>
          )}
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
            <ProfileFeaturedProject project={featuredProject} />
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
  inEditMode: PropTypes.bool,
  editProjectOrProfile: PropTypes.func.isRequired,
  cancelEditProjectOrProfile: PropTypes.func.isRequired,
  updateUserProfile: PropTypes.func.isRequired,
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

  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 72,
  },

  uploadPhotoButton: {
    marginTop: 10,
    fontSize: 12,
  },

  profileHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
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

  disabled: {
    ':hover': {
      textDecoration: 'none',
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
    marginLeft: 10,
  },

  followButton: {
    marginLeft: 'auto',
  },

  editButton: {
    marginLeft: 10,
  },

  editButtonsContainer: {
    marginLeft: 'auto',
  },

  edit: {
    border: 0,
    background: '#eeeeee',
    borderRadius: 2,
    fontSize: 12,
    width: '100%',
    boxSizing: 'border-box',
  },

  featuredProjectHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  featuredDropdown: {
    marginLeft: 'auto',
  },

  displayNone: {
    display: 'none',
  },
});

const mapStateToProps = state => ({
  inEditMode: state.inEditMode,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    addUserFollowing,
    removeUserFollowing,
    editProjectOrProfile,
    cancelEditProjectOrProfile,
    updateUserProfile,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileHeader);
