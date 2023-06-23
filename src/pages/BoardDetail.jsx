import React, { useCallback } from "react";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getBoardDetailAxios } from "../apis/board/getBoardDetailAxios";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import ApplicationForMatching from "../apis/matching/ApplicationForMatching";

function BoardDetail() {
  const [currentPosition, setCurrentPosition] = useState(70);
  const formRef = useRef(null);
  const formRangeRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);
  const queryClient = useQueryClient();

  // 스크롤 시 따라다니는 Form
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const position = window.pageYOffset;
  //     const limitedPosition = Math.max(70, Math.min(125, position));
  //     setCurrentPosition(limitedPosition);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (formRef.current && formRangeRef.current) {
  //     // formRef와 formRangeRef가 null이 아닌지 확인
  //     const formHeight = formRef.current.offsetHeight;
  //     const formRangeHeight = formRangeRef.current.offsetHeight;
  //     const maxTopPosition = formRangeHeight - formHeight;
  //     const limitedTopPosition = Math.max(
  //       0,
  //       Math.min(maxTopPosition, currentPosition)
  //     );
  //     formRef.current.style.top = `${limitedTopPosition}px`;
  //   }
  // }, [currentPosition]);

  const { isError, isLoading, data, error } = useQuery(
    ["getBoardDetailAxios", params.boardId],
    () => getBoardDetailAxios(params.boardId)
  );

  // 매칭 신청 버튼
  const ApplicationForMatchingMutation = useMutation(ApplicationForMatching, {
    onSuccess: () => {
      queryClient.invalidateQueries("getBoardDetailAxios");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const matchingButtonHandler = (boardId) => {
    ApplicationForMatchingMutation.mutate(boardId);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    if (error.response.request.status === 401) {
      Swal.fire({
        icon: "error",
        title: "로그인이후 이용가능한 페이지입니다!",
        confirmButtonText: "확인",
      }).then(() => {
        navigate("/");
      });
    }
    return null;
  }

  const currentDate = new Date(); // 현재 날짜를 가져옴
  const year = currentDate.getFullYear(); // 년도를 가져옴
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 월을 가져옴 (0부터 시작하기 때문에 +1)
  const day = String(currentDate.getDate()).padStart(2, "0"); // 일을 가져옴
  const formattedDate = `${year}-${month}-${day}`; // 포맷팅된 날짜 생성

  console.log(data.deadLine);
  console.log(formattedDate); // 출력: "2023-06-22"
  console.log(data.deadLine < formattedDate);

  return (
    <Container>
      <ContentContainer>
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
                  {data.checkApply && data.checkMatched === false ? (
                    <ProfileVisitButton
                      onClick={() => {
                        matchingButtonHandler(data.boardId);
                        Swal.fire({
                          icon: "success",
                          title: "매칭 신청 취소 완료!",
                          text: "매칭 신청이 취소되었습니다!",
                          confirmButtonText: "확인",
                        });
                      }}
                      buttonStatus="cancel"
                    >
                      매칭 취소
                    </ProfileVisitButton>
                  ) : data.checkMatched && data.checkApply ? (
                    <ProfileVisitButton
                      onClick={() => {
                        Swal.fire({
                          icon: "success",
                          title: "매칭이 이미 완료된 게시글입니다.",
                          confirmButtonText: "확인",
                        });
                      }}
                    >
                      매칭 완료
                    </ProfileVisitButton>
                  ) : data.checkMatched && data.checkApply === false ? (
                    <ProfileVisitButton
                      onClick={() => {
                        Swal.fire({
                          icon: "success",
                          title: "매칭이 이미 완료된 게시글입니다.",
                          confirmButtonText: "확인",
                        });
                      }}
                    >
                      매칭 완료
                    </ProfileVisitButton>
                  ) : (
                    <ProfileVisitButton
                      onClick={() => {
                        if (data.deadLine > formattedDate) {
                          matchingButtonHandler(data.boardId);
                          Swal.fire({
                            icon: "success",
                            title: "매칭 신청 완료!",
                            text: "매칭이 완료되었습니다!",
                            confirmButtonText: "확인",
                          });
                        } else {
                          Swal.fire({
                            icon: "error",
                            title: "이미 마감된 게시글입니다.",
                            confirmButtonText: "확인",
                          });
                        }
                      }}
                    >
                      매칭 신청
                    </ProfileVisitButton>
                  )}
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
      </ContentContainer>
    </Container>
  );
}

export default BoardDetail;

const Container = styled.div`
  /* padding: 20px 150px 20px 150px; */
  padding: 20px 300px;
  width: 100%;
  display: flex;
  /* background-color: aqua; */
  position: relative;
  align-items: center;
  justify-content: center;

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

const ContentContainer = styled.div`
  width: 1200px;
  min-width: 1200px;
  /* background-color: aqua; */
  display: flex;
`;

const StyledForm = styled.div`
  position: fixed;
  right: 300px;
  transition: top 0.8s ease;
  @media (max-width: 1320px) {
    position: relative;
    right: 0px;
    margin-top: 20px;
  }
`;

const Form = styled.div`
  width: 500px;
  height: max-content;
  background-color: #f5f5f5;
  border-radius: 5px;
  margin-left: auto;

  /* position: fixed;
  right: 140px; */

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
  background-color: ${(props) =>
    props.buttonStatus === "cancel" ? "#696969" : "#514073"};
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
