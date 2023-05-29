import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FeedDetail from "../components/FeedDetail";
import "../css/App.css";
import { useQuery } from "react-query";
import { getFeed } from "../apis/ feed/getFeed";

function Feed() {
  const navigate = useNavigate();
  const [feedDetailOpen, setFeedDetailOpen] = useState(false);

  const openFeedDetail = () => {
    setFeedDetailOpen(true);
  };

  const closeFeedDetail = () => {
    setFeedDetailOpen(false);
  };

  // 서버 통신
  const { isLoading, isError, data } = useQuery("getFeed", getFeed);

  if (isLoading) {
    return <h1>로딩 중입니다..!</h1>;
  }

  if (isError) {
    return <h1>{isError}</h1>;
  }

  return (
    <FeedContainer>
      {data.map((item) => {
        return (
          <Cards key={item.photoId}>
            <CardsImg
              src={item.photoUrl}
              onClick={() => {
                openFeedDetail();
              }}
            />
          </Cards>
        );
      })}
      {feedDetailOpen && (
        <FeedDetail open={openFeedDetail} close={closeFeedDetail} />
      )}
    </FeedContainer>
  );
}

export default Feed;

const FeedContainer = styled.div`
  width: 70%;
  background: #eee;
  margin: auto;
  height: auto;
  display: flex;
  flex-wrap: wrap;
`;

const Cards = styled.div`
  width: 33.3%;
  background: black;
`;

const CardsImg = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;
