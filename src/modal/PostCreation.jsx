import React from "react";
import { useState, useRef } from "react";
import { styled } from "styled-components";

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
              <Text>새 게시글 작성</Text>
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
                <input />
                <input />
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

const ModalBtn = styled.button`
  background-color: var(--coz-purple-600);
  text-decoration: none;
  border: none;
  padding: 20px;
  color: white;
  border-radius: 30px;
  cursor: grab;
`;

const ExitBtn = styled(ModalBtn)`
  color: black;
  /* background-color: #4000c7;
  border-radius: 10px; */
  text-decoration: none;
  /* margin: 10px; */
  /* padding: 5px 10px; */
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
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

const Text = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-grow: 1;
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
  flex-direction: column;
  margin-left: 10px;
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
