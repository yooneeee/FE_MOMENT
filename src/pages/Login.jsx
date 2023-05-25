import React from "react";
import { styled } from "styled-components";
import { InputWrap, Input, InputTitle } from "../styles/InputStyles";
import { ButtonText } from "../styles/ButtonStyles";
import {
  Container,
  CenteredContent,
  Title,
  TitleLogo,
} from "../styles/ContainerStyles";
import {
  KakaoLoginButton,
  KakaoLogoContainer,
  KakaoLogoImage,
  EmailButton,
} from "../styles/ButtonStyles";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  return (
    <Container>
      <CenteredContent>
        <TitleLogo>
          <Title>Moment</Title>
        </TitleLogo>
        <InputTitle>이메일</InputTitle>
        <InputWrap>
          <Input type="text" placeholder="이메일 주소를 입력해주세요" />
        </InputWrap>
        <InputTitle>비밀번호</InputTitle>
        <InputWrap>
          <Input type="password" placeholder="비밀번호를 입력해주세요." />
        </InputWrap>
        <ButtonWrap>
          <EmailButton>
            <ButtonText>이메일로 로그인하기</ButtonText>
          </EmailButton>
        </ButtonWrap>
        <Line />
        <KakaoLoginButton>
          <KakaoLogoContainer>
            <KakaoLogoImage src="img/KakaoLogoImage.png" alt="카카오 로고" />
          </KakaoLogoContainer>
          <ButtonText>카카오로 로그인하기</ButtonText>
        </KakaoLoginButton>
      </CenteredContent>
    </Container>
  );
}

export default Login;

const ButtonWrap = styled.div`
  display: flex;
  margin-top: 40px;
`;
const Line = styled.div`
  border-top: 1px solid #d4d4d4;
  width: 100%;
  margin: 40px auto;
`;
