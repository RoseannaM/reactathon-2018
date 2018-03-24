import React, { Component } from "react";
import PageLayout from "../components/page-layout";
import { compose, graphql } from "react-apollo";
import eventQuery from "./event.query.graphql";
import EventCardList from "../components/event-card-list";
import EventCard from "../components/event-card";
import withLoadingSpinner from "../components/with-loading-spinner";

class EventPageView extends Component {
  render() {
    return <PageLayout title={this.props.data.event.title} />;
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
