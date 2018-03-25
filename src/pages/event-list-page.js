import React, { Component } from "react";
import { compose, graphql } from "react-apollo";
import eventsQuery from "./events.query.graphql";
import styled from "styled-components";
import EventCardList from "../components/event-card-list";
import EventCard from "../components/event-card";
import { Header } from "../components/header";
import { Layout, LayoutLeft, LayoutRight, LayoutMiddle } from "../components/layout";

import withLoadingSpinner from "../components/with-loading-spinner";


const White = styled.div`
  margin: 0;
  background: #fff;
  width: 100vw;
  height: 100vh;
`;


class EventListPageView extends Component {
  render() {
    return (
      <White>
        <Header />
        <Layout>
          <LayoutMiddle>
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
          </LayoutMiddle>
        </Layout>
      </White>
    );
  }
}

export const EventListPage = compose(graphql(eventsQuery), withLoadingSpinner)(
  EventListPageView
);
