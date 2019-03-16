import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';
import dateFormat from 'dateformat';

import ProjectDetailSidebar from './project_detail_sidebar';
import AdminProjectControls from './admin_project_controls';
import FeaturedProjectLabel from './featured_project_label';
import PhotoGallery from './photo_gallery';
import Icon from './icon';
import ICONS from './icon_constants';
import puppyImage from './puppy.png';
import codiImage from './codi.png';
import './app.css';
import {
  getProjectById,
  getAllTags,
  editProjectOrProfile,
  cancelEditProjectOrProfile,
  updateProjectDetails,
  incrementDownloadCount,
  addFavorite,
  removeFavorite,
  removeProject,
} from './redux/actions';

const MAX_NUM_SCREENSHOTS = 3;

class ProjectDetail extends Component {
  state = {
    title: undefined,
    tutorialUrl: undefined,
    description: undefined,
    credits: undefined,
    newImage: undefined,
    isDraft: undefined,
    currentTags: undefined,
    screenshots: undefined,
  };

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
    this.imageRef = React.createRef();
    this.addScreenshotInputRef = React.createRef();
  }

  componentDidMount() {
    const projectId = this.props.match.params.projectId; // eslint-disable-line
    this.props.getProjectById(projectId); // eslint-disable-line
    this.props.getAllTags(); // eslint-disable-line
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;

    if (prevProps.project && match.params.projectId !== prevProps.project.id.toString()) {
      const projectId = match.params.projectId; // eslint-disable-line
      this.props.getProjectById(projectId); // eslint-disable-line
      this.props.getAllTags(); // eslint-disable-line
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.project && state.id !== props.project.id) {
      return {
        id: props.project.id,
        title: props.project.title,
        tutorialUrl: props.project.tutorialUrl,
        description: props.project.description,
        credits: props.project.credits,
        imagePath: props.project.imagePath,
        isDraft: props.project.isDraft,
        currentTags: props.project.Tags,
        screenshots: props.project.screenshots ? JSON.parse(props.project.screenshots) : [],
      };
    }
    return null;
  }

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value });
  };

  handleTutorialChange = (event) => {
    this.setState({ tutorialUrl: event.target.value });
  };

  handleDescriptionChange = (event) => {
    this.setState({ description: event.target.value });
  };

  handleCreditsChange = (event) => {
    this.setState({ credits: event.target.value });
  };

  handleChangeFile = (event) => {
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

  handleIsDraftChange = (event) => {
    this.setState({ isDraft: event.target.checked });
  };

  handleTagsChange = (event) => {
    const { allTags } = this.props;
    const { currentTags } = this.state;
    const tag = allTags.filter(tag => tag.tagName === event.target.value)[0];

    if (currentTags.filter(item => item.tagName === tag.tagName).length > 0) {
      // currentTags includes the selected tag, so we remove it
      const newTags = currentTags.filter(item => item.tagName !== tag.tagName);
      this.setState({ currentTags: newTags });
    } else {
      const newTags = currentTags.concat([tag]);
      this.setState({ currentTags: newTags });
    }
  };

  handleStarClicked = (isFavorited) => {
    const {
      project, loggedInUser, addFavorite, removeFavorite,
    } = this.props;

    if (loggedInUser) {
      if (!isFavorited) {
        addFavorite(project.id, loggedInUser.id);
      } else {
        removeFavorite(project.id, loggedInUser.id);
      }
    }
  };

  handleAddScreenshot = (event) => {
    const { screenshots } = this.state;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.setState({
          screenshots: screenshots.concat([{ src: reader.result, file }]),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  handleRemoveScreenshot = (index) => {
    const { screenshots } = this.state;

    const newScreenshots = screenshots.slice();
    newScreenshots.splice(index, 1);
    this.setState({
      screenshots: newScreenshots,
    });
  }

  resetState = () => {
    const { project } = this.props;
    const {
      title, tutorialUrl, description, credits, isDraft, Tags, screenshots,
    } = project;

    this.setState({
      title,
      tutorialUrl,
      description,
      credits,
      newImage: undefined,
      isDraft,
      currentTags: Tags,
      screenshots: screenshots ? JSON.parse(screenshots) : [],
    });
  };

  renderTagsButtons = (tagName, tagSelected) => {
    const { inEditMode } = this.props;
    return (
      <button
        className={css(
          styles.tagsButton,
          tagSelected && styles.tagSelected,
          !tagSelected && styles.tagDoesNotExist,
          !inEditMode && styles.tagReadOnly,
        )}
        key={tagName}
        type="button"
        value={tagName}
        onClick={this.handleTagsChange}
        disabled={!inEditMode}
      >
        {tagName}
      </button>
    );
  };

  renderLeftContainer = () => {
    const {
      project,
      editProjectOrProfile,
      cancelEditProjectOrProfile,
      inEditMode,
      updateProjectDetails,
      loggedInUser,
      incrementDownloadCount,
      isAdmin,
      removeProject,
    } = this.props;
    const {
      imagePath, author, aiaPath, id,
    } = project;
    const {
      title, description, tutorialUrl, credits, newImage, isDraft, currentTags, screenshots,
    } = this.state;

    const loggedInAsAuthor = loggedInUser && loggedInUser.id === author.id;

    return inEditMode ? (
      <form>
        <div className={css(styles.leftContainer)}>
          <div className={css(styles.imageContainer)}>
            <img
              className={css(styles.appImage)}
              src={imagePath || puppyImage}
              alt="project"
              ref={this.imageRef}
            />
            <button
              className={css(styles.editImageOverlay)}
              type="button"
              onClick={() => this.inputRef.current.click()}
            >
              Upload New Photo
            </button>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className={css(styles.displayNone)}
              ref={this.inputRef}
              onChange={this.handleChangeFile}
            />
          </div>
          <button
            type="button"
            className={css(styles.projectDetailButton)}
            onClick={() => {
              updateProjectDetails(
                title,
                project.id,
                description,
                tutorialUrl,
                credits,
                newImage,
                isDraft,
                currentTags.map(tag => tag.id),
                screenshots,
              );
            }}
          >
            Save
          </button>
          <button
            type="button"
            className={css(styles.projectDetailButton, styles.removeButton)}
            onClick={() => removeProject(id)}
          >
            Remove
          </button>
          <button
            type="button"
            className={css(styles.projectDetailButton, styles.cancelButton)}
            onClick={() => {
              this.resetState();
              cancelEditProjectOrProfile();
            }}
          >
            Cancel
          </button>
          {/* eslint-disable-next-line */}
          <p className={css(styles.attribution)}>By submitting a project to the gallery, you are publishing it under a Creative Commons Attribution License, and affirming that you have the authority to do so.</p>
        </div>
      </form>
    ) : (
      <div className={css(styles.leftContainer)}>
        <Link to={`/project/${project.id}`}>
          <div className={css(styles.imageContainer)}>
            <img className={css(styles.appImage)} src={imagePath || puppyImage} alt="project" />
          </div>
        </Link>
        <button
          type="button"
          className={css(styles.openAppButton)}
          onClick={() => {
            window.open(
              `http://gallery-a-dot.mit-appinventor-gallery.appspot.com/?locale=en&repo=http://gallery-test.appinventor.mit.edu/api/exports/${aiaPath}.asc`,
            );
            incrementDownloadCount(id);
          }}
        >
          Open App
        </button>
        {(loggedInAsAuthor || isAdmin) && (
          <button
            type="button"
            className={css(styles.projectDetailButton)}
            onClick={() => editProjectOrProfile()}
          >
            Edit
          </button>
        )}
        <div className={css(styles.centeredContainer)}>
          <div className={css(styles.iconContainer)}>
            <span>{project.numDownloads}</span>
            <Icon icon={ICONS.DOWNLOAD} color="#58585a" />
          </div>
        </div>
      </div>
    );
  };

  renderPhotoGallerySelector = () => {
    const { screenshots } = this.state;

    return (
      <div className={css(styles.photoGallerySelectorContainer)}>
        {screenshots.map((screenshot, index) => (
          <div className={css(styles.photoGallerySelectorPhotoContainer)} key={screenshot.src}>
            <button
              type="button"
              className={css(styles.removeScreenshotButton)}
              onClick={() => {
                this.handleRemoveScreenshot(index);
              }}
            >
              X
            </button>
            <img
              className={css(styles.photoGallerySelectorPhoto)}
              src={screenshot.src}
              alt={`screenshot ${index}`}
            />
          </div>
        ))}
        {screenshots.length < MAX_NUM_SCREENSHOTS && (
          <React.Fragment>
            <button
              className={css(styles.addScreenshotButton)}
              type="button"
              onClick={() => this.addScreenshotInputRef.current.click()}
            >
              Add Screenshot
            </button>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className={css(styles.displayNone)}
              ref={this.addScreenshotInputRef}
              onChange={this.handleAddScreenshot}
            />
          </React.Fragment>)}
      </div>
    );
  };

  renderDescriptionContainer = () => {
    const {
      project, inEditMode, loggedInUser, allTags, isAdmin,
    } = this.props;
    const { FavoritedUsers, featuredLabel } = project;
    const {
      title, tutorialUrl, description, credits, isDraft, currentTags, screenshots,
    } = this.state;
    const profileImage = project.author.imagePath;

    const creationDate = new Date(project.creationDate);
    creationDate.setTime(creationDate.getTime() + creationDate.getTimezoneOffset() * 60 * 1000);
    const creationDateString = dateFormat(creationDate, 'mmmm dd, yyyy, h:MM TT');

    const lastModifiedDate = new Date(project.creationDate);
    lastModifiedDate.setTime(lastModifiedDate.getTime()
      + lastModifiedDate.getTimezoneOffset() * 60 * 1000);
    const lastModifiedDateString = dateFormat(lastModifiedDate, 'mmmm dd, yyyy, h:MM TT');

    const datesContainer = (
      <div className={css(styles.datesContainer)}>
        <p>{`Created: ${creationDateString}`}</p>
        <p>{`Last Modified: ${lastModifiedDateString}`}</p>
      </div>
    );

    let favorited = false;
    if (loggedInUser) {
      for (let i = 0; i < FavoritedUsers.length; i += 1) {
        if (FavoritedUsers[i].id === loggedInUser.id) {
          favorited = true;
          break;
        }
      }
    }

    const starColor = favorited ? '#ffd633' : '#58585a';

    const iconContainer = (
      <div className={css(styles.iconsContainer)}>
        <div className={css(styles.iconContainer)}>
          <span>{project.FavoritedUsers.length}</span>
          <span className={css(styles.favoriteIcon)}>
            <Icon
              icon={ICONS.FAVORITE}
              color={starColor}
              onClick={() => this.handleStarClicked(favorited)}
            />
          </span>
        </div>
      </div>
    );

    const tagButtons = [];
    const tagSelected = currentTags.map(tag => tag.tagName);
    allTags.forEach((tag) => {
      if (!inEditMode) {
        if (tagSelected.indexOf(tag.tagName) > -1) {
          // Tag is selected (read only mode)
          tagButtons.push(this.renderTagsButtons(tag.tagName, true));
        }
      } else {
        // Edit mode
        tagButtons.push(this.renderTagsButtons(tag.tagName, tagSelected.indexOf(tag.tagName) > -1));
      }
    });
    const tagsContainer = <div className={css(styles.tagsContainer)}>{tagButtons}</div>;

    const tutorialInputId = 'tutorial-input';
    const creditsInputId = 'credits-input';
    const draftCheckboxId = 'draft-checkbox';

    return inEditMode ? (
      <div className={css(styles.rightContainer)}>
        <div className={css(styles.descriptionContainer)}>
          <div className={css(styles.titleAndDraftCheckbox)}>
            <div className={css(styles.titleContainer)}>
              <input
                className={css(styles.appTitleEdit)}
                value={title}
                onChange={this.handleTitleChange}
                placeholder="Title"
              />
            </div>
            <div className={css(styles.draftCheckbox)}>
              <label htmlFor={draftCheckboxId}>
                <input
                  type="checkbox"
                  onChange={this.handleIsDraftChange}
                  checked={isDraft}
                  id={draftCheckboxId}
                />
                Draft
              </label>
            </div>
          </div>
          <div className={css(styles.userInfo)}>
            <img
              className={css(styles.profileImage)}
              src={profileImage || codiImage}
              alt="profile"
            />
            <p className={css(styles.appAuthor)}>{project.author.username}</p>
          </div>
          <div className={css(styles.description)}>
            <p className={css(styles.editTitle)}>Description:</p>
            <textarea
              className={css(styles.edit)}
              value={description || ''}
              onChange={this.handleDescriptionChange}
              placeholder="Description"
            />
          </div>
          {!!featuredLabel && <FeaturedProjectLabel label={featuredLabel} />}
          {tagsContainer}
          {this.renderPhotoGallerySelector()}
          <div className={css(styles.tutorial)}>
            <label htmlFor={tutorialInputId}>
              <p className={css(styles.editTitle)}>Tutorial / Video:</p>
              <input
                className={css(styles.edit)}
                value={tutorialUrl || ''}
                placeholder="Tutorial / Video URL"
                onChange={this.handleTutorialChange}
                id={tutorialInputId}
              />
            </label>
          </div>
          <div className={css(styles.credits)}>
            <p className={css(styles.editTitle)}>Credits: </p>
            <textarea
              className={css(styles.edit)}
              value={credits || ''}
              placeholder="Are you remixing code from other apps? Credit them here."
              onChange={this.handleCreditsChange}
              id={creditsInputId}
            />
          </div>
          {datesContainer}
          {!!isAdmin && <AdminProjectControls project={project} />}
        </div>
      </div>
    ) : (
      <div className={css(styles.descriptionContainer)}>
        <div className={css(styles.titleContainer)}>
          <Link to={`/project/${project.id}`}>
            <p className={css(styles.appTitle)}>{project.title}</p>
          </Link>
          {project.isDraft && <div className={css(styles.draft)}>Draft</div>}
          {iconContainer}
        </div>
        <div className={css(styles.userInfo)}>
          <Link to={`/profile/${project.author.username}`} className={css(styles.userInfoLinks)}>
            <img
              className={css(styles.profileImage)}
              src={profileImage || codiImage}
              alt="profile"
            />
          </Link>
          <Link to={`/profile/${project.author.username}`} className={css(styles.userInfoLinks)}>
            <p className={css(styles.appAuthor)}>{project.author.username}</p>
          </Link>
        </div>
        <div className={css(styles.description)}>
          {!!project.description && project.description}
        </div>
        {!!featuredLabel && <FeaturedProjectLabel label={featuredLabel} />}
        {tagsContainer}
        {!!screenshots.length && (
          <PhotoGallery photos={screenshots.map(screenshot => screenshot.src)} />
        )}
        <div className={css(styles.tutorial)}>
          {!!project.tutorialUrl && (
            <div>
              <p className={css(styles.detailTitle)}>Tutorial / Video:</p>
              <span>
                <a href={project.tutorialUrl}>{project.tutorialUrl}</a>
              </span>
            </div>
          )}
        </div>
        <div className={css(styles.credits)}>
          {!!credits && (
            <div>
              <p className={css(styles.detailTitle)}>Credits:</p>
              {credits}
            </div>
          )}
        </div>
        <div className={css(styles.filler)} />
        {datesContainer}
        {/* eslint-disable-next-line */}
        <p className={css(styles.attribution)}>This project is published under a Creative Commons Attribution License.</p>
        {!!isAdmin && <AdminProjectControls project={project} />}
      </div>
    );
  };

  render() {
    const { project } = this.props;

    return project ? (
      <div className={css(styles.galleryContainer)}>
        <div className={css(styles.galleryAppDetail)}>
          {this.renderLeftContainer()}
          {this.renderDescriptionContainer()}
        </div>

        <div className={css(styles.sideBar)}>
          <ProjectDetailSidebar author={project.author} projects={project.author.projects} />
        </div>
      </div>
    ) : (
      <div className={css(styles.projectDoesNotExist)}>That project could not be found.</div>
    );
  }
}

ProjectDetail.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.shape({
      username: PropTypes.string.isRequired,
      projects: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          title: PropTypes.string.isRequired,
        }),
      ),
    }).isRequired,
    description: PropTypes.string,
    tutorialUrl: PropTypes.string,
    imagePath: PropTypes.string,
    isDraft: PropTypes.bool.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        tagName: PropTypes.string.isRequired,
      }),
    ),
    screenshots: PropTypes.string,
  }),
  getProjectById: PropTypes.func.isRequired,
  getAllTags: PropTypes.func.isRequired,
  editProjectOrProfile: PropTypes.func.isRequired,
  cancelEditProjectOrProfile: PropTypes.func.isRequired,
  inEditMode: PropTypes.bool.isRequired,
  updateProjectDetails: PropTypes.func.isRequired,
  allTags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      tagName: PropTypes.string.isRequired,
    }),
  ),
  incrementDownloadCount: PropTypes.func.isRequired,
  addFavorite: PropTypes.func.isRequired,
  removeFavorite: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  isAdmin: PropTypes.bool,
};

