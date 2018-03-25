import React from "react";

import turtle1 from "../images/turtle1.svg";
import turtle2 from "../images/turtle2.svg";

import styled from "styled-components";
import { Large } from "../components/typography";

import { Header } from "../components/header";

const SpinnerPage = styled.div`
  width: 100vw;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const SpinnerInner = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export default Component =>
  class WithLoadingSpinner extends React.Component {
    state = {
      frame: 0
    };

    componentDidMount() {
      window.setInterval(() => {
        this.setState(() => ({
          frame: (this.state.frame + 1) % 2
        }));
      }, 500);
    }

    render() {
      if (this.props.data && !this.props.data.loading) {
        return <Component {...this.props} />;
      } else {
        return (
          <React.Fragment>
            <Header />
            <SpinnerPage>
              <SpinnerInner>
                <img
                  src={turtle1}
                  style={{
                    minHeight: "300px",
                    display: this.state.frame === 1 ? "none" : "block"
                  }}
                  width="300px"
                />
                <img
                  src={turtle2}
                  style={{
                    minHeight: "300px",
                    display: this.state.frame === 0 ? "none" : "block"
                  }}
                  width="300px"
                />
                <Large>Loading...</Large>
              </SpinnerInner>
            </SpinnerPage>
          </React.Fragment>
        );
      }
    }
  };
