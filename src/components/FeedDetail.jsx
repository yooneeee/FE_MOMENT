import React, { useEffect, useRef, useState } from "react";
import "../css/FeedDetailModal.css";
import disableScroll from "./DisableScroll";
import enableScroll from "./EnableScroll";

const FeedDetail = (props) => {
  const { open, close } = props;
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

  return (
    <div className={open ? "openModal feed-datail-modal" : "feed-datail-modal"}>
      {open ? (
        <section ref={modalRef}>
          <header>
            <p className="headerTitle">피드</p>
            <button className="saveButton">저장하기</button>
          </header>

          <div className="container">
            <main className="main-body">
              <div className="imgContainer">
                <img src="img/profile_12.jpeg" className="feedDetailImg" />
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
              <textarea
                className="contentInput"
                placeholder="문구 입력..."
              ></textarea>
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
