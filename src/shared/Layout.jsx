import React from "react";
import Header from "../components/Header";
import { styled } from "styled-components";

function Footer() {
  return (
    <FooterStyles>
      <span>copyright @SCC</span>
    </FooterStyles>
  );
}

function Layout({ children }) {
  return (
    <TotalLayout>
      <Header />
      <LayoutStyles>{children}</LayoutStyles>
      <Footer />
    </TotalLayout>
  );
}

export default Layout;

const TotalLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 50px;
  box-sizing: border-box;
`;

const FooterStyles = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  background: black;
  color: white;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;
const LayoutStyles = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;
