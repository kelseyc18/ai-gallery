import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import dateFormat from 'dateformat';

export default function FeaturedProjectLabel(props) {
  const { label, hasTopMargin } = props;
  const {
    dateAwarded, ageDivision, category, description,
  } = label;

  const date = new Date(dateAwarded);
  date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  const dateAwardedString = dateFormat(date, 'mmmm yyyy');

  return (
    <div className={css(styles.container, !!hasTopMargin && styles.topMargin)}>
      <div className={css(styles.title)}>{`Featured App of the Month - ${dateAwardedString}`}</div>
      <div className={css(styles.body)}>
        <p className={css(styles.award)}>{`${category} Award (${ageDivision})`}</p>
        <p className={css(styles.description)}>{description}</p>
      </div>
    </div>
  );
}

FeaturedProjectLabel.propTypes = {
  label: PropTypes.shape({
    dateAwarded: PropTypes.string.isRequired,
  }).isRequired,
  hasTopMargin: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    background: '#c1e673',
    width: '100%',
    marginBottom: 10,
  },

  topMargin: {
    marginTop: 10,
  },

  title: {
    fontWeight: 'bold',
    padding: 10,
  },

  body: {
    padding: 10,
    fontSize: 14,
  },

  award: {
    fontWeight: 'bold',
  },
});
