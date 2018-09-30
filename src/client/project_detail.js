import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, css } from 'aphrodite';

import puppyImage from './puppy.png';
import './app.css';
import { getProjectById } from './redux/actions';

class ProjectDetail extends Component {
  componentDidMount() {
    const projectId = this.props.match.params.projectId; // eslint-disable-line
    this.props.getProjectById(projectId); // eslint-disable-line
  }

  render() {
    const { project } = this.props;

    return project ? (
      <div className={css(styles.galleryContainer)}>
        <div className={css(styles.galleryAppDetail)}>
          <div className={css(styles.rightContainer)}>
            <Link to={`/project/${project._id}`}>
              <img className={css(styles.appImage)} src={puppyImage} alt="project" />
            </Link>
            <button type="button" className={css(styles.openAppButton)}>
              Open App
            </button>
          </div>

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
          </div>
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

  appAuthor: {
    color: '#58585a',
  },

  openAppButton: {
    backgroundColor: '#84ad2d',
    border: 'none',
    color: 'white',
  },

  description: {
    marginTop: 10,
    marginBottom: 10,
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
});

const mapStateToProps = state => ({
  project: state.selectedProject,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getProjectById,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectDetail);
