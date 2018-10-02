import React from 'react';
import PropTypes from 'prop-types';

const Icon = (props) => {
  const { color, size, icon } = props;

  const styles = {
    svg: {
      display: 'inline-block',
      verticalAlign: 'middle',
    },
    path: {
      fill: color,
    },
  };

  return (
    <svg style={styles.svg} width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24">
      <path style={styles.path} d={icon} />
    </svg>
  );
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};

Icon.defaultProps = {
  size: 24,
};

export default Icon;
