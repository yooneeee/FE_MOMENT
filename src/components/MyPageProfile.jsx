import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { mypage } from "../apis/mypage/mypage";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const MyPageProfile = ({ mine }) => {
  const { hostId } = useParams();
  // console.log(hostId);
  const [isMine, setIsMine] = useState(mine);

  useEffect(() => {
    setIsMine(mine);
  }, [mine]);

  console.log("mine", mine);
  const { isError, isLoading, data } = useQuery(["mypage", mypage], () =>
    mypage(hostId)
  );

  if (isLoading) {
    return <h1>로딩 중입니다(oﾟvﾟ)ノ</h1>;
  }

  if (isError) {
    return <h1>오류(⊙ˍ⊙)</h1>;
  }
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
          {isMine && (
            <Link
              to={`/mypageinformation/${hostId}`}
              state={{ checkKakaoId: data.checkKakaoId }}
            >
              <ChatBtn>프로필 편집</ChatBtn>
            </Link>
          )}
        </StFlex>
      </ProfileInfo>
    </ProfileSection>
  );
};

export default MyPageProfile;

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
