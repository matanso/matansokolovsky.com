import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <form action="/api/login" method="POST">
          <input type="text" name="username"/>
          <input type="password" name="password"/>
          <input type="submit" value="submit"/>
        </form>
      </div>
    );
  }
}

export default App;
