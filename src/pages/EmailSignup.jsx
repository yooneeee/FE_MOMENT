import React, { useCallback, useMemo, useState } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Container, TitleLogo, Title } from "../styles/ContainerStyles";
import { InputWrap, Input, InputTitle } from "../styles/InputStyles";

function EmailSignup() {
  const navigate = useNavigate();
  const backButtonHandler = () => {
    navigate("/main");
  };

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sex, setSex] = useState("");
  const [role, setRole] = useState("");

  // 성별 버튼 클릭 핸들러
  const sexButtonClickHandler = useCallback((selectedSex) => {
    setSex(selectedSex);
  }, []);

  // 직업 버튼 클릭 핸들러
  const roleButtonClickHandler = useCallback((selectedRole) => {
    setRole(selectedRole);
  }, []);
  const MemoizedSelectionButton = React.memo(SelectionButton);

  const signupButtonHandler = (e) => {
    e.preventDefault();
  };

  /* 
  // 정규식
  const emailRegex =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;
  
  // 이메일 에러 메세지
  const emailMessage = useMemo(() => {
    if (email && !emailRegex.test(email)) {
      return "이메일을 확인해 주세요";
    } else {
      return "";
    }
  }, [email]);

  // 패스워드 에러메세지
  const passwordMessage = useMemo(() => {
    if (password && !passwordRegex.test(password)) {
      return "비밀번호는 영문, 숫자 포함 8자리 이상입니다.";
    } else {
      return "";
    }
  }, [password]); */

  return (
    <Container>
      <CenteredContent>
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
          {console.log(nickname, role)}
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
        <InputTitle>비밀번호 확인</InputTitle>
        <InputWrap>
          <Input type="password" placeholder="비밀번호를 확인해주세요." />
        </InputWrap>
        <InputTitle>휴대폰 인증</InputTitle>
        <BottomButtonWrap>
          <BottomButton type="submit" onClick={signupButtonHandler}>
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
  max-width: 500px;
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
