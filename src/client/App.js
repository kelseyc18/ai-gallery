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
        pathname: '/',
        search: `?q=${searchQuery}`,
      });
    }
  };

  handleUserLogin = (event) => {
    const { loginAsUserWithUUID } = this.props;
    loginAsUserWithUUID(Number(event.target.value));
  };

  render() {
    const { searchQuery } = this.state;
    const { loggedInUser } = this.props;

    const USER_DROPDOWN_ID = 'user-dropdown-id';

    return (
      <div>
        <div className={css(styles.headerContainer)}>
          <div className={css(styles.header)}>
            <Link to="/">
              <img className={css(styles.logo)} src={logo} alt="logo" />
            </Link>
            <Link to="/">
              <h1 className={css(styles.headerTitle)}>Project Gallery</h1>
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
            <div className={css(styles.userAuthentication)}>
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
              <p className={styles.loginMessage}>
                {!!loggedInUser && `You are logged in as ${loggedInUser.username}.`}
                {!loggedInUser && 'You are not logged in.'}
              </p>
            </div>
          </div>
        </div>

        <div className={css(styles.contentContainer)}>
          <Switch>
            <Route exact path="/" component={GalleryContainer} />
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
  cookie: PropTypes.string,
  loggedInUser: PropTypes.shape({
    username: PropTypes.string,
  }),
  loginAsUserWithUUID: PropTypes.func.isRequired,
  loginAsUserWithCookie: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  headerContainer: {
    borderTop: 'solid #a5cf47 20px',
    backgroundColor: 'white',
    position: 'fixed',
    top: 0,
    width: '100%',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    margin: 'auto',
    maxWidth: 850,
    maxHeight: 20,
  },

  headerTitle: {
    marginLeft: 20,
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
  },

  userAuthentication: {
    marginLeft: 'auto',
  },

  loginMessage: {
    fontSize: 10,
  },
});

const mapStateToProps = state => ({
  cookie: state.cookie,
  loggedInUser: state.loggedInUser,
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
