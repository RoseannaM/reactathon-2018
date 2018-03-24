import React, { Component } from "react";
import styled from "styled-components";
import { Layout, LayoutLeft, LayoutRight } from "../components/layout";

const Black = styled.div`
  margin: 0;
  background: black;
  width: 100vw;
  height: 100vh;
  color: white;
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
          <LayoutRight isOpen={this.state.isOpen}>Card list</LayoutRight>
        </Layout>
      </Black>
    );
  }
}
