import React, { Component } from "react";

import { BrowserRouter, Route } from "react-router-dom";
import { Page1 } from "./pages/page1";
import { Page2 } from "./pages/page2";
import { EventStart } from "./pages/EventStart";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/login";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
<<<<<<< HEAD
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
          <Link to="/login">
            <Button variant="raised" color="primary">
              Login
            </Button>
          </Link>

=======
          <Route path="/" exact component={Landing} />
>>>>>>> 9f8ff5c68f850abdf599c4c4e01c88aedc3a716a
          <Route path="/page1" component={Page1} />
          <Route path="/page2" component={Page2} />
          <Route path="/event-start" component={EventStart} />
          <Route path="/login" component={Login} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
