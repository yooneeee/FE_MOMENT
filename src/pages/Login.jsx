import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InputWrap, Input, InputTitle } from "../styles/InputStyles";
import { ButtonText } from "../styles/ButtonStyles";
import { Container, Title, TitleLogo } from "../styles/ContainerStyles";
import {
  KakaoLoginButton,
  KakaoLogoContainer,
  KakaoLogoImage,
  EmailButton,
} from "../styles/ButtonStyles";
import { useNavigate } from "react-router-dom";
import { useInput } from "../hooks/useInput";
import { useMutation } from "react-query";
import { loginAxios } from "../apis/auth/login";
import { useDispatch } from "react-redux";
import { loginSuccess, setUser } from "../redux/modules/user";

function Login() {
  const navigate = useNavigate();
  const [email, onChangeEmailHandler, resetEmail] = useInput("");
  const [password, onChangePasswordHandler, resetPassword] = useInput("");
  const [loginActive, setLoginActive] = useState(false);
  const dispatch = useDispatch();

  const loginActiveHandler = () => {
    return email.includes("@") && password.length >= 8
      ? setLoginActive(true)
      : setLoginActive(false);
  };

  const loginMutation = useMutation(loginAxios, {
    onSuccess: (response) => {
      alert("로그인 성공!");
      dispatch(loginSuccess());
      dispatch(
        setUser({
          nickName: response.nickName,
          profileImg: response.profileImg,
          role: response.role,
        })
      );

      navigate("/main");
      resetEmail();
      resetPassword();
    },
    onError: (error) => {
      alert("아이디와 비밀번호를 다시 확인해주세요!");
      resetPassword();
    },
  });

  const loginButtonHandler = () => {
    loginMutation.mutate({ email, password });
  };
  useEffect(() => {
    loginActiveHandler();
  }, [email, password]);

  return (
    <Container>
      <CenteredContent>
        <TitleLogo>
          <Title>Moment</Title>
        </TitleLogo>
        <InputTitle>이메일</InputTitle>
        <InputWrap>
          <Input
            type="text"
            name="email"
            value={email}
            onChange={onChangeEmailHandler}
            placeholder="이메일 주소를 입력해주세요"
          />
        </InputWrap>
        <InputTitle>비밀번호</InputTitle>
        <InputWrap>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={onChangePasswordHandler}
            placeholder="비밀번호를 입력해주세요."
          />
        </InputWrap>
        <ButtonWrap>
          <EmailButton
            type="button"
            disabled={!loginActive}
            onClick={loginButtonHandler}
          >
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
const CenteredContent = styled.form`
  flex: 1 0 auto;
  margin: 0px auto;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 40px 0px;
`;
