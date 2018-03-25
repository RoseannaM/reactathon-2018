import React, { Component } from "react";
import Button from "material-ui/Button";
import { Header } from "../components/header";
import { Title, Large } from "../components/typography";
import styled from "styled-components";
import { Link } from "react-router-dom";
import netlifyIdentity from "netlify-identity-widget";
import logo from "../images/logo-paint.png";
import friends from "../images/forrest-friends.png"


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

const Hr = styled.hr`
  border: solid 1px #d0bde2;
    width: 80%;
    margin-bottom: 50px;

`

const H3 = styled.h3`
  margin-bottom: 50px;
`

const GatheringDiv = styled.div `
  background-color: #fff;
  width: 100%;
  height: 500px;
  padding-bottom: 30px;
  margin-bottom: 50px;
`
const TextContainer = styled.div `
  

`
const GatheringImg = styled.img `
  margin: 20px;
`

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
          <Hr/>
          <GatheringDiv>
          <Large>
              Attend a meetup from anywhere. <strong>Assemble</strong> enables team collaboration,<br/>
              cross geo inclusivity and strengthens connections.
            </Large>
          <GatheringImg src={friends} width="70%"  />            
            <br/>
            <H3>harnessing the power of the real time video streaming, we make it easy for you to create and
              join events.
            </H3>
          </GatheringDiv>
        </Center>
      </React.Fragment>
    );
  }
}
