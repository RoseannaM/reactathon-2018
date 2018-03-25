import React, { Component } from "react";
import styled from "styled-components";
import netlifyIdentity from "netlify-identity-widget";

import Button from "material-ui/Button";
import { ActionAssignmentTurnedIn } from "material-ui";
import { withRouter } from "react-router-dom";

const Widget = styled.div``;

let mounted;

export class Login extends Component {
  constructor() {
    super();

    netlifyIdentity.on("login", login => {
      netlifyIdentity.close();
      this.props.history.push("/");
    });

    netlifyIdentity.on("close", () => {
      if (!netlifyIdentity.currentUser() && mounted) {
        netlifyIdentity.open();
      }
    });
  }

  componentDidMount() {
    mounted = true;
    netlifyIdentity.open();
  }

  componentWillUnmount() {
    console.log("unmount");
    mounted = false;
    netlifyIdentity.close();
  }

  render() {
    return <Widget />;
  }
}

export default withRouter(Login);
