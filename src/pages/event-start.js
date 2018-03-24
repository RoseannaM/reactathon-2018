import React, { Component } from "react";
import styled from "styled-components";

const Black = styled.div`
  margin: 0;
  background: black;
  width: 100vw;
  height: 100vh;
`;

const Center = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const Title = styled.p`
  padding: 0;
  margin: 0;
  font-size: 100px;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
`;

export class EventStart extends Component {
  render() {
    return (
      <Black>
        <Center>
          <Title>The event will begin soon</Title>
        </Center>
      </Black>
    );
  }
}
