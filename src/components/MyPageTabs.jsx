import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";

function MyPageTabs() {
  const { hostId } = useParams();
  // console.log("첫번째", hostId);

  const navigate = useNavigate();
  const [entireClicked, setEntireClicked] = useState(true);
  const [feedClicked, setFeedClicked] = useState();
  const [boardClicked, setBoardClicked] = useState();
  const [chatClicked, setChatClicked] = useState();

  const underlineButton = (buttonName) => {
    switch (buttonName) {
      case "entire":
        setEntireClicked(true);
        setFeedClicked(false);
        setBoardClicked(false);
        setChatClicked(false);
        break;
      case "feed":
        setEntireClicked(false);
        setFeedClicked(true);
        setBoardClicked(false);
        setChatClicked(false);
        break;
      case "board":
        setEntireClicked(false);
        setFeedClicked(false);
        setBoardClicked(true);
        setChatClicked(false);
        break;
      case "chat":
        setEntireClicked(false);
        setFeedClicked(false);
        setBoardClicked(false);
        setChatClicked(true);
        break;
      default:
        break;
    }
  };

  const entireHandler = () => {
    underlineButton("entire");
    navigate(`/page/${hostId}`);
  };
  const feedHandler = () => {
    underlineButton("feed");
    navigate(`/mypagefeed/${hostId}`);
  };
  const boardHandler = () => {
    underlineButton("board");
    navigate(`/mypageboard/${hostId}`);
  };
  const chatHandler = () => {
    underlineButton("chat");
  };

  return (
    <TabsStyles>
      <MaueBar>
        <TabButton isClicked={entireClicked} onClick={entireHandler}>
          전체보기
        </TabButton>
        <TabButton
          isClicked={feedClicked}
          isFeedClicked={feedClicked}
          onClick={feedHandler}
        >
          내 피드
        </TabButton>
        <TabButton isClicked={boardClicked} onClick={boardHandler}>
          내 게시글
        </TabButton>
        <TabButton isClicked={chatClicked} onClick={chatHandler}>
          채팅목록
        </TabButton>
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
  flex: 1;
  max-width: 100px;
  padding: 11px;
  border: none;
  outline: none;
  background: none;
  text-decoration: none;
  /* border-bottom: ${(props) =>
    props.isClicked ? "2px solid black" : "none"}; */
  font-weight: ${(props) =>
    props.isClicked || props.isFeedClicked ? "900" : "none"};
  color: ${(props) =>
    props.isClicked || props.isFeedClicked ? "#ff0000" : "none"};
  /* text-decoration: ${(props) => (props.isClicked ? "underline" : "none")}; */
`;
