import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loginAsUserWithUUID, logoutUser } from './redux/actions';
import sharedStyles from './sharedstyles';
import codiImage from './codi.png';

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

class DropdownMenu extends Component {
  state = {
    showMenu: false,
  };

  closeMenu = (event) => {
    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  };

  showMenu = () => {
    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  };

  handleUserLogin = (event) => {
    const { loginAsUserWithUUID } = this.props;
    this.setState({ showMenu: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
    loginAsUserWithUUID(Number(event.target.value));
  };

  handleClickProfile = (history) => {
    const { loggedInUser } = this.props;

    this.setState({ showMenu: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
    history.push(`/profile/${loggedInUser.username}`);
  };

  handleClickSignout = () => {
    const { logoutUser } = this.props;

    logoutUser();
    this.setState({ showMenu: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
  };

  render() {
    const { showMenu } = this.state;
    const { loggedInUser, isAdmin } = this.props;

    if (loggedInUser) {
      return (
        <div>
          <button
            type="button"
            className={css(
              sharedStyles.headerButton,
              styles.dropdownHeaderButton,
              styles.usernameButton,
              showMenu && styles.selectedDropdownButton,
            )}
            onClick={this.showMenu}
          >
            <div className={css(styles.usernameButtonContent)}>
              <img
                className={css(styles.profileImage)}
                src={loggedInUser.imagePath || codiImage}
                alt="profile"
              />
              {`${loggedInUser.username}`}
              {isAdmin && ' (admin)'}
            </div>
          </button>

          {showMenu && (
            <div
              className={css(styles.menu)}
              ref={(element) => {
                this.dropdownMenu = element;
              }}
            >
              <Route
                render={({ history }) => (
                  <button
                    type="button"
                    className={css(styles.menuButton)}
                    onClick={() => this.handleClickProfile(history)}
                  >
                    View Profile
                  </button>
                )}
              />
              <button
                type="button"
                className={css(styles.menuButton)}
                onClick={this.handleClickSignout}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      );
    }
    return (
      <div>
        <button
          type="button"
          className={css(
            sharedStyles.headerButton,
            styles.dropdownHeaderButton,
            showMenu && styles.selectedDropdownButton,
          )}
          onClick={this.showMenu}
        >
          Sign In
        </button>

        {showMenu && (
          <div
            className={css(styles.menu, styles.signInMenu)}
            ref={(element) => {
              this.dropdownMenu = element;
            }}
          >
            <div>
              {'Log in as: '}
              <select onChange={this.handleUserLogin}>
                <option value={null}>---</option>
                {USERS.map(user => (
                  <option value={user.id} key={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    );
  }
}

DropdownMenu.propTypes = {
  loggedInUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
  isAdmin: PropTypes.bool,
  loginAsUserWithUUID: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  menu: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    maxWidth: 260,
  },

  signInMenu: {
    zIndex: 9999,
    position: 'absolute',
    padding: 10,
    marginTop: 5,
    right: 0,
    border: '1px solid #dddddd',
  },

  dropdownHeaderButton: {
    paddingLeft: 20,
    paddingRight: 20,
    ':hover': {
      backgroundColor: '#daebb4',
      color: '#222222',
      opacity: 'initial',
    },
  },

  selectedDropdownButton: {
    backgroundColor: '#b8cf86',
    ':hover': {
      backgroundColor: '#b8cf86',
      color: '#222222',
    },
  },

  menuButton: {
    width: '100%',
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    border: 'none',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#58585A',
    ':hover': {
      backgroundColor: '#daebb4',
      color: '#222222',
      opacity: 'initial',
    },
  },

  loginButton: {
    marginLeft: 'auto',
  },

  usernameButton: {
    fontWeight: 'normal',
    fontSize: 14,
    ':hover': {
      opacity: 'initial',
    },
  },

  usernameButtonContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 2,
    marginRight: 5,
  },
});

const mapStateToProps = state => ({
  loggedInUser: state.loggedInUser,
  isAdmin: state.isAdmin,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    loginAsUserWithUUID,
    logoutUser,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DropdownMenu);
