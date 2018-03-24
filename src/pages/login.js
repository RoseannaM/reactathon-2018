import React, { Component } from "react";
import styled from "styled-components";
import netlifyIdentity from "netlify-identity-widget";

import Button from "material-ui/Button";

const Widget = styled.div`
  
`
const Loginbutton = styled.button `
    color: blue;
`

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
    <Widget>
      <Button onClick={this.handleLogIn}>Log in with netlify</Button>
    </Widget>
    );
  }
}
