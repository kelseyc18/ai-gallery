import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFeaturedProjects } from './redux/actions';

import GalleryApp from './gallery_app';
import './app.css';

class FeaturedProjectGallery extends Component {
  componentDidMount() {
    const { getFeaturedProjects } = this.props;
    getFeaturedProjects();
  }

  render() {
    const { projects, projectsTotal } = this.props;

    return (
      <React.Fragment>
        <div className={css(styles.searchBanner)}>
          <div className={css(styles.bannerText)}>Featured Projects</div>
        </div>
        <div className={css(styles.galleryContainer)}>
          {projects.map(project => (
            <GalleryApp project={project} key={project.id} />
          ))}
          {projects.length < projectsTotal ? (
            <div className={css(styles.footer)}>
              <button
                className={css(styles.button)}
                onClick={() => getFeaturedProjects(projects.length)}
                type="button"
              >
                Load more projects
              </button>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

FeaturedProjectGallery.propTypes = {
  getFeaturedProjects: PropTypes.func.isRequired,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
  projectsTotal: PropTypes.number,
};

const styles = StyleSheet.create({
  galleryContainer: {
    display: 'flex',
    margin: 'auto',
    maxWidth: 850,
    padding: 20,
  },

  searchBanner: {
    backgroundColor: '#A5CF47',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    color: 'white',
    fontWeight: 'bold',
  },

  bannerText: {
    fontSize: 48,
  },
});

const mapStateToProps = state => ({
  projects: state.projects,
  projectsTotal: state.projectsTotal,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getFeaturedProjects,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeaturedProjectGallery);
