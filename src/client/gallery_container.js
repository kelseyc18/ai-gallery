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

    const bannerText = searchQuery ? 'Search' : 'Explore';

    return (
      <div className={css(styles.outerContainer)}>
        <div className={css(styles.searchBanner)}>
          <div>{bannerText}</div>
        </div>
        <div className={css(styles.galleryContainer)}>
          {projects.map(project => (
            <GalleryApp project={project} key={project.id} />
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
};

const styles = StyleSheet.create({
  outerContainer: {
    margin: 'auto',
  },

  galleryContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: 850,
    margin: 'auto',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
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
