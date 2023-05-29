import React, { useEffect, useRef, useState } from "react";
import "../css/FeedDetailModal.css";
import disableScroll from "./DisableScroll";
import enableScroll from "./EnableScroll";
import { feedDetail } from "../apis/feed/feedDetail";
import { useQuery } from "react-query";

// 다른 화면 클릭 후 피드 페이지 클릭 시 화면 재 렌더링 되는 버그 있음

const FeedDetail = (props) => {
  const { open, close, photoId } = props;
  const [file, setFile] = useState("");
  const modalRef = useRef(null);

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

  // 서버 통신
  const { isError, isLoading, data } = useQuery(["feedDetail", photoId], () =>
    feedDetail(photoId)
  );

  if (isLoading) {
    return;
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
          </header>

          <div className="container">
            <main className="main-body">
              <div className="imgContainer">
                <img src={data.photoUrl} className="feedDetailImg" />
              </div>
            </main>

            <div className="inputSection">
              <div className="profileBox">
                <img src="img/monkey_test.jpeg" className="profileImg" />
                <div>
                  <p className="position">Photo</p>
                  <p>Jun</p>
                </div>
              </div>

              <div className="contentArea">
                <p>{data.contents}</p>
              </div>
            </div>
          </div>

          <button className="close" onClick={close}>
            X
          </button>
        </section>
      ) : null}
    </div>
  );
};

export default FeedDetail;
