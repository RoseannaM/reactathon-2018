import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import styled from "styled-components";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import DraftsIcon from "material-ui-icons/Drafts";
import PropTypes from "prop-types";
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const mystyles = {
  listItem: {
    color: "#fff",
    padding: "5px",
    borderRadius: "5px",
    marginBottom: "10px"
  }
};

const styles = {
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};


export default class EventCard extends Component {

  render() {
    
    const date = "24 March 12:00"
    const desc = "this is a great time to be alive"
    return (
      <div>
        <Card>
          <CardContent>
            <Typography variant="headline" component="h2">
              {this.props.title}
            </Typography>
            <Typography color="textSecondary">
              {date}
            </Typography>
            <Typography component="p">
              {desc}
            </Typography>
          </CardContent>
          <CardActions><a href={this.props.id}
          ><Button size="small">Join Event</Button></a>

          </CardActions>
        </Card>
      </div>
    );
  }
}
