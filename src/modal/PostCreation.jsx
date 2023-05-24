import React from "react";
import { useState, useRef } from "react";
import { styled } from "styled-components";
import { Input } from "../styles/InputStyles";

function PostCreation() {
  const [isOpen, setIsOpen] = useState(false);

  const openModalHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={openModalHandler}>모달</button>
      {isOpen ? (
        <ModalBackdrop onClick={openModalHandler}>
          {/* event 버블링을 막는 메소드 */}
          <ModalView onClick={(e) => e.stopPropagation()}>
            <Top>
              {/* <ExitBtn onClick={openModalHandler}>x</ExitBtn> */}
              <CancelButton>취소</CancelButton>
              <Text1>새 게시글 작성</Text1>
              <UploadButton>업로드</UploadButton>
            </Top>
            <Container>
              <ImageUploadContainer></ImageUploadContainer>
              <InformationContainer>
                <CardHeader>
                  <ProfileImg src="img/monkey_test.jpeg"></ProfileImg>
                  <div>
                    <UserNickName>Jun</UserNickName>
                  </div>
                </CardHeader>
                <TitleInput type="text" placeholder="제목 입력.." />
                <DetailTextarea type="text" placeholder="상세내용 입력.." />
                <span>위치 추가</span>
              </InformationContainer>
            </Container>
          </ModalView>
        </ModalBackdrop>
      ) : null}
    </div>
  );
}

export default PostCreation;

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ModalBackdrop = styled.div`
  /* width: 100%; */
  z-index: 1;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const ModalView = styled.div`
  display: flex;
  /* align-items: center; */
  flex-direction: column;
  border-radius: 20px;
  width: 100%;
  max-width: 60%;
  /* min-height: calc(100vh - 100px); */
  min-height: 70%;
  background-color: #ffffff;
`;
const Top = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid black;
  border-top: none;
  border-right: none;
  border-left: none;
  padding: 10px;
`;
const CancelButton = styled.button`
  margin-left: 10px;
  border: none;
  background-color: white;
  font-size: 15px;
`;
const UploadButton = styled.button`
  margin-right: 10px;
  border: none;
  background-color: white;
  font-size: 15px;
`;
const Text1 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-grow: 1;
  font-weight: 700;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
`;
const ImageUploadContainer = styled.div`
  display: flex;
  /* flex-direction: column;
  align-items: center; */
  justify-content: flex-start;
  width: 65%;
  max-width: 100%;
  /* min-height: 100%; */
  height: 70vh;
  border: 1px dashed gray;
  border-bottom-left-radius: 20px 20px;
  cursor: pointer;
`;

const InformationContainer = styled.div`
  display: flex;
  width: 35%;
  flex-direction: column;
  margin-left: 10px;
  margin-right: 10px;
`;

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 70%;
  object-fit: cover;
  padding: 10px;
  flex-shrink: 0;
`;
const UserNickName = styled.div`
  font-size: 23px;
  margin-left: 10px;
`;
const CardHeader = styled.div`
  display: flex;
  align-items: center;
`;
const TitleInput = styled(Input)`
  height: 8%;

  &::placeholder {
    color: #6e6e6e;
  }
`;
const DetailTextarea = styled.textarea`
  width: 100%;
  outline: none;
  border: none;
  height: 50%;
  font-size: 14px;
  font-weight: 400;
  resize: none;

  &::placeholder {
    color: #6e6e6e;
  }
`;
