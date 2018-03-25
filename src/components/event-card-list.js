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
    backgroundColor: 'rgba(255, 255, 255, 0)',
  }
});

const mystyles = {
  cardtitle: {
    margin: '5px',
    color: '#fff',
  },
  cardOuter: {
    display:  'block',
    margin: '10px 5px',
    padding: '10px',
    borderRadius: '5px',
    backgroundImage: 'linear-gradient(60deg, rgba(88, 95, 255, 0.82) 20%, rgb(131, 233, 254) 72%)'
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