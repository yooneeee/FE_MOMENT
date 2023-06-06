import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CreateBoard from "./CreateBoard";
import CreateFeed from "./CreateFeed";
import { useMutation } from "react-query";
import { logoutAxios } from "../apis/auth/login";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../redux/modules/user";
import Swal from "sweetalert2";

function Header() {
  const [feedModalOpen, setFeedModalOpen] = useState(false);
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const dispatch = useDispatch();

  // 로그인 여부 확인
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const nickName = useSelector((state) => state.user.nickName);
  const profileImg = useSelector((state) => state.user.profileImg);
  const userId = useSelector((state) => state.user.userId);

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
  // 메뉴창과, 글 쓰기, 프로필 state 저장
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWriteMenuOpen, setIsWriteMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // 헤더 컴포넌트 DOM 요소 참조
  const headerRef = useRef(null);

  //메뉴, 글쓰기 메뉴, 프로필 메뉴 토글 여닫는 함수
  const toggleMenuClose = () => {
    setIsMenuOpen(false);
  };
  const toggleWriteMenuOpen = () => {
    setIsWriteMenuOpen(true);
  };
  const toggleWriteMenuClose = () => {
    setIsWriteMenuOpen(false);
  };
  const toggleProfileMenuClose = () => {
    setIsProfileMenuOpen(false);
  };
  //창 너비에 따라 메뉴와 글쓰기 메뉴를 닫는 함수
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setIsMenuOpen(false);
    setIsWriteMenuOpen(false);
    setIsProfileMenuOpen(false);
  };
  //헤더 영역 외의 클릭 이벤트를 처리해 메뉴와 글쓰기 메뉴를 닫는 함수
  const handleClickOutside = (event) => {
    if (headerRef.current && !headerRef.current.contains(event.target)) {
      setIsMenuOpen(false);
      setIsWriteMenuOpen(false);
      setIsProfileMenuOpen(false);
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
      Swal.fire({
        icon: "success",
        title: "로그아웃 성공!",
        text: `[${nickName}]님 로그아웃되었습니다✨`,
        confirmButtonText: "확인",
      });
      navigate("/");
    },
    onError: (error) => {
      throw error;
    },
  });

  const logoutHandler = async (e) => {
    sessionStorage.removeItem("Access_key");
    sessionStorage.removeItem("Refresh_key");
    await logoutMutation.mutateAsync();
    dispatch(logoutSuccess());
    navigate("/");
  };
  return (
    <HeaderStyles
      ismobile={windowWidth <= 768 ? "true" : "false"}
      ref={headerRef}
    >
      <LeftMenu>
        <HeaderTitle
          onClick={() => {
            navigate("/main");
            toggleMenuClose();
            toggleWriteMenuClose();
          }}
        >
          Moment
        </HeaderTitle>
        <HeaderButton
          onClick={() => {
            navigate("/feeds");
            toggleWriteMenuClose();
            toggleProfileMenuClose();
          }}
        >
          피드
        </HeaderButton>
        <HeaderButton
          onClick={() => {
            navigate("/board");
            toggleWriteMenuClose();
            toggleProfileMenuClose();
          }}
        >
          게시판
        </HeaderButton>
      </LeftMenu>

      <ButtonBox>
        {windowWidth <= 768 ? (
          <MenuButton
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              toggleWriteMenuClose();
              toggleProfileMenuClose();
            }}
          >
            <MenuIcon>&#9776;</MenuIcon>
          </MenuButton>
        ) : (
          <>
            {isLoggedIn ? (
              <>
                <HeaderButton
                  onClick={() => {
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                    toggleWriteMenuClose();
                  }}
                >
                  <ProfileImg src={profileImg} />
                  <div>{nickName}</div>
                </HeaderButton>
              </>
            ) : (
              <>
                <HeaderButton
                  name={"login"}
                  onClick={() => {
                    navigate("/login");
                    toggleWriteMenuClose();
                    toggleProfileMenuClose();
                  }}
                >
                  로그인
                </HeaderButton>
                <HeaderButton
                  name={"integratedsignup"}
                  onClick={() => {
                    navigate("/integratedsignup");
                    toggleWriteMenuClose();
                    toggleProfileMenuClose();
                  }}
                >
                  회원가입
                </HeaderButton>
              </>
            )}
            <HeaderButton
              name={"Write"}
              onClick={() => {
                setIsWriteMenuOpen(!isWriteMenuOpen);
                toggleProfileMenuClose();
              }}
            >
              글쓰기
            </HeaderButton>
          </>
        )}
      </ButtonBox>

      {isProfileMenuOpen && (
        <ToggleProfileMenu>
          <MenuButton
            name={"mypage"}
            onClick={() => {
              navigate(`/page/${userId}`);
              toggleMenuClose();
              toggleWriteMenuClose();
              toggleProfileMenuClose();
            }}
          >
            마이페이지
          </MenuButton>
          <MenuButton
            name={"logout"}
            onClick={() => {
              logoutHandler();
              toggleProfileMenuClose();
            }}
          >
            로그아웃
          </MenuButton>
        </ToggleProfileMenu>
      )}

      {isWriteMenuOpen && (
        <ToggleWriteMenu>
          <MenuButton
            onClick={() => {
              openFeedModal();
              toggleWriteMenuClose();
              toggleProfileMenuClose();
              toggleMenuClose();
            }}
          >
            피드 작성
          </MenuButton>
          <MenuButton
            onClick={() => {
              openBoardModal();
              toggleWriteMenuClose();
              toggleProfileMenuClose();
              toggleMenuClose();
            }}
          >
            게시글 작성
          </MenuButton>
        </ToggleWriteMenu>
      )}

      {isMenuOpen && (
        <ToggleMenu>
          <MenuButton
            onClick={() => {
              navigate("/feeds");
              toggleMenuClose();
              toggleWriteMenuClose();
              toggleProfileMenuClose();
            }}
          >
            피드
          </MenuButton>
          <MenuButton
            onClick={() => {
              navigate("/board");
              toggleMenuClose();
              toggleWriteMenuClose();
              toggleProfileMenuClose();
            }}
          >
            게시판
          </MenuButton>
          <MenuButton
            onClick={() => {
              toggleWriteMenuOpen();
              toggleProfileMenuClose();
            }}
          >
            글쓰기
          </MenuButton>
          {isLoggedIn ? (
            <>
              <MenuButton
                onClick={() => {
                  toggleWriteMenuClose();
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                }}
              >
                <ProfileContainer>
                  <ProfileImg src={profileImg}></ProfileImg>
                  <ProfileName>{nickName}</ProfileName>
                </ProfileContainer>
              </MenuButton>
              <MenuButton
                name={"mypage"}
                onClick={() => {
                  navigate(`/page/${userId}`);
                  toggleMenuClose();
                  toggleWriteMenuClose();
                  toggleProfileMenuClose();
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
                  toggleProfileMenuClose();
                }}
              >
                로그인
              </MenuButton>
              <MenuButton
                onClick={() => {
                  navigate("/integratedsignup");
                  toggleMenuClose();
                  toggleWriteMenuClose();
                  toggleProfileMenuClose();
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
  right: 0;
  background-color: black;
  padding: 10px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  @media (max-width: 768px) {
    top: 105px;
    right: 120px;
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
const LeftMenu = styled.div`
  display: flex;
`;

const HeaderTitle = styled.p`
  font-size: 25px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 20px;
`;

const ButtonBox = styled.div`
  display: flex;
  gap: 20px;
  margin-right: 30px;
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
  z-index: 10;
  justify-content: space-between;
`;

const HeaderButton = styled.button`
  padding: 8px;
  gap: 10px;
  cursor: pointer;
  border: none;
  background: none;
  align-items: center;
  color: white;
  display: flex;
`;

const ProfileImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 70%;
  object-fit: cover;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 22px;
    height: 22px;
  }
`;

const ToggleProfileMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 88px;
  background-color: black;
  padding: 10px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  @media (max-width: 768px) {
    top: 135px;
    right: 120px;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileName = styled.div`
  margin-left: 8px;
  font-size: 15px;
`;

export default Header;
