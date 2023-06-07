import React from "react";
import Spinner from "../assets/img/Spinner.gif";
import styled from "styled-components";

function LoadingSpinner() {
  return (
    <Background>
      <SpinnerImg src={Spinner} alt="loading-spinner"></SpinnerImg>
    </Background>
  );
}

export const Background = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #ffffffb7;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const SpinnerImg = styled.img`
  width: 50px;
  height: 50px;
`;

export default LoadingSpinner;
