import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { mypageInformationAxios } from "../apis/mypage/mypage";
import { useMutation } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserDataComponent from "../components/UserDataComponent";
import DeleteUser from "../components/DeleteUser";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/modules/user";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression";

const MyPageInformation = () => {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginUserData = UserDataComponent();

  const location = useLocation();
  const checkKakaoId = location.state?.checkKakaoId;
  const [image, setImage] = useState(loginUserData.profileImg);
  const fileInput = useRef();

  const [newNick, setNewNick] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newRole, setNewRole] = useState(loginUserData.role);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [intro, setIntro] = useState("");

  const [nickCharacters, setNickCharacters] = useState(0);
  const [pwCharacters, setPwCharacters] = useState(0);
  const [introCharacters, setIntroCharacters] = useState(0);
  const introduceMaxLength = 50;
  const nickMaxLength = 8;
  const pwMaxLength = 15;

  /* 프로필 이미지 선택 */
  // const fileSelectHandler = (e) => {
  //   const file = e.target.files[0];
  //   // 파일 처리 로직 추가
  //   // 이미지 업로드 후 이미지 변경 로직
  //   // setImage(file);
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const fileSelectHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          // maxSizeMB: 1,
          maxSizeKB: 100,
          maxWidthOrHeight: 100,
          useWebWorker: true,
          fileType: "webp",
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const roleButtonClickHandler = useCallback((selectedRole) => {
    setNewRole(selectedRole);
  }, []);

  const MemoizedSelectionButton = React.memo(SelectionButton);

  /* 서버 통신 */
  const mutation = useMutation(mypageInformationAxios, {
    onSuccess: (response) => {
      Swal.fire({
        icon: "success",
        title: "수정 완료(❁´◡`❁)",
        text: `회원정보가 정상적으로 수정되었습니다!`,
        confirmButtonText: "확인",
      });
      navigate(`/page/${hostId}`);
      dispatch(
        setUser({
          nickName: newNick,
          profileImg: image,
          role: newRole,
        })
      );
    },

    onError: (error) => {
      console.log("에러", error);
      if (error.status == 409) {
        Swal.fire({
          icon: "warning",
          title: "닉네임 중복!",
          text: `중복된 닉네임이 존재합니다!다른 닉네임을 설정해주세요🙏`,
          confirmButtonText: "확인",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "회원정보 수정 실패!",
          confirmButtonText: "확인",
        });
      }
    },
  });

  /* 정보변경 버튼 클릭 */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const file = fileInput.current.files[0];
    const formData = new FormData();

    const update = {
      nickName: newNick,
      password: newPw,
      role: newRole,
      content: intro,
    };
    formData.append(
      "update",
      new Blob([JSON.stringify(update)], { type: "application/json" })
    );
    file && formData.append("profile", file);
    mutation.mutate({ hostId, formData });
  };

  const deleteUser = () => {
    setDeleteUserModal(true);
  };

  const handleModalClose = () => {
    setDeleteUserModal(false);
  };

  const handleNickInput = (e) => {
    if (e.target.value.length <= 8) {
      setNewNick(e.target.value);
      setNickCharacters(e.target.value.length);
    }
  };

  const prevValue = "";

  const handlePwInput = (e) => {
    setNewPw(e.target.value);
    setPwCharacters(e.target.value.length);
  };

  const handleIntroduceInput = (e) => {
    const textareaLineHeight = 24;
    const maxRows = 4;
    const maxLength = 50;

    // const previousRows = e.target.rows;
    // e.target.rows = 1;

    const currentRows = ~~(e.target.scrollHeight / textareaLineHeight);

    if (currentRows > maxRows || e.target.value.length > maxLength) {
      e.target.value = prevValue;
    } else {
      prevValue = e.target.value;
      e.target.rows = currentRows;
      setIntro(e.target.value);
      setIntroCharacters(e.target.value.length);
    }
  };

  return (
    <Container>
      <form onSubmit={handleFormSubmit}>
        <Box>
          <Title>
            기본 회원정보<span>필수</span>
          </Title>
          <Line />
          <Text1>사진</Text1>
          <ProfileContainer>
            <ProfileImg alt="프로필사진" src={image} />
          </ProfileContainer>
          <TextColumn>
            <ProfileText>
              <UploadButton>
                사진선택
                <input
                  type="file"
                  name="profileImg"
                  accept="image/*"
                  onChange={fileSelectHandler}
                  ref={fileInput}
                ></input>
              </UploadButton>
            </ProfileText>
          </TextColumn>
        </Box>
        <Line1 />
        <Box>
          <Text>닉네임</Text>
          <TextColumn>
            <HiddenInput
              maxLength={8}
              type="text"
              placeholder={`${loginUserData.nickName}`}
              name="nickName"
              value={newNick}
              onChange={handleNickInput}
            />
            <div>
              {nickCharacters}/{nickMaxLength}
            </div>
          </TextColumn>
        </Box>
        <Line1 />
        {checkKakaoId ? (
          <div></div>
        ) : (
          <>
            <Box>
              <Text>
                <span>새 비밀번호</span>
              </Text>
              <TextColumn>
                <HiddenInput
                  minLength={7}
                  maxLength={15}
                  type="password"
                  placeholder="변경할 비밀번호 입력 (8자 - 15자)"
                  name="password"
                  value={newPw}
                  onChange={handlePwInput}
                />
                <div>
                  {pwCharacters}/{pwMaxLength}
                </div>
              </TextColumn>
            </Box>
            <Line1 />
          </>
        )}

        <Box>
          <Text>
            <span>Role</span>
          </Text>
          <TextColumn>
            <ButtonContainer>
              <MemoizedSelectionButton
                type="button"
                onClick={() => roleButtonClickHandler("MODEL")}
                style={{
                  backgroundColor: newRole === "MODEL" ? "#483767" : "#ffffff",
                  color: newRole === "MODEL" ? "#ffffff" : "#000000",
                }}
              >
                모델
              </MemoizedSelectionButton>
              <MemoizedSelectionButton
                type="button"
                onClick={() => roleButtonClickHandler("PHOTOGRAPHER")}
                style={{
                  backgroundColor:
                    newRole === "PHOTOGRAPHER" ? "#483767" : "#ffffff",
                  color: newRole === "PHOTOGRAPHER" ? "#ffffff" : "#000000",
                }}
              >
                작가
              </MemoizedSelectionButton>
            </ButtonContainer>
          </TextColumn>
        </Box>
        <Line1 />
        <Box>
          <Text>한 줄 소개</Text>
          <TextColumn>
            <Introduce
              rows={1}
              maxLength={49}
              placeholder="자신을 소개해주세요(최대 50자)"
              name="introduce"
              value={intro}
              onChange={handleIntroduceInput}
            />
            <div>
              {introCharacters}/{introduceMaxLength}
            </div>
          </TextColumn>
        </Box>
        <Line1 />
        <TwoButtonContainer>
          <ChangeButtonContainer>
            <ChangeButton type="submit">정보변경</ChangeButton>
          </ChangeButtonContainer>
          <WithdrawalButton type="button" onClick={deleteUser}>
            회원탈퇴할게요
          </WithdrawalButton>
        </TwoButtonContainer>
      </form>
      {deleteUserModal && <DeleteUser handleModalClose={handleModalClose} />}
    </Container>
  );
};

