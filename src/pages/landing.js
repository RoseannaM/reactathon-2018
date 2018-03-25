import React, { Component } from "react";
import Button from "material-ui/Button";
import { Header } from "../components/header";
import { Title, Large } from "../components/typography";
import styled from "styled-components";
import { Link } from "react-router-dom";
import netlifyIdentity from "netlify-identity-widget";
import logo from "../images/logo-paint.png";

window.netlifyIdentity = netlifyIdentity;
// You must run this once before trying to interact with the widget
netlifyIdentity.init();

const Center = styled.div`
  width: 100%;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const CallToAction = styled.div`margin: 20px 0;`;

const Hero = styled.div`margin: 20px 0;`;

export class Landing extends Component {
  render() {
    const currentUser = netlifyIdentity.currentUser();

    console.log(currentUser);

    const loginButton = (
      <Link to="/login">
        <Button variant={currentUser ? "flat" : "raised"} color="primary">
          {currentUser ? "Logout" : "Login"}
        </Button>
      </Link>
    );

    const startButton = (
      <Link to="/event-list">
        <Button variant="raised" color="primary">
          Start your event now
        </Button>
      </Link>
    );

    return (
      <React.Fragment>
        <Header actions={loginButton} />
        <Center>
          <Title>
            Get ready to <strong>Assemble.</strong>
          </Title>
          <Hero>
            <img src={logo} width="300px" />
          </Hero>
          <div>
            <Large>
              <strong>Assemble</strong> is a platform for gathering with others
              in real time for meetups and conferences.
            </Large>
          </div>
          <CallToAction>{currentUser ? startButton : loginButton}</CallToAction>
        </Center>
      </React.Fragment>
    );
  }
}
