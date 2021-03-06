import React from "react";
import Button from "material-ui/Button";
import Menu, { MenuItem } from "material-ui/Menu";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui-icons/MoreVert";
import PresentToAllIcon from "material-ui-icons/PresentToAll";
import VideocamIcon from "material-ui-icons/Videocam";
import styled from "styled-components";
import { RequestDialog } from "./request-dialog";

const IconWrapper = styled.div`
  padding-top: 5px;
  padding-right: 10px;
`;

export class BroadcastActions extends React.Component {
  state = {
    anchorEl: null,
    dialogOpen: false
  };

  handleDialogClickOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
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
              if (!this.props.isCameraActive) {
                this.handleDialogClickOpen();
              }
              this.handleClose();
              this.props.toggleCamera();
            }}
          >
            <IconWrapper>
              <VideocamIcon />
            </IconWrapper>Broadcast camera
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (!this.props.isScreenActive) {
                this.handleDialogClickOpen();
              }
              this.handleClose();
              this.props.toggleScreen();
            }}
          >
            <IconWrapper>
              <PresentToAllIcon />
            </IconWrapper>Broadcast screen
          </MenuItem>
        </Menu>
        <RequestDialog
          open={this.state.dialogOpen}
          handleClose={this.handleDialogClose}
        />
      </div>
    );
  }
}
