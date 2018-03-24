import React, { Component } from "react";
// import styled from "styled-components";
import netlifyIdentity from "netlify-identity-widget";

// const Widget = styled.div`
//   color: green;
//   background-color: purple;
// `;

export class Login extends Component {
  constructor() {
    super();

    this.handleLogIn = this.handleLogIn.bind(this);
  }

  handleLogIn() {
    // You can import the widget into any component and interact with it.
    netlifyIdentity.open();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <button onClick={this.handleLogIn}>Log in with netlify</button>
        </div>
      </div>
    );
  }
}
