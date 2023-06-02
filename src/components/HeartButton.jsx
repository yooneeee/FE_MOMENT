import React, { useState, useEffect } from "react";
import styled from "styled-components";

const HeartButton = ({ like, onClick }) => {
  console.log(like);
  return (
    <Heart
      src={like ? "/img/heart.png" : "/img/empty-heart.png"}
      onClick={onClick}
    />
  );
};

export default HeartButton;

const Heart = styled.img`
  width: 20px;
  cursor: pointer;
`;
