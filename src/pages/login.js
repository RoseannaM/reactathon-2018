import React, { Component } from "react";
import styled from "styled-components";
import netlifyIdentity from "netlify-identity-widget";

import Button from "material-ui/Button";
import { ActionAssignmentTurnedIn } from "material-ui";
import { withRouter } from "react-router-dom";

const Widget = styled.div``;

export class Login extends Component {
  constructor() {
    super();

    netlifyIdentity.on("login", login => {
      netlifyIdentity.close();
      this.props.history.push("/");
    });

    netlifyIdentity.on("close", () => {
      if (!netlifyIdentity.currentUser()) {
        netlifyIdentity.open();
      }
    });
  }

  componentDidMount() {
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
