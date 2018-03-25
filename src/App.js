import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import { client } from "./apollo-client";
import { MuiThemeProvider } from "material-ui/styles";

import { BrowserRouter, Route } from "react-router-dom";
import { Page1 } from "./pages/page1";
import { Page2 } from "./pages/page2";
import { Event } from "./pages/event";
import { EventPage } from "./pages/event-page";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { Organizer } from "./pages/organizer-view";
import { theme } from "./theme.js";
import { EventListPage } from "./pages/event-list-page";

import netlifyIdentity from "netlify-identity-widget";
import { loginUser, logoutUser } from "./identityActions";

class App extends Component {
  state = { user: null };

  componentDidMount() {
    const user = localStorage.getItem("currentCoolUser");

    if (user) {
      this.setState({ user: JSON.parse(user) });
    } else {
      loginUser();
    }

    netlifyIdentity.on("login", user => this.setState({ user }, loginUser()));
    netlifyIdentity.on("logout", () =>
      this.setState({ user: null }, logoutUser())
    );
  }

  handleLogIn = () => {
    netlifyIdentity.open();
  };

  handleLogOut = () => {
    netlifyIdentity.logout();
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <BrowserRouter>
            <div className="App">
              <style>
                @import
                url('https://fonts.googleapis.com/css?family=IBM+Plex+Serif');
              </style>
              <Route path="/" exact component={Landing} />
              <Route path="/page1" component={Page1} />
              <Route path="/page2" component={Page2} />
              <Route path="/event" exact component={Event} />
              <Route path="/event/:id" component={EventPage} />
              <Route path="/organizer" component={Organizer} />
              <Route path="/login" component={Login} />
              <Route path="/event-list" component={EventListPage} />
            </div>
          </BrowserRouter>
        </ApolloProvider>
      </MuiThemeProvider>
    );
  }
}

export default App;
