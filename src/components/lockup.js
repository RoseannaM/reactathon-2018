import styled from "styled-components";
import React from "react";
import logo from "../images/icon-simple.png";

const Wrapper = styled.div`
  font-size: 1.5em;
  display: inline-flex;
  align-items: center;
`;

const Icon = styled.div`
  width: 1.5em;
  height: 1.5em;
  margin-right: 10px;
`;

export class Lockup extends React.Component {
  render() {
    return (
      <Wrapper>
        <Icon>
          <img width="100%" height="100%" src={logo} alt="icon" />
        </Icon>
        Assemble
      </Wrapper>
    );
  }
}
