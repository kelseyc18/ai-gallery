import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';

import Icon from './icon';
import ICONS from './icon_constants';
import puppyImage from './puppy.png';
import './app.css';
import {
  getProjectById,
  editProject,
  cancelEditProject,
  updateProjectDetails,
} from './redux/actions';

class ProjectDetail extends Component {
  state = {
    title: undefined,
    tutorialUrl: undefined,
    description: undefined,
    credits: undefined,
    imagePath: undefined,
    newImage: undefined,
  };

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
    this.imageRef = React.createRef();
  }

  componentDidMount() {
    const projectId = this.props.match.params.projectId; // eslint-disable-line
    this.props.getProjectById(projectId); // eslint-disable-line
  }

  static getDerivedStateFromProps(props, state) {
    if (
      state.title === undefined
      && state.tutorialUrl === undefined
      && state.description === undefined
      && state.credits === undefined
      && state.imagePath === undefined
      && props.project
    ) {
      return {
        title: props.project.title,
        tutorialUrl: props.project.tutorialUrl,
        description: props.project.description,
        credits: props.project.credits,
        imagePath: props.project.imagePath,
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

  renderRightContainer = () => {
    const {
      project,
      editProject,
      cancelEditProject,
      inEditMode,
      updateProjectDetails,
    } = this.props;
    const { imagePath } = project;
    const {
      title, description, tutorialUrl, credits, newImage,
    } = this.state;

    const iconContainer = (
      <div className={css(styles.iconsContainer)}>
        <div className={css(styles.iconContainer)}>
          <span>{project.numDownloads}</span>
          <Icon icon={ICONS.DOWNLOAD} color="#58585a" />
        </div>
        <div className={css(styles.iconContainer)}>
          <span>{project.numFavorites}</span>
          <Icon icon={ICONS.FAVORITE} color="#58585a" />
        </div>
      </div>
    );

    return inEditMode ? (
      <form>
        <div className={css(styles.rightContainer)}>
          <div className={css(styles.imageContainer)}>
            <img className={css(styles.appImage)} src={imagePath || puppyImage} alt="project" ref={this.imageRef} />
            <button className={css(styles.editImageOverlay)} type="button" onClick={() => this.inputRef.current.click()}>Upload New Photo</button>
            <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }} ref={this.inputRef} onChange={this.handleChangeFile} />
          </div>
          <button
            type="button"
            className={css(styles.projectDetailButton)}
            onClick={() => {
              updateProjectDetails(title, project._id, description, tutorialUrl, credits, newImage);
            }}
          >
            Save
          </button>
          <button
            type="button"
            className={css(styles.projectDetailButton, styles.cancelButton)}
            onClick={() => cancelEditProject()}
          >
            Cancel
          </button>
          {iconContainer}
        </div>
      </form>
    ) : (
      <div className={css(styles.rightContainer)}>
        <Link to={`/project/${project._id}`}>
          <div className={css(styles.imageContainer)}>
            <img className={css(styles.appImage)} src={imagePath || puppyImage} alt="project" />
          </div>
        </Link>
        <button
          type="button"
          className={css(styles.projectDetailButton)}
          onClick={() => editProject()}
        >
          Edit
        </button>
        {iconContainer}
      </div>
    );
  };

  renderDescriptionContainer = () => {
    const { project, inEditMode } = this.props;
    const {
      title, tutorialUrl, description, credits,
    } = this.state;

    const datesContainer = (
      <div className={css(styles.datesContainer)}>
        <p>{`Creation Date: ${project.creationDate}`}</p>
        <p>{`Last Modified Date: ${project.lastModifiedDate}`}</p>
      </div>
    );

    const tutorialInputId = 'tutorial-input';
    const creditsInputId = 'credits-input';

    return inEditMode ? (
      <div className={css(styles.descriptionContainer)}>
        <input
          className={css(styles.appTitleEdit)}
          value={title}
          onChange={this.handleTitleChange}
          placeholder="Title"
        />
        <p className={css(styles.appAuthor)}>{project.author.username}</p>
        <div className={css(styles.description)}>
          <p>Description:</p>
          <textarea
            value={description || ''}
            onChange={this.handleDescriptionChange}
            placeholder="Description"
          />
        </div>
        <div className={css(styles.tutorial)}>
          <label htmlFor={tutorialInputId}>
            {'Tutorial / Video: '}
            <input
              value={tutorialUrl || ''}
              placeholder="Tutorial / Video URL"
              onChange={this.handleTutorialChange}
              id={tutorialInputId}
            />
          </label>
        </div>
        <div className={css(styles.credits)}>
          <p>Credits: </p>
          <textarea
            value={credits || ''}
            placeholder="Are you remixing code from other apps? Credit them here."
            onChange={this.handleCreditsChange}
            id={creditsInputId}
          />
        </div>
        {datesContainer}
      </div>
    ) : (
      <div className={css(styles.descriptionContainer)}>
        <Link to={`/project/${project._id}`}>
          <p className={css(styles.appTitle)}>{project.title}</p>
        </Link>
        <Link to={`/profile/${project.author.username}`}>
          <p className={css(styles.appAuthor)}>{project.author.username}</p>
        </Link>
        <div className={css(styles.description)}>
          <p>{project.description}</p>
        </div>
        <div className={css(styles.tutorial)}>
          {!!project.tutorialUrl && (
            <span>
              {'Tutorial / Video: '}
              <a href={project.tutorialUrl}>{project.tutorialUrl}</a>
            </span>
          )}
        </div>
        <div className={css(styles.credits)}>{!!credits && `Credits: ${credits}`}</div>
        {datesContainer}
      </div>
    );
  };

  render() {
    const { project } = this.props;

    return project ? (
      <div className={css(styles.galleryContainer)}>
        <div className={css(styles.galleryAppDetail)}>
          {this.renderRightContainer()}
          {this.renderDescriptionContainer()}
        </div>

        <div className={css(styles.sideBar)}>Remixes</div>
      </div>
    ) : (
      <div>That project does not exist.</div>
    );
  }
}

