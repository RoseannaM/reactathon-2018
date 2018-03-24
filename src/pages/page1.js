import React, { Component } from "react";
import styled from "styled-components";

const Fancy = styled.div`color: red;`;

export class Page1 extends Component {
  render() {
    return <Fancy>Page 1</Fancy>;
  }
}
