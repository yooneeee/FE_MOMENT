import React from "react";
import { FiArrowUpCircle } from "@react-icons/all-files/fi/FiArrowUpCircle";
import styled from "styled-components";

function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  return <ScrollTopButton type="button" onClick={scrollToTop} />;
}

export default ScrollToTopButton;

const ScrollTopButton = styled(FiArrowUpCircle)`
  font-size: 16px;
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  z-index: 999;
  &:hover {
    transform: scale(1.05);
  }
`;
