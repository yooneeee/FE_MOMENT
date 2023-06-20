import React, { useCallback } from "react";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getBoardDetailAxios } from "../apis/board/getBoardDetailAxios";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function BoardDetail() {
  const [currentPosition, setCurrentPosition] = useState(70);
  const formRef = useRef(null);
  const formRangeRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);
  // 스크롤 시 따라다니는 Form
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      const limitedPosition = Math.max(70, Math.min(125, position));
      setCurrentPosition(limitedPosition);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (formRef.current && formRangeRef.current) {
      // formRef와 formRangeRef가 null이 아닌지 확인
      const formHeight = formRef.current.offsetHeight;
      const formRangeHeight = formRangeRef.current.offsetHeight;
      const maxTopPosition = formRangeHeight - formHeight;
      const limitedTopPosition = Math.max(
        0,
        Math.min(maxTopPosition, currentPosition)
      );
      formRef.current.style.top = `${limitedTopPosition}px`;
    }
  }, [currentPosition]);

  const { isError, isLoading, data } = useQuery(
    ["getBoardDetailAxios", params.boardId],
    () => getBoardDetailAxios(params.boardId)
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>오류가 발생하였습니다...!</h1>;
  }

  return (
    <Container>
      <FlexContainer>
        <BoardImg img={data.boardImgUrl} />
        <MainContentContainer>
          <Title>작가 말</Title>
          <MainContentBody>{data.content}</MainContentBody>

          <Title name="작품">작가 작품</Title>
          <WorksContainer>
            {data.feedImgUrl.map((item) => {
              return <WorkItem img={item.photoUrl} key={item.photoId} />;
            })}
          </WorksContainer>
        </MainContentContainer>
      </FlexContainer>

      <StyledForm ref={formRef}>
        <Form>
          <FormBody>
            <Title>{data.title}</Title>
            <ProfileBox>
              <ProfileImg
                src={data.profileUrl}
                onClick={() => {
                  navigate(`/page/${data.hostId}`);
                }}
              ></ProfileImg>

              <UserDataBox>
                <UserPostion> {data.role} </UserPostion>
                <UserNickName>{data.nickName}</UserNickName>
              </UserDataBox>

              {data.hostId !== userId && (
                <ButtonContainer>
                  <ProfileVisitButton
                    onClick={() => {
                      navigate(`/chattest/${data.hostId}`);
                    }}
                  >
                    채팅하기
                  </ProfileVisitButton>
                  <ProfileVisitButton
                    onClick={() => {
                      Swal.fire({
                        icon: "error",
                        text: `현재 준비 중인 기능입니다.
                        불편을 끼쳐드려 죄송합니다.`,
                        confirmButtonText: "확인",
                      });
                    }}
                    // buttonColor="#6D0F8E"
                  >
                    매칭 신청
                  </ProfileVisitButton>
                </ButtonContainer>
              )}
            </ProfileBox>

            <HashTagContainer>
              {data.tag_boardList.map((item) => {
                return <HashTag key={item.tagId}>{item.tag}</HashTag>;
              })}
            </HashTagContainer>
            <ListTitle>촬영장소</ListTitle>
            <ListContent>{data.location}</ListContent>
            <ListTitle>급여 조건</ListTitle>
            <ListContent>{data.pay}</ListContent>
            <ListTitle>지원 방법</ListTitle>
            <ListContent>{data.apply}</ListContent>
            <ListTitle>모집 마감일</ListTitle>
            <ListContent>{data.deadLine}</ListContent>
          </FormBody>
        </Form>
      </StyledForm>
      <FormRange ref={formRangeRef}></FormRange>

      {/* <Form>
        <FormBody>
          <Title>{data.title}</Title>
          <ProfileBox>
            <ProfileImg
              src={data.profileUrl}
              onClick={() => {
                navigate(`/page/${data.hostId}`);
              }}
            ></ProfileImg>

            <UserDataBox>
              <UserPostion> {data.role} </UserPostion>
              <UserNickName>{data.nickName}</UserNickName>
            </UserDataBox>

            {data.hostId !== userId && (
              <ButtonContainer>
                <ProfileVisitButton
                  onClick={() => {
                    navigate(`/chattest/${data.hostId}`);
                  }}
                >
                  채팅하기
                </ProfileVisitButton>
                <ProfileVisitButton
                  onClick={() => {
                    Swal.fire({
                      icon: "error",
                      text: `현재 준비 중인 기능입니다.
                        불편을 끼쳐드려 죄송합니다.`,
                      confirmButtonText: "확인",
                    });
                  }}
                  // buttonColor="#6D0F8E"
                >
                  매칭 신청
                </ProfileVisitButton>
              </ButtonContainer>
            )}
          </ProfileBox>

          <HashTagContainer>
            {data.tag_boardList.map((item) => {
              return <HashTag key={item.tagId}>{item.tag}</HashTag>;
            })}
          </HashTagContainer>
          <ListTitle>촬영장소</ListTitle>
          <ListContent>{data.location}</ListContent>
          <ListTitle>급여 조건</ListTitle>
          <ListContent>{data.pay}</ListContent>
          <ListTitle>지원 방법</ListTitle>
          <ListContent>{data.apply}</ListContent>
          <ListTitle>모집 마감일</ListTitle>
          <ListContent>{data.deadLine}</ListContent>
        </FormBody>
      </Form> */}
    </Container>
  );
}

