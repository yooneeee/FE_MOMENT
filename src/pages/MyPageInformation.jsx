import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { mypageInformationAxios } from "../apis/mypage/mypage";
import { useMutation } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserDataComponent from "../components/UserDataComponent";
import DeleteUser from "../components/DeleteUser";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/modules/user";

const MyPageInformation = () => {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginUserData = UserDataComponent();

  const location = useLocation();
  const checkKakaoId = location.state.checkKakaoId;
  const [image, setImage] = useState(loginUserData.profileImg);
  // console.log(image);
  const fileInput = useRef();

  const [newNick, setNewNick] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newRole, setNewRole] = useState("");
  const [deleteUserModal, setDeleteUserModal] = useState(false);

  /* 프로필 이미지 선택 */
  const fileSelectHandler = (e) => {
    const file = e.target.files[0];
    // 파일 처리 로직 추가
    // 이미지 업로드 후 이미지 변경 로직
    // setImage(file);
    console.log("프로필", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const roleButtonClickHandler = useCallback((selectedRole) => {
    setNewRole(selectedRole);
  }, []);

  const MemoizedSelectionButton = React.memo(SelectionButton);

  /* 서버 통신 */
  const mutation = useMutation(mypageInformationAxios, {
    onSuccess: (response) => {
      alert("수정 완료(❁´◡`❁)", response);
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
      alert("수정 실패o(TヘTo)", error);
    },
  });

  /* 정보변경 버튼 클릭 */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const file = fileInput.current.files[0];
    console.log("핸들러", file);
    const formData = new FormData();

    const update = {
      nickName: newNick,
      password: newPw,
      role: newRole,
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
            <ProfileImg src={image} />
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
              type="text"
              placeholder="닉네임 입력(최대 8자)"
              name="nickName"
              value={newNick}
              onChange={(e) => {
                setNewNick(e.target.value);
              }}
            />
          </TextColumn>
        </Box>
        <Line1 />
        {checkKakaoId ? (
          <div></div>
        ) : (
          <>
            <Box>
              <Text>
                <span>신규 비밀번호</span>
              </Text>
              <TextColumn>
                <Column>
                  <HiddenInput
                    type="password"
                    placeholder="신규 비밀번호 입력"
                    name="password"
                    value={newPw}
                    onChange={(e) => {
                      setNewPw(e.target.value);
                    }}
                  />
                </Column>
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
                  backgroundColor: newRole === "MODEL" ? "#000000" : "#ffffff",
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
                    newRole === "PHOTOGRAPHER" ? "#000000" : "#ffffff",
                  color: newRole === "PHOTOGRAPHER" ? "#ffffff" : "#000000",
                }}
              >
                작가
              </MemoizedSelectionButton>
            </ButtonContainer>
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
    background-color: #000000;
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

const Column = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const HiddenInput = styled.input`
  width: 100%;
  max-width: 65%;
  border: 1px solid #acabab;
  border-radius: 3px;
  padding: 10px 10px;
  outline: none;

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
  /* background-color: #c0f10d; */
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
  /* background-color: #ffb773; */
  height: auto;
  padding: 15px 0;
  box-sizing: border-box;
  border-top: 1px solid #f1f1f1;
  border-bottom: none;
  font-size: 14px;
  text-align: left;

  span {
    font-weight: 800;
    font-size: 15px;
  }
`;

const Line = styled.div`
  border-top: 4px solid #000000;
  width: 100%;
  margin: 20px auto;
`;
const Line1 = styled.div`
  border-top: 1px solid #d6d6d6;
  width: 100%;
  margin: 10px auto;
`;
