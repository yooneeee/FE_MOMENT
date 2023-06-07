import React, { useState } from "react";
import styled from "styled-components";
import BoardItem from "../components/BoardItem";
import { useQuery } from "react-query";
import { getBoard } from "../apis/create/getBoard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function Board() {
  const [activeNavItem, setActiveNavItem] = useState("Model");
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const { isError, isLoading, data } = useQuery(
    ["getBoard", activeNavItem],
    () => getBoard(activeNavItem)
  );

  console.log(data);
  if (isLoading) {
    return null;
  }

  if (isError) {
    return <h1>오류가 발생하였습니다...!</h1>;
  }

  const handleNavItemClick = (item) => {
    setActiveNavItem(item);
  };

  return (
    <Container>
      <Header>
        <Navbar>
          <span>게시판</span>
          <NavItems>
            <NavItem
              className={activeNavItem === "Model" ? "active" : ""}
              onClick={() => {
                handleNavItemClick("Model");
              }}
            >
              Model
            </NavItem>
            <NavItem
              className={activeNavItem === "Photographer" ? "active" : ""}
              onClick={() => handleNavItemClick("Photographer")}
            >
              Photographer
            </NavItem>
          </NavItems>
        </Navbar>
      </Header>
      <Content>
        {data.map((item) => {
          return (
            <BoardItem
              onClick={() => {
                if (isLoggedIn) {
                  navigate(`${item.boardId}`);
                } else {
                  Swal.fire({
                    icon: "warning",
                    title: "회원 전용 서비스!",
                    text: `로그인이 필요한 서비스입니다🙏`,
                    confirmButtonText: "확인",
                  });
                }
              }}
              item={item}
              key={item.boardId}
            />
          );
        })}
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
  color: #999999;
`;

const NavItem = styled.div`
  cursor: pointer;
  padding: 5px 5px 5px 5px;

  &.active {
    color: black;
  }
`;

const Header = styled.header`
  padding: 16px;
  width: 80%;
  border-bottom: 1px solid #ddd;
`;

const Content = styled.div`
  width: 80%;
`;
