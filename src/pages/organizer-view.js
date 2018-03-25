import React, { Component } from "react";
import styled from "styled-components";

import { Header } from "../components/header";
import { Layout, LayoutLeft, LayoutRight } from "../components/layout";
import { Subtitle } from "../components/typography";

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

export class Organizer extends Component {
  render() {
    const streamInfo = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 }
    ];

    return (
      <White>
        <Header />
        <Layout>
          <LayoutLeft>
            <Subtitle>Active stream</Subtitle>
            <ActiveStreamCard />
          </LayoutLeft>
          <LayoutRight isOpen={true}>
            <Subtitle>Staged streams</Subtitle>
            <ProposedStreamList>
              {streamInfo.map(({ id }) => (
                <StreamCardWrapper key={id}>
                  <StagedStreamCard />
                </StreamCardWrapper>
              ))}
            </ProposedStreamList>
          </LayoutRight>
        </Layout>
      </White>
    );
  }
}
