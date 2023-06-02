import React, { useState } from "react";
import styled from "styled-components";

function MyPageTabs() {
  const [isButtonClicked, setIsButtonClicked] = useState();

  const underlineButton = () => {
    // 이전 상태 값을 가져와서 반전시키는 업데이트
    setIsButtonClicked((prevState) => !prevState);
  };
  return (
    <TabsStyles>
      <MaueBar>
        <TabButton isClicked={isButtonClicked} onClick={underlineButton}>
          전체보기
        </TabButton>
        <TabButton>내 피드</TabButton>
        <TabButton>게시글</TabButton>
        <TabButton>채팅</TabButton>
      </MaueBar>
    </TabsStyles>
  );
}

export default MyPageTabs;

const TabsStyles = styled.div`
  width: 100%;
  background: #f5f5f5;
  border: 1px solid #666666;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 19%;
  font-weight: 600;
  top: 0;
  left: 0;
  top: 0;
  left: 0;
`;
const MaueBar = styled.div`
  display: flex;
  width: 100%;
  /* max-width: 800px; */
`;
const TabButton = styled.button`
  margin-right: 15px;
  padding: 11px;
  border: none;
  outline: none;
  background: none;
  text-decoration: none;
  border-bottom: ${(props) => (props.isClicked ? "1px solid black" : "none")};
`;
