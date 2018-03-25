import styled from "styled-components";
import React from "react";
import { Lockup } from "./lockup";

import { Link } from "react-router-dom";

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
  margin-bottom: 40px;
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
          <Link to="/">
            <Lockup />
          </Link>
        </Left>
        <Right>{this.props.actions}</Right>
      </Wrapper>
    );
  }
}
