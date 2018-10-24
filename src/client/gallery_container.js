import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProjects } from './redux/actions';

import GalleryApp from './gallery_app';
import './app.css';

const queryString = require('query-string');

class GalleryContainer extends Component {
  componentDidMount() {
    const { getProjects, location } = this.props;
    const query = queryString.parse(location.search).q;
    getProjects(0, query);
  }

  componentDidUpdate(prevProps) {
    const { location, getProjects } = this.props;
    if (location.search !== prevProps.location.search) {
      const query = queryString.parse(location.search).q;
      getProjects(0, query);
    }
  }

  render() {
    const {
      projects, getProjects, projectsTotal, searchQuery,
    } = this.props;

    return (
      <div className={css(styles.galleryContainer)}>
        {projects.map(project => (
          <GalleryApp project={project} key={project._id} />
        ))}
        {projects.length < projectsTotal ? (
          <div className={css(styles.footer)}>
            <button
              className={css(styles.button)}
              onClick={() => getProjects(projects.length, searchQuery)}
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
  searchQuery: PropTypes.string,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
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
  searchQuery: state.searchQuery,
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
