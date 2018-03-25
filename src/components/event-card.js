import React, { Component } from "react";
import { withStyles } from 'material-ui/styles';
import styled from "styled-components";
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import DraftsIcon from 'material-ui-icons/Drafts';
import PropTypes from 'prop-types'


const mystyles = {
  listItem: {
    color: '#fff',
    padding: '5px',
    borderRadius: '5px',
    marginBottom: '10px'
  }
}

export default class EventCard extends Component {
  render() {
    return <div>
    <ListItem style={mystyles.listItem}button component="a" href={this.props.href}>
      {this.props.title}
    </ListItem>
    </div>;
  }
}
