import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import { client } from "./apollo-client";
import { MuiThemeProvider } from "material-ui/styles";

import { BrowserRouter, Route } from "react-router-dom";
import { OAuth } from "./pages/oauth";
import { Page1 } from "./pages/page1";
import { Page2 } from "./pages/page2";
import { Event } from "./pages/event";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { OrganizerPage } from "./pages/organizer-page";
import { theme } from "./theme.js";
import { EventListPage } from "./pages/event-list-page";
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
  }

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
              <Route path="/event/:id" exact component={Event} />
              <Route path="/organizer/:id" component={OrganizerPage} />
              <Route path="/login" component={Login} />
              <Route path="/event-list" component={EventListPage} />
              <Route path="/oauth" component={OAuth} />
            </div>
          </BrowserRouter>
        </ApolloProvider>
      </MuiThemeProvider>
    );
  }
}

export default App;
