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
    const { projects } = this.props;

    return (
      <div className={css(styles.galleryContainer)}>
        {projects.map(project => (
          <GalleryApp project={project} key={project._id} />
        ))}
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
    justifyContent: 'space-between',
  },
});

const mapStateToProps = state => ({
  projects: state.projects,
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
