import React, { Component } from "react";
import styled from "styled-components";
import netlifyIdentity from "netlify-identity-widget";

import Button from "material-ui/Button";
import { ActionAssignmentTurnedIn } from "material-ui";
import { withRouter } from "react-router-dom";

const Widget = styled.div`
  

`

export class Login extends Component {
  constructor() {
    super();
    
    let loggedIn = false;

    netlifyIdentity.on("login", login => loggedIn = true);

    if (loggedIn === true) {
      console.log(true);
      netlifyIdentity.close();
      this.props.history.push("/");
    }
    else {
      netlifyIdentity.on("close", () => netlifyIdentity.open())
    }
  }

  componentDidMount(){
    netlifyIdentity.open();
  }

  

  render() {
    return ( 
    <Widget>
      <Button>Log in with netlify</Button>
    </Widget>
    );
  }
}

export default withRouter(Login);

