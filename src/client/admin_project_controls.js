import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import dateFormat from 'dateformat';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { updateFeaturedProject } from './redux/actions';

class AdminProjectControls extends Component {
  state = {
    ageDivision: '',
    category: '',
    dateAwarded: '',
    description: '',
  };

  static getDerivedStateFromProps(props, state) {
    const { project } = props;
    const { featuredLabel } = project;
    let dateAwarded;

    if (project.id !== state.projectId) {
      if (featuredLabel) {
        const date = new Date(featuredLabel.dateAwarded);
        date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        dateAwarded = dateFormat(date, 'yyyy-mm');
      }

      return {
        ageDivision: (featuredLabel && featuredLabel.ageDivision) || '',
        category: (featuredLabel && featuredLabel.category) || '',
        dateAwarded: dateAwarded || '',
        description: (featuredLabel && featuredLabel.description) || '',
        projectId: project.id,
      };
    }
    return null;
  }

  handleAgeDivisionChange = (event) => {
    this.setState({ ageDivision: event.target.value });
  };

  handleCategoryChange = (event) => {
    this.setState({ category: event.target.value });
  };

  handleAwardedDateChange = (event) => {
    this.setState({ dateAwarded: event.target.value });
  };

  handleDescriptionChange = (event) => {
    this.setState({ description: event.target.value });
  };

  handleSubmit = () => {
    const {
      ageDivision, category, dateAwarded, description,
    } = this.state;
    const { updateFeaturedProject, project } = this.props;

    if (ageDivision && category && dateAwarded) {
      const featuredLabel = {
        ageDivision,
        category,
        dateAwarded,
        description,
      };
      updateFeaturedProject(project.id, featuredLabel);
    } else {
      alert('Please make sure you fill out all the fields.');
    }
  };

  handleRemoveAward = () => {
    const { updateFeaturedProject, project } = this.props;

    updateFeaturedProject(project.id, null);
  };

  render() {
    const ageDivisions = ['Young', 'Teen', 'Adult'];
    const categories = ['Best Design', 'Most Creative', 'Most Innovative', 'Inventor'];

    const ageDivisionDropdownId = 'age-division-dropdown';
    const awardedDateId = 'awarded-date-dropdown';
    const categoryDropdownId = 'category-dropdown';
    const descriptionId = 'award-description';

    const {
      dateAwarded, ageDivision, category, description,
    } = this.state;

    return (
      <div className={css(styles.container)}>
        <div className={css(styles.title)}>Admin Controls</div>
        <div className={css(styles.body)}>
          <div className={css(styles.featuredProjectTitle)}>Featured App of the Month</div>
          <label htmlFor={ageDivisionDropdownId}>
            Age Division:
            <select
              id={ageDivisionDropdownId}
              value={ageDivision}
              onChange={this.handleAgeDivisionChange}
            >
              <option value="">---</option>
              {ageDivisions.map(ageDivision => (
                <option value={ageDivision} key={ageDivision}>
                  {ageDivision}
                </option>
              ))}
            </select>
          </label>
          <br />

          <label htmlFor={awardedDateId}>
            Month Awarded:
            <input
              type="month"
              id={awardedDateId}
              value={dateAwarded}
              onChange={this.handleAwardedDateChange}
            />
          </label>
          <br />

          <label htmlFor={categoryDropdownId}>
            Category:
            <select id={categoryDropdownId} value={category} onChange={this.handleCategoryChange}>
              <option value="">---</option>
              {categories.map(category => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <br />

          <label htmlFor={descriptionId}>
            Description:
            <br />
            <textarea
              className={css(styles.edit)}
              value={description}
              onChange={this.handleDescriptionChange}
            />
          </label>
          <br />

          <button
            type="button"
            className={css(styles.featuredProjectButton)}
            onClick={this.handleSubmit}
          >
            Update App of the Month Award
          </button>

          <button
            type="button"
            className={css(styles.featuredProjectButton, styles.removeButton)}
            onClick={this.handleRemoveAward}
          >
            Remove Award
          </button>
        </div>
      </div>
    );
  }
}

AdminProjectControls.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  updateFeaturedProject: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    background: '#ffe19c',
    width: '100%',
    marginTop: 10,
  },

  title: {
    fontWeight: 'bold',
    margin: 10,
  },

  body: {
    margin: 10,
    marginTop: 0,
    fontSize: 14,
  },

  featuredProjectTitle: {
    fontWeight: 'bold',
  },

  featuredProjectButton: {
    marginTop: 10,
    fontSize: 14,
  },

  edit: {
    border: 0,
    background: '#eeeeee',
    borderRadius: 2,
    fontSize: 12,
    width: '100%',
    boxSizing: 'border-box',
  },

  removeButton: {
    marginLeft: 10,
  },
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    updateFeaturedProject,
  },
  dispatch,
);

export default connect(
  null,
  mapDispatchToProps,
)(AdminProjectControls);
