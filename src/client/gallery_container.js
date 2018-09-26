import React, { Component } from 'react';
import GalleryApp from './gallery_app';
import './app.css';

export default class GalleryContainer extends Component {
  state = { apps: [] };

  componentDidMount() {
    fetch('/api/getApps')
      .then(res => res.json())
      .then(res => this.setState({ apps: res.apps }));
  }

  render() {
    const { apps } = this.state;
    return (
      <div className="gallery-container">
        {apps.map(app => (
          <GalleryApp app={app} key={app.projectId} />
        ))}
      </div>
    );
  }
}
