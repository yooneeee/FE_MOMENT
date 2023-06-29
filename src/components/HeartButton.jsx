import React, { useState, useEffect } from "react";
import styled from "styled-components";

const HeartButton = ({ like, onClick }) => {
  return (
    <Heart
      src={like ? "/img/heart.png" : "/img/empty-heart.png"}
      alt="heart"
      onClick={onClick}
    />
  );
};

export default HeartButton;

const Heart = styled.img`
  width: 20px;
  cursor: pointer;
  @media (max-width: 1076px) {
    width: 15px;
  }
`;
