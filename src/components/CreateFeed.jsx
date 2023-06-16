import React, { useEffect, useRef, useState } from "react";
import "../css/CreateFeedModal.css";
import disableScroll from "./DisableScroll";
import enableScroll from "./EnableScroll";
import { useInput } from "../hooks/useInput";
import { createFeedAxios } from "../apis/feed/createFeedAxios";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import UserDataComponent from "./UserDataComponent";
import styled from "styled-components";
import Swal from "sweetalert2";
import { TbBoxMultiple } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";

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
  const [uploadToggleBtn, setUploadToggleBtn] = useState(false);
  const [content, onChangeContentHandler] = useInput();
  const modalRef = useRef(null);
  const loginUserData = UserDataComponent();
  const queryClient = useQueryClient();

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
      Swal.fire({
        icon: "success",
        title: "피드 생성 완료!",
        text: `피드가 생성되었습니다✨`,
        confirmButtonText: "확인",
      });
      close();
      queryClient.invalidateQueries("getFeedAxios");
    },
    onError: (error) => {
      alert(error);
    },
  });

  // 저장하기 버튼 클릭
  const saveButtonHandler = () => {
    if (!selectedFile || !content || hashTags == []) {
      Swal.fire({
        icon: "error",
        title: "피드 생성 실패!",
        text: `모든 내용을 입력해주세요🙏`,
        confirmButtonText: "확인",
      });
      return;
    }
    const formData = new FormData();
    formData.append("contents", content);
    formData.append(
      "photoHashTag",
      new Blob([JSON.stringify(hashTags)], { type: "application/json" })
    );
    formData.append("imageFile", selectedFile);

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
                등록하기
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
                      multiple={true}
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
                {uploadToggleBtn && (
                  <UploadToggleContainer>
                    <ImgContainer>
                      {previewImage !== null ? (
                        <ImgBox>
                          <UploadImg img={previewImage} />
                        </ImgBox>
                      ) : null}
                      <PlusButton>
                        <AiOutlinePlus
                          size={"17px"}
                          onClick={() => {
                            alert("사진추가");
                          }}
                        />
                      </PlusButton>
                    </ImgContainer>
                  </UploadToggleContainer>
                )}
                <MultipleUpload
                  onClick={() => {
                    setUploadToggleBtn(!uploadToggleBtn);
                  }}
                >
                  <TbBoxMultiple size={"25px"} />
                </MultipleUpload>
              </div>
            </main>

            <div className="inputSection">
              <div className="profileBox">
                <img
                  src={loginUserData.profileImg}
                  className="profileImg"
                  alt="프로필이미지"
                />
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

const MultipleUpload = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 0 20px 28px 0;
  padding: 7px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(58, 58, 58, 0.5);
  color: white;
`;

const UploadToggleContainer = styled.div`
  display: flex;
  position: absolute;
  background-color: rgba(58, 58, 58, 0.5);
  bottom: 0;
  margin-bottom: 90px;
  right: 0;
  margin-right: 20px;
  padding: 15px;
  border-radius: 5px;
`;

const ImgContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const ImgBox = styled.div`
  width: 100px;
  height: 100px;
`;

const UploadImg = styled.div`
  height: 100%;
  background-position: center;
  background-size: cover;
  background-image: ${(props) => `url(${props.img})`};
`;

const PlusButton = styled.button`
  border-radius: 50%;
  padding: 5px;
  width: 40px;
  height: 40px;
`;
