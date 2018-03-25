import styled from "styled-components";

export const Layout = styled.div`display: flex;`;

export const LayoutLeft = styled.div`
  height: 100%;
  flex-grow: 1;
  padding: 20px 40px;
  box-sizing: border-box;
  border: 1px dashed black;
`;

export const LayoutRight = styled.div`
  transition: width 200ms;
  width: ${props => (props.isOpen ? "40%" : "0%")};
  overflow: hidden;
  height: 100%;
  padding: 20px 40px;
  box-sizing: border-box;
  border: 1px dashed black;
`;

export const LayoutMiddle = styled.div`
  width: 80vw;
  padding: 0 10vw;
  height: 100%;
  box-sizing: border-box;
  border: 1px dashed black;
`;
