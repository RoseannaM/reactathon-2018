import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import { client } from "./apollo-client";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";

import { BrowserRouter, Route } from "react-router-dom";
import { Page1 } from "./pages/page1";
import { Page2 } from "./pages/page2";
import { EventStart } from "./pages/event-start";
import { Event } from "./pages/event";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { Organizer } from "./pages/organizer-view";
import { theme } from "./theme.js";

class App extends Component {
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
              <Route path="/event-start" component={EventStart} />
              <Route path="/event" component={Event} />
              <Route path="/organizer" component={Organizer} />
              <Route path="/login" component={Login} />
            </div>
          </BrowserRouter>
        </ApolloProvider>
      </MuiThemeProvider>
    );
  }
}

export default App;
