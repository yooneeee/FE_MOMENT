import React, { useEffect, useRef, useState } from "react";
import "../css/CreateFeedModal.css";
import disableScroll from "./DisableScroll";
import enableScroll from "./EnableScroll";

const CreateFeed = (props) => {
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
    <div className={open ? "openModal create-feed-modal" : "create-feed-modal"}>
      {open ? (
        <section ref={modalRef}>
          <header>
            <p className="headerTitle">새 피드 만들기</p>
            <button className="saveButton">저장하기</button>
          </header>
          <main className="main-body">
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
              <img src={previewImage} alt="Preview" className="preview-image" />
            )}
          </main>
          {/* <div>인풋구역입니다</div> */}
          <button className="close" onClick={close}>
            X
          </button>
        </section>
      ) : null}
    </div>
  );
};

export default CreateFeed;
