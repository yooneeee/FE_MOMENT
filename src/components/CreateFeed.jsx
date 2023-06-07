import React, { useEffect, useRef, useState } from "react";
import "../css/CreateFeedModal.css";
import disableScroll from "./DisableScroll";
import enableScroll from "./EnableScroll";
import { useInput } from "../hooks/useInput";
import { createFeedAxios } from "../apis/feed/createFeedAxios";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import UserDataComponent from "./UserDataComponent";
import styled from "styled-components";

const CreateFeed = (props) => {
  // 해시태그 기능
  const [inputHashTag, setInputHashTag] = useState("");
  const [hashTags, setHashTags] = useState([]);

  const isEmptyValue = (value) => {
    if (!value.length) {
      return true;
    }
    return false;
  };

  const addHashTag = (e) => {
    const allowedCommand = ["Comma", "Enter", "Space", "NumpadEnter"];
    if (!allowedCommand.includes(e.code)) return;

    if (isEmptyValue(e.target.value.trim())) {
      return setInputHashTag("");
    }

    let newHashTag = e.target.value.trim();
    const regExp = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
    if (regExp.test(newHashTag)) {
      newHashTag = newHashTag.replace(regExp, "");
    }
    if (newHashTag.includes(",")) {
      newHashTag = newHashTag.split(",").join("");
    }

    if (isEmptyValue(newHashTag)) return;

    if (hashTags.length >= 3) return;

    if (!newHashTag.startsWith("#")) {
      newHashTag = `#${newHashTag}`;
    }

    setHashTags((prevHashTags) => {
      return [...new Set([...prevHashTags, newHashTag])];
    });

    setInputHashTag("");
  };

  const removeHashTag = (tag) => {
    setHashTags((prevHashTags) =>
      prevHashTags.filter((hashTag) => hashTag !== tag)
    );
  };

  const keyDownHandler = (e) => {
    if (e.code !== "Enter" && e.code !== "NumpadEnter") return;
    e.preventDefault();

    const regExp = /^[a-z|A-Z|가-힣|ㄱ-ㅎ|ㅏ-ㅣ|0-9| \t|]+$/g;
    if (!regExp.test(e.target.value)) {
      setInputHashTag("");
    }
  };

  const changeHashTagInput = (e) => {
    setInputHashTag(e.target.value);
  };
  ///////////////////////////////////////////////////////
  const { open, close } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [content, onChangeContentHandler] = useInput();
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const loginUserData = UserDataComponent(); // 나의 유저 데이터 받아오는 코드

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
    if (!selectedFile || !content || hashTags == []) {
      alert("모든 내용을 입력해주세요!");
      return;
    }

    const formData = new FormData();
    formData.append(
      "contents",
      new Blob([JSON.stringify(content)], { type: "application/json" })
    );
    formData.append(
      "photoHashTag",
      new Blob([JSON.stringify(hashTags)], { type: "application/json" })
    );
    formData.append(
      "imageFile",
      new Blob([JSON.stringify(selectedFile)], { type: "application/json" })
    );

    createFeedMutation.mutate(formData);
  };

  return (
    <div className={open ? "openModal create-feed-modal" : "create-feed-modal"}>
      {open ? (
        <section ref={modalRef}>
          <div className="header">
            <div className="headerTitle">새 피드 만들기</div>
            <div className="headerRightBox">
              <button className="saveButton" onClick={saveButtonHandler}>
                저장하기
              </button>
              <button className="close" onClick={close}>
                <AiOutlineClose />
              </button>
            </div>
          </div>

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
                <img src={loginUserData.profileImg} className="profileImg" />
                <div>
                  <p className="position">{loginUserData.role}</p>
                  <p>{loginUserData.nickName}</p>
                </div>
              </div>
              <textarea
                className="contentInput"
                placeholder="문구 입력..."
                value={content}
                onChange={onChangeContentHandler}
              ></textarea>

              <HashTageContainer>
                <HashTagInputTitle>해시태그</HashTagInputTitle>
                <HashTag>
                  {hashTags.map((hashTag) => (
                    <Tag key={hashTag} onClick={() => removeHashTag(hashTag)}>
                      {hashTag}
                    </Tag>
                  ))}

                  <HashTagInput
                    value={inputHashTag}
                    onChange={changeHashTagInput}
                    onKeyUp={addHashTag}
                    onKeyDown={keyDownHandler}
                    placeholder="#해시태그를 등록해보세요. (최대 3개)"
                    className="hashTagInput"
                  />
                </HashTag>
              </HashTageContainer>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default CreateFeed;

const HashTageContainer = styled.div`
  margin-top: 50px;
  margin-left: 5px;
`;

const HashTag = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  width: 100%;
  border: 2px solid $GRAY;
  border-radius: 10px;
  padding: 5px;
  gap: 5px;
  margin-top: 10px;
`;

const Tag = styled.div`
  display: inline-flex;
  flex-direction: row;
  background: #483767;
  color: white;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #483767;
  }
`;

const HashTagInput = styled.input`
  outline: none;
  border: none;
  font-size: 16px;
  padding: 5px;
  width: 100%;
`;

const HashTagInputTitle = styled.div`
  padding-bottom: 10px;
  padding-left: 6px;
`;
