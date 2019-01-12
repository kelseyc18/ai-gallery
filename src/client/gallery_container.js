import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProjects } from './redux/actions';

import GalleryApp from './gallery_app';
import ExploreProjectsDropdown from './explore_projects_dropdown';
import './app.css';

const queryString = require('query-string');

class GalleryContainer extends Component {
  componentDidMount() {
    const {
      getProjects, location, sortBy, loggedInUser,
    } = this.props;
    const query = queryString.parse(location.search).q;
    getProjects(0, query, sortBy, loggedInUser ? loggedInUser.id : undefined);
  }

  componentDidUpdate(prevProps) {
    const {
      location, getProjects, sortBy, loggedInUser,
    } = this.props;
    if (location.search !== prevProps.location.search) {
      const query = queryString.parse(location.search).q;
      getProjects(0, query, sortBy, loggedInUser ? loggedInUser.id : undefined);
    }
  }

  render() {
    const {
      projects, getProjects, projectsTotal, searchQuery, sortBy,
    } = this.props;

    const bannerText = searchQuery ? 'Search' : 'Explore';

    return (
      <div className={css(styles.outerContainer)}>
        <div className={css(styles.searchBanner)}>
          <div>{bannerText}</div>
        </div>
        <div className={css(styles.bodyContainer)}>
          {!searchQuery && (
            <div className={css(styles.dropdownContainer)}>
              <ExploreProjectsDropdown />
            </div>
          )}
          <div className={css(styles.galleryContainer)}>
            {projects.map(project => (
              <GalleryApp project={project} key={project.id} />
            ))}
            {projects.length < projectsTotal ? (
              <div className={css(styles.footer)}>
                <button
                  className={css(styles.button)}
                  onClick={() => getProjects(projects.length, searchQuery, sortBy)}
                  type="button"
                >
                  Load more projects
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

GalleryContainer.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
  getProjects: PropTypes.func.isRequired,
  projectsTotal: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
  sortBy: PropTypes.string,
  loggedInUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

const styles = StyleSheet.create({
  outerContainer: {
    margin: 'auto',
  },

  bodyContainer: {
    maxWidth: 850,
    margin: 'auto',
    padding: 20,
  },

  dropdownContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },

  galleryContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  searchBanner: {
    backgroundColor: '#92267C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
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
  sortBy: state.sortBy,
  loggedInUser: state.loggedInUser,
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
