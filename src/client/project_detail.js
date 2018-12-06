import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';

import ProjectDetailSidebar from './project_detail_sidebar';
import Icon from './icon';
import ICONS from './icon_constants';
import puppyImage from './puppy.png';
import bobaImage from './boba.png';
import './app.css';
import {
  getProjectById,
  getAllTags,
  editProject,
  cancelEditProject,
  updateProjectDetails,
  incrementDownloadCount,
  addFavorite,
  removeFavorite,
} from './redux/actions';

class ProjectDetail extends Component {
  state = {
    title: undefined,
    tutorialUrl: undefined,
    description: undefined,
    credits: undefined,
    newImage: undefined,
    isDraft: undefined,
    currentTags: undefined,
  };

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
    this.imageRef = React.createRef();
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
    const { project, allTags } = this.props;
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

  renderTagsButtons = (tagName, tagSelected) => {
    const { inEditMode } = this.props;
    return (
      <button
        className={css(
          styles.tagsButton,
          tagSelected && styles.tagSelected,
          !tagSelected && styles.tagDoesNotExist,
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

  handleStarClicked = (isFavorited) => {
    const {
      project, loggedInUser, addFavorite, removeFavorite,
    } = this.props;

    if (!isFavorited) {
      addFavorite(project.id, loggedInUser);
    } else {
      removeFavorite(project.id, loggedInUser);
    }
  };

  resetState = () => {
    const { project } = this.props;
    const {
      title, tutorialUrl, description, credits, isDraft, Tags,
    } = project;

    this.setState({
      title,
      tutorialUrl,
      description,
      credits,
      newImage: undefined,
      isDraft,
      currentTags: Tags,
    });
  };

  renderLeftContainer = () => {
    const {
      project,
      editProject,
      cancelEditProject,
      inEditMode,
      updateProjectDetails,
      loggedInUser,
      incrementDownloadCount,
    } = this.props;
    const {
      imagePath, author, aiaPath, id, Tags,
    } = project;
    const {
      title, description, tutorialUrl, credits, newImage, isDraft, currentTags,
    } = this.state;

    const loggedInAsAuthor = loggedInUser === author.id;

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
              style={{ display: 'none' }}
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
                currentTags.map(tag => tag.tagId),
              );
            }}
          >
            Save
          </button>
          <button
            type="button"
            className={css(styles.projectDetailButton, styles.cancelButton)}
            onClick={() => {
              this.resetState();
              cancelEditProject();
            }}
          >
            Cancel
          </button>
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
              `http://ai2.appinventor.mit.edu/?locale=en&repo=http://localhost:3000/api/exports/${aiaPath}.asc`,
            );
            incrementDownloadCount(id);
          }}
        >
          Open App
        </button>
        {loggedInAsAuthor && (
          <button
            type="button"
            className={css(styles.projectDetailButton)}
            onClick={() => editProject()}
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

  renderDescriptionContainer = () => {
    const {
      project, inEditMode, loggedInUser, allTags,
    } = this.props;
    const { FavoritedUsers, ProjectTags, Tags } = project;
    const {
      title, tutorialUrl, description, credits, isDraft, currentTags,
    } = this.state;
    const profileImage = project.author.imagePath;

    const datesContainer = (
      <div className={css(styles.datesContainer)}>
        <p>{`Created: ${project.creationDate}`}</p>
        <p>{`Last Modified: ${project.lastModifiedDate}`}</p>
      </div>
    );

    let favorited = false;
    for (let i = 0; i < FavoritedUsers.length; i += 1) {
      if (FavoritedUsers[i].id === loggedInUser) {
        favorited = true;
        break;
      }
    }

    const starColor = favorited ? '#ffd633' : '#58585a';

    const iconContainer = (
      <div className={css(styles.iconsContainer)}>
        <div className={css(styles.iconContainer)}>
          <span>{project.FavoritedUsers.length}</span>
          <Icon
            icon={ICONS.FAVORITE}
            color={starColor}
            onClick={() => this.handleStarClicked(favorited)}
          />
        </div>
      </div>
    );

    const tagButtons = [];
    const tagSelected = inEditMode
      ? currentTags.map(tag => tag.tagName)
      : Tags.map(tag => tag.tagName);
    allTags.forEach((tag) => {
      tagButtons.push(this.renderTagsButtons(tag.tagName, tagSelected.indexOf(tag.tagName) > -1));
    });
    const tagsContainer = <div className={css(styles.tagsContainer)}>{tagButtons}</div>;

    const tutorialInputId = 'tutorial-input';
    const creditsInputId = 'credits-input';
    const draftCheckboxId = 'draft-checkbox';

    return inEditMode ? (
      <div className={css(styles.rightContainer)}>
        <div className={css(styles.descriptionContainer)}>
          <div className={css(styles.titleContainer)}>
            <input
              className={css(styles.appTitleEdit)}
              value={title}
              onChange={this.handleTitleChange}
              placeholder="Title"
            />
          </div>
          <div className={css(styles.userInfo)}>
            <img
              className={css(styles.profileImage)}
              src={profileImage || bobaImage}
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
          {tagsContainer}
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
              src={profileImage || bobaImage}
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
        {tagsContainer}
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
      <div>That project does not exist.</div>
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
        tagId: PropTypes.number.isRequired,
        tagName: PropTypes.string.isRequired,
      }),
    ),
  }),
  getProjectById: PropTypes.func.isRequired,
  getAllTags: PropTypes.func.isRequired,
  editProject: PropTypes.func.isRequired,
  cancelEditProject: PropTypes.func.isRequired,
  inEditMode: PropTypes.bool.isRequired,
  updateProjectDetails: PropTypes.func.isRequired,
  allTags: PropTypes.arrayOf(
    PropTypes.shape({
      tagId: PropTypes.number.isRequired,
      tagName: PropTypes.string.isRequired,
    }),
  ),
  incrementDownloadCount: PropTypes.func.isRequired,
  addFavorite: PropTypes.func.isRequired,
  removeFavorite: PropTypes.func.isRequired,
  loggedInUser: PropTypes.number.isRequired,
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
    padding: 10,
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
    gridTemplateColumns: '85% 15%',
    width: 'max-content',
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
    marginBottom: 50,
  },

  tagsButton: {
    display: 'inline-block',
    textAlign: 'center',
    justifyContent: 'center',
    margin: 5,
    fontSize: 12,
    borderRadius: 5,
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

  draft: {
    border: '#F88D34 1px solid',
    color: '#F88D34',
    textTransform: 'uppercase',
    marginLeft: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },

  draftCheckbox: {
    margin: 10,
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

  description: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 12,
  },

  tutorial: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 12,
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
});

const mapStateToProps = state => ({
  project: state.selectedProject,
  inEditMode: state.inEditMode,
  allTags: state.allTags,
  loggedInUser: state.loggedInUser,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getProjectById,
    getAllTags,
    editProject,
    cancelEditProject,
    updateProjectDetails,
    incrementDownloadCount,
    addFavorite,
    removeFavorite,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectDetail);
