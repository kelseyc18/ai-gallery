import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProjects } from './redux/actions';

import GalleryApp from './gallery_app';
import './app.css';

class GalleryContainer extends Component {
  componentDidMount() {
    this.props.getProjects(); // eslint-disable-line
  }

  render() {
    const { projects, getProjects, projectsTotal } = this.props;

    return (
      <div className={css(styles.galleryContainer)}>
        {projects.map(project => (
          <GalleryApp project={project} key={project._id} />
        ))}
        {projects.length < projectsTotal ? (
          <div className={css(styles.footer)}>
            <button
              className={css(styles.button)}
              onClick={() => getProjects(projects.length)}
              type="button"
            >
              Load more projects
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}

GalleryContainer.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  getProjects: PropTypes.func.isRequired,
  projectsTotal: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  galleryContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 'auto',
    marginTop: 100,
    maxWidth: 850,
    paddingLeft: 20,
    paddingRight: 20,
  },

  footer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    margin: 20,
    marginTop: 0,
  },

  button: {
    margin: 'auto',
  },
});

const mapStateToProps = state => ({
  projects: state.projects,
  projectsTotal: state.projectsTotal,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getProjects,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GalleryContainer);
