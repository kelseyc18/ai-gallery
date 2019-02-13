import React, { Component } from 'react';
import {
  Route, Link, Switch, Redirect, withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import Cookie from 'cookie';

import { loginAsUserWithCookie } from './redux/actions';
import Icon from './icon';
import ICONS from './icon_constants';
import GalleryContainer from './gallery_container';
import ProjectDetail from './project_detail';
import ProjectShowcase from './project_showcase';
import FeaturedProjectGallery from './featured_project_gallery';
import DropdownMenu from './dropdown_menu';
import Profile from './profile';
import sharedStyles from './sharedstyles';
import './app.css';
import logo from './logo.png';

class App extends Component {
  state = {
    searchQuery: '',
  };

  componentDidMount() {
    const { loginAsUserWithCookie } = this.props;
    const currentCookie = Cookie.parse(document.cookie).gallery;
    if (currentCookie) loginAsUserWithCookie(currentCookie);
  }

  // TODO: comment out when we no longer need fake logging in
  // componentDidUpdate() {
  //   const { loginAsUserWithCookie, cookie } = this.props;
  //   const currentCookie = Cookie.parse(document.cookie).gallery;
  //   if (currentCookie !== cookie) loginAsUserWithCookie(currentCookie);
  // }

  handleQueryInput = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleKeyPress = (event) => {
    const { searchQuery } = this.state;
    const { history } = this.props;

    if (event.key === 'Enter') {
      history.push({
        pathname: '/explore',
        search: `?q=${searchQuery}`,
      });
    }
  };

  handleClickCreate = () => {
    window.open('http://ai2.appinventor.mit.edu', '_blank');
  };

  render() {
    const { searchQuery } = this.state;

    const header = (
      <div className={css(styles.headerContainer)}>
        <div className={css(styles.header)}>
          <Link to="/">
            <img className={css(styles.logo)} src={logo} alt="logo" />
          </Link>
          <Link to="/">
            <h1 className={css(styles.headerTitle)}>Project Gallery</h1>
          </Link>
          <button
            type="button"
            className={css(sharedStyles.headerButton)}
            onClick={this.handleClickCreate}
          >
            Create
          </button>
          <Link to="/explore">
            <button type="button" className={css(sharedStyles.headerButton)}>
              Explore
            </button>
          </Link>
          <Link to="/featured">
            <button type="button" className={css(sharedStyles.headerButton)}>
              Featured
            </button>
          </Link>
          <div className={css(styles.searchContainer)}>
            <Icon icon={ICONS.SEARCH} color="#58585a" />
            <input
              value={searchQuery}
              onChange={this.handleQueryInput}
              onKeyPress={this.handleKeyPress}
              placeholder="Search"
              className={css(styles.searchInput)}
            />
          </div>
          <div className={css(styles.leftAligned)}>
            <DropdownMenu />
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {header}

        <div className={css(styles.contentContainer)}>
          <Switch>
            <Route exact path="/" component={FeaturedProjectGallery} />
            <Route path="/featured" component={FeaturedProjectGallery} />
            <Route path="/explore" component={GalleryContainer} />
            <Route path="/project/:projectId" component={ProjectDetail} />
            <Redirect exact path="/project" to="/" />
            <Route path="/profile/:username/favorites" component={ProjectShowcase} />
            <Route path="/profile/:username/projects" component={ProjectShowcase} />
            <Route path="/profile/:username" component={Profile} />
            <Redirect exact path="/profile" to="/" />
          </Switch>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
  loggedInUser: PropTypes.shape({
    username: PropTypes.string,
  }),
  loginAsUserWithCookie: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  headerContainer: {
    borderTop: 'solid #a5cf47 20px',
    backgroundColor: 'white',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    padding: 20,
    paddingRight: 0,
    margin: 'auto',
    maxHeight: 20,
  },

  headerTitle: {
    marginLeft: 20,
    marginRight: 20,
    fontSize: 24,
  },

  logo: {
    height: 48,
    width: 'auto',
  },

  contentContainer: {
    margin: 'auto',
    marginTop: 80,
  },

  searchContainer: {
    marginLeft: 20,
    marginRight: 20,
    flexGrow: 1,
    display: 'flex',
  },

  searchInput: {
    flexGrow: 1,
  },

  leftAligned: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 60,
  },
});

const mapStateToProps = state => ({
  cookie: state.cookie,
  loggedInUser: state.loggedInUser,
  isAdmin: state.isAdmin,
  searchQuery: state.searchQuery,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    loginAsUserWithCookie,
  },
  dispatch,
);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App),
);
