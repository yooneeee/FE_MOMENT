import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FeedDetail from "../components/FeedDetail";
import "../css/App.css";

function Feed() {
  const navigate = useNavigate();
  const [feedDetailOpen, setFeedDetailOpen] = useState(false);

  const openFeedDetail = () => {
    setFeedDetailOpen(true);
  };

  const closeFeedDetail = () => {
    setFeedDetailOpen(false);
  };

  return (
    <FeedContainer>
      <Cards>
        <CardsImg
          src="img/profile_1.jpeg"
          onClick={() => {
            openFeedDetail();
          }}
        />
        {feedDetailOpen && (
          <FeedDetail open={openFeedDetail} close={closeFeedDetail} />
        )}
      </Cards>
      <Cards>
        <CardsImg src="img/profile_2.jpeg" />
      </Cards>
      <Cards>
        <CardsImg src="img/profile_3.jpeg" />
      </Cards>
      <Cards>
        <CardsImg src="img/profile_4.jpeg" />
      </Cards>
      <Cards>
        <CardsImg src="img/profile_5.png" />
      </Cards>
      <Cards>
        <CardsImg src="img/profile_6.jpeg" />
      </Cards>
      <Cards>
        <CardsImg src="img/profile_7.jpeg" />
      </Cards>
      <Cards>
        <CardsImg src="img/profile_8.jpeg" />
      </Cards>
      <Cards>
        <CardsImg src="img/profile_9.jpg" />
      </Cards>
      <Cards>
        <CardsImg src="img/profile_10.jpeg" />
      </Cards>
      <Cards>
        <CardsImg src="img/profile_11.webp" />
      </Cards>
      <Cards>
        <CardsImg src="img/profile_12.jpeg" />
      </Cards>
      <Cards>
        <CardsImg src="img/profile_13.jpeg" />
      </Cards>
      <Cards>
        <CardsImg src="img/profile_14.jpeg" />
      </Cards>
      <Cards>
        <CardsImg src="img/profile_15.jpeg" />
      </Cards>
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
