import React, { Component } from "react";

export default class EventCard extends Component {
  render() {
    return <div>{this.props.event.title}</div>;
  }
}
