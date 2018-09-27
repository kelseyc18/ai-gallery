import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

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
      <div className={css(styles.galleryAppDetail)}>
        <Link to={`/project/${project._id}`}>
          <img className={css(styles.appImage)} src={puppyImage} alt="project" />
        </Link>
        <div className={css(styles.descriptionContainer)}>
          <Link to={`/project/${project._id}`}>
            <p className={css(styles.appTitle)}>{project.title}</p>
          </Link>
          <a href="http://appinventor.mit.edu/">
            <p className={css(styles.appAuthor)}>{project.authorId}</p>
          </a>
        </div>
      </div>
    ) : (
      <div>That project does not exist.</div>
    );
  }
}

const styles = StyleSheet.create({
  galleryAppDetail: {
    border: 'solid #dddddd 1px',
    borderRadius: 10,
    backgroundColor: 'white',
    display: 'flex',
    margin: 'auto',
    marginBottom: 20,
    padding: 10,
    width: 800
  },

  appImage: {
    margin: 'auto',
    width: '100%',
    maxWidth: 160
  },

  descriptionContainer: {
    marginLeft: 10
  },

  appTitle: {
    fontWeight: 800,
    fontSize: 20,
    color: '#128ba8',
    ':hover': {
      color: '#105fa8'
    }
  },

  appAuthor: {
    color: '#58585a'
  }
});
