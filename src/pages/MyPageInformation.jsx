import React, { useState } from "react";
import { styled } from "styled-components";

function MyPageInformation() {
  const [isVisible, setIsVisible] = useState(false);

  const pwHandler = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Container>
      <div>기본 회원정보</div>
      <Line />
      <Text>사진</Text>
      <Line1 />
      <Box>
        <Text>닉네임</Text>
        <Text2>미뇽</Text2>
        <button>닉네임 변경</button>
      </Box>
      <Line1 />
      <Box>
        <Text>
          <span>비밀번호</span>
        </Text>
        <Text2>
          {isVisible ? (
            <>
              <div>
                <span>현재 비밀번호</span>
                <input type="password" />
              </div>
              <div>
                <span>신규 비밀번호</span>
                <input type="password" />
              </div>
              <div>
                <span>신규 비밀번호 재 입력</span>
                <input type="password" />
              </div>
            </>
          ) : (
            <span>********</span>
          )}
        </Text2>
        <Button onClick={pwHandler}>비밀번호 변경</Button>
        {/* {isVisible && <div>보여지나</div>} */}
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
const Text = styled.div`
  /* float: left;
  max-width: 30%;
  background-color: #c0f10d; */
  height: auto;
  padding: 15px 0;
  box-sizing: border-box;
  border-top: 1px solid #f1f1f1;
  border-bottom: none;
  font-size: 14px;
  text-align: left;
`;
const Text2 = styled.div`
  /* display: inline-block; */
  /* max-width: 55%;
  background-color: #ffb773; */
  height: auto;
  padding: 15px 0;
  box-sizing: border-box;
  border-top: 1px solid #f1f1f1;
  border-bottom: none;
  font-size: 14px;
  text-align: left;

  span {
    font-weight: 900;
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
  margin: 20px auto;
`;
