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
import { MdExpandCircleDown } from "react-icons/md";
import { EventSourcePolyfill } from "event-source-polyfill";
import { TbBell } from "react-icons/tb";
import AlarmListModal from "./AlarmListModal";
import { BsFillCircleFill } from "react-icons/bs";
import { decrypt } from "../apis/axios";

function Header() {
  const dispatch = useDispatch();
  const [modalType, setModalType] = useState(null);
  const openModal = (type) => {
    setModalType(type);
  };
  const closeModal = () => {
    setModalType(null);
  };

  // 로그인 여부 확인
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const nickName = useSelector((state) => state.user.nickName);
  const profileImg = useSelector((state) => state.user.profileImg);
  const userId = useSelector((state) => state.user.userId);

  const navigate = useNavigate();
  // 현재 창 너비
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // 메뉴창과, 글 쓰기, 프로필 state 저장
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWriteMenuOpen, setIsWriteMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  // 알림창
  const [alarmList, setAlarmList] = useState([]);
  const [isAlarmListOpen, setIsAlarmListOpen] = useState(false);
  const showAlarmList = () => {
    setIsAlarmListOpen(!isAlarmListOpen);
    setHasNewNotifications(false);
  };
  const closeAlarmList = () => {
    setIsAlarmListOpen(false);
  };

  // 신규알람 표시 여부
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

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
    closeAlarmList();
  };
  //헤더 영역 외의 클릭 이벤트를 처리해 메뉴와 글쓰기 메뉴를 닫는 함수
  const handleClickOutside = (event) => {
    if (headerRef.current && !headerRef.current.contains(event.target)) {
      setIsMenuOpen(false);
      setIsWriteMenuOpen(false);
      setIsProfileMenuOpen(false);
    }
  };
  const Access_key = sessionStorage.getItem("Access_key");
  const Refresh_key = sessionStorage.getItem("Refresh_key");

  const EventSource = EventSourcePolyfill;
  useEffect(() => {
    if (isLoggedIn) {
      const fetchSse = async () => {
        const headers = {
          "Content-Type": "text/event-stream",
          Connection: "keep-alive",
          ACCESS_KEY: Access_key,
          REFRESH_KEY: decrypt(Refresh_key),
        };
        const eventSource = new EventSource(
          `https://moment-backend.shop/sse/chat/alarm/${userId}`,
          {
            headers,
            withCredentials: true,
            heartbeatTimeout: 4000000,
          }
        );
        eventSource.addEventListener("chatAlarm-event", (event) => {
          const eventData = JSON.parse(event.data);
          console.log("Received event:", eventData);
          setAlarmList((prevList) => [...prevList, eventData]);
          setHasNewNotifications(true);
        });
      };
      fetchSse();
    }
  }, [isLoggedIn]);

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
    <>
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
              closeAlarmList();
            }}
          >
            <MainLogo src="/img/mainlogo2.png" />
          </HeaderTitle>
          <CategoryBox>
            <HeaderButton
              onClick={() => {
                navigate("/feeds");
                toggleWriteMenuClose();
                toggleProfileMenuClose();
                closeAlarmList();
              }}
            >
              포트폴리오
            </HeaderButton>
            <HeaderButton
              onClick={() => {
                navigate("/board");
                toggleWriteMenuClose();
                toggleProfileMenuClose();
                closeAlarmList();
              }}
            >
              구인/구직 게시판
            </HeaderButton>
          </CategoryBox>
        </LeftMenu>
        <ButtonBox>
          {windowWidth <= 768 ? (
            <MenuButton
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                toggleWriteMenuClose();
                toggleProfileMenuClose();
                closeAlarmList();
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
                      closeAlarmList();
                    }}
                  >
                    <ProfileImg src={profileImg} />
                    <div>{nickName}</div>
                    <MdExpandCircleDown
                      style={{ fontSize: "17px", color: "#483767" }}
                    />
                  </HeaderButton>
                  <HeaderButton
                    name={"alarmList"}
                    onClick={() => {
                      toggleProfileMenuClose();
                      toggleWriteMenuClose();
                      showAlarmList();
                    }}
                  >
                    <TbBell style={{ fontSize: "20px" }} />
                    {!isAlarmListOpen && hasNewNotifications && (
                      <NotificationDot>
                        <BsFillCircleFill
                          style={{ fontSize: "8px", color: "red" }}
                        />
                      </NotificationDot>
                    )}
                  </HeaderButton>
                </>
              ) : (
                <>
                  <HeaderButton
                    name={"login"}
                    bgcolor="#483767"
                    color="white"
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
                  closeAlarmList();
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
                closeAlarmList();
              }}
            >
              마이페이지
            </MenuButton>
            <MenuButton
              name={"chatlist"}
              onClick={() => {
                navigate(`/chatroomlist/${userId}`);
                toggleProfileMenuClose();
                closeAlarmList();
              }}
            >
              채팅목록
            </MenuButton>
            <MenuButton
              name={"logout"}
              onClick={() => {
                logoutHandler();
                closeAlarmList();
                toggleProfileMenuClose();
              }}
            >
              로그아웃
            </MenuButton>
          </ToggleProfileMenu>
        )}

        {isWriteMenuOpen && (
          <>
            <ToggleWriteMenu>
              <MenuButton
                onClick={() => {
                  toggleWriteMenuClose();
                  toggleProfileMenuClose();
                  toggleMenuClose();
                  closeAlarmList();
                  openModal("feed");
                }}
              >
                포트폴리오 작성
              </MenuButton>
              <MenuButton
                onClick={() => {
                  toggleWriteMenuClose();
                  toggleProfileMenuClose();
                  toggleMenuClose();
                  closeAlarmList();
                  openModal("board");
                }}
              >
                구인/구직글 작성
              </MenuButton>
            </ToggleWriteMenu>
          </>
        )}
        {modalType === "feed" && (
          <CreateFeed open={openModal} close={closeModal} />
        )}
        {modalType === "board" && (
          <CreateBoard open={openModal} close={closeModal} />
        )}
        {isMenuOpen && (
          <ToggleMenu>
            <MenuButton
              onClick={() => {
                navigate("/feeds");
                toggleMenuClose();
                toggleWriteMenuClose();
                toggleProfileMenuClose();
                closeAlarmList();
              }}
            >
              포트폴리오
            </MenuButton>
            <MenuButton
              onClick={() => {
                navigate("/board");
                toggleMenuClose();
                toggleWriteMenuClose();
                toggleProfileMenuClose();
                closeAlarmList();
              }}
            >
              구인/구직 게시판
            </MenuButton>
            <MenuButton
              onClick={() => {
                toggleWriteMenuOpen();
                toggleProfileMenuClose();
                closeAlarmList();
              }}
            >
              글쓰기
            </MenuButton>
            {isLoggedIn ? (
              <>
                <MenuButton
                  name={"mypage"}
                  onClick={() => {
                    navigate(`/page/${userId}`);
                    toggleMenuClose();
                    toggleWriteMenuClose();
                    toggleProfileMenuClose();
                    closeAlarmList();
                  }}
                >
                  마이페이지
                </MenuButton>
                <MenuButton
                  name={"alarmlist"}
                  onClick={() => {
                    showAlarmList();
                    toggleMenuClose();
                    toggleWriteMenuClose();
                    toggleProfileMenuClose();
                  }}
                >
                  알림
                </MenuButton>
                <MenuButton
                  name={"chatlist"}
                  onClick={() => {
                    navigate(`/chatroomlist/${userId}`);
                    toggleMenuClose();
                    toggleWriteMenuClose();
                    toggleProfileMenuClose();
                    closeAlarmList();
                  }}
                >
                  채팅목록
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
      </HeaderStyles>

      {isAlarmListOpen && (
        <AlarmListModal showAlarmList={showAlarmList} alarmList={alarmList} />
      )}
    </>
  );
}

const ToggleMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0px;
  background-color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  z-index: 100;
`;

const ToggleWriteMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 58px;
  background-color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  @media (max-width: 768px) {
    top: 105px;
    right: 120px;
  }
`;

const CategoryBox = styled.div`
  display: flex;
  gap: 20px;
  margin-left: 20px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuButton = styled.button`
  display: block;
  padding: 8px;
  border: none;
  background: none;
  color: black;
  font-size: 15px;
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
  align-items: center;
  flex-grow: 1;
`;

const HeaderTitle = styled.p`
  font-family: "UhBeeGENWOO";
  display: flex;
  font-size: 28px;
  font-weight: 600;
  align-items: center;
  cursor: pointer;
  margin-right: 20px;
`;

const ButtonBox = styled.div`
  display: flex;
  gap: 20px;
`;

const HeaderStyles = styled.div`
  width: 100%;
  background: white;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 100px;
  font-weight: 600;
  position: fixed;
  top: 0;
  left: 0;
  top: 0;
  left: 0;
  z-index: 10;
  justify-content: space-between;
  box-shadow: 0px 0.1px 5px gray;

  @media (max-width: 768px) {
    padding: 0 50px 0 80px;
  }
`;

const HeaderButton = styled.button`
  padding: 8px;
  gap: 3px;
  cursor: pointer;
  border: none;
  border-radius: 3.97px;
  background: none;
  align-items: center;
  background-color: ${(props) => props.bgcolor || "white"};
  color: ${(props) => props.color || "black"};
  display: flex;
  font-size: 15px;
  @media (max-width: 768px) {
    width: 56px;
  }
`;

const ProfileImg = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 4px;
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
  right: 210px;
  background-color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  @media (max-width: 768px) {
    top: 135px;
    right: 120px;
  }
`;

const MainLogo = styled.img`
  width: 50px;
`;
const NotificationDot = styled.span`
  position: absolute;
  top: 12px;
  right: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: white;
`;
export default Header;
