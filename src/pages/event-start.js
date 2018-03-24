import React, { Component } from "react";
import styled from "styled-components";

import { Timer } from "../components/timer";

const Black = styled.div`
  margin: 0;
  background: black;
  width: 100vw;
  height: 100vh;
`;

export class EventStart extends Component {
  render() {
    return (
      <Black>
        <Timer />
      </Black>
    );
  }
}
