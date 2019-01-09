import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

// eslint-disable-next-line
export default class AdminProjectControls extends Component {
  render() {
    const ageDivisions = ['Youth', 'Teen', 'Adult'];
    const categories = ['Best Design', 'Most Creative', 'Most Innovative', 'Inventor'];

    const ageDivisionDropdownId = 'age-division-dropdown';
    const awardedDateId = 'awarded-date-dropdown';
    const categoryDropdownId = 'category-dropdown';

    return (
      <div className={css(styles.container)}>
        <div className={css(styles.title)}>Admin Controls</div>
        <div className={css(styles.body)}>
          <div className={css(styles.featuredProjectTitle)}>Featured Project</div>
          <label htmlFor={ageDivisionDropdownId}>
            Age Division:
            <select id={ageDivisionDropdownId}>
              <option value={null}>---</option>
              {ageDivisions.map(ageDivision => (
                <option value={ageDivisions} key={ageDivision}>
                  {ageDivision}
                </option>
              ))}
            </select>
          </label>
          <br />

          <label htmlFor={awardedDateId}>
            Month Awarded:
            <input type="month" id={awardedDateId} />
          </label>
          <br />

          <label htmlFor={categoryDropdownId}>
            Category:
            <select id={categoryDropdownId}>
              <option value={null}>---</option>
              {categories.map(category => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <br />

          <button type="button" className={css(styles.featuredProjectButton)}>
            Update Featured Project Award
          </button>
        </div>
      </div>
    );
  }
}

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
});
