import React, { Component } from "react";
import styled from "styled-components";
import { NavBar } from "../components/nav-bar";

const White = styled.div`
  margin: 0;
  background: white;
  width: 100vw;
  height: 100vh;
  color: black;
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

export class Organizer extends Component {
  render() {
    return (
      <White>
        <NavBar />
        <Layout>
          <LayoutLeft>a</LayoutLeft>
          <LayoutRight>Card list</LayoutRight>
        </Layout>
      </White>
    );
  }
}
