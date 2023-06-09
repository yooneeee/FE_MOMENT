import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InputWrap, Input, InputTitle } from "../../styles/InputStyles";
import { ButtonText } from "../../styles/ButtonStyles";
import { Container, Title, TitleLogo } from "../../styles/ContainerStyles";
import {
  KakaoLoginButton,
  KakaoLogoContainer,
  KakaoLogoImage,
  EmailButton,
} from "../../styles/ButtonStyles";
import { useNavigate } from "react-router-dom";
import { useInput } from "../../hooks/useInput";
import { useMutation } from "react-query";
import { loginAxios } from "../../apis/auth/login";
import { useDispatch } from "react-redux";
import { loginSuccess, setUser } from "../../redux/modules/user";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`;
console.log(process.env.REST_API_KEY);
console.log(process.env.REDIRECT_URI);
function Login() {
  const navigate = useNavigate();
  const [email, onChangeEmailHandler, resetEmail] = useInput("");
  const [password, onChangePasswordHandler, resetPassword] = useInput("");
  const [loginActive, setLoginActive] = useState(false);
  const [passwordType, setPasswordType] = useState({
    type: "password",
    visible: false,
  });
  const dispatch = useDispatch();

  const passwordTypeHandler = (e) => {
    setPasswordType(() => {
      if (!passwordType.visible) {
        return { type: "text", visible: true };
      }
      return { type: "password", visible: false };
    });
  };
  const loginActiveHandler = () => {
    return email.includes("@") && password.length >= 7
      ? setLoginActive(true)
      : setLoginActive(false);
  };

  const loginMutation = useMutation(loginAxios, {
    onSuccess: (response) => {
      Swal.fire({
        icon: "success",
        title: "로그인 성공!",
        text: `[${response.nickName}]님 로그인되었습니다✨`,
        confirmButtonText: "확인",
      });
      console.log(response);
      dispatch(loginSuccess());
      dispatch(
        setUser({
          nickName: response.nickName,
          profileImg: response.profileImg,
          role: response.role,
          userId: response.userId,
        })
      );

      navigate("/main");
      resetEmail();
      resetPassword();
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "로그인 실패!",
        text: `아이디와 비밀번호를 다시 확인해주세요!`,
        confirmButtonText: "확인",
      });

      resetPassword();
    },
  });

  const loginButtonHandler = () => {
    loginMutation.mutate({ email, password });
  };
  useEffect(() => {
    loginActiveHandler();
  }, [email, password]);

  const kakaoLoginButtonHandler = () => {
    try {
      Swal.fire({
        title: "카카오 간편가입 주의",
        text: "카카오 로그인시 선택항목에도 🌟모두 동의🌟해주셔야 원활한 서비스 이용이 가능합니다!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#483767",
        cancelButtonColor: "#c4c4c4",
        confirmButtonText: "확인",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = KAKAO_AUTH_URL;
        }
      });
    } catch (error) {
      throw error;
    }
  };

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
            type={passwordType.type}
            name="password"
            value={password}
            onChange={onChangePasswordHandler}
            placeholder="비밀번호를 입력해주세요."
          />
          <span onClick={passwordTypeHandler}>
            {passwordType.visible ? (
              <AiOutlineEye />
            ) : (
              <AiOutlineEyeInvisible />
            )}
          </span>
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
        <KakaoLoginButton type="button" onClick={kakaoLoginButtonHandler}>
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
