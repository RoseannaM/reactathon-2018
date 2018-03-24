import React, { Component } from "react";
import Grid from "material-ui/Grid";

export default class PageLayout extends Component {
  render() {
    return (
      <Grid container spacing={24}>
        {this.props.children}
      </Grid>
    );
  }
}
