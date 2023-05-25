import React from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  Container,
  CenteredContent,
  TitleLogo,
  Title,
} from "../styles/ContainerStyles";
import { InputWrap, Input, InputTitle } from "../styles/InputStyles";

function EmailSignup() {
  const navigate = useNavigate();

  const backButtonHandler = () => {
    navigate("/main");
  };

  return (
    <Container>
      <CenteredContent>
        <TitleLogo>
          <Title>Moment</Title>
        </TitleLogo>
        <InputTitle>닉네임</InputTitle>
        <InputWrap>
          <Input type="text" placeholder="닉네임을 입력해주세요." />
        </InputWrap>
        <InputTitle>직업</InputTitle>
        <ButtonContainer>
          <SelectionButton>모델</SelectionButton>
          <SelectionButton>작가</SelectionButton>
        </ButtonContainer>
        <InputTitle>성별</InputTitle>
        <ButtonContainer>
          <SelectionButton>남자</SelectionButton>
          <SelectionButton>여자</SelectionButton>
        </ButtonContainer>
        <InputTitle>이메일</InputTitle>
        <InputWrap>
          <Input type="text" placeholder="이메일 주소를 입력해주세요" />
        </InputWrap>
        <InputTitle>비밀번호</InputTitle>
        <InputWrap>
          <Input type="password" placeholder="비밀번호를 입력해주세요" />
        </InputWrap>
        <InputTitle>비밀번호 확인</InputTitle>
        <InputWrap>
          <Input type="password" placeholder="비밀번호를 확인해주세요." />
        </InputWrap>
        <InputTitle>휴대폰 인증</InputTitle>
        <BottomButtonWrap>
          <BottomButton>회원 가입 완료</BottomButton>
          <BottomButton onClick={backButtonHandler}>취소</BottomButton>
        </BottomButtonWrap>
      </CenteredContent>
    </Container>
  );
}

export default EmailSignup;

/* 버튼 선택 */
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
`;

const SelectionButton = styled.button`
  background-color: #ffffff;
  border-radius: 3px;
  margin-right: 2px;
  color: #000000;
  padding: 10px 40px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;

  &:active,
  &:focus {
    background-color: #000000; /* 선택 시 배경색 변경 */
    color: white;
  }
`;

/* 회원가입, 취소 버튼 */
const BottomButton = styled.button`
  width: 40%;
  height: 48px;
  border: none;
  font-weight: 700;
  background-color: #000000;
  border-radius: 64px;
  color: white;
  margin-bottom: 16px;
  cursor: pointer;

  /* 요소가 비활성화 상태일 때 */
  /*  &:disabled {
    background-color: #dadada;
    color: white;
  } */
`;
const BottomButtonWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 80px 40px;
`;
