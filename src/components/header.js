import styled from "styled-components";
import React from "react";
import { Lockup } from "./lockup";

const Wrapper = styled.div`
  padding: 8px 16px;
  display: flex;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(20, 11, 47, 0.05),
    0 2px 16px -2px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  box-sizing: border-box;
  overflow: hidden;
  margin-bottom: 16px;
`;

const Left = styled.div`flex-grow: 1;`;
const Right = styled.div`
  display: flex;
  align-items: center;
`;

export class Header extends React.Component {
  render() {
    return (
      <Wrapper>
        <Left>
          <Lockup />
        </Left>
        <Right>Actions go here</Right>
      </Wrapper>
    );
  }
}
