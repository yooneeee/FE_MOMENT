import React, { useState } from "react";
import { styled } from "styled-components";

function MyPageInformation() {
  const [pwIsVisible, setpwIsVisible] = useState(false);
  const [nickIsVisible, setnickIsVisible] = useState(false);

  /* 버튼 클릭시 히든 폼 */
  const nicknameHandler = () => {
    setnickIsVisible(!nickIsVisible);
  };
  const pwHandler = () => {
    setpwIsVisible(!pwIsVisible);
  };

  /* 취소 버튼 클릭시 되돌아가기 */
  const nickCancelHandler = () => {
    setnickIsVisible(false);
  };
  const pwcancelHandler = () => {
    setpwIsVisible(false);
  };

  return (
    <Container>
      <div>기본 회원정보</div>
      <Line />
      <Text>사진</Text>
      <Line1 />
      <Box>
        <Text>닉네임</Text>
        <Text2>
          {nickIsVisible ? (
            <HiddenForm>
              <HiddenInput type="text" />
              <ButtonColumn>
                <HiddenFormBtn onClick={nickCancelHandler}>취소</HiddenFormBtn>
                <HiddenFormBtn>완료</HiddenFormBtn>
              </ButtonColumn>
            </HiddenForm>
          ) : (
            <span>미뇽</span>
          )}
        </Text2>
        {nickIsVisible ? null : (
          <Button onClick={nicknameHandler}>닉네임 변경</Button>
        )}
      </Box>
      <Line1 />
      <Box>
        <Text>
          <span>비밀번호</span>
        </Text>
        <Text2>
          {pwIsVisible ? (
            <HiddenForm>
              <Column>
                <span>현재 비밀번호</span>
                <HiddenInput type="password" />
              </Column>
              <Column>
                <span>신규 비밀번호</span>
                <HiddenInput type="password" />
              </Column>
              <Column>
                <span>신규 비밀번호 재 입력</span>
                <HiddenInput type="password" />
              </Column>
              <ButtonColumn>
                <HiddenFormBtn onClick={pwcancelHandler}>취소</HiddenFormBtn>
                <HiddenFormBtn>완료</HiddenFormBtn>
              </ButtonColumn>
            </HiddenForm>
          ) : (
            <span>********</span>
          )}
        </Text2>
        {pwIsVisible ? null : (
          <Button onClick={pwHandler}>비밀번호 변경</Button>
        )}
      </Box>
      <Line1 />
    </Container>
  );
}

export default MyPageInformation;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 10px auto 0;
`;
const Box = styled.div`
  /* width: 100%;
  align-items: center; */
  /* display: grid; */
  /* grid-template-columns: 30% 55% 15%; */
  width: 100%;
  /* max-width: 800px; */
  margin: 10px auto 0;
`;
const HiddenForm = styled.div`
  padding: 10px;
`;
const Column = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const HiddenInput = styled.input`
  border: 1px solid #cacaca;
  padding: 5px 30px;
`;

const ButtonColumn = styled.div`
  width: 100%;
  max-width: 33%;
  display: flex;
  justify-content: space-between;
  /* margin: 0 auto 5px; */
  margin: 0 0 5px;
`;
const HiddenFormBtn = styled.button`
  padding: 8px 19px;
  border: none;
  background-color: #d1d1d1;
  margin-top: 10px;
`;
const Text = styled.div`
  float: left;
  width: 100%;
  max-width: 30%;
  background-color: #c0f10d;
  height: auto;
  padding: 15px 0;
  box-sizing: border-box;
  border-top: 1px solid #f1f1f1;
  border-bottom: none;
  font-size: 14px;
  text-align: left;
`;
const Text2 = styled.div`
  display: inline-block;
  width: 100%;
  max-width: 55%;
  background-color: #ffb773;
  height: auto;
  padding: 15px 0;
  box-sizing: border-box;
  border-top: 1px solid #f1f1f1;
  border-bottom: none;
  font-size: 14px;
  text-align: left;

  span {
    font-weight: 800;
    font-size: 15px;
  }
`;
const Button = styled.button`
  max-width: 15%;
  border: 1px #d1d1d1 solid;
  /* border-radius: 8px; */
  background-color: transparent;
  padding: 7px 5px;
  font-size: 14px;
`;
const Line = styled.div`
  border-top: 4px solid #000000;
  width: 100%;
  margin: 20px auto;
`;
const Line1 = styled.div`
  border-top: 1px solid #d6d6d6;
  width: 100%;
  margin: 10px auto;
`;
