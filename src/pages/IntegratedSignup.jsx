import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Container,
  CenteredContent,
  TitleLogo,
  Title,
} from "../styles/ContainerStyles";
import {
  KakaoLoginButton,
  KakaoLogoImage,
  KakaoLogoContainer,
  EmailButton,
  ButtonText,
} from "../styles/ButtonStyles";
import { REDIRECT_URI, REST_API_KEY } from "./Login/KakaoLoginData";

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

function IntegratedSignup() {
  const navigate = useNavigate();
  const kakaoSignupButtonHandler = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <Container>
      <CenteredContent>
        <TitleLogo>
          <Title>Moment</Title>
        </TitleLogo>
        <Text1>반가워요❣</Text1>
        <Text2>
          통합회원으로 <span>모먼트</span>를 간편하게 이용하세요
        </Text2>
        <EmailButton>
          <ButtonText
            name={"emailsignup"}
            onClick={() => {
              navigate("/emailsignup");
            }}
          >
            이메일로 가입하기
          </ButtonText>
        </EmailButton>
        <TextWithLines>
          <Line />
          <Text3>또는</Text3>
          <Line />
        </TextWithLines>
        <KakaoLoginButton type="button" onClick={kakaoSignupButtonHandler}>
          <KakaoLogoContainer>
            <KakaoLogoImage src="img/KakaoLogoImage.png" alt="카카오 로고" />
          </KakaoLogoContainer>
          <ButtonText>카카오로 3초만에 가입하기</ButtonText>
        </KakaoLoginButton>
        <Text4>
          이미 모먼트 계정이 있으신가요?
          <LoginButton
            name={"login"}
            onClick={() => {
              navigate("/login");
            }}
          >
            로그인하기
          </LoginButton>
        </Text4>
      </CenteredContent>
    </Container>
  );
}

export default IntegratedSignup;

const Text1 = styled.div`
  padding: 20px;
  font-size: 20px;
  font-weight: 600;
  margin-left: auto;
  margin-right: auto;
`;
const Text2 = styled.div`
  padding: 20px;
  font-size: 18px;
  font-weight: 200;
  margin-bottom: 50px;
  margin-left: auto;
  margin-right: auto;

  span {
    font-weight: 700;
  }
`;
const Text3 = styled.div`
  padding: 0 5px;
  color: #d4d4d4;
`;
const Text4 = styled.div`
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;

  span {
    margin-left: 20px;
  }
`;

/* 구분선 */
const TextWithLines = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`;
const Line = styled.div`
  border-top: 1px solid #d4d4d4;
  margin: 50px 10px;
  width: 100px;
`;

const LoginButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  margin-left: 10px;
  font-size: 15px;
  text-decoration: underline;
`;
