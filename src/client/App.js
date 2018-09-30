import React from 'react';
import {
  Route, Link, Switch, Redirect,
} from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

import GalleryContainer from './gallery_container';
import ProjectDetail from './project_detail';
import './app.css';
import logo from './logo.png';

export default function App() {
  return (
    <div>
      <div className={css(styles.headerContainer)}>
        <div className={css(styles.header)}>
          <Link to="/">
            <img className={css(styles.logo)} src={logo} alt="logo" />
          </Link>
          <Link to="/">
            <h1 className={css(styles.headerTitle)}>Project Gallery</h1>
          </Link>
        </div>
      </div>

      <div className={css(styles.contentContainer)}>
        <Switch>
          <Route exact path="/" component={GalleryContainer} />
          <Route path="/project/:projectId" component={ProjectDetail} />
          <Redirect exact path="/project" to="/" />
        </Switch>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    borderTop: 'solid #a5cf47 20px',
    backgroundColor: 'white',
    position: 'fixed',
    top: 0,
    width: '100%',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    margin: 'auto',
    maxWidth: 1000,
    maxHeight: 20,
  },

  headerTitle: {
    marginLeft: 20,
    fontSize: 24,
  },

  logo: {
    height: 48,
    width: 'auto',
  },

  contentContainer: {
    margin: 'auto',
  },
});
