import React, { Component } from "react";
import Button from "material-ui/Button";

import { Link } from "react-router-dom";
import netlifyIdentity from "netlify-identity-widget";

export class Landing extends Component {

  render() {

    const currentUser = netlifyIdentity.currentUser();
    console.log(currentUser);
    return (
      <React.Fragment>
        <Link to="/page1">
          <Button variant="raised" color="primary">
            Page 1
          </Button>
        </Link>
        <Link to="/page2">
          <Button variant="raised" color="primary">
            Page 2
          </Button>
        </Link>
        <Link to="/event-start">
          <Button variant="raised" color="primary">
            Event start
          </Button>
        </Link>
        {currentUser ?
          <Link to="/login">
            <Button variant="raised" color="primary">
              Logout
          </Button>
          </Link> :
          <Link to="/login">
            <Button variant="raised" color="primary">
              Login
        </Button>
          </Link>
        }
        
      </React.Fragment>
    );
  }
}
