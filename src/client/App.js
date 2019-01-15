import React, { Component } from 'react';
import {
  Route, Link, Switch, Redirect, withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import Cookie from 'cookie';

import { loginAsUserWithUUID, loginAsUserWithCookie } from './redux/actions';
import Icon from './icon';
import ICONS from './icon_constants';
import GalleryContainer from './gallery_container';
import ProjectDetail from './project_detail';
import ProjectShowcase from './project_showcase';
import FeaturedProjectGallery from './featured_project_gallery';
import Profile from './profile';
import './app.css';
import logo from './logo.png';

// TODO(kelsey): Replace when implementing actual user authentication
const USERS = [
  {
    id: 1,
    username: 'piazza_master',
  },
  {
    id: 2,
    username: 'boba_master',
  },
  {
    id: 3,
    username: 'coffee_master',
  },
];

class App extends Component {
  state = {
    searchQuery: '',
  };

  componentDidMount() {
    const { loginAsUserWithCookie } = this.props;
    const currentCookie = Cookie.parse(document.cookie).AppInventor;
    if (currentCookie) loginAsUserWithCookie(currentCookie);
  }

  // componentDidUpdate() {
  //   const { loginAsUserWithCookie, cookie } = this.props;
  //   const currentCookie = Cookie.parse(document.cookie).AppInventor;
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

  handleUserLogin = (event) => {
    const { loginAsUserWithUUID } = this.props;
    loginAsUserWithUUID(Number(event.target.value));
  };

  handleClickCreate = () => {
    window.open('http://ai2.appinventor.mit.edu', '_blank');
  };

  render() {
    const { searchQuery } = this.state;
    const { loggedInUser, isAdmin } = this.props;

    const USER_DROPDOWN_ID = 'user-dropdown-id';

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
            className={css(styles.headerButton)}
            onClick={this.handleClickCreate}
          >
            Create
          </button>
          <Link to="/explore">
            <button type="button" className={css(styles.headerButton)}>
              Explore
            </button>
          </Link>
          <Link to="/featured">
            <button type="button" className={css(styles.headerButton)}>
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
            />
          </div>
          <div className={css(styles.leftAligned)}>
            {/* eslint-disable-next-line */}
            <label htmlFor={USER_DROPDOWN_ID}>
              {'Log in as: '}
              <select id={USER_DROPDOWN_ID} onChange={this.handleUserLogin}>
                {USERS.map(user => (
                  <option value={user.id} key={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </label>
            <p className={css(styles.loginMessage)}>
              {!!loggedInUser
                && `You are logged in as ${loggedInUser.username}${isAdmin ? ' (admin)' : ''}.`}
              {!loggedInUser && 'You are not logged in.'}
            </p>
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
  loginAsUserWithUUID: PropTypes.func.isRequired,
  loginAsUserWithCookie: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
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

  headerButton: {
    height: 60,
    paddingLeft: 10,
    paddingRight: 10,
    border: 'none',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#58585A',
    ':hover': {
      backgroundColor: '#f0f0f0',
      color: '#222222',
    },
  },

  contentContainer: {
    margin: 'auto',
    marginTop: 80,
  },

  searchContainer: {
    marginLeft: 20,
    marginRight: 20,
  },

  leftAligned: {
    marginLeft: 'auto',
  },

  loginMessage: {
    fontSize: 10,
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
    loginAsUserWithUUID,
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
