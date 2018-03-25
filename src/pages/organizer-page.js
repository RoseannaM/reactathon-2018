import React, { Component } from "react";
import styled from "styled-components";
import organizerQuery from "./organizer.query.graphql";
import { Header } from "../components/header";
import { Layout, LayoutLeft, LayoutRight } from "../components/layout";
import { Subtitle } from "../components/typography";
import { compose, graphql } from "react-apollo";
import withLoadingSpinner from "../components/with-loading-spinner";
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from "opentok-react";

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
          <OTSubscriber />
        </OTStreams>
      </OTSession>
    );
  }
}

class OrganizerView extends Component {
  render() {
    const { session } = this.props.data.event;

    return (
      <White>
        <Header />
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
                session.requests.map(request => (
                  <StreamCardWrapper key={request.session.id}>
                    <StagedStreamCard>
                      <SessionView session={request.session} />
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
  withLoadingSpinner
)(OrganizerView);
