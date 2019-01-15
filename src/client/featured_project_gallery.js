import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFeaturedProjects } from './redux/actions';

import GalleryApp from './gallery_app';
import './app.css';

class FeaturedProjectGallery extends Component {
  state = {
    showFeaturedLabels: true,
  };

  componentDidMount() {
    const { getFeaturedProjects } = this.props;
    getFeaturedProjects();
  }

  handleShowDescriptionsClicked = (event) => {
    this.setState({ showFeaturedLabels: event.target.checked });
  };

  render() {
    const { projects, projectsTotal } = this.props;
    const { showFeaturedLabels } = this.state;

    return (
      <React.Fragment>
        <div className={css(styles.searchBanner)}>Featured Projects</div>
        <div className={css(styles.galleryContainer)}>
          <div className={css(styles.toolbar)}>
            <input
              type="checkbox"
              checked={showFeaturedLabels}
              onChange={this.handleShowDescriptionsClicked}
            />
            Show Descriptions
          </div>
          <div className={css(styles.projectsContainer, !!showFeaturedLabels && styles.centered)}>
            {projects.map(project => (
              <GalleryApp project={project} key={project.id} showFeatured={showFeaturedLabels} />
            ))}
          </div>
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
    flexDirection: 'column',
    margin: 'auto',
    maxWidth: 850,
    padding: 20,
  },

  projectsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  centered: {
    justifyContent: 'center',
  },

  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
