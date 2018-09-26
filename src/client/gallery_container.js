import React, { Component } from 'react';
import GalleryApp from './gallery_app';
import './app.css';

export default class GalleryContainer extends Component {
  state = { projects: [] };

  componentDidMount() {
    fetch('/api/projects')
      .then(res => res.json())
      .then(res => this.setState({ projects: res.projects }));
  }

  render() {
    const { projects } = this.state;
    return (
      <div className="gallery-container">
        {projects.map(project => (
          <GalleryApp project={project} key={project.projectId} />
        ))}
      </div>
    );
  }
}
