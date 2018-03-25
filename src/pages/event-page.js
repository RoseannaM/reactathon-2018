import React, { Component } from "react";
import PageLayout from "../components/page-layout";
import { compose, graphql } from "react-apollo";
import eventQuery from "./event.query.graphql";
import EventCardList from "../components/event-card-list";
import EventCard from "../components/event-card";
import withLoadingSpinner from "../components/with-loading-spinner";
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from "opentok-react";
import netlifyIdentity from "netlify-identity-widget";

class EventPageView extends Component {
  state = {
    camera: true,
    screen: false
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

  render() {
    return (
      <PageLayout title={this.props.data.event.title}>
        <button onClick={this.toggleCamera}>Camera</button>
        <button onClick={this.toggleScreen}>Screen</button>
        {this.renderVideo()}
      </PageLayout>
    );
  }
}

export const EventPage = compose(
  graphql(eventQuery, {
    options: props => ({
      variables: {
        id: props.match.params.id
      }
    })
  }),
  withLoadingSpinner
)(EventPageView);
