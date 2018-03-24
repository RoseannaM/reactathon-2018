import React, { Component } from "react";
import PageLayout from "../components/page-layout";
import { compose, graphql } from "react-apollo";
import eventsQuery from "./events.query.graphql";
import EventCardList from "../components/event-card-list";
import EventCard from "../components/event-card";
import withLoadingSpinner from "../components/with-loading-spinner";

class EventListPageView extends Component {
  render() {
    return (
      <PageLayout>
        <EventCardList title="Owned Events">
          {this.props.data.ownedEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </EventCardList>
        <EventCardList title="Joined Events">
          {this.props.data.joinedEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </EventCardList>
      </PageLayout>
    );
  }
}

export const EventListPage = compose(graphql(eventsQuery), withLoadingSpinner)(
  EventListPageView
);
