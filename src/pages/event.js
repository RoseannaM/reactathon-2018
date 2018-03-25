import React, { Component } from "react";
import styled from "styled-components";
import { Layout, LayoutLeft, LayoutRight } from "../components/layout";
import { Overlay } from "../components/overlay";
import { Header } from "../components/header";
import { compose, graphql } from "react-apollo";
import eventQuery from "./event.query.graphql";
import EventCardList from "../components/event-card-list";
import EventCard from "../components/event-card";
import withLoadingSpinner from "../components/with-loading-spinner";
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from "opentok-react";
import netlifyIdentity from "netlify-identity-widget";

const Black = styled.div`
  margin: 0;
  background: white;
  width: 100vw;
  height: 100vh;
`;

const Center = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export class EventImpl extends Component {
  state = {
    camera: true,
    screen: false,
    isOpen: false,
    isRevealed: false
  };

  toggleCamera = () => {
    this.setState({
      camera: !this.state.camera
    });
  };

  toggleScreen = () => {
    this.setState({
      screen: !this.state.screen
    });
  };

  renderVideo() {
    const { session } = this.props.data.event;
    const currentUser = netlifyIdentity.currentUser();

    return session && session.accessToken ? (
      <OTSession
        apiKey="46086982"
        sessionId={session.id}
        token={session.accessToken}
      >
        {session.stream === currentUser.id && this.state.camera ? (
          <OTPublisher />
        ) : null}
        {session.stream === currentUser.id && this.state.screen ? (
          <OTPublisher videoSource="screen" />
        ) : null}
        <OTStreams>
          <OTSubscriber />
        </OTStreams>
      </OTSession>
    ) : null; // waiting image here
  }

  constructor() {
    super();

    window.addEventListener("keydown", e => {
      if (e.keyCode === 13) {
        //TODO fix
        this.setState({
          isOpen: !this.state.isOpen
        });
      }
      if (e.keyCode === 32) {
        //TODO fix
        this.setState({
          isRevealed: !this.state.isRevealed
        });
      }
    });
  }

  render() {
    return (
      <Black>
        <Header />
        <Layout>
          <LayoutLeft>
            <button onClick={this.toggleCamera}>Camera</button>
            <button onClick={this.toggleScreen}>Screen</button>
            {this.renderVideo()}
          </LayoutLeft>
          <LayoutRight isOpen={this.state.isOpen}>Card list</LayoutRight>
        </Layout>
        <Overlay isRevealed={this.state.isRevealed} />
      </Black>
    );
  }
}

export const Event = compose(
  graphql(eventQuery, {
    options: props => ({
      variables: {
        id: props.match.params.id
      }
    })
  }),
  withLoadingSpinner
)(EventImpl);
