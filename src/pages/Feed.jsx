import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "../css/App.css";
import { getFeedAxios } from "../apis/feed/getFeedAxios";
import { useInfiniteQuery } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import FeedCard from "../components/FeedCard";
import FeedDetail from "../components/FeedDetail";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useInView } from "react-intersection-observer";
import ScrollToTopButton from "../components/ScrollToTopButton";

function Feed() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  // 모달 제어
  const [feedDetailOpen, setFeedDetailOpen] = useState([]);
  const [showButton, setShowButton] = useState(false);

  const ShowButtonClick = () => {
    const { scrollY } = window;
    scrollY > 200 ? setShowButton(true) : setShowButton(false);
  };
  useEffect(() => {
    window.addEventListener("scroll", ShowButtonClick);
    return () => {
      window.removeEventListener("scroll", ShowButtonClick);
    };
  }, []);

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

  // 무한 스크롤
  const { isLoading, isError, data, fetchNextPage } = useInfiniteQuery(
    "getFeedAxios",
    getFeedAxios,
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage === lastPage.totalPages) {
          return;
        } else {
          return lastPage.currentPage + 1;
        }
      },
    }
  );

  const [bottomObserverRef, bottomInView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (bottomInView) {
      fetchNextPage();
    }
  }, [bottomInView, fetchNextPage]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h3>에러가 발생하였습니다.</h3>;
  }

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
        <div ref={bottomObserverRef}></div>
      </FeedContainer>
      {showButton && <ScrollToTopButton />}
    </>
  );
}

export default Feed;

const FeedContainer = styled.div`
  padding: 30px 0 30px 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px;
  margin: auto 100px;
  @media (max-width: 1300px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    gridtemplate-columns: repeat(1, 1fr);
  }
`;
