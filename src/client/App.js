import React, { Component } from 'react';
import {
  Route, Link, Switch, Redirect, withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { loginAsUser } from './redux/actions';

import Icon from './icon';
import ICONS from './icon_constants';
import GalleryContainer from './gallery_container';
import ProjectDetail from './project_detail';
import Profile from './profile';
import './app.css';
import logo from './logo.png';

// TODO(kelsey): Replace when implementing actual user authentication
const USERS = [
  {
    id: '5bb3cdb8c47ccf553251d0f6',
    username: 'piazza_master',
  },
  {
    id: '5bb3cde6c47ccf553251d0f7',
    username: 'boba_master',
  },
  {
    id: '5bbfd5adac85e209d0d4a598',
    username: 'coffee_master',
  },
];

class App extends Component {
  state = {
    searchQuery: '',
  };

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
    const { loginAsUser } = this.props;
    loginAsUser(event.target.value);
  };

  render() {
    const { searchQuery } = this.state;

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
                {'Logged in as: '}
                <select id={USER_DROPDOWN_ID} onChange={this.handleUserLogin}>
                  {USERS.map(user => (
                    <option value={user.id} key={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className={css(styles.contentContainer)}>
          <Switch>
            <Route exact path="/" component={GalleryContainer} />
            <Route path="/project/:projectId" component={ProjectDetail} />
            <Redirect exact path="/project" to="/" />
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
  loginAsUser: PropTypes.func.isRequired,
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
  },

  searchContainer: {
    marginLeft: 20,
  },

  userAuthentication: {
    marginLeft: 'auto',
  },
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    loginAsUser,
  },
  dispatch,
);

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(App),
);
