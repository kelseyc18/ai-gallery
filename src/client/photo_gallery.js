import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';

export default class PhotoGallery extends Component {
  state = {
    selectedImageSrc: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.photos && props.photos.length > 0 && !state.selectedImageSrc) {
      return {
        selectedImageSrc: props.photos[0],
      };
    }
    return null;
  }

  handleOnClick = (imgSrc) => {
    this.setState({ selectedImageSrc: imgSrc });
  };

  render() {
    const { selectedImageSrc } = this.state;
    const { photos } = this.props;

    return (
      <div className={css(styles.container)}>
        <img
          className={css(styles.selectedScreenshotImage)}
          src={selectedImageSrc}
          alt="screenshot"
        />
        <div className={css(styles.thumbnailContainer)}>
          {photos.map(photoSrc => (
            <button
              type="button"
              className={css(styles.thumbnailButton)}
              onClick={() => this.handleOnClick(photoSrc)}
              key={photoSrc}
            >
              <img className={css(styles.thumbnail)} alt="thumbnail" src={photoSrc} />
            </button>
          ))}
        </div>
      </div>
    );
  }
}

PhotoGallery.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.string),
};

const styles = StyleSheet.create({
  container: {
    margin: 'auto',
    marginBottom: 10,
  },

  selectedScreenshotImage: {
    width: 300,
  },

  selectedThumbnail: {
    opacity: 1,
  },

  thumbnailButton: {
    border: 0,
    padding: 0,
  },

  thumbnailContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  thumbnail: {
    width: 96,
    opacity: 0.5,
  },
});
