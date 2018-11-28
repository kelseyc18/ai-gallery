import React from 'react';
import PropTypes from 'prop-types';

const Icon = (props) => {
  const {
    color, size, icon, onClick,
  } = props;

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
    <svg
      style={styles.svg}
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 24 24"
      onClick={onClick}
    >
      <path style={styles.path} d={icon} />
    </svg>
  );
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

Icon.defaultProps = {
  size: 24,
};

export default Icon;
