import React, { useEffect, useRef, useState } from "react";
import "../css/FeedDetailModal.css";
import disableScroll from "./DisableScroll";
import enableScroll from "./EnableScroll";
import { feedDetailAxios } from "../apis/feed/feedDetailAxios";
import { useQuery, useQueryClient } from "react-query";
import { AiOutlineClose } from "react-icons/ai";
import { useMutation } from "react-query";
import heartAxios from "../apis/feed/heartAxios";
import HeartButton from "./HeartButton";
import { useNavigate } from "react-router-dom";

// 다른 화면 클릭 후 피드 페이지 클릭 시 화면 재 렌더링 되는 버그 있음

const FeedDetail = (props) => {
  const { open, close, photoId } = props;
  const modalRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 모달창 바깥을 눌렀을 때 모달 close
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      close();
    }
  };

  // 스크롤 방지
  useEffect(() => {
    disableScroll();
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      enableScroll();
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // 피드 데이터 받아오기
  const { isError, isLoading, data } = useQuery(
    ["feedDetailAxios", feedDetailAxios],
    () => feedDetailAxios(photoId)
  );

  // 좋아요 버튼
  const likeButtonMutation = useMutation(heartAxios, {
    onSuccess: () => {
      queryClient.invalidateQueries("feedDetailAxios");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const likeButtonHandler = () => {
    likeButtonMutation.mutate(photoId);
  };

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <h1>오류가 발생하였습니다...!</h1>;
  }

  return (
    <div className={open ? "openModal feed-datail-modal" : "feed-datail-modal"}>
      {open ? (
        <section ref={modalRef}>
          <header>
            <p className="headerTitle">피드</p>
            <button className="close" onClick={close}>
              <AiOutlineClose />
            </button>
          </header>
          <div className="container">
            <main className="main-body">
              <div className="imgContainer">
                <img src={data.photoUrl} className="feedDetailImg" />
              </div>
            </main>

            <div className="inputSection">
              <div className="profileContainer">
                <img
                  src={data.profileUrl}
                  className="profileImg"
                  onClick={() => {
                    navigate(`/page/${data.hostId}`);
                  }}
                />
                <div>
                  <p className="position">{data.role}</p>
                  <p>{data.nickName}</p>
                </div>

                <div className="loveButtonBox">
                  <HeartButton
                    like={data.checkLove}
                    onClick={likeButtonHandler}
                  />
                  <div>{data.photoLoveCnt}</div>
                </div>
              </div>

              <div className="contentArea">
                <p>{data.contents === "undefined" ? null : data.contents}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default FeedDetail;
