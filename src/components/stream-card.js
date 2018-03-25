import styled, { keyframes } from "styled-components";
import React from "react";

const blink = keyframes`
  0% {
    color: transparent;
  }

  50% {
    color: white;
  }
`;

export const StagedStreamCard = styled.div`
  width: 100%;
  max-height: 200px;
  padding-bottom: 75%;
  border: 1px solid black;

  background-image: url("http://i0.kym-cdn.com/photos/images/original/000/581/296/c09.jpg");
`;

const ActiveStreamWrapper = styled.div`
  width: 100%;
  border: 1px solid black;
  padding-bottom: 75%;
  position: relative;

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
  background-image: url("http://i0.kym-cdn.com/photos/images/original/000/581/296/c09.jpg");
`;

const ActiveStreamActions = styled.div`
  position: absolute;
  right: 0;
  height: 100%;
  width: 30px;
  background-color: rbba(0, 0, 0, 0.5);
  color: white;
`;

export const ActiveStreamCard = () => (
  <ActiveStreamWrapper>
    <ActiveStreamActions>X</ActiveStreamActions>
    <ActiveStream />
  </ActiveStreamWrapper>
);
