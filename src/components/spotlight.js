import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
`;

export const Spotlight = styled.div`
  background-image: radial-gradient(
    circle at top left,
    white 0%,
    white 5%,
    black 30%
  );
  animation: ${fadeIn} 200ms ease-in-out;
  width: 500px;
  height: 500px;
  transform: rotate(45deg);
`;
