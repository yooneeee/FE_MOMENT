import React from "react";
import styled from "styled-components";
import { mypage } from "../apis/mypage/mypage";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Chatting } from "../apis/mypage/chatting";
import { useSelector } from "react-redux";

const MyPageProfile = () => {
  const { hostId } = useParams();

  const userId = useSelector((state) => state.user.userId);
  // console.log("호스트1", hostId);

  const { isError, isLoading, data } = useQuery(
    ["mypage", hostId],
    () => mypage(hostId),
    {
      // hostId가 정의되어 있을 때만 데이터 요청
      enabled: hostId !== undefined,
    }
  );
  console.log("데이터1", data);

  if (isLoading) {
    return <h1>로딩 중입니다(oﾟvﾟ)ノ</h1>;
  }

  if (isError) {
    return <h1>오류(⊙ˍ⊙)</h1>;
  }
  if (data) {
    const isMyPage = parseInt(userId) === parseInt(hostId);
    const chatHostId = data.hostId;
    // console.log("호스트설정아이디", chatHostId);
    // console.log("유저", userId);
    // console.log("호스트2", hostId);

    return (
      <ProfileSection>
        <ProfilePicture src={data.profileUrl} />
        <ProfileInfo>
          <StFlex>
            <UserRole>{data.role}</UserRole>
            <UserNickname>{data.nickName}</UserNickname>
          </StFlex>
          <StFlex>
            <Post>피드 {data.photoList.length}</Post>
            <span>|</span>
            <Recommend>게시글 {data.boardCnt}</Recommend>
          </StFlex>
          <Post>추천 {data.totalPhotoLoveCnt}</Post>
          <StFlex>
            {isMyPage ? (
              <>
                <Link
                  to={`/mypageinformation/${hostId}`}
                  state={{ checkKakaoId: data.checkKakaoId }}
                >
                  <ChatBtn>프로필 편집</ChatBtn>
                </Link>
              </>
            ) : (
              <Link to={`/chattest/${chatHostId}`}>
                <ChatBtn>채팅하기</ChatBtn>
              </Link>
            )}
          </StFlex>
        </ProfileInfo>
      </ProfileSection>
    );
  }
};
export default MyPageProfile;

const ProfileSection = styled.div`
  width: 350px;
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
  font-weight: 550;
  text-align: center;
  writing-mode: horizontal-tb;
  margin-top: 15px;
`;

const ChatBtn = styled.button`
  border: none;
  padding: 10px 40px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  background-color: #483767;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 15px;

  &:hover {
    background-color: #5f5374;
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

const UserRole = styled.div`
  color: #666;
`;

const ProfilePicture = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
`;

const UserNickname = styled.span``;

const Recommend = styled.span`
  font-size: 16px;
`;

const Post = styled.div`
  font-size: 16px;
`;

const StFlex = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

const StFlex2 = styled(StFlex)`
  flex-direction: column;
  margin-top: 20px;
  gap: 3px;
`;
