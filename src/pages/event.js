import React, { Component } from "react";
import styled from "styled-components";
import { Layout, LayoutMiddle } from "../components/layout";
import { Overlay } from "../components/overlay";
import { Header } from "../components/header";
import { compose, graphql } from "react-apollo";
import eventQuery from "./event.query.graphql";
import requestMutation from "./request-to-stream.mutation.graphql";
import EventCardList from "../components/event-card-list";
import EventCard from "../components/event-card";
import withLoadingSpinner from "../components/with-loading-spinner";
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from "opentok-react";
import { MainStreamCard } from "../components/stream-card";
import netlifyIdentity from "netlify-identity-widget";
import Menu, { MenuItem } from "material-ui/Menu";
import { BroadcastActions } from "../components/broadcast-actions";
import rabbit from "../images/rabbit.svg";
import { Subtitle, Large } from "../components/typography";

const Black = styled.div`
  margin: 0;
  background: white;
  width: 100vw;
  height: 100vh;
`;

const Center = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const ImageWrapper = styled.div`
  margin: 20px 0;
`;
const ImageCaption = styled.div`
  text-align: center;
`;

const Metadata = styled.div`
  width: 800px;
`;

export class EventImpl extends Component {
  state = {
    camera: false,
    screen: false,
    isOpen: false,
    isRevealed: false,
    request: null
  };

  toggleCamera = () => {
    if (!this.state.camera) {
      this.requestToStream();
    }
    this.setState({
      camera: !this.state.camera
    });
  };

  toggleScreen = () => {
    if (!this.state.screen) {
      this.requestToStream();
    }
    this.setState({
      screen: !this.state.screen
    });
  };

  requestToStream = () => {
    if (!this.state.request) {
      this.props
        .mutate({
          variables: {
            id: this.props.data.event.id
          }
        })
        .then(result => {
          console.log(result);
          this.setState({
            request: result.data.requestToStream
          });
        });
    }
  };

  renderVideo() {
    const event = this.props.data.event;
    const currentUser = netlifyIdentity.currentUser();

    return event.session && event.session.accessToken ? (
      <React.Fragment>
        <Metadata>
          <Subtitle>{event.title}</Subtitle>
          <Large>{event.description}</Large>
        </Metadata>
        {!event.stream ? (
          <div>
            <ImageWrapper>
              <img src={rabbit} alt="Rabbit" />
            </ImageWrapper>
            <ImageCaption>
              <Subtitle>Waiting for the stream to start</Subtitle>
            </ImageCaption>
          </div>
        ) : null}
        <OTSession
          apiKey="46086982"
          sessionId={event.session.id}
          token={event.session.accessToken}
        >
          {event.stream === `${currentUser.id}-camera` && this.state.camera ? (
            <OTPublisher
              properties={{
                width: "800px",
                height: "600px"
              }}
            />
          ) : null}
          {event.stream === `${currentUser.id}-screen` && this.state.screen ? (
            <OTPublisher
              properties={{
                width: "800px",
                height: "600px",
                videoSource: "screen"
              }}
            />
          ) : null}
          <OTStreams>
            <OTSubscriber
              properties={{
                width: "800px",
                height: "600px"
              }}
            />
          </OTStreams>
        </OTSession>
      </React.Fragment>
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
        <Header
          actions={
            <BroadcastActions
              toggleCamera={this.toggleCamera}
              toggleScreen={this.toggleScreen}
              isCameraActive={this.state.camera}
              isScreenActive={this.state.screen}
            />
          }
        />
        <Layout>
          <LayoutMiddle>
            <Center>{this.renderVideo()}</Center>
          </LayoutMiddle>
        </Layout>
        <Overlay
          isRevealed={this.state.isRevealed || this.props.data.event.session}
        />
        {this.state.request ? (
          <div style={{ display: "none" }}>
            {this.state.camera ? (
              <OTSession
                apiKey="46086982"
                sessionId={this.state.request.cameraSession.id}
                token={this.state.request.cameraSession.accessToken}
              >
                <OTPublisher />
              </OTSession>
            ) : null}
            {this.state.screen ? (
              <OTSession
                apiKey="46086982"
                sessionId={this.state.request.screenSession.id}
                token={this.state.request.screenSession.accessToken}
              >
                <OTPublisher
                  properties={{
                    videoSource: "screen"
                  }}
                />
              </OTSession>
            ) : null}
          </div>
        ) : null}
      </Black>
    );
  }
}

export const Event = compose(
  graphql(eventQuery, {
    options: props => ({
      pollInterval: 5000,
      variables: {
        id: props.match.params.id
      }
    })
  }),
  graphql(requestMutation),
  withLoadingSpinner
)(EventImpl);
