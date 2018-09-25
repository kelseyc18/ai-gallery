import React, { Component } from 'react';
import './app.css';

export default class App extends Component {
  state = { username: null, apps: [] };

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
    fetch('/api/getApps')
      .then(res => res.json())
      .then(res => this.setState({ apps: res.apps }));
  }

  render() {
    const { username, apps } = this.state;
    return (
      <div>
        <h1>MIT App Inventor Gallery</h1>
        {username ? <h2>{`Hello ${username}`}</h2> : <h2>Loading.. please wait!</h2>}
        <div className="gallery-container">
          {apps.map(name => (
            <div className="gallery-app">{name}</div>
          ))}
        </div>
      </div>
    );
  }
}
