import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserProjects, getUserFavoriteProjects } from './redux/actions';

import GalleryApp from './gallery_app';
import './app.css';

class ProjectShowcase extends Component {
  componentDidMount() {
    const { getUserProjects, getUserFavoriteProjects, match } = this.props;
    if (match.path.endsWith('/favorites')) {
      getUserFavoriteProjects(match.params.username);
    } else {
      getUserProjects(match.params.username);
    }
  }

  render() {
    const { match, projects } = this.props;
    const { username } = match.params;
    const bannerText = match.path.endsWith('/favorites')
      ? `Favorites (${projects.length})`
      : `Shared Projects (${projects.length})`;
    return (
      <React.Fragment>
        <div className={css(styles.searchBanner)}>
          <div>
            <Link to={`/profile/${username}`} className={css(styles.bannerUsername)}>
              {username}
            </Link>
          </div>
          <div className={css(styles.bannerText)}>{bannerText}</div>
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

ProjectShowcase.propTypes = {
  getUserFavoriteProjects: PropTypes.func.isRequired,
  getUserProjects: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
  }),
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

const styles = StyleSheet.create({
  galleryContainer: {
    display: 'flex',
    margin: 'auto',
    maxWidth: 850,
    paddingTop: 20,
    paddingLeft: 20,
    flexWrap: 'wrap',
  },

  searchBanner: {
    backgroundColor: '#F88D34',
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

  bannerUsername: {
    fontSize: 36,
    color: '#58585a',
    ':hover': {
      textDecoration: 'underline',
    },
  },

  bannerText: {
    fontSize: 28,
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
)(ProjectShowcase);
