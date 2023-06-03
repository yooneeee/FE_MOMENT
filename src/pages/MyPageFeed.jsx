import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MyPageTabs from "../components/MyPageTabs";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { mypage } from "../apis/mypage/mypage";
import { mypageFeedDelete } from "../apis/mypage/mypage";
import { FiSettings } from "react-icons/fi";
import { BiDownArrow } from "react-icons/bi";

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
      alert("삭제 완료!");
      setEditButtons([]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const deleteButtonHandler = (photoId) => {
    try {
      deleteMutation.mutate(photoId);
      toggleButtonClose(photoId);
    } catch (error) {}
  };

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      queryClient.refetchQueries(["mypage", mypage]);
    }
  }, [deleteMutation.isSuccess, queryClient]);

  if (isLoading) {
    return <h1>로딩 중입니다(oﾟvﾟ)ノ</h1>;
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

  /* 삭제, 수정 버튼 */
  const modifyButton = () => {
    alert("수정");
  };

  return (
    <>
      <MyPageTabs />
      <PageContainer>
        <ContentContainer>
          <ProfileSection>
            <ProfilePicture src={data.profileUrl} />
            <ProfileInfo>
              <StFlex>
                <span>{data.role}</span>
                <UserNickname>{data.nickName}</UserNickname>
              </StFlex>
              <StFlex>
                <Post>피드 {data.photoList.length}</Post>
                <span>|</span>
                <Recommend>게시글 {data.boardCnt}</Recommend>
              </StFlex>
              <Post>추천🧡 {data.totalPhotoLoveCnt}</Post>
              <StFlex>
                <Link to={`/mypageinformation/${hostId}`}>
                  <ChatBtn>프로필 편집</ChatBtn>
                </Link>
              </StFlex>
            </ProfileInfo>
          </ProfileSection>
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
                      <FiSettings size={18} />
                      <BiDownArrow size={18} />
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
  /* display: block; */
  /* width: 100%; */
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
  margin-top: 80px;
  @media (min-width: 769px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 30px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-right: 40px;
  margin-bottom: 20px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    align-items: center;
    margin-right: 0;
    margin-bottom: 30px;
    width: 70%;
  }
`;

const ProfileInfo = styled.div`
  font-size: 19px;
  font-weight: bold;
  text-align: center;
  writing-mode: horizontal-tb;
`;

const ChatBtn = styled.button`
  border: none;
  padding: 10px 40px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 20px;
  background-color: #c9ccd1;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 15px;

  &:hover {
    background-color: #202020;
  }

  @media (min-width: 769px) {
    padding: 12px 50px;
    font-size: 18px;
    writing-mode: horizontal-tb;
  }

  @media (max-width: 480px) {
    padding: 8px 30px;
    font-size: 14px;
    writing-mode: horizontal-tb;
  }
`;

const ProfilePicture = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
`;

const UserNickname = styled.span``;

const Recommend = styled.span`
  color: #666;
  font-size: 16px;
`;

const Post = styled.div`
  color: #666;
  font-size: 16px;
`;

const StFlex = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

const WorkSection = styled.div`
  flex-grow: 1;
  margin: 30px;
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

  &:hover ${EditButton} {
    display: block;
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;
