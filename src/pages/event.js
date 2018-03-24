import React, { Component } from "react";
import styled from "styled-components";

import { Spotlight } from "../components/spotlight";

const Black = styled.div`
  margin: 0;
  background: black;
  width: 100vw;
  height: 100vh;
  color: white;
`;

const Layout = styled.div`display: flex;`;
const LayoutLeft = styled.div`
  display: flex;
  height: 100%;
  flex-grow: 1;
  border: 1px solid white;
`;
const LayoutRight = styled.div`
  display: flex;
  transition: width 200ms;
  width: ${props => (props.isOpen ? "30%" : "0%")};
  overflow: hidden;
  height: 100%;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
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

export class Event extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };

    window.addEventListener("keydown", e => {
      if (e.keyCode === 13) {
        //TODO fix
        this.setState({
          isOpen: !this.state.isOpen
        });
      }
    });
  }

  render() {
    return (
      <Black>
        <Layout>
          <LayoutLeft>a</LayoutLeft>
          <LayoutRight isOpen={this.state.isOpen}>b</LayoutRight>
        </Layout>
      </Black>
    );
  }
}
