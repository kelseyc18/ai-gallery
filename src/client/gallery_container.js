import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProjects, getAllTags, getUsers } from './redux/actions';

import GalleryApp from './gallery_app';
import UserPreview from './user_preview';
import ExploreProjectsDropdown from './explore_projects_dropdown';
import './app.css';

const queryString = require('query-string');

const tagForAll = { id: 0, tagName: 'All' };

class GalleryContainer extends Component {
  state = {
    selectedTag: tagForAll,
  };

  componentDidMount() {
    const {
      getProjects, location, sortBy, loggedInUser, getAllTags, getUsers,
    } = this.props;
    const { selectedTag } = this.state;
    const query = queryString.parse(location.search).q;

    getProjects(0, query, sortBy, loggedInUser ? loggedInUser.id : undefined, selectedTag);
    getAllTags();
    if (query) {
      getUsers(0, query);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location, getProjects, sortBy, loggedInUser, getAllTags, getUsers,
    } = this.props;
    const { selectedTag } = this.state;

    if (location.search !== prevProps.location.search) {
      const query = queryString.parse(location.search).q;
      getProjects(0, query, sortBy, loggedInUser ? loggedInUser.id : undefined, selectedTag);
      getAllTags();
      if (query) {
        getUsers(0, query);
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selectedTag && state.selectedTag.id !== props.selectedTag.id) {
      return {
        selectedTag: props.selectedTag,
      };
    }
    return null;
  }

  handleTagsChange = (event) => {
    const {
      location, getProjects, sortBy, loggedInUser, allTags,
    } = this.props;
    const query = queryString.parse(location.search).q;

    if (event.target.value === 'All') {
      this.setState({ selectedTag: tagForAll });
      getProjects(0, query, sortBy, loggedInUser ? loggedInUser.id : undefined, tagForAll);
    } else {
      const tag = allTags.filter(tag => tag.tagName === event.target.value)[0];
      this.setState({ selectedTag: tag });
      getProjects(0, query, sortBy, loggedInUser ? loggedInUser.id : undefined, tag);
    }
  };

  renderTagButton = (tagName) => {
    const { selectedTag } = this.state;
    const tagSelected = selectedTag.tagName === tagName;

    return (
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
  };

  renderTagsButtons = () => {
    const { allTags } = this.props;

    return (
      <div className={css(styles.tagsContainer)}>
        {!!allTags.length && this.renderTagButton('All')}
        {allTags.map(tag => this.renderTagButton(tag.tagName))}
      </div>
    );
  };

  renderUsers = () => {
    const {
      users, usersTotal, searchQuery, getUsers,
    } = this.props;

    return (
      <React.Fragment>
        <div className={css(styles.usersHeader)}>{`${usersTotal} user(s) found`}</div>
        <div className={css(styles.galleryContainer, styles.usersContainer)}>
          {users.map(user => (
            <UserPreview user={user} key={user.id} />
          ))}
          {users.length < usersTotal ? (
            <div className={css(styles.buttonContainer)}>
              <button
                className={css(styles.button)}
                onClick={() => getUsers(users.length, searchQuery)}
                type="button"
              >
                Load more users
              </button>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  };

  render() {
    const {
      projects, getProjects, projectsTotal, searchQuery, sortBy,
    } = this.props;
    const { selectedTag } = this.state;

    const bannerText = searchQuery ? 'Search' : 'Explore';

    return (
      <div className={css(styles.outerContainer)}>
        <div className={css(styles.searchBanner)}>
          <div>{bannerText}</div>
          {!!searchQuery && (
            <div className={css(styles.subtitle)}>{`Results for "${searchQuery}"`}</div>
          )}
        </div>
        <div className={css(styles.bodyContainer)}>
          {!!searchQuery && this.renderUsers()}
          {!searchQuery && (
            <div className={css(styles.dropdownContainer)}>
              <ExploreProjectsDropdown />
            </div>
          )}
          {!!searchQuery && (
            <div className={css(styles.usersHeader)}>{`${projectsTotal} project(s) found`}</div>
          )}
          <div className={css(!!searchQuery && styles.galleryContainer)}>
            {this.renderTagsButtons()}
            {projects.length === 0 && sortBy === 'following' && (
              <div className={css(styles.noProjects)}>
                Follow more users to see their published projects here!
              </div>
            )}
            <div className={css(styles.projectsContainer)}>
              {projects.map(project => (
                <GalleryApp project={project} key={project.id} />
              ))}
              {projects.length < projectsTotal ? (
                <div className={css(styles.footer)}>
                  <button
                    className={css(styles.button)}
                    onClick={() => getProjects(projects.length, searchQuery, sortBy, selectedTag)}
                    type="button"
                  >
                    Load more projects
                  </button>
                </div>
              ) : null}
            </div>
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
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  ),
  usersTotal: PropTypes.number,
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
  getUsers: PropTypes.func.isRequired,
  allTags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
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

  usersHeader: {
    backgroundColor: '#F88D34',
    fontWeight: 'bold',
    fontSize: 18,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },

  galleryContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fef1e6',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    border: '#F88D34 1.5px solid',
    borderTop: 0,
    padding: 10,
  },

  dropdownContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },

  usersContainer: {
    marginBottom: 20,
  },

  projectsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  noProjects: {
    marginTop: 20,
    textAlign: 'center',
  },

  searchBanner: {
    backgroundColor: '#92267C',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 20,
    fontWeight: 'normal',
    marginBottom: 10,
  },

  buttonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
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
    margin: 'auto',
    width: '100%',
  },

  tagsButton: {
    textAlign: 'center',
    justifyContent: 'center',
    margin: 5,
    fontSize: 14,
    borderRadius: 15,
    border: 'none',
    whiteSpace: 'nowrap',
    paddingLeft: 15,
    paddingRight: 15,
    minWidth: 70,
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
  sortBy: state.projectsSortBy,
  loggedInUser: state.loggedInUser,
  allTags: state.allTags,
  selectedTag: state.selectedTag,
  users: state.users,
  usersTotal: state.usersTotal,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getProjects,
    getAllTags,
    getUsers,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GalleryContainer);
