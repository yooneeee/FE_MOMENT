import React from "react";
import styled from "styled-components";
import BoardItem from "../components/BoardItem";

function Board() {
  return (
    <Container>
      <Header>
        <Navbar>
          <span>게시판</span>
          <NavItems>
            <NavItem>Model</NavItem>
            <NavItem>Photo</NavItem>
          </NavItems>
        </Navbar>
      </Header>
      <Content>
        <BoardItem />
        <BoardItem />
        <BoardItem />
        <BoardItem />
        <BoardItem />
        <BoardItem />
        <BoardItem />
      </Content>
    </Container>
  );
}

export default Board;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
`;
const NavItems = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavItem = styled.div`
  cursor: pointer;
`;

const Header = styled.header`
  padding: 16px;
  width: 80%;
  border-bottom: 1px solid #ddd;
`;

const Content = styled.div`
  width: 80%;
`;
