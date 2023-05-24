import React, { useEffect, useRef, useState } from "react";
import "../css/CreateBoardModal.css";
import disableScroll from "./DisableScroll";
import enableScroll from "./EnableScroll";

const CreateBoard = (props) => {
  const { open, close } = props;
  const [file, setFile] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const modalRef = useRef(null);

  // 이미지 미리보기
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

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
    <div
      className={open ? "openModal create-board-modal" : "create-board-modal"}
    >
      {open ? (
        <section ref={modalRef}>
          <header>
            <p className="headerTitle">새 피드 만들기</p>
            <button className="saveButton">저장하기</button>
          </header>

          <div className="container">
            <main className="main-body">
              <div className="imgContainer">
                {!previewImage ? (
                  <label htmlFor="file" className="btn-upload">
                    파일 업로드하기
                    <input
                      type="file"
                      name="file"
                      id="file"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="preview-image"
                  />
                )}
              </div>
            </main>

            <div className="inputSection">
              <div className="profileBox">
                <img src="img/monkey_test.jpeg" className="profileImg" />
                <div>
                  <p>Photo</p>
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

export default CreateBoard;
