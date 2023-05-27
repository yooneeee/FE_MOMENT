import React, { useCallback, useEffect, useMemo, useState } from "react";
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

  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(false);
  const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] =
    useState(false);
  const [signupActive, setSignupActive] = useState(false);
  // 이미지 state
  const [profileImg, setProfileImg] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);

  // 이메일 인증 번호 state
  const [code, setCode] = useState("");
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [isemailChecking, setIsEmailChecking] = useState(false);

  const signupMutation = useMutation(signupAxios, {
    onSuccess: () => {
      alert("회원가입이 완료되었습니다✨");
      setNickName("");
      setEmail("");
      setGender("");
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
      alert("회원님의 이메일로 인증번호를 전송을 실패했습니다!");
    },
  });
  const checkEmailMutation = useMutation(checkEmailAxios, {
    onSuccess: () => {
      setIsEmailChecking(true);
      alert("이메일 인증에 성공하셨습니다!");
    },
    onError: () => {
      setIsEmailChecking(false);
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
    setGender(selectedSex);
  }, []);
  const roleButtonClickHandler = useCallback((selectedRole) => {
    setRole(selectedRole);
  }, []);

  // 프로필사진 업로드
  const addPhoto = (e) => {
    e.preventDefault();
    setProfileImg(e.target.files[0]);

    // 미리보기
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = () => {
      const previewImgUrl = reader.result;
      setImgUrl(previewImgUrl);
    };
  };

  const MemoizedSelectionButton = React.memo(SelectionButton);
  // password 확인
  function validatePasswordCheck(password, passwordCheck) {
    return password === passwordCheck;
  }
  const signupActiveHandler = () => {
    if (!email || !password || !nickName || !gender) {
      setSignupActive(false);
    } else {
      setSignupActive(true);
    }
  };
  // 이메일 서버에 전송
  const emailSendButtonHandler = () => {
    sendEmailMutation.mutate({ email });
  };

  // 이메일 인증번호 확인
  const emailVerifyNumCheckHandler = () => {
    if (!code) {
      alert("인증번호를 입력해주세요!");
    } else {
      checkEmailMutation.mutate({ email, code });
    }
  };

  // 회원가입버튼 클릭
  const signupButtonHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile", profileImg);

    const signup = {
      nickName,
      gender,
      role,
      password,
      email,
    };
    formData.append(
      "signup",
      new Blob([JSON.stringify(signup)], { type: "application/json" })
    );

    if (signupActive) {
      if (!isemailChecking) {
        alert("이메일 인증을 완료해주세요!");
        return;
      }
      signupMutation.mutate(formData);
    } else {
      alert("회원정보를 모두 입력해주세요!");
    }
  };
  useEffect(() => {
    signupActiveHandler();
  }, [nickName, email, gender, role, password]);
  return (
    <Container>
      <CenteredContent>
        <TitleLogo>
          <Title>Moment</Title>
        </TitleLogo>
        <StImageUpload>
          <InputTitle>프로필 사진을 선택해 주세요.</InputTitle>
          <StProfile image={imgUrl}>IMAGE</StProfile>
          <input
            type="file"
            id="fileUpload"
            name="profileImg"
            onChange={addPhoto}
          ></input>
        </StImageUpload>
        <InputTitle>닉네임</InputTitle>
        <InputWrap>
          <Input
            type="text"
            name="nickname"
            value={nickName || ""}
            placeholder="닉네임을 입력해주세요."
            onChange={(e) => setNickName(e.target.value)}
          />
        </InputWrap>
        <InputTitle>직업</InputTitle>
        <ButtonContainer>
          <MemoizedSelectionButton
            onClick={() => roleButtonClickHandler("MODEL")}
            style={{
              backgroundColor: role === "MODEL" ? "#000000" : "#ffffff",
              color: role === "MODEL" ? "#ffffff" : "#000000",
            }}
          >
            모델
          </MemoizedSelectionButton>
          <MemoizedSelectionButton
            onClick={() => roleButtonClickHandler("PHOTOGRAPHER")}
            style={{
              backgroundColor: role === "PHOTOGRAPHER" ? "#000000" : "#ffffff",
              color: role === "PHOTOGRAPHER" ? "#ffffff" : "#000000",
            }}
          >
            작가
          </MemoizedSelectionButton>
        </ButtonContainer>
        <InputTitle>성별</InputTitle>
        <ButtonContainer>
          <MemoizedSelectionButton
            onClick={() => sexButtonClickHandler("MALE")}
            style={{
              backgroundColor: gender === "MALE" ? "#000000" : "#ffffff",
              color: gender === "MALE" ? "#ffffff" : "#000000",
            }}
          >
            남자
          </MemoizedSelectionButton>
          <MemoizedSelectionButton
            onClick={() => sexButtonClickHandler("FEMALE")}
            style={{
              backgroundColor: gender === "FEMALE" ? "#000000" : "#ffffff",
              color: gender === "FEMALE" ? "#ffffff" : "#000000",
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
          <MailCheckButton type="button" onClick={emailSendButtonHandler}>
            {isemailChecking ? "인증완료" : "인증번호 전송"}
          </MailCheckButton>
        </InputGroup>
        {/*         {emailErrorMessage && <ErrorMessage>{emailError}</ErrorMessage>}
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
          <MailCheckButton type="button" onClick={emailVerifyNumCheckHandler}>
            {isemailChecking ? "인증완료" : "확인"}
          </MailCheckButton>
        </InputGroup> */}
        {/* 이메일 인증번호 입력란 => 이메일을 서버에 성공적으로 보내면 인증번호 입력란이 나게 */}
        {isSendEmail && !isemailChecking && (
          <>
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
              <MailCheckButton
                type="button"
                onClick={emailVerifyNumCheckHandler}
              >
                {isemailChecking ? "인증완료" : "확인"}
              </MailCheckButton>
            </InputGroup>
          </>
        )}
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
            type="button"
            onClick={signupButtonHandler}
            bgcolor={signupActive ? "black" : "lightgrey"}
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
  justify-content: center;
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
  background-color: ${(props) => props.bgcolor || "black"};
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
export const StImageUpload = styled.div`
  padding: 5%;
  margin-bottom: 3%;
  border: 1px solid #ccc;
  border-radius: 10px;

  input {
    padding-top: 3%;
  }
`;
export const StProfile = styled.div`
  width: 200px;
  line-height: 200px;
  font-size: 0.7rem;
  text-align: center;
  color: #ccc;
  margin: 10px auto;
  border: 1px solid #ccc;
  border-radius: 50%;
  background: ${(props) => `url(${props.image}) no-repeat 50% /cover`};
`;