export default BoardDetail;

const Container = styled.div`
  /* padding: 20px 150px 20px 150px; */
  margin: 20px 150px;
  display: flex;
  /* background-color: aqua; */
  position: relative;

  @media (max-width: 1320px) {
    flex-direction: column;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const BoardImg = styled.div`
  width: 500px;
  height: 500px;
  background-image: url(${(props) => props.img});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 5px;
`;

const StyledForm = styled.div`
  position: fixed;
  right: 150px;
  transition: top 0.8s ease;
  @media (max-width: 1320px) {
    position: relative;
    right: 0px;
    margin-top: 20px;
  }
`;

const Form = styled.div`
  width: 500px;
  max-height: calc(
    100vh - 190px
  ); /* Adjust the value (200px) based on your needs */
  background-color: #f5f5f5;
  border-radius: 5px;
  position: absolute;
  right: 0;

  /* Hide the scrollbar
  ::-webkit-scrollbar {
    width: 0.8em;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #c5c5c5;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #888;
  } */
`;

const FormBody = styled.div`
  padding: 30px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-top: ${(props) => (props.name === "작품" ? "100px" : "0px")};
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  padding-top: 20px;
`;

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 70%;
  object-fit: cover;
  cursor: pointer;
`;

const UserDataBox = styled.div`
  padding-left: 15px;
`;

const UserPostion = styled.div`
  color: #777777;
  font-size: 14px;
  padding-bottom: 5px;
`;

const UserNickName = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-left: auto;
  gap: 5px;
`;

const ProfileVisitButton = styled.button`
  margin-left: auto;
  padding: 12px;
  background-color: ${(props) => props.buttonColor || "#514073"};
  color: white;
  border: none;
  border-radius: 10px;

  &:hover {
    background-color: #8c8c8c;
    border-color: #fff;
    color: #fff;
  }
`;

const HashTagContainer = styled.div`
  padding-top: 20px;
  display: flex;
  gap: 5px;
`;

const HashTag = styled.div`
  background-color: #514073;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 7px;
`;

const ListTitle = styled.div`
  color: #777777;
  margin-top: 30px;
`;

const ListContent = styled.div`
  margin-top: 20px;
`;

const MainContentContainer = styled.div`
  margin-top: 40px;
`;

const MainContentBody = styled.div`
  margin-top: 20px;
  width: 620px;
`;

const WorksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 10px;
  width: 620px;
`;

const WorkItem = styled.div`
  width: 200px;
  height: 200px;
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const FormRange = styled.div`
  width: 10%;
`;