const styles = StyleSheet.create({
  galleryContainer: {
    display: 'flex',
    margin: 'auto',
    marginTop: 100,
    maxWidth: 850,
    paddingLeft: 20,
  },

  galleryAppDetail: {
    border: 'solid #dddddd 1px',
    borderRadius: 10,
    backgroundColor: 'white',
    display: 'flex',
    marginBottom: 20,
    marginRight: 20,
    padding: 5,
    width: 800,
  },

  imageContainer: {
    position: 'relative',
  },

  appImage: {
    margin: 'auto',
    display: 'block',
    width: 160,
    height: 160,
    borderRadius: 5,
  },

  editImageOverlay: {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.5)',
    top: 0,
    height: '100%',
    width: '100%',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  rightContainer: {
    display: 'grid',
    flexGrow: 1,
  },

  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 160,
    margin: 10,
  },

  descriptionContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
    flexGrow: 1,
  },

  tagsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },

  tagsButton: {
    display: 'inline-block',
    textAlign: 'center',
    justifyContent: 'center',
    margin: 5,
    fontSize: 12,
    borderRadius: 15,
    border: 'none',
    whiteSpace: 'nowrap',
  },

  tagSelected: {
    backgroundColor: '#84ad2d',
    color: 'white',
  },

  tagDoesNotExist: {
    backgroundColor: '#eeeeee',
    color: 'black',
  },

  tagReadOnly: {
    opacity: 0.9,
    ':hover': {
      cursor: 'initial',
      opacity: 0.9,
    },
  },

  draft: {
    border: '#F88D34 1px solid',
    color: '#F88D34',
    textTransform: 'uppercase',
    marginLeft: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },

  draftCheckbox: {
    alignSelf: 'center',
    marginLeft: 10,
  },

  credits: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 12,
  },

  titleContainer: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 'auto',
  },

  titleAndDraftCheckbox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  appTitle: {
    fontWeight: 800,
    fontSize: 25,
    color: '#128ba8',
    ':hover': {
      color: '#105fa8',
    },
    marginRight: 5,
  },

  appTitleEdit: {
    fontWeight: 800,
    fontSize: '25px !important',
    color: '#128ba8',
    width: '100%',
    border: 0,
    background: '#eeeeee',
    borderRadius: 2,
    padding: 5,
  },

  userInfo: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
    fontWeight: 800,
  },

  userInfoLinks: {
    height: 24,
  },

  profileImage: {
    height: 24,
    width: 24,
    borderRadius: 2,
  },

  appAuthor: {
    color: '#58585a',
    marginLeft: 5,
    ':hover': {
      textDecoration: 'underline',
    },
  },

  projectDetailButton: {
    backgroundColor: '#92267C',
    borderRadius: 2,
    border: 'none',
    color: 'white',
    marginTop: 10,
  },

  openAppButton: {
    backgroundColor: '#84ad2d',
    borderRadius: 2,
    border: 'none',
    color: 'white',
    marginTop: 10,
  },

  cancelButton: {
    backgroundColor: '#58585a',
  },

  removeButton: {
    backgroundColor: '#e64e4e',
  },

  description: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 14,
  },

  tutorial: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 14,
  },

  tutorialTitle: {
    fontWeight: 700,
  },

  sideBar: {
    border: 'solid #dddddd 1px',
    borderRadius: 10,
    backgroundColor: 'white',
    display: 'flex',
    marginRight: 20,
    marginBottom: 20,
    padding: 10,
    minWidth: 200,
  },

  iconsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  centeredContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 5,
  },

  datesContainer: {
    fontSize: 12,
    color: '#58585a',
    marginBottom: 'auto',
    marginTop: 5,
  },

  filler: {
    flexGrow: 1,
  },

  edit: {
    border: 0,
    background: '#eeeeee',
    borderRadius: 2,
    fontSize: 12,
    width: '100%',
    boxSizing: 'border-box',
  },

  editTitle: {
    fontSize: 15,
    marginBottom: 5,
  },

  detailTitle: {
    fontSize: 15,
    marginBottom: 5,
  },

  favoriteIcon: {
    cursor: 'pointer',
  },

  projectDoesNotExist: {
    textAlign: 'center',
    marginTop: 100,
  },

  photoGallerySelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  photoGallerySelectorPhoto: {
    width: 100,
    marginRight: 10,
  },

  photoGallerySelectorPhotoContainer: {
    position: 'relative',
  },

  removeScreenshotButton: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  addScreenshotButton: {
    height: 100,
    width: 100,
  },

  displayNone: {
    display: 'none',
  },

  attribution: {
    marginTop: 10,
    fontSize: 12,
  },
});

const mapStateToProps = state => ({
  project: state.selectedProject,
  inEditMode: state.inEditMode,
  allTags: state.allTags,
  loggedInUser: state.loggedInUser,
  isAdmin: state.isAdmin,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getProjectById,
    getAllTags,
    editProjectOrProfile,
    cancelEditProjectOrProfile,
    updateProjectDetails,
    incrementDownloadCount,
    addFavorite,
    removeFavorite,
    removeProject,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectDetail);
