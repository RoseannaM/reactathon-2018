import React, { Component } from "react";
import { compose, graphql } from "react-apollo";
import eventsQuery from "./events.query.graphql";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import EventCardList from "../components/event-card-list";
import EventCard from "../components/event-card";
import { Header } from "../components/header";
import {
  Layout,
  LayoutLeft,
  LayoutRight,
  LayoutMiddle
} from "../components/layout";
import { Subtitle, Large } from "../components/typography";
import withLoadingSpinner from "../components/with-loading-spinner";

const White = styled.div`
  margin: 0;
  background: #fff;
  width: 100vw;
  height: 100vh;
`;

const styledBtn = {
  margin: "5px"
};

const Intro = styled.div`margin-bottom: 30px;`;

class EventListPageView extends Component {
  render() {
    return (
      <White>
        <Header />
        <Layout>
          <LayoutMiddle>
            <Intro>
              <Subtitle>Start your event</Subtitle>
              <Large>
                Create a new event, or join an event that someone else is
                organizing.
              </Large>
            </Intro>
            <EventCardList title="Owned Events">
              {this.props.data.ownedEvents.map(event => (
                <EventCard key={event.id} title={event.title} />
              ))}
              <EventCard
                title="Create event"
                href="https://www.eventbrite.com/create"
              />
            </EventCardList>
            <EventCardList title="Joined Events">
              {this.props.data.joinedEvents.map(event => (
                <EventCard key={event.id} title={event.title} href="#" />
              ))}
              {/* <a href="/event" class="btn btn-primary btn-lg active" role="button">
              <Button style={styledBtn} size="small" variant="raised" color="primary" >
                Create Event
              </Button>
              </a> */}
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
