import React, { Component } from "react";
import styled from "styled-components";
import organizerQuery from "./organizer.query.graphql";
import { Header } from "../components/header";
import { Layout, LayoutLeft, LayoutRight } from "../components/layout";
import { Subtitle } from "../components/typography";
import { compose, graphql } from "react-apollo";
import withLoadingSpinner from "../components/with-loading-spinner";
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from "opentok-react";
import Button from "material-ui/Button";
import startEventMutation from "./start-event.mutation.graphql";

import { StagedStreamCard, ActiveStreamCard } from "../components/stream-card";

const White = styled.div`
  margin: 0;
  background: white;
  width: 100vw;
  height: 100vh;
  color: black;
`;

const ProposedStreamList = styled.div`
  display: flex;
  flex-direction: column;
`;

const StreamCardWrapper = styled.div`
  padding-bottom: 10px;
`;

class SessionView extends Component {
  render() {
    return (
      <OTSession
        apiKey="46086982"
        sessionId={this.props.session.id}
        token={this.props.session.accessToken}
      >
        <OTStreams>
          <OTSubscriber
            properties={{
              width: "100%"
            }}
          />
        </OTStreams>
      </OTSession>
    );
  }
}

class OrganizerView extends Component {
  startBroadcast = () => {
    this.props.startBroadcast(this.props.data.event.id);
  };

  render() {
    console.log(this.props.data);
    const { session } = this.props.data.event;
    const event = this.props.data.event;

    return (
      <White>
        <Header
          actions={
            !session ? (
              <Button
                variant="raised"
                color="primary"
                onClick={this.startBroadcast}
              >
                Start Broadcast
              </Button>
            ) : null
          }
        />
        <Layout>
          <LayoutLeft>
            <Subtitle>Active stream</Subtitle>
            <ActiveStreamCard>
              {session ? <SessionView session={session} /> : null}
            </ActiveStreamCard>
          </LayoutLeft>
          <LayoutRight isOpen={true}>
            <Subtitle>Staged streams</Subtitle>
            <ProposedStreamList>
              {session &&
                event.requests.map(request => (
                  <StreamCardWrapper key={request.cameraSession.id}>
                    <StagedStreamCard>
                      <SessionView session={request.cameraSession} />
                    </StagedStreamCard>
                  </StreamCardWrapper>
                ))}
            </ProposedStreamList>
          </LayoutRight>
        </Layout>
      </White>
    );
  }
}

export const OrganizerPage = compose(
  graphql(organizerQuery, {
    options: props => ({
      variables: {
        id: props.match.params.id
      }
    })
  }),
  graphql(startEventMutation, {
    name: "startBroadcastMutation"
  }),
  withLoadingSpinner
)(OrganizerView);
