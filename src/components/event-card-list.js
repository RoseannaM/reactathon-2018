import React, { Component } from "react";
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import InboxIcon from 'material-ui-icons/Inbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import PropTypes from 'prop-types'


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  }
});

const mystyles = {
  cardtitle: {
    margin: '5px'
  },
  cardOuter: {
    display: 'block',
    color: 'red',
    margin: 'auto'
  }
}

export class EventCardList extends Component {
  render() {
    const classes = this.props.classes;
    return ( <div style={mystyles.cardOuter}>
      <div className={classes.root}>
      <h3 style={mystyles.cardtitle}>{this.props.title}</h3>
        <List component="nav">
          
        </List>
      </div>
      {this.props.children}</div>);
  }
}

EventCardList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventCardList);