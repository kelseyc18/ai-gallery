import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserProjects, getUserFavoriteProjects } from './redux/actions';

import GalleryApp from './gallery_app';
import './app.css';

class FeaturedProjectGallery extends Component {
  componentDidMount() {
    // Get featured projects
  }

  render() {
    const projects = [];

    return (
      <React.Fragment>
        <div className={css(styles.searchBanner)}>
          <div className={css(styles.bannerText)}>Featured Projects</div>
        </div>
        <div className={css(styles.galleryContainer)}>
          {projects.map(project => (
            <GalleryApp project={project} key={project.id} />
          ))}
        </div>
      </React.Fragment>
    );
  }
}

FeaturedProjectGallery.propTypes = {};

const styles = StyleSheet.create({
  galleryContainer: {
    display: 'flex',
    margin: 'auto',
    maxWidth: 850,
    paddingTop: 20,
    paddingLeft: 20,
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
    paddingTop: 10,
    paddingBottom: 10,
  },

  bannerText: {
    fontSize: 48,
  },
});

const mapStateToProps = state => ({
  projects: state.projects,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getUserProjects,
    getUserFavoriteProjects,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeaturedProjectGallery);
