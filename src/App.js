import React, { Component } from "react";
import "./App.css";
import { ApolloProvider } from "react-apollo";
import { client } from "./apollo-client";

import Button from "material-ui/Button";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Page1 } from "./pages/page1";
import { Page2 } from "./pages/page2";

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div className="App">
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

            <Route path="/page1" component={Page1} />
            <Route path="/page2" component={Page2} />
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
