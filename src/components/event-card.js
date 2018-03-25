import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import styled from "styled-components";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import DraftsIcon from "material-ui-icons/Drafts";
import PropTypes from "prop-types";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import { Link } from "react-router-dom";
import Typography from "material-ui/Typography";

const mystyles = {
  listItem: {
    color: "#fff",
    padding: "5px",
    borderRadius: "5px",
    marginBottom: "10px"
  }
};

const cardStyle = {
  card: {
    marginBottom: "10px"
  }
};

export default class EventCard extends Component {
  render() {
    return (
      <div style={cardStyle.card}>
        <Card>
          <CardContent>
            <Typography variant="headline" component="h2">
              {this.props.title}
            </Typography>
            <Typography color="textSecondary">{this.props.date}</Typography>
            <Typography component="p">
              {this.props.desc ? (
                this.props.desc.substring(0, 250) + " ..."
              ) : (
                " "
              )}
            </Typography>
          </CardContent>
          <CardActions>
            {!this.props.isExternal ? (
              <Link to={this.props.href}>
                <Button size="small">Join Event</Button>
              </Link>
            ) : (
              <a href={this.props.href}>
                <Button size="small">Join Event</Button>
              </a>
            )}
          </CardActions>
        </Card>
      </div>
    );
  }
}
