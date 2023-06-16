import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import MyPageTabs from "../components/MyPageTabs";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { mypage } from "../apis/mypage/mypage";
import { mypageFeedDelete } from "../apis/mypage/mypage";
import { FiSettings } from "react-icons/fi";
import { BiDownArrow } from "react-icons/bi";
import MyPageProfile from "../components/MyPageProfile";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import FeedDetail from "../components/FeedDetail";

function MyPageFeed() {
  const { hostId } = useParams();
  const queryClient = useQueryClient();

  const [editButtons, setEditButtons] = useState([]);
  const toggleWriteMenuRef = useRef(null);

  const { isError, isLoading, data } = useQuery(["mypage", mypage], () =>
    mypage(hostId)
  );

  // 모달 제어
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [feedDetailOpen, setFeedDetailOpen] = useState([]);

  const openFeedDetail = (photoId) => {
    if (isLoggedIn) {
      setFeedDetailOpen((prevOpen) => [...prevOpen, photoId]);
    } else {
      Swal.fire({
        icon: "warning",
        title: "회원 전용 서비스!",
        text: `로그인이 필요한 서비스입니다🙏`,
        confirmButtonText: "확인",
      });
    }
  };

  const closeFeedDetail = (photoId) => {
    setFeedDetailOpen((prevOpen) => prevOpen.filter((id) => id !== photoId));
  };

  /* Delete 서버 */
  const deleteMutation = useMutation(mypageFeedDelete, {
    onSuccess: () => {
      queryClient.invalidateQueries(["mypage", mypage]);
      setEditButtons([]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  /* 삭제, 수정 버튼 */
  const modifyButton = (e, index) => {
    Swal.fire({
      text: "준비중인 서비스입니다! 조금만 기다려주세요🙏",
      icon: "warning",
      confirmButtonColor: "#483767",
      confirmButtonText: "확인",
    });
    toggleButtonClose(index);
  };

  const deleteButtonHandler = (photoId) => {
    try {
      Swal.fire({
        title: "정말로 삭제 하시겠습니까?",
        text: "다시 되돌릴 수 없습니다. 신중하세요.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#483767",
        cancelButtonColor: "#c4c4c4",
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteMutation.mutateAsync(photoId);
            toggleButtonClose(photoId);
            Swal.fire({
              title: "삭제가 완료되었습니다✨",
              icon: "success",
              confirmButtonColor: "#483767",
              confirmButtonText: "완료",
            });
          } catch (error) {
            Swal.fire({
              title: "삭제 실패!",
              text: "피드 삭제 중 오류가 발생했습니다.",
              icon: "error",
              confirmButtonColor: "#483767",
              confirmButtonText: "확인",
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        toggleWriteMenuRef.current &&
        !toggleWriteMenuRef.current.contains(event.target)
      ) {
        setEditButtons([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>오류(⊙ˍ⊙)</h1>;
  }

  /* 토글버튼 */
  const toggleButtonOpen = (index) => {
    const updatedEditButtons = [...editButtons];
    updatedEditButtons[index] = true;
    setEditButtons(updatedEditButtons);
  };

  const toggleButtonClose = (index) => {
    const updatedEditButtons = [...editButtons];
    updatedEditButtons[index] = false;
    setEditButtons(updatedEditButtons);
  };

  return (
    <>
      <MyPageTabs pageName={"내 피드"} />
      <PageContainer>
        <ContentContainer>
          <ProfileContainer>
            <MyPageProfile />
          </ProfileContainer>
          <WorkSection>
            <Work>나의 작업물</Work>
            <WorkList>
              {data.photoList.map((item, index) => {
                const isOpen = feedDetailOpen.includes(item.photoId);
                return (
                  <>
                    <WorkItem
                      src={item.photoUrl}
                      onClick={() => {
                        openFeedDetail(item.photoId);
                      }}
                    >
                      <EditButton
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleButtonOpen(index);
                        }}
                      >
                        <FiSettings size={14} />
                        <BiDownArrow size={14} style={{ marginLeft: "5px" }} />
                      </EditButton>
                      {editButtons[index] && (
                        <ToggleWriteMenu ref={toggleWriteMenuRef}>
                          <Button
                            onClick={(e) => {
                              modifyButton(e, index);
                              e.stopPropagation();
                            }}
                          >
                            수정
                          </Button>
                          <Button
                            onClick={(e) => {
                              deleteButtonHandler(item.photoId);
                              e.stopPropagation();
                            }}
                          >
                            삭제
                          </Button>
                        </ToggleWriteMenu>
                      )}
                    </WorkItem>
                    {isOpen && (
                      <FeedDetail
                        open={() => openFeedDetail(item.photoId)}
                        close={() => closeFeedDetail(item.photoId)}
                        photoId={item.photoId}
                      />
                    )}
                  </>
                );
              })}
            </WorkList>
          </WorkSection>
        </ContentContainer>
      </PageContainer>
    </>
  );
}

export default MyPageFeed;

const ToggleWriteMenu = styled.div`
  position: absolute;
  top: 68px;
  right: -95px;
  transform: translate(-50%, -50%);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    top: 80px;
    left: 5px;
  }
`;

const ProfileContainer = styled.div`
  width: 400px;
`;

const EditButton = styled.button`
  position: absolute;
  top: 16px;
  right: -20px;
  transform: translate(-50%, -50%);
  /*   display: flex; */
  z-index: 100;
  background-color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 900;
  padding: 5px;
`;

const Button = styled.button`
  width: 100px;
  margin-left: 58px;
  padding: 8px;
  margin-bottom: 4px;
  background-color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 900;
  @media (max-width: 768px) {
    width: 60px;
  }
`;

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 1200px;
  margin-top: 40px;
  @media (min-width: 769px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const WorkSection = styled.div`
  flex-grow: 1;
  margin-left: 1rem;
`;

const Work = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const WorkList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  justify-items: center;
  align-items: center;
  margin-top: 16px;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const WorkItem = styled.div`
  width: 100%;
  padding-top: 100%;
  border-radius: 7px;
  background-image: ${(props) => `url(${props.src})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  border-radius: 7px;
  cursor: pointer;

  &:hover ${EditButton} {
    display: block;
  }
  @media (max-width: 480px) {
    height: 200px;
  }
`;