ProjectDetail.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
    description: PropTypes.string,
    tutorialUrl: PropTypes.string,
    imagePath: PropTypes.string,
  }),
  getProjectById: PropTypes.func.isRequired,
  editProject: PropTypes.func.isRequired,
  cancelEditProject: PropTypes.func.isRequired,
  inEditMode: PropTypes.bool.isRequired,
  updateProjectDetails: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  galleryContainer: {
    display: 'flex',
    margin: 'auto',
    marginTop: 100,
    maxWidth: 1000,
    paddingLeft: 20,
  },

  galleryAppDetail: {
    border: 'solid #dddddd 1px',
    borderRadius: 10,
    backgroundColor: 'white',
    display: 'flex',
    margin: 'auto',
    marginBottom: 20,
    marginRight: 20,
    padding: 10,
    width: 800,
  },

  imageContainer: {
    position: 'relative',
    marginBottom: 10,
  },

  appImage: {
    margin: 'auto',
    display: 'block',
    width: 160,
    height: 160,
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
    display: 'flex',
    flexDirection: 'column',
    width: 160,
  },

  descriptionContainer: {
    marginLeft: 10,
    width: '100%',
    maxWidth: 577,
  },

  credits: {
    marginBottom: 10,
  },

  appTitle: {
    fontWeight: 800,
    fontSize: 20,
    color: '#128ba8',
    ':hover': {
      color: '#105fa8',
    },
  },

  appTitleEdit: {
    fontWeight: 800,
    fontSize: 20,
    color: '#128ba8',
  },

  appAuthor: {
    color: '#58585a',
  },

  projectDetailButton: {
    backgroundColor: '#84ad2d',
    border: 'none',
    color: 'white',
    marginBottom: 10,
  },

  cancelButton: {
    backgroundColor: '#58585a',
  },

  description: {
    marginTop: 10,
    marginBottom: 10,
  },

  tutorial: {
    marginTop: 10,
    marginBottom: 10,
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
    flexDirection: 'column',
    margin: 'auto',
  },

  iconContainer: {
    alignSelf: 'end',
    marginTop: 5,
  },

  datesContainer: {
    fontSize: 12,
    color: '#58585a',
  },
});

const mapStateToProps = state => ({
  project: state.selectedProject,
  inEditMode: state.inEditMode,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getProjectById,
    editProject,
    cancelEditProject,
    updateProjectDetails,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectDetail);
