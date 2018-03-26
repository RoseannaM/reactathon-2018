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
import selectStreamMutation from "./select-stream.mutation.graphql";

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

const StreamCardWrapper = styled.div`padding-bottom: 10px;`;

class SessionView extends Component {
  render() {
    if (!this.props.session.id || !this.props.session.accessToken) {
      return null;
    }
    return (
      <OTSession
        apiKey="46086982"
        sessionId={this.props.session.id}
        token={this.props.session.accessToken}
      >
        <OTStreams>
          <OTSubscriber
            properties={{
              ...(this.props.subscriberProperties || {})
            }}
          />
        </OTStreams>
      </OTSession>
    );
  }
}

class OrganizerView extends Component {
  startBroadcast = () => {
    this.props.startBroadcastMutation({
      variables: {
        id: this.props.data.event.id
      }
    });
  };

  selectStream = streamId => {
    this.props.selectStream({
      variables: {
        sessionId: this.props.data.event.id,
        userId: streamId
      }
    });
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
            ) : (
              <Button variant="raised" color="primary">
                Stop Broadcast
              </Button>
            )
          }
        />
        <Layout>
          <LayoutLeft>
            <Subtitle>Active stream</Subtitle>
            <ActiveStreamCard>
              {session ? (
                <SessionView
                  subscriberProperties={{ width: "800px", height: "600px" }}
                  session={session}
                />
              ) : null}
            </ActiveStreamCard>
          </LayoutLeft>
          <LayoutRight isOpen={true}>
            <Subtitle>Staged streams</Subtitle>
            <ProposedStreamList>
              {session &&
                event.requests.map(
                  request =>
                    request.user.id ===
                    "4818b197-0266-43eb-88c5-ac0fcc3731df" ? (
                      <StreamCardWrapper key={request.screenSession.id}>
                        <StagedStreamCard
                          onPromote={() => {
                            console.log("promote");
                            this.selectStream(`${request.user.id}-screen`);
                          }}
                        >
                          <SessionView
                            subscriberProperties={{
                              width: "300px",
                              height: "200px"
                            }}
                            session={request.screenSession}
                          />
                        </StagedStreamCard>
                      </StreamCardWrapper>
                    ) : (
                      <StreamCardWrapper key={request.cameraSession.id}>
                        <StagedStreamCard
                          onPromote={() => {
                            console.log("promote");
                            this.selectStream(`${request.user.id}-camera`);
                          }}
                        >
                          <SessionView
                            subscriberProperties={{
                              width: "300px",
                              height: "200px"
                            }}
                            session={request.cameraSession}
                          />
                        </StagedStreamCard>
                      </StreamCardWrapper>
                    )
                )}
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
  graphql(selectStreamMutation, {
    name: "selectStream"
  }),
  withLoadingSpinner
)(OrganizerView);
