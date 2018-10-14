import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

import GalleryAppPreview from './gallery_app_preview';

export default function ProjectDetailSidebar(props) {
  const { projects, author } = props;

  return (
    <div>
      <p className={css(styles.title)}>{`Apps made by ${author.username}`}</p>
      {projects.slice(0, 4).map(project => (
        <GalleryAppPreview key={project._id} project={project} author={author} />
      ))}
    </div>
  );
}

ProjectDetailSidebar.propTypes = {
  author: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
    }),
  ),
};

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
  },
});
