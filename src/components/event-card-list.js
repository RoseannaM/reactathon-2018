import React, { Component } from "react";

export default class EventCardList extends Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}
