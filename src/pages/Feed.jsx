import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "../css/App.css";
import { getFeedAxios } from "../apis/feed/getFeedAxios";
import { useInfiniteQuery } from "react-query";
import { useRef } from "react";
import { useObserver } from "../components/useObserver";
import LoadingSpinner from "../components/LoadingSpinner";
import FeedCard from "../components/FeedCard";
import FeedDetail from "../components/FeedDetail";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
/* import { useInView } from "react-intersection-observer"; */

function Feed() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  // 모달 제어
  const [feedDetailOpen, setFeedDetailOpen] = useState([]);

  const openFeedDetail = (photoId) => {
    if (isLoggedIn) {
      setFeedDetailOpen((prevOpen) => [...prevOpen, photoId]);
    } else {
      Swal.fire({
        icon: "warning",
        title: "회원 전용 서비스!",
        text: `로그인이 필요한 서비스입니다🙏`,
        confirmButtonText: "확인",
      });
    }
  };

  const closeFeedDetail = (photoId) => {
    setFeedDetailOpen((prevOpen) => prevOpen.filter((id) => id !== photoId));
  };

  const { isLoading, isError, data, fetchNextPage } = useInfiniteQuery(
    "getFeedAxios",
    getFeedAxios,
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage == lastPage.totalPages) {
          return;
        } else {
          return lastPage.currentPage + 1;
        }
      },
    }
  );

  // intersect
  const onIntersect = ([entry]) => {
    entry.isIntersecting && fetchNextPage();
  };

  // 화면의 바닥 ref를 위한 useRef
  const bottom = useRef();

  // 초기 렌더링 시 bottom이 null 값이 잡힘
  useEffect(() => {
    console.log(bottom.current);
  }, [bottom]);

  // const { ref, inView, entry } = useInView();

  // useEffect(() => {
  //   if (ref && data?.hasMorePages) fetchNextPage();
  // }, [ref]);

  useObserver({
    target: bottom,
    onIntersect,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>오류가 발생하였습니다...!</h1>;
  }

  console.log(data);

  return (
    <>
      <FeedContainer>
        {data.pages
          .flatMap((page) => page.photoList)
          .map((item) => {
            const isOpen = feedDetailOpen.includes(item.photoId);
            return (
              <>
                <FeedCard
                  key={item.photoId}
                  data={item}
                  onClick={() => {
                    openFeedDetail(item.photoId);
                  }}
                />
                {isOpen && (
                  <FeedDetail
                    open={() => openFeedDetail(item.photoId)}
                    close={() => closeFeedDetail(item.photoId)}
                    photoId={item.photoId}
                  />
                )}
              </>
            );
          })}
        <div ref={bottom}></div>
      </FeedContainer>
    </>
  );
}

export default Feed;
const FeedContainer = styled.div`
  padding: 20px 10px 20px 10px;
  margin: auto 100px;
  display: flex;
  flex-wrap: wrap;
  gap: 60px;
  /* background-color: green; */
`;

const Cards = styled.div`
  width: 24%;
  background: black;
  margin: 5px;
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

//////////////////////////////////////
