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
    color: 'blue',
    margin: '5px'
  }
}

export class EventCardList extends Component {
  render() {
    const classes = this.props.classes;
    return ( <div>
      <div className={classes.root}>
      <h1 style={mystyles.cardtitle}>{this.props.title}</h1>
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