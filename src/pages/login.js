import React, { Component } from "react";
import styled from "styled-components";

const Fancy = styled.div`color: red;`;
const Widget = styled.div `
    color:green;
    background-color: purple;
`

export class Login extends Component {
  render() {


    return <Widget>LOGIN TO ME</Widget>;
  }
}
