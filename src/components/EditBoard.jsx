import React, { useEffect, useRef, useState } from "react";
import "../css/CreateBoardModal.css";
import disableScroll from "./DisableScroll";
import enableScroll from "./EnableScroll";
import styled from "styled-components";
import { useInput } from "../hooks/useInput";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import UserDataComponent from "./UserDataComponent";
import Swal from "sweetalert2";
import { getBoardDetailAxios } from "../apis/board/getBoardDetailAxios";
import { mypageBoardEditAxios } from "../apis/mypage/mypage";

const EditBoard = (props) => {
  const { open, close, id, item } = props;

  const { isError, isLoading, data } = useQuery(
    ["getBoardDetailAxios", id],
    () => getBoardDetailAxios(id)
  );

  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(item.boardImgUrl);
  const [title, onChangeTitleHandler] = useInput("");
  const [content, onChangeContentHandler] = useInput("");
  const [location, onChangeLocationHandler] = useInput("");
  const [pay, onChangePayHandler] = useInput("");
  const [apply, onChangeApplyHandler] = useInput("");
  const [deadLine, onChangeDeadLineHandler] = useInput("");
  const loginUserData = UserDataComponent(); // 나의 유저 데이터 받아오는 코드
  const queryClient = useQueryClient();
  // 오늘 날짜
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  const dateString = year + "-" + month + "-" + day;

  // 이미지 미리보기
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  // 모달창 바깥을 눌렀을 때 모달 close
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      close();
    }
  };

  // 스크롤 방지
  useEffect(() => {
    disableScroll();
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      enableScroll();
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // 서버 통신
  const editBoardMutation = useMutation(mypageBoardEditAxios, {
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "게시물 수정 완료!",
        text: `게시글 수정이 완료됐습니다✨`,
        confirmButtonText: "확인",
      });
      queryClient.invalidateQueries("getBoardAxios");
      queryClient.invalidateQueries("mypage");
      close();
    },
    onError: (error) => {
      alert(error);
    },
  });

  // 수정하기 버튼 클릭
  const saveButtonHandler = () => {
    const editData = {
      title,
      content,
      location,
      pay,
      apply,
      deadLine,
    };
    const boardId = id;
    editBoardMutation.mutate({ boardId, editData });
  };

  return (
    <div
      className={open ? "openModal create-board-modal" : "create-board-modal"}
    >
      {open ? (
        <section ref={modalRef}>
          <Header>
            <HeaderTitle>새 게시글 만들기</HeaderTitle>
            <HeaderRightBox>
              <SaveButton onClick={saveButtonHandler}>등록하기</SaveButton>
              <CloseButton onClick={close}>
                <AiOutlineClose />
              </CloseButton>
            </HeaderRightBox>
          </Header>

          {data && (
            <Container>
              <MainBody>
                <ImgContainer>
                  {!previewImage ? (
                    <ButtonLabel htmlFor="file">
                      파일 업로드하기
                      <input
                        type="file"
                        name="file"
                        id="file"
                        onChange={handleFileChange}
                      />
                    </ButtonLabel>
                  ) : (
                    <ImgBox src={previewImage} alt="Preview" />
                  )}
                </ImgContainer>
              </MainBody>

              <InputSection>
                <ProfileBox>
                  <ProfileImg
                    src={loginUserData.profileImg}
                    alt="프로필이미지"
                  />
                  <div>
                    <Position>{loginUserData.role}</Position>
                    <p>{loginUserData.nickName}</p>
                  </div>
                </ProfileBox>
                <ContentContainer>
                  <InputTitle>제목</InputTitle>
                  <ContentInput
                    placeholder={`${data.title}`}
                    value={title}
                    onChange={onChangeTitleHandler}
                  ></ContentInput>

                  <InputTitle>내용</InputTitle>
                  <ContentInput
                    placeholder={`${data.content}`}
                    value={content}
                    onChange={onChangeContentHandler}
                  ></ContentInput>
                  <InputTitle>촬영 장소</InputTitle>
                  <ContentInput
                    placeholder={`${data.location}`}
                    value={location}
                    onChange={onChangeLocationHandler}
                  />

                  <InputTitle>페이</InputTitle>
                  <ContentInput
                    placeholder={`${data.pay}`}
                    value={pay}
                    onChange={onChangePayHandler}
                  />

                  <InputTitle>지원 방법</InputTitle>
                  <ContentInput
                    placeholder={`${data.apply}`}
                    value={apply}
                    onChange={onChangeApplyHandler}
                  />

                  <InputTitle>모집 마감일</InputTitle>
                  <ContentInput
                    type="date"
                    value={deadLine}
                    onChange={onChangeDeadLineHandler}
                    min={dateString}
                  />
                </ContentContainer>
              </InputSection>
            </Container>
          )}
        </section>
      ) : null}
    </div>
  );
};

export default EditBoard;

const ImgBox = styled.img`
  position: relative;
  width: 720px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: contain;
`;

const ContentContainer = styled.div`
  margin-top: -15px;
`;

const CloseButton = styled.button`
  margin: 3px 5px 0 0;
  background-color: transparent;
`;

const InputTitle = styled.div`
  margin: 20px 0px 0px 15px;
`;

const ContentInput = styled.input`
  height: 30px;
  width: 94%;
  margin: 6px 0px 0px 15px;
  border: none;
  outline: none;
  font-size: 15px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  padding: 5px;
  border-bottom: 1px solid #eee;
`;

const HeaderTitle = styled.div`
  padding: 5px;
  margin-left: 3px;
  color: black;
`;

const HeaderRightBox = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const SaveButton = styled.button`
  padding: 5px;
  background-color: transparent;
  font-weight: 600;
  margin-left: auto;
`;

const Container = styled.div`
  display: flex;
`;

const MainBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 700px;
  max-height: 700px;
  overflow: hidden;
`;

const ImgContainer = styled.div`
  position: relative;
  width: 720px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputSection = styled.div`
  min-width: 350px;
  min-height: 700px;
  padding: 10px;
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  color: black;
`;

const ProfileImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 70%;
  object-fit: cover;
  padding: 15px;
  flex-shrink: 0;
  cursor: pointer;
`;

const Position = styled.p`
  color: #787878;
`;

const ButtonLabel = styled.label`
  width: 150px;
  height: 30px;
  background: #483767;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  &:hover {
    background: #5f5374;
    color: #fff;
  }

  input {
    display: none; // input 태그를 숨깁니다
  }
`;
