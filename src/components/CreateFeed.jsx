import React, { useEffect, useRef, useState } from "react";
import "../css/CreateFeedModal.css";
import disableScroll from "./DisableScroll";
import enableScroll from "./EnableScroll";
import { useInput } from "../hooks/useInput";
import { createFeedAxios } from "../apis/feed/createFeedAxios";
import { useMutation, useQueryClient } from "react-query";
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
    const allowedCommand = ["Enter"];
    if (!allowedCommand.includes(e.code)) return;

    if (isEmptyValue(e.target.value)) {
      return setInputHashTag("");
    }

    let newHashTag = e.target.value;
    const regExp = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
    // if (regExp.test(newHashTag)) {
    //   newHashTag = newHashTag.replace(regExp, "");
    // }
    if (newHashTag.includes(",")) {
      newHashTag = newHashTag.split(",").join("");
    }

    if (isEmptyValue(newHashTag)) return;

    if (hashTags.length >= 3) return;

    if (newHashTag.length > 8) {
      Swal.fire({
        icon: "error",
        // title: "피드 생성 완료!",
        text: `입력한 값은 8자를 초과할 수 없습니다.`,
        confirmButtonText: "확인",
      });
      return;
    }

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
    // e.preventDefault();

    const regExp = /^[a-z|A-Z|가-힣|ㄱ-ㅎ|ㅏ-ㅣ|0-9| \t|]+$/g;
    // if (!regExp.test(e.target.value)) {
    //   setInputHashTag("");
    // }
  };

  const changeHashTagInput = (e) => {
    setInputHashTag(e.target.value);
  };

  ///////////////////////////////////////////////////////
  const { open, close } = props;
  const [selectedFile, setSelectedFile] = useState([]);
  const [previewImage, setPreviewImage] = useState([]);
  const [uploadToggleBtn, setUploadToggleBtn] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [content, onChangeContentHandler] = useInput();
  const modalRef = useRef(null);
  const loginUserData = UserDataComponent();
  const queryClient = useQueryClient();

  const handleFileChange = (e) => {
    const files = e.target.files;

    const fileArray = Array.from(files);

    setSelectedFile([...selectedFile, ...fileArray]);

    fileArray.forEach((file) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewImage((prevImages) => [...prevImages, reader.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // console.log(selectedFile);
  // console.log(previewImage);

  const handleDeletePhoto = (index) => {
    setSelectedFile((prevSelectedFile) => {
      const newSelectedFile = [...prevSelectedFile];
      newSelectedFile.splice(index, 1);
      return newSelectedFile;
    });

    setPreviewImage((prevPreviewImage) => {
      const newPreviewImage = [...prevPreviewImage];
      newPreviewImage.splice(index, 1);
      return newPreviewImage;
    });

    // 메인 이미지 인덱스 변경
    setMainImageIndex((index) => index - 1);
  };

  const handleImageClick = (index) => {
    setMainImageIndex(index);
  };

  // 모달창 바깥을 눌렀을 때 모달 close
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
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

    selectedFile.forEach((file) => {
      formData.append("imageFile", file);
    });

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
                {previewImage == "" ? (
                  <label htmlFor="file" className="btn-upload">
                    파일 업로드하기
                    <input
                      type="file"
                      multiple
                      name="file"
                      id="file"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <img
                    src={previewImage[mainImageIndex]}
                    alt="Preview"
                    className="preview-image"
                  />
                )}
                {uploadToggleBtn && (
                  <UploadToggleContainer>
                    <ImgContainer>
                      {previewImage !== null &&
                        previewImage.map((item, index) => (
                          <ImgBox
                            key={index}
                            onClick={() => handleImageClick(index)}
                          >
                            <UploadImg img={item}>
                              <DeletePhotoButton
                                onClick={() => {
                                  handleDeletePhoto(index);
                                }}
                              >
                                <AiOutlineClose />
                              </DeletePhotoButton>
                            </UploadImg>
                          </ImgBox>
                        ))}
                      <PlusButton htmlFor="file">
                        <AiOutlinePlus size={"20px"} />
                        <input
                          type="file"
                          multiple
                          name="file"
                          id="file"
                          onChange={handleFileChange}
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
                maxLength={100}
              ></textarea>

              <HashTageContainer>
                <HashTagInputTitle>해시태그</HashTagInputTitle>
                <HashTagGuide>8자 이내, 해시태그 개수 3개 제한</HashTagGuide>
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
                    placeholder="#Enter를 눌러 해시태그를 등록해보세요."
                    className="hashTagInput"
                    maxLength={8}
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
  margin-left: 5px;
`;

const HashTag = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  width: 320px;
  /* background-color: aqua; */
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

const HashTagGuide = styled.div`
  color: #787878;
  font-size: 13px;
  margin-left: 5px;
`;

const HashTagInput = styled.input`
  outline: none;
  border: none;
  font-size: 16px;
  width: 100%;
  margin-top: 10px;
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
  background-color: rgba(22, 22, 22, 0.7);
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
  cursor: pointer;
`;

const UploadImg = styled.div`
  position: relative;
  height: 100%;
  background-position: center;
  background-size: cover;
  background-image: ${(props) => `url(${props.img})`};
`;

const PlusButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 5px;
  width: 40px;
  height: 40px;
  background-color: transparent;
  color: white;
  border: 1px solid white;
  cursor: pointer;
`;

const DeletePhotoButton = styled.button`
  padding: 5px;
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(58, 58, 58, 0.5);
  border-radius: 50%;
  width: 25px;
  height: 25px;
`;
