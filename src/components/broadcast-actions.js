import React from "react";
import Button from "material-ui/Button";
import Menu, { MenuItem } from "material-ui/Menu";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui-icons/MoreVert";
import PresentToAllIcon from "material-ui-icons/PresentToAll";
import VideocamIcon from "material-ui-icons/Videocam";
import styled from "styled-components";

const IconWrapper = styled.div`
  padding-top: 5px;
  padding-right: 10px;
`;

export class BroadcastActions extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <IconButton
          aria-label="More"
          aria-owns={anchorEl ? "long-menu" : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem
            onClick={() => {
              this.handleClose();
              this.props.toggleCamera();
            }}
          >
            <IconWrapper>
              <PresentToAllIcon />
            </IconWrapper>Broadcast screen
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.handleClose();
              this.props.toggleScreen();
            }}
          >
            <IconWrapper>
              <VideocamIcon />
            </IconWrapper>Broadcast camera
          </MenuItem>
        </Menu>
      </div>
    );
  }
}
