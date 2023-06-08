import React from "react";
import Header from "../components/Header";
import styled from "styled-components";

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
const HeaderStyles = styled.div`
  width: 100%;
  background: black;
  color: white;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  font-weight: 600;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  top: 0;
  left: 0;
`;

const FooterStyles = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  background: white;
  color: black;
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
