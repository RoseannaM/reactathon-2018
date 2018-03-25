import React, { Component } from "react";
import styled from "styled-components";
import { Layout, LayoutLeft, LayoutRight } from "../components/layout";
import { Overlay } from "../components/overlay";
import { Header } from "../components/header";

const Black = styled.div`
  margin: 0;
  background: white;
  width: 100vw;
  height: 100vh;
`;

const Center = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export class Event extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      isRevealed: false
    };

    window.addEventListener("keydown", e => {
      if (e.keyCode === 13) {
        //TODO fix
        this.setState({
          isOpen: !this.state.isOpen
        });
      }
      if (e.keyCode === 32) {
        //TODO fix
        this.setState({
          isRevealed: !this.state.isRevealed
        });
      }
    });
  }

  render() {
    return (
      <Black>
        <Header />
        <Overlay isRevealed={this.state.isRevealed} />
        <Layout>
          <LayoutLeft>a</LayoutLeft>
          <LayoutRight isOpen={this.state.isOpen}>Card list</LayoutRight>
        </Layout>
      </Black>
    );
  }
}
