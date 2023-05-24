import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

function Header() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWriteMenuOpen, setIsWriteMenuOpen] = useState(false);
  /* 
  const toggleMenuOpen = () => {
    setIsMenuOpen(true);
  }; */
  const toggleMenuClose = () => {
    setIsMenuOpen(false);
  };
  const toggleWriteMenuOpen = () => {
    setIsWriteMenuOpen(true);
  };
  const toggleWriteMenuClose = () => {
    setIsWriteMenuOpen(false);
  };
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMenuOpen(false); // 화면 크기 변화 시 메뉴 닫기
      setIsWriteMenuOpen(false); // 화면 크기 변화 시 글쓰기 메뉴 닫기
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <HeaderStyles isMobile={windowWidth <= 768}>
      <HeaderTitle
        onClick={() => {
          navigate("/main");
          toggleMenuClose();
          toggleWriteMenuClose();
        }}
      >
        Moment
      </HeaderTitle>
      <ButtonBox>
        {/*    화면크기 768px보다 작을 때 */}
        {windowWidth <= 768 ? (
          <MenuButton
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              toggleWriteMenuClose();
            }}
          >
            <MenuIcon>&#9776;</MenuIcon>
          </MenuButton>
        ) : (
          <>
            {/*    화면크기 768px보다 클 때 */}
            <HeaderButton
              onClick={() => {
                navigate("/feed");
                toggleWriteMenuClose();
              }}
            >
              피드
            </HeaderButton>
            <HeaderButton
              onClick={() => {
                navigate("/board");
                toggleWriteMenuClose();
              }}
            >
              게시판
            </HeaderButton>
            <HeaderButton
              name={"Write"}
              onClick={() => {
                setIsWriteMenuOpen(!isWriteMenuOpen);
              }}
            >
              글쓰기
            </HeaderButton>
            <HeaderButton
              name={"login"}
              onClick={() => {
                navigate("/login");
                toggleWriteMenuClose();
              }}
            >
              로그인
            </HeaderButton>
            <HeaderButton
              name={"integratedsignup"}
              onClick={() => {
                navigate("/integratedsignup");
                toggleWriteMenuClose();
              }}
            >
              회원가입
            </HeaderButton>
          </>
        )}
      </ButtonBox>
      {/* 글쓰기 모달 열렸을 때 */}
      {isWriteMenuOpen && (
        <ToggleWriteMenu>
          <MenuButton
            onClick={() => {
              toggleWriteMenuClose();
              toggleMenuClose();
            }}
          >
            피드 작성
          </MenuButton>
          <MenuButton
            onClick={() => {
              toggleWriteMenuClose();
              toggleMenuClose();
            }}
          >
            게시글 작성
          </MenuButton>
        </ToggleWriteMenu>
      )}
      {/* 화면크기 작아졌을 때 메뉴 모달 열렸을 때 */}
      {isMenuOpen && (
        <ToggleMenu>
          <MenuButton
            onClick={() => {
              navigate("/feed");
              toggleMenuClose();
              toggleWriteMenuClose();
            }}
          >
            피드
          </MenuButton>
          <MenuButton
            onClick={() => {
              navigate("/board");
              toggleMenuClose();
              toggleWriteMenuClose();
            }}
          >
            게시판
          </MenuButton>
          <MenuButton onClick={toggleWriteMenuOpen}>글쓰기</MenuButton>
          <MenuButton
            onClick={() => {
              navigate("/login");
              toggleMenuClose();
              toggleWriteMenuClose();
            }}
          >
            로그인
          </MenuButton>
          <MenuButton
            onClick={() => {
              navigate("/integratedsignup");
              toggleMenuClose();
              toggleWriteMenuClose();
            }}
          >
            회원가입
          </MenuButton>
        </ToggleMenu>
      )}
    </HeaderStyles>
  );
}

const ToggleMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background-color: black;
  padding: 10px;
  display: flex;
  flex-direction: column;
  z-index: 100;
`;

const ToggleWriteMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 170px;
  background-color: black;
  padding: 10px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  @media (max-width: 768px) {
    top: 100px;
    right: 80px;
  }
`;
const MenuButton = styled.button`
  display: block;
  padding: 8px;
  border: none;
  background: none;
  color: white;
  cursor: pointer;

  &:hover {
    opacity: 40%;
  }
`;

const MenuIcon = styled.span`
  font-size: 20px;
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
  position: fixed;
  top: 0;
  left: 0;
  top: 0;
  left: 0;
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

/* const LinkBox = styled.div`
  display: flex;
  gap: 20px;
  margin-left: 30px;
`; */

const HeaderButton = styled.button`
  padding: 8px;
  cursor: pointer;
  border: none;
  background: none;
  color: white;
`;
export default Header;
