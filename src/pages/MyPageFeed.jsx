import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MyPageTabs from "../components/MyPageTabs";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { mypage } from "../apis/mypage/mypage";
import { mypageFeedDelete } from "../apis/mypage/mypage";
import { FiSettings } from "react-icons/fi";
import { BiDownArrow } from "react-icons/bi";
import MyPageProfile from "../components/MyPageProfile";
import LoadingSpinner from "../components/LoadingSpinner";

function MyPageFeed() {
  const { hostId, photoId } = useParams();
  const queryClient = useQueryClient();

  const [editButtons, setEditButtons] = useState([]);

  const { isError, isLoading, data } = useQuery(["mypage", mypage], () =>
    mypage(hostId)
  );

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
  const modifyButton = () => {
    alert("수정");
  };

  const deleteButtonHandler = (photoId) => {
    try {
      if (
        !window.confirm(
          "삭제하시면 복구할 수 없습니다. 정말로 삭제하시겠습니까?"
        )
      ) {
        return;
      }
      deleteMutation.mutate(photoId);
      toggleButtonClose(photoId);
    } catch (error) {}
  };

  // useEffect(() => {
  //   if (deleteMutation.isSuccess) {
  //     queryClient.refetchQueries(["mypage", mypage]);
  //   }
  // }, [deleteMutation.isSuccess, queryClient]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>오류(⊙ˍ⊙)</h1>;
  }
  console.log("mypagefeed", data);
  console.log("photo", data.photoList);

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
          <MyPageProfile />
          <WorkSection>
            <Work>나의 작업물</Work>
            <WorkList>
              {data.photoList.map((item, index) => {
                return (
                  <WorkItem key={index} src={item.photoUrl}>
                    <EditButton
                      onClick={(e) => {
                        if (editButtons[index]) {
                          toggleButtonClose(index);
                        } else {
                          toggleButtonOpen(index);
                        }
                      }}
                    >
                      <FiSettings size={14} />
                      <BiDownArrow size={14} style={{ marginLeft: "5px" }} />
                    </EditButton>
                    {editButtons[index] && (
                      <ToggleWriteMenu>
                        <Button onClick={modifyButton}>수정</Button>
                        <Button
                          onClick={() => deleteButtonHandler(item.photoId)}
                        >
                          삭제
                        </Button>
                      </ToggleWriteMenu>
                    )}
                  </WorkItem>
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
  top: 88px;
  left: 25px;
  transform: translate(-50%, -50%);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    top: 105px;
    right: 120px;
  }
`;
const EditButton = styled.button`
  position: absolute;
  top: 25px;
  left: 30px;
  transform: translate(-50%, -50%);
  display: none;

  background-color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 900;

  padding: 8px;
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
    grid-template-columns: repeat(4, 1fr);
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
  background-image: ${(props) => `url(${props.src})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  border-radius: 7px;

  &:hover ${EditButton} {
    display: block;
  }
  @media (max-width: 480px) {
    height: 200px;
  }
`;
