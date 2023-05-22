import React from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";

function InitialNav() {
  const navigate = useNavigate();
  return (
    <HeaderWrapper>
      <div onClick={() => navigate("/Main")} id="header-title">
        &nbsp; Moment
      </div>

      <Navbar>
        <NavItem onClick={() => navigate("/Main")}>HOME</NavItem>
        <NavItem onClick={() => navigate("/Login")}>로그인/회원가입</NavItem>
      </Navbar>
    </HeaderWrapper>
  );
}

export default InitialNav;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background-color: #fcfcfc;

  #header-title {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
  }
`;
const Navbar = styled.div`
  display: flex;
`;
const NavItem = styled.div`
  margin-right: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  &:hover {
    color: #62a1ca;
  }
`;
