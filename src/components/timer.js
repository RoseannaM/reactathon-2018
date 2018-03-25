import React from "react";
import styled from "styled-components";

export class Timer extends React.Component {
  constructor() {
    super();
    this.state = {
      eventTime: Date.now() + 3000
    };
    setInterval(() => this.forceUpdate(), 1000);
  }
  render() {
    const timeLeft = Math.max(
      Math.floor((this.state.eventTime - Date.now()) / 10),
      0
    );

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes > 0 ? minutes + ":" : ""}:${seconds > 9
      ? "0"
      : ""}${seconds}`;
  }
}
