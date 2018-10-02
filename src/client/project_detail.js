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
import { getProjectById, editProject, cancelEditProject } from './redux/actions';

class ProjectDetail extends Component {
  componentDidMount() {
    const projectId = this.props.match.params.projectId; // eslint-disable-line
    this.props.getProjectById(projectId); // eslint-disable-line
  }

  renderRightContainer = () => {
    const {
      project, editProject, cancelEditProject, inEditMode,
    } = this.props;

    return inEditMode ? (
      <div className={css(styles.rightContainer)}>
        <Link to={`/project/${project._id}`}>
          <img className={css(styles.appImage)} src={puppyImage} alt="project" />
        </Link>
        <button type="button" className={css(styles.projectDetailButton)} onClick={() => {}}>
          Save
        </button>
        <button
          type="button"
          className={css(styles.projectDetailButton, styles.cancelButton)}
          onClick={() => cancelEditProject()}
        >
          Cancel
        </button>
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
      </div>
    ) : (
      <div className={css(styles.rightContainer)}>
        <Link to={`/project/${project._id}`}>
          <img className={css(styles.appImage)} src={puppyImage} alt="project" />
        </Link>
        <button
          type="button"
          className={css(styles.projectDetailButton)}
          onClick={() => editProject()}
        >
          Edit
        </button>
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
      </div>
    );
  };

  renderDescriptionContainer = () => {
    const { project, inEditMode } = this.props;

    const datesContainer = (
      <div className={css(styles.datesContainer)}>
        <p>{`Creation Date: ${project.creationDate}`}</p>
        <p>{`Last Modified Date: ${project.lastModifiedDate}`}</p>
      </div>
    );

    return inEditMode ? (
      <div className={css(styles.descriptionContainer)}>
        <input className={css(styles.appTitleEdit)} defaultValue={project.title} placeholder="Title" />
        <a href="http://appinventor.mit.edu/">
          <p className={css(styles.appAuthor)}>{project.authorId}</p>
        </a>
        <textarea
          className={css(styles.description)}
          defaultValue={project.description || `${project.title} is the best app in the world!`}
          placeholder="Description"
        />
        <div className={css(styles.tutorial)}>
          {project.tutorialUrl ? (
            <React.Fragment>
              <span>Tutorial / Video: </span>
              <input defaultValue={project.tutorialUrl} placeholder="Tutorial / Video URL" />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span>Tutorial / Video: </span>
              <input defaultValue={`http://${project.title}.com`} placeholder="Tutorial / Video URL" />
            </React.Fragment>
          )}
        </div>
        {datesContainer}
      </div>
    ) : (
      <div className={css(styles.descriptionContainer)}>
        <Link to={`/project/${project._id}`}>
          <p className={css(styles.appTitle)}>{project.title}</p>
        </Link>
        <a href="http://appinventor.mit.edu/">
          <p className={css(styles.appAuthor)}>{project.authorId}</p>
        </a>
        <div className={css(styles.description)}>
          <p>{project.description || `${project.title} is the best app in the world!`}</p>
        </div>
        <div className={css(styles.tutorial)}>
          {project.tutorialUrl ? (
            <React.Fragment>
              <span>Tutorial / Video: </span>
              <a href={project.tutorialUrl}>{project.tutorialUrl}</a>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span>Tutorial / Video: </span>
              <a href={`http://${project.title}.com`}>{`http://${project.title}.com`}</a>
            </React.Fragment>
          )}
        </div>
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
    authorId: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
  getProjectById: PropTypes.func.isRequired,
  editProject: PropTypes.func.isRequired,
  cancelEditProject: PropTypes.func.isRequired,
  inEditMode: PropTypes.bool.isRequired,
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

  appImage: {
    margin: 'auto',
    marginBottom: 5,
    width: '100%',
  },

  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 160,
  },

  descriptionContainer: {
    marginLeft: 10,
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
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectDetail);
