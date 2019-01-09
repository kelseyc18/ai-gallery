import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import dateFormat from 'dateformat';

export default function FeaturedProjectLabel(props) {
  const { label } = props;
  const {
    dateAwarded, ageDivision, category, description,
  } = label;

  const dateAwardedDate = new Date(dateAwarded);
  const dateAwardedString = dateFormat(dateAwardedDate, 'mmmm yyyy');

  return (
    <div className={css(styles.container)}>
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
    dateAwarded: PropTypes.string,
  }),
};

const styles = StyleSheet.create({
  container: {
    background: '#c1e673',
    width: '100%',
    marginTop: 10,
  },

  title: {
    fontWeight: 'bold',
    margin: 10,
  },

  body: {
    margin: 10,
    fontSize: 14,
  },

  award: {
    fontWeight: 'bold',
  },
});
