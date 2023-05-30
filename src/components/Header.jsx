import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CreateBoard from "./CreateBoard";
import CreateFeed from "./CreateFeed";
import { useMutation } from "react-query";
import { logoutAxios } from "../apis/auth/login";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../redux/modules/user";

function Header() {
  const [feedModalOpen, setFeedModalOpen] = useState(false);
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const openFeedModal = () => {
    setFeedModalOpen(true);
  };
  const closeFeedModal = () => {
    setFeedModalOpen(false);
  };
  const openBoardModal = () => {
    setBoardModalOpen(true);
  };
  const closeBoardModal = () => {
    setBoardModalOpen(false);
  };
  const navigate = useNavigate();
  // 현재 창 너비
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // 메뉴창과, 글 쓰기 state 저장
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWriteMenuOpen, setIsWriteMenuOpen] = useState(false);
  // 헤더 컴포넌트 DOM 요소 참조
  const headerRef = useRef(null);
  const toggleWriteMenuRight = isWriteMenuOpen
    ? isLoggedIn
      ? "195px"
      : "170px"
    : "0";
  //메뉴, 글쓰기 메뉴 토글 여닫는 함수
  const toggleMenuClose = () => {
    setIsMenuOpen(false);
  };
  const toggleWriteMenuOpen = () => {
    setIsWriteMenuOpen(true);
  };
  const toggleWriteMenuClose = () => {
    setIsWriteMenuOpen(false);
  };
  //창 너비에 따라 메뉴와 글쓰기 메뉴를 닫는 함수
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setIsMenuOpen(false);
    setIsWriteMenuOpen(false);
  };
  //헤더 영역 외의 클릭 이벤트를 처리해 메뉴와 글쓰기 메뉴를 닫는 함수
  const handleClickOutside = (event) => {
    if (headerRef.current && !headerRef.current.contains(event.target)) {
      setIsMenuOpen(false); // 헤더 밖을 클릭시 메뉴 닫기
      setIsWriteMenuOpen(false); // 헤더 밖을 클릭시 글쓰기 메뉴 닫기
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const logoutMutation = useMutation(logoutAxios, {
    onSuccess: () => {
      alert("로그아웃 되었습니다.");
      navigate("/");
    },
    onError: (error) => {
      throw error;
    },
  });

  const logoutHandler = async (e) => {
    e.stopPropagation();
    sessionStorage.removeItem("Access_key");
    sessionStorage.removeItem("Refresh_key");
    await logoutMutation.mutateAsync();
    dispatch(logoutSuccess());
    navigate("/");
    logoutMutation.mutate();
  };
  return (
    <HeaderStyles
      ismobile={windowWidth <= 768 ? "true" : "false"}
      ref={headerRef}
    >
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
            {isLoggedIn ? (
              <>
                <HeaderButton
                  name={"Mypage"}
                  onClick={() => {
                    navigate("/mypage");
                    toggleWriteMenuClose();
                  }}
                >
                  마이페이지
                </HeaderButton>
                <HeaderButton
                  name={"logout"}
                  onClick={logoutHandler}
                  /*   onClick={() => {
                logoutHandler();
                toggleWriteMenuClose();
              }} */
                >
                  로그아웃
                </HeaderButton>
              </>
            ) : (
              <>
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
          </>
        )}
      </ButtonBox>
      {/* 글쓰기 모달 열렸을 때 */}
      {isWriteMenuOpen && (
        <ToggleWriteMenu style={{ right: toggleWriteMenuRight }}>
          <MenuButton
            onClick={() => {
              openFeedModal();
              toggleWriteMenuClose();
              toggleMenuClose();
            }}
          >
            피드 작성
          </MenuButton>
          <MenuButton
            onClick={() => {
              openBoardModal();
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
          {isLoggedIn ? (
            <>
              <MenuButton
                name={"mypage"}
                onClick={() => {
                  navigate("/mypage");
                  toggleMenuClose();
                  toggleWriteMenuClose();
                }}
              >
                마이페이지
              </MenuButton>
              <MenuButton name={"logout"} onClick={logoutHandler}>
                로그아웃
              </MenuButton>
            </>
          ) : (
            <>
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
            </>
          )}
        </ToggleMenu>
      )}
      {feedModalOpen && (
        <CreateFeed open={openFeedModal} close={closeFeedModal} />
      )}
      {boardModalOpen && (
        <CreateBoard open={openBoardModal} close={closeBoardModal} />
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
  right: 195px;
  background-color: black;
  padding: 10px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  @media (max-width: 768px) {
    top: 100px;
    right: 100px;
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

const HeaderButton = styled.button`
  padding: 8px;
  cursor: pointer;
  border: none;
  background: none;
  color: white;
`;
export default Header;
