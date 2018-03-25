import styled from "styled-components";

export const Layout = styled.div`display: flex;`;

export const LayoutLeft = styled.div`
  display: flex;
  height: 100%;
  flex-grow: 1;
`;

export const LayoutRight = styled.div`
  display: flex;
  transition: width 200ms;
  width: ${props => (props.isOpen ? "30%" : "0%")};
  overflow: hidden;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
