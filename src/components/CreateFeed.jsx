import React, { useEffect, useRef, useState } from "react";
import "../css/CreateFeedModal.css";
import disableScroll from "./DisableScroll";
import enableScroll from "./EnableScroll";
import { useInput } from "../hooks/useInput";
import { createFeedAxios } from "../apis/feed/createFeed";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

const CreateFeed = (props) => {
  const { open, close } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [content, onChangeContentHandler] = useInput();
  const modalRef = useRef(null);
  const navigate = useNavigate();

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

  // 서버 통신
  const createFeedMutation = useMutation(createFeedAxios, {
    onSuccess: () => {
      alert("피드 생성이 완료됐습니다");
      close();
      navigate("/feeds");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // 저장하기 버튼 클릭
  const saveButtonHandler = () => {
    if (!selectedFile || !content) {
      alert("사진과 내용을 모두 입력해주세요");
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", selectedFile);
    formData.append("contents", content);

    createFeedMutation.mutate(formData);
  };

  return (
    <div className={open ? "openModal create-feed-modal" : "create-feed-modal"}>
      {open ? (
        <section ref={modalRef}>
          <header>
            <p className="headerTitle">새 피드 만들기</p>
            <button className="saveButton" onClick={saveButtonHandler}>
              저장하기
            </button>
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
                  <p className="position">Photo</p>
                  <p>Jun</p>
                </div>
              </div>
              <textarea
                className="contentInput"
                placeholder="문구 입력..."
                value={content}
                onChange={onChangeContentHandler}
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

export default CreateFeed;
