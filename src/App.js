import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import { client } from "./apollo-client";

import { BrowserRouter, Route } from "react-router-dom";
import { Page1 } from "./pages/page1";
import { Page2 } from "./pages/page2";
import { EventStart } from "./pages/event-start";
import { EventPage } from "./pages/event-page";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { EventListPage } from "./pages/event-list-page";

class App extends Component {
  render() {
    return (
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
            <Route path="/login" component={Login} />
            <Route path="/event-list" component={EventListPage} />
            <Route path="/event/:id" component={EventPage} />
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
