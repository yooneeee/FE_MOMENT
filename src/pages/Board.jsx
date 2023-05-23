import React from "react";
import styled from "styled-components";
import BoardItem from "../components/BoardItem";

function Board() {
  return (
    <Container>
      <Header>
        <Navbar>
          <NavItem>모델 구인</NavItem>
          <NavItem>사진작가 구인</NavItem>
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

const Header = styled.header`
  background-color: #f2f2f2;
  padding: 16px;
  width: 100%;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-around;
`;

const NavItem = styled.div`
  cursor: pointer;
`;

const Content = styled.div`
  width: 80%;
`;
