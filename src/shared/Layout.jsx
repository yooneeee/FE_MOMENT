import React from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

function Header() {
  const navigate = useNavigate();
  return (
    <HeaderStyles>
      <HeaderTitle
        onClick={() => {
          navigate("/main");
        }}
      >
        Moment
      </HeaderTitle>
      <LinkBox>
        <HeaderButton
          onClick={() => {
            navigate("/feed");
          }}
        >
          피드
        </HeaderButton>
        <HeaderButton
          onClick={() => {
            navigate("/board");
          }}
        >
          게시판
        </HeaderButton>
      </LinkBox>
      <ButtonBox>
        <HeaderButton
          name={"login"}
          onClick={() => {
            navigate("/login");
          }}
        >
          로그인
        </HeaderButton>
        <HeaderButton>회원가입</HeaderButton>
      </ButtonBox>
    </HeaderStyles>
  );
}

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
  overflow-x: hidden;
  overflow-y: auto;
`;

const HeaderStyles = styled.div`
  width: 100%;
  background: black;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  color: white;
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
  background: black;
  color: white;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const LayoutStyles = styled.div`
  min-height: 100vh;
  padding-top: 50px;
`;

const HeaderTitle = styled.p`
  font-size: 25px;
  font-weight: 600;
  cursor: pointer;
`;

const ButtonBox = styled.div`
  display: flex;
  gap: 20px;
  margin-left: auto;
  margin-right: 30px;
`;

const LinkBox = styled.div`
  display: flex;
  gap: 20px;
  margin-left: 30px;
`;

const HeaderButton = styled.button`
  padding: 8px;
  cursor: pointer;
  border: none;
  background: none;
  color: white;
`;
