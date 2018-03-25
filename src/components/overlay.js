import styled from "styled-components";
import React, { Component } from "react";
import { Timer } from "../components/timer";
import { Title } from "../components/typography";

export const PageOverlay = styled.div`
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vw;
  position: fixed;
  display: flex;
  pointer-events: ${props => (props.isRevealed ? "none" : "auto")};
`;

const Left = styled.div`
  background: #140e19;
  width: 50%;
  display: flex;
  flex-direction: column;
  transition: left 600ms;
  position: fixed;
  left: ${props => (props.isRevealed ? "-50%" : "0")};
  height: 100%;
`;

const Right = styled.div`
  background: #140e19;
  width: 50%;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: ${props => (props.isRevealed ? "100%" : "50%")};
  transition: left 600ms;
  height: 100%;
`;

export class Overlay extends Component {
  render() {
    return (
      <PageOverlay isRevealed={this.props.isRevealed}>
        <Left isRevealed={this.props.isRevealed}>
          <Timer />
        </Left>
        <Right isRevealed={this.props.isRevealed}>
          <Title>Chat goes here maybe</Title>
        </Right>
      </PageOverlay>
    );
  }
}
