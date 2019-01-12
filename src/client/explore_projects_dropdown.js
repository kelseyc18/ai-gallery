import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProjects } from './redux/actions';

class ExploreProjectsDropdown extends Component {
  state = {
    sortBy: undefined,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.sortBy !== state.sortBy) {
      return {
        sortBy: props.sortBy,
      };
    }
    return null;
  }

  handleDropdownSelectionChange = (event) => {
    const { getProjects, loggedInUser } = this.props;
    getProjects(0, undefined, event.target.value, loggedInUser ? loggedInUser.id : undefined);
    this.setState({ sortBy: event.target.value });
  };

  render() {
    const { sortBy } = this.state;

    return (
      <select
        className={css(styles.dropdown)}
        value={sortBy}
        onChange={this.handleDropdownSelectionChange}
      >
        <option value="recent">Recent</option>
        <option value="popular">Popular</option>
        <option value="following">Following</option>
      </select>
    );
  }
}

ExploreProjectsDropdown.propTypes = {
  getProjects: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

const styles = StyleSheet.create({
  dropdown: {
    fontSize: 16,
  },
});

const mapStateToProps = state => ({
  sortBy: state.sortBy,
  projects: state.projects,
  searchQuery: state.searchQuery,
  loggedInUser: state.loggedInUser,
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
)(ExploreProjectsDropdown);
