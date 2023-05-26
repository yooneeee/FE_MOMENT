import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Container, TitleLogo, Title } from "../styles/ContainerStyles";
import { InputWrap, Input, InputTitle } from "../styles/InputStyles";
import { useMutation } from "react-query";
import {
  checkEmailAxios,
  sendEmailAxios,
  signupAxios,
} from "../apis/auth/signup";

function EmailSignup() {
  const navigate = useNavigate();
  const backButtonHandler = () => {
    navigate("/main");
  };

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(false);
  const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] =
    useState(false);

  const [signupActive, setSignupActive] = useState(false);

  // 이메일 인증 번호 state
  const [code, setCode] = useState("");
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);

  const signupMutation = useMutation(signupAxios, {
    onSuccess: () => {
      alert("회원가입이 완료되었습니다✨");
      setNickname("");
      setEmail("");
      setSex("");
      setRole("");
      setPassword("");
      setPasswordCheck("");
      navigate("/login");
    },
  });
  const sendEmailMutation = useMutation(sendEmailAxios, {
    onSuccess: () => {
      setIsSendEmail(true);
      alert("회원님의 이메일로 인증번호를 전송했습니다!");
    },
    onError: () => {
      setIsSendEmail(false);
    },
  });
  const checkEmailMutation = useMutation(checkEmailAxios, {
    onSuccess: () => {
      setEmailChecking(true);
      alert("이메일 인증에 성공하셨습니다!");
    },
    onError: () => {
      setEmailChecking(false);
      alert("인증번호를 다시 확인해보세요!");
    },
  });
  // 이메일, 패스워드 정규식
  const emailRegex =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;

  // 이메일 에러 메세지
  const emailError = useMemo(() => {
    if (email && !emailRegex.test(email)) {
      setEmailErrorMessage(true);
      return "이메일의 형식이 올바르지 않습니다.";
    } else {
      return "";
    }
  }, [email]);
  // 패스워드 에러 메세지
  const passwordError = useMemo(() => {
    if (password && !passwordRegex.test(password)) {
      setPasswordErrorMessage(true);
      return "비밀번호는 8~20자의 영문, 숫자 포함 8자리 이상입니다.";
    } else {
      return "";
    }
  }, [password]);
  // 패스워드체크 에러 메세지
  const passwordCheckError = useMemo(() => {
    if (!validatePasswordCheck(password, passwordCheck)) {
      setPasswordCheckErrorMessage(true);
      return "입력하신 비밀번호가 일치하지 않습니다.";
    } else {
      return "";
    }
  }, [passwordCheck]);

  // 성별, 직업 버튼 클릭 핸들러
  const sexButtonClickHandler = useCallback((selectedSex) => {
    setSex(selectedSex);
  }, []);
  const roleButtonClickHandler = useCallback((selectedRole) => {
    setRole(selectedRole);
  }, []);

  const MemoizedSelectionButton = React.memo(SelectionButton);
  // password 확인
  function validatePasswordCheck(password, passwordCheck) {
    return password === passwordCheck;
  }
  const signupActiveHandler = () => {
    return !nickname || !email || !password || !passwordCheck || !sex || !role
      ? setSignupActive(false)
      : setSignupActive(true);
  };

  // 이메일 서버에 전송
  const emailSendButtonHandler = () => {
    sendEmailMutation.mutate(email);
  };

  // 이메일 인증번호 확인
  const emailVerifyNumCheckHandler = () => {
    if (!code) {
      alert("인증번호를 입력해주세요!");
    }
    checkEmailMutation.mutate({ email, code });
  };

  // 회원가입버튼 클릭
  const signupButtonHandler = (e) => {
    e.preventDefault();

    /*     if (nickname.length === 0) {
      alert("닉네임을 입력해주세요");
    } else if (email.length === 0) {
      alert("이메일을 입력해주세요");
    } else if (password.length === 0) {
      alert("비밀번호를 입력해주세요");
    } else if (sex.length === 0) {
      alert("성별을 선택해주세요");
    } else if (role.length === 0) {
      alert("직업을 선택해주세요");
    } */

    const newUser = {
      nickname,
      sex,
      role,
      password,
      email,
    };

    console.log("새로운 회원 정보 => ", newUser);
    signupMutation.mutate(newUser);
  };

  return (
    <Container>
      <CenteredContent onSubmit={signupButtonHandler}>
        <TitleLogo>
          <Title>Moment</Title>
        </TitleLogo>
        <InputTitle>닉네임</InputTitle>
        <InputWrap>
          <Input
            type="text"
            name="nickname"
            value={nickname || ""}
            placeholder="닉네임을 입력해주세요."
            onChange={(e) => setNickname(e.target.value)}
          />
        </InputWrap>
        <InputTitle>직업</InputTitle>
        <ButtonContainer>
          <MemoizedSelectionButton
            onClick={() => roleButtonClickHandler("model")}
            style={{
              backgroundColor: role === "model" ? "#000000" : "#ffffff",
              color: role === "model" ? "#ffffff" : "#000000",
            }}
          >
            모델
          </MemoizedSelectionButton>
          <MemoizedSelectionButton
            onClick={() => roleButtonClickHandler("photographer")}
            style={{
              backgroundColor: role === "photographer" ? "#000000" : "#ffffff",
              color: role === "photographer" ? "#ffffff" : "#000000",
            }}
          >
            작가
          </MemoizedSelectionButton>
        </ButtonContainer>
        <InputTitle>성별</InputTitle>
        <ButtonContainer>
          <MemoizedSelectionButton
            onClick={() => sexButtonClickHandler("male")}
            style={{
              backgroundColor: sex === "male" ? "#000000" : "#ffffff",
              color: sex === "male" ? "#ffffff" : "#000000",
            }}
          >
            남자
          </MemoizedSelectionButton>
          <MemoizedSelectionButton
            onClick={() => sexButtonClickHandler("female")}
            style={{
              backgroundColor: sex === "female" ? "#000000" : "#ffffff",
              color: sex === "female" ? "#ffffff" : "#000000",
            }}
          >
            여자
          </MemoizedSelectionButton>
        </ButtonContainer>
        <InputTitle>이메일</InputTitle>
        <InputGroup>
          <InputWrap>
            <Input
              type="text"
              name="email"
              value={email || ""}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="이메일 주소를 입력해주세요"
            />
          </InputWrap>
          <MailCheckButton onClick={emailSendButtonHandler}>
            인증번호 전송
          </MailCheckButton>
        </InputGroup>
        {emailErrorMessage && <ErrorMessage>{emailError}</ErrorMessage>}
        <InputTitle>인증번호</InputTitle>
        <InputGroup>
          <InputWrap>
            <Input
              type="text"
              name="code"
              value={code || ""}
              onChange={(e) => {
                setCode(e.target.value);
              }}
              placeholder="인증번호를 입력해주세요"
            />
          </InputWrap>
          <MailCheckButton onClick={emailVerifyNumCheckHandler}>
            {emailChecking ? "인증완료" : "확인"}
          </MailCheckButton>
        </InputGroup>
        {/* 이메일 인증번호 입력란 => 이메일을 서버에 성공적으로 보내면 인증번호 입력란이 나게 */}
        {/*  {isSendEmail && !emailChecking && (
          <>
            <InputTitle>인증번호</InputTitle>
            <InputGroup>
              <InputWrap>
                <Input
                  type="number"
                  name="code"
                  value={code || ""}
                  onChange={(e) => {
                    setCode(e.target.value);
                  }}
                  placeholder="인증번호를 입력해주세요"
                />
              </InputWrap>
              <MailCheckButton onClick={emailVerifyNumCheckHandler}>
                확인
              </MailCheckButton>
            </InputGroup>
          </>
        )} */}
        <InputTitle>비밀번호</InputTitle>
        <InputWrap>
          <Input
            type="password"
            name="password"
            value={password}
            placeholder="비밀번호를 입력해주세요"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </InputWrap>
        {passwordErrorMessage && <ErrorMessage>{passwordError}</ErrorMessage>}
        <InputTitle>비밀번호 확인</InputTitle>
        <InputWrap>
          <Input
            type="password"
            placeholder="비밀번호를 다시 입력해주세요."
            value={passwordCheck}
            onChange={(e) => {
              setPasswordCheck(e.target.value);
            }}
          />
        </InputWrap>
        {passwordCheckErrorMessage && (
          <ErrorMessage>{passwordCheckError}</ErrorMessage>
        )}
        <BottomButtonWrap>
          <BottomButton
            type="submit"
            onClick={signupButtonHandler}
            /*  disabled={signupActive} */
          >
            회원 가입 완료
          </BottomButton>
          <BottomButton onClick={backButtonHandler}>취소</BottomButton>
        </BottomButtonWrap>
      </CenteredContent>
    </Container>
  );
}

export default EmailSignup;

const CenteredContent = styled.form`
  flex: 1 0 auto;
  margin: 0px auto;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 40px 0px;
`;

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
const InputGroup = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
/* 메일 확인, 인증 버튼 */
const MailCheckButton = styled.button`
  margin: 0 10px;
  width: 16%;
  height: 48px;
  border: none;
  font-weight: 700;
  background-color: #000000;
  border-radius: 64px;
  color: white;
  cursor: pointer;

  /* 요소가 비활성화 상태일 때 */
  &:disabled {
    background-color: #dadada;
    color: white;
  }
`;

/* 회원가입, 취소 버튼 */
const BottomButton = styled.button`
  width: 35%;
  height: 48px;
  border: none;
  font-weight: 700;
  background-color: #000000;
  border-radius: 64px;
  color: white;
  margin-bottom: 16px;
  cursor: pointer;

  /* 요소가 비활성화 상태일 때 */
  &:disabled {
    background-color: #dadada;
    color: white;
  }
`;
const BottomButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  justify-content: space-evenly;
  margin: 80px 40px;
`;
const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  flex-wrap: warp;
`;
