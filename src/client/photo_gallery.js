import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';

export default class PhotoGallery extends Component {
  state = {
    selectedImageIndex: 0,
  };

  handleOnClickNext = () => {
    const { selectedImageIndex } = this.state;
    this.setState({ selectedImageIndex: selectedImageIndex + 1 });
  };

  handleOnClickPrevious = () => {
    const { selectedImageIndex } = this.state;
    this.setState({ selectedImageIndex: selectedImageIndex - 1 });
  };

  render() {
    const { selectedImageIndex } = this.state;
    const { photos } = this.props;

    return (
      <div className={css(styles.container)}>
        <div>{`${selectedImageIndex + 1} of ${photos.length}`}</div>
        <div className={css(styles.photoContainer)}>
          <button type="button" onClick={this.handleOnClickPrevious} disabled={selectedImageIndex < 1}>&lt;&lt;</button>
          <img
            className={css(styles.selectedScreenshotImage)}
            src={photos[selectedImageIndex]}
            alt="screenshot"
          />
          <button type="button" onClick={this.handleOnClickNext} disabled={selectedImageIndex + 1 >= photos.length}>&gt;&gt;</button>
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
    textAlign: 'center',
  },

  photoContainer: {
    margin: 'auto',
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  selectedScreenshotImage: {
    width: 300,
  },
});
