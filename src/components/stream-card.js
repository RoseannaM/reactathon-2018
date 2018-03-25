import styled, { keyframes } from "styled-components";
import React from "react";

import IconButton from "material-ui/IconButton";
import StopIcon from "material-ui-icons/Stop";
import StarIcon from "material-ui-icons/Star";
import Tooltip from "material-ui/Tooltip";

const blink = keyframes`
  0% {
    color: transparent;
  }

  50% {
    color: white;
  }
`;

export const StagedStreamCardWrapper = styled.div`
  width: 200px;
  height: 150px;
  position: relative;

  box-shadow: 0 0 0 1px rgba(20, 11, 47, 0.05),
    0 2px 16px -2px rgba(0, 0, 0, 0.1);
`;

export const StagedStreamCardInner = styled.div`
  width: 100%;
  max-height: 200px;
  padding-bottom: 75%;
  border: 1px solid black;
  background: black;
`;

export const StagedStreamCard = props => (
  <StagedStreamCardWrapper>
    <StagedStreamCardInner>{props.children}</StagedStreamCardInner>
    <StreamActions>
      <Tooltip id="tooltip-top-start" title="Promote stream" placement="right">
        <IconButton aria-label="Promote" style={{ color: "white" }}>
          <StarIcon />
        </IconButton>
      </Tooltip>
    </StreamActions>
  </StagedStreamCardWrapper>
);

const ActiveStreamWrapper = styled.div`
  width: 800px;
  height: 600px;
  position: relative;

  box-shadow: 0 0 0 1px rgba(20, 11, 47, 0.05),
    0 2px 16px -2px rgba(0, 0, 0, 0.1);

  &:after {
    box-sizing: border-box;
    animation: ${blink} 1.5s step-end infinite;
    position: absolute;
    content: " ● LIVE";
    padding: 5px;
    width: 100%;
    background: red;
    color: white;
    bottom: 0;
  }
`;

const ActiveStream = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background: black;
`;

const StreamActions = styled.div`
  position: absolute;
  right: 0;
  height: 50px;
  width: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  transition: background-color 200ms;

  &:hover {
    background-color: rgba(0, 0, 0, 1);
  }
`;

export const ActiveStreamCard = props => (
  <ActiveStreamWrapper>
    <ActiveStream>{props.children}</ActiveStream>
    <StreamActions>
      <Tooltip id="tooltip-top-start" title="Stop stream" placement="right">
        <IconButton aria-label="Stop" style={{ color: "white" }}>
          <StopIcon />
        </IconButton>
      </Tooltip>
    </StreamActions>
  </ActiveStreamWrapper>
);

export const MainStreamCard = styled.div`
  width: 50vw;
  height: 50vh;
  border: 1px solid black;
`;
