import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProjects, getAllTags } from './redux/actions';

import GalleryApp from './gallery_app';
import ExploreProjectsDropdown from './explore_projects_dropdown';
import './app.css';

const queryString = require('query-string');

class GalleryContainer extends Component {
  state = {
    currentTags: [],
  };

  componentDidMount() {
    const {
      getProjects, location, sortBy, loggedInUser, getAllTags,
    } = this.props;
    const query = queryString.parse(location.search).q;
    getProjects(0, query, sortBy, loggedInUser ? loggedInUser.id : undefined);
    getAllTags();
  }

  componentDidUpdate(prevProps) {
    const {
      location, getProjects, sortBy, loggedInUser, getAllTags,
    } = this.props;
    if (location.search !== prevProps.location.search) {
      const query = queryString.parse(location.search).q;
      getProjects(0, query, sortBy, loggedInUser ? loggedInUser.id : undefined);
      getAllTags();
    }
  }

  handleTagsChange = (event) => {
    const { allTags } = this.props;
    const { currentTags } = this.state;
    const tag = allTags.filter(tag => tag.tagName === event.target.value)[0];

    if (currentTags.filter(item => item.tagName === tag.tagName).length > 0) {
      // currentTags includes the selected tag, so we remove it
      const newTags = currentTags.filter(item => item.tagName !== tag.tagName);
      this.setState({ currentTags: newTags });
    } else {
      const newTags = currentTags.concat([tag]);
      this.setState({ currentTags: newTags });
    }
  };

  renderTagsButtons = (tagName, tagSelected) => (
    <button
      className={css(
        styles.tagsButton,
        tagSelected && styles.tagSelected,
        !tagSelected && styles.tagDoesNotExist,
      )}
      key={tagName}
      type="button"
      value={tagName}
      onClick={this.handleTagsChange}
    >
      {tagName}
    </button>
  );

  render() {
    const {
      projects, getProjects, projectsTotal, searchQuery, sortBy, allTags,
    } = this.props;
    const { currentTags } = this.state;

    const tagButtons = [];
    const tagSelected = currentTags.map(tag => tag.tagName);
    allTags.forEach((tag) => {
      tagButtons.push(this.renderTagsButtons(tag.tagName, tagSelected.indexOf(tag.tagName) > -1));
    });
    const tagsContainer = <div className={css(styles.tagsContainer)}>{tagButtons}</div>;

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
          {tagsContainer}
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
  getAllTags: PropTypes.func.isRequired,
  allTags: PropTypes.arrayOf(
    PropTypes.shape({
      tagId: PropTypes.number.isRequired,
      tagName: PropTypes.string.isRequired,
    }),
  ),
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

  tagsContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tagsButton: {
    textAlign: 'center',
    justifyContent: 'center',
    margin: 5,
    fontSize: 14,
    borderRadius: 15,
    border: 'none',
    whiteSpace: 'nowrap',
  },

  tagSelected: {
    backgroundColor: '#84ad2d',
    color: 'white',
  },

  tagDoesNotExist: {
    backgroundColor: '#bbbbbb',
    color: 'white',
  },
});

const mapStateToProps = state => ({
  projects: state.projects,
  projectsTotal: state.projectsTotal,
  searchQuery: state.searchQuery,
  sortBy: state.sortBy,
  loggedInUser: state.loggedInUser,
  allTags: state.allTags,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getProjects,
    getAllTags,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GalleryContainer);
