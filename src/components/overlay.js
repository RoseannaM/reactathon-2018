import styled from "styled-components";
import React, { Component } from "react";
import { Timer } from "../components/timer";
import { Title, Subtitle } from "../components/typography";
import flowerFrog from "../images/flower-frog.svg";
import Vivus from "vivus";

export const PageOverlay = styled.div`
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  display: flex;
  pointer-events: ${props => (props.isRevealed ? "none" : "auto")};
  z-index: 1;
`;

const Left = styled.div`
  background: black;
  color: white;
  width: 50%;
  display: flex;
  flex-direction: column;
  transition: left 600ms;
  position: fixed;
  left: ${props => (props.isRevealed ? "-50%" : "0")};
  height: 100%;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
`;

const Right = styled.div`
  background: black;
  color: white;
  width: 50%;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: ${props => (props.isRevealed ? "100%" : "50%")};
  transition: left 600ms;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
`;

export class Overlay extends Component {
  componentDidMount() {
    new Vivus("flower-frog", { duration: 200 });
  }

  render() {
    return (
      <PageOverlay isRevealed={this.props.isRevealed}>
        <Left isRevealed={this.props.isRevealed}>
          <Title>Your event will start soon</Title>
          <Subtitle>
            The event starts in <Timer />
          </Subtitle>
        </Left>
        <Right isRevealed={this.props.isRevealed}>
          <object
            width="400px"
            height="400px"
            id="flower-frog"
            type="image/svg+xml"
            data={flowerFrog}
            style={{ filter: "invert(100%)" }}
          />
        </Right>
      </PageOverlay>
    );
  }
}
