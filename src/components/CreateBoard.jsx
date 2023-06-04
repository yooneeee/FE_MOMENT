import React, { useEffect, useRef, useState } from "react";
import "../css/CreateBoardModal.css";
import disableScroll from "./DisableScroll";
import enableScroll from "./EnableScroll";
import styled from "styled-components";
import { useInput } from "../hooks/useInput";
import { createBoardAxios } from "../apis/board/createBoard";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import UserDataComponent from "./UserDataComponent";

const CreateBoard = (props) => {
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

  /////////////////////////////////////////////////////////////
  const { open, close } = props;
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [title, onChangeTitleHandler] = useInput();
  const [content, onChangeContentHandler] = useInput();
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
  const createBoardMutation = useMutation(createBoardAxios, {
    onSuccess: () => {
      alert("게시글 생성이 완료됐습니다");
      close();
      navigate("/board");
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

    const boardRequestDto = {
      title: title,
      contents: content,
      locationTags: hashTags,
    };

    formData.append(
      "boardRequestDto",
      new Blob([JSON.stringify(boardRequestDto)], { type: "application/json" })
    );
    formData.append("boardImg", selectedFile);

    createBoardMutation.mutate(formData);
  };

  return (
    <div
      className={open ? "openModal create-board-modal" : "create-board-modal"}
    >
      {open ? (
        <section ref={modalRef}>
          <header>
            <p className="headerTitle">새 게시글 만들기</p>
            <div className="headerRightBox">
              <button className="saveButton" onClick={saveButtonHandler}>
                저장하기
              </button>
              <button className="close" onClick={close}>
                <AiOutlineClose />
              </button>
            </div>
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
                <img src={loginUserData.profileImg} className="profileImg" />
                <div>
                  <p className="position">{loginUserData.role}</p>
                  <p>{loginUserData.nickName}</p>
                </div>
              </div>
              <textarea
                className="titleInput"
                placeholder="제목 입력..."
                value={title}
                onChange={onChangeTitleHandler}
              ></textarea>
              <textarea
                className="contentInput"
                placeholder="문구 입력..."
                value={content}
                onChange={onChangeContentHandler}
              ></textarea>

              <HashTageContainer>
                <InputTitle>해시태그</InputTitle>
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

export default CreateBoard;

const HashTageContainer = styled.div`
  margin-top: 20px;
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
  background: #1e90ff;
  color: white;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #4a88db;
  }
`;

const HashTagInput = styled.input`
  outline: none;
  border: none;
  font-size: 16px;
  padding: 5px;
  width: 100%;
`;

const InputTitle = styled.div`
  padding-bottom: 10px;
  padding-left: 6px;
`;