export default MyPageInformation;

/* 버튼 */
const UploadButton = styled.label`
  display: inline-block;
  padding: 10px 75px;
  background-color: #ffffff;
  color: #000000;
  border: 1px #acabab solid;
  border-radius: 3px;
  /* margin-left: 45px; */

  &:hover {
    background-color: #483767;
    color: #ffffff;
  }

  input[type="file"] {
    display: none;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
`;
const SelectionButton = styled.button`
  background-color: #ffffff;
  border-radius: 3px;
  border: 1px #acabab solid;
  margin-right: 2px;
  color: #000000;
  padding: 10px 40px;
  font-size: 15px;
  font-weight: 800;

  &:active,
  &:focus {
    background-color: #000000; /* 선택 시 배경색 변경 */
    color: white;
  }
`;
const ChangeButton = styled.button`
  display: inline-block;
  padding: 10px 75px;
  background-color: #ffffff;
  border-radius: 3px;
  border: 1px #acabab solid;
  justify-content: flex-end;
  margin-right: 185px;

  &:hover {
    background-color: #483767;
    color: #ffffff;
  }
`;
const WithdrawalButton = styled.button`
  border: none;
  background-color: transparent;
  margin-left: 10px;
  font-size: 15px;
  text-decoration: underline;
  color: #858585;
  margin-top: 40px;
  &:hover {
    color: #1b1b1b;
  }
`;

const TwoButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ChangeButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  /* max-width: 50%; */
  margin: 10px auto 0;
`;
const Title = styled.div`
  font-size: 25px;
  font-weight: 700;
  margin-top: 20px;

  span {
    margin-left: 10px;
    color: #afafaf;
    font-size: 25px;
  }
`;

const ProfileContainer = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  /* cursor: pointer; */
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const ProfileText = styled.div`
  margin-top: 10px;
  font-weight: 600;
`;

const Box = styled.div`
  width: 100%;
  margin: 10px auto 0;
`;

const HiddenInput = styled.input`
  width: 100%;
  max-width: 65%;
  border: 1px solid #acabab;
  border-radius: 3px;
  padding: 10px 10px;
  outline: none;
  margin-bottom: 5px;

  &:focus {
    border-color: #000000;
    outline: none; /* 포커스 시 기본 테두리 제거 */
  }

  &::placeholder {
    color: #acabab;
  }
`;

const Text = styled.div`
  float: left;
  width: 100%;
  max-width: 30%;
  height: auto;
  padding: 15px 0;
  box-sizing: border-box;
  border-top: 1px solid #f1f1f1;
  border-bottom: none;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
`;
const Text1 = styled(Text)`
  height: 30vh;
`;
const TextColumn = styled.div`
  display: inline-block;
  width: 100%;
  max-width: 55%;
  height: auto;
  padding: 15px 0;
  box-sizing: border-box;
  border-top: 1px solid #f1f1f1;
  border-bottom: none;
  font-size: 14px;
  text-align: left;

  span {
    font-size: 15px;
    margin-top: 5px;
  }
`;

const Line = styled.div`
  border-top: 4px solid #483767;
  width: 100%;
  margin: 20px auto;
`;
const Line1 = styled.div`
  border-top: 1px solid #d6d6d6;
  width: 100%;
  margin: 10px auto;
`;
const Introduce = styled.textarea`
  resize: none;
  width: 65%;
  height: 80px;
  padding: 10px;
  border: 1px solid #acabab;
  border-radius: 3px;

  &:focus {
    border-color: #000000;
    outline: none; /* 포커스 시 기본 테두리 제거 */
  }

  &::placeholder {
    color: #acabab;
  }
`;
