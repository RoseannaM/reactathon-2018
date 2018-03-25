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
  renderVideo() {
    const { session } = this.props.data.event.session;
    const currentUser = netlifyIdentity.currentUser();
    console.log(currentUser);

    return session && session.accessToken ? (
      <OTSession
        apiKey="46086982"
        sessionId={session.id}
        token={session.accessToken}
      >
        {session.stream === currentUser.id ? <OTPublisher /> : null}
        <OTStreams>
          <OTSubscriber />
        </OTStreams>
      </OTSession>
    ) : null;
  }

  render() {
    return (
      <PageLayout title={this.props.data.event.title}>
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
