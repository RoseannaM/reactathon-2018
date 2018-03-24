import React, { Component } from "react";
import styled from "styled-components";
import { NavBar } from "../components/nav-bar";
import { Layout, LayoutLeft, LayoutRight } from "../components/layout";
import { StreamCard } from "../components/stream-card";

const White = styled.div`
  margin: 0;
  background: white;
  width: 100vw;
  height: 100vh;
  color: black;
`;

const ProposedStream = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const StreamItemWrapper = styled.div``;

export class Organizer extends Component {
  render() {
    const streamInfo = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

    return (
      <White>
        <NavBar />
        <Layout>
          <LayoutLeft>a</LayoutLeft>
          <LayoutRight isOpen={true}>
            <ProposedStream>
              {streamInfo.map(({ id }) => <StreamCard key={id} />)}
            </ProposedStream>
          </LayoutRight>
        </Layout>
      </White>
    );
  }
}
