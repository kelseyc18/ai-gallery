import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import puppyImage from './puppy.png';
import './app.css';

export default class ProjectDetail extends Component {
  state = { project: { title: 'untitled', authorId: 'no author' } };

  componentDidMount() {
    const projectId = this.props.match.params.projectId; // eslint-disable-line
    fetch(`/api/project/${projectId}`)
      .then(res => res.json())
      .then(res => this.setState({ project: res.project }));
  }

  render() {
    const { project } = this.state;

    return project ? (
      <div className="gallery-container">
        <div className="gallery-app">
          <Link to={`/project/${project.projectId}`}>
            <img className="app-image" src={puppyImage} alt="project" />
          </Link>
          <div className="app-description-container">
            <Link to={`/project/${project.projectId}`}>
              <p className="app-title">{project.title}</p>
            </Link>
            <a href="http://appinventor.mit.edu/">
              <p className="app-author">{project.authorId}</p>
            </a>
          </div>
        </div>
      </div>
    ) : (
      <div className="gallery-container">That project does not exist.</div>
    );
  }
}
