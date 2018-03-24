import React, { Component } from "react";

import { BrowserRouter, Route } from "react-router-dom";
import { Page1 } from "./pages/page1";
import { Page2 } from "./pages/page2";
import { EventStart } from "./pages/event-start";
import { Event } from "./pages/event";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";

class App extends Component {
  render() {
    return (
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
          <Route path="/login" component={Login} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
