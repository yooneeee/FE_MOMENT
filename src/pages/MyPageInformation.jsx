import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import { mypageInformationAxios } from "../apis/mypage/mypage";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import UserDataComponent from "../components/UserDataComponent";
import { deleteUserAxios } from "../apis/auth/login";
import Swal from "sweetalert2";
import { logoutSuccess } from "../redux/modules/user";
import { useDispatch } from "react-redux";

const MyPageInformation = () => {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const loginUserData = UserDataComponent();
  const dispatch = useDispatch();

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
    console.log("마지막", file);
    file && formData.append("profile", file);
    console.log(hostId);
    console.log(formData);
    mutation.mutate({ hostId, formData });
  };

  const deleteUser = () => {
    setDeleteUserModal(true);
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleModalClose = () => {
    setDeleteUserModal(false);
  };

  const deleteUserMutation = useMutation(deleteUserAxios, {
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "회원탈퇴 완료!",
        text: `지금까지 저희 서비스를 이용해주셔서 감사합니다✨`,
        confirmButtonText: "확인",
      });
      sessionStorage.removeItem("Access_key");
      sessionStorage.removeItem("Refresh_key");
      navigate("/");
      dispatch(logoutSuccess());
    },
    onError: (error) => {
      alert("회원탈퇴를 실패했습니다!");
    },
  });

  const handleConfirm = async (e) => {
    await deleteUserMutation.mutateAsync();
  };

  const handleCancel = () => {
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
      {deleteUserModal && (
        <ModalContainer>
          <Outside onClick={handleModalClose} />
          <ModalWrap>
            <ModalHeader>
              <ModalTitle>회원탈퇴</ModalTitle>
              <CloseButton onClick={handleModalClose}>x</CloseButton>
            </ModalHeader>
            <ModalContent>
              <ModalSubtitle>
                회원 탈퇴를 원하시는 경우, 아래 항목을 입력하고 동의하신 후,
                [확인]을 클릭해주세요.
              </ModalSubtitle>
              <CheckboxList>
                <CheckboxText>
                  1. 회원 탈퇴 시 개인 정보 및 서비스 이용내역은 즉시
                  삭제됩니다.
                </CheckboxText>
                <CheckboxText>
                  2. 회원 탈퇴와 동시에 회원 가입 시에 기재한 모든 개인정보 및
                  서비스 이용 정보는 삭제되며, 복구는 불가능합니다.
                </CheckboxText>
                <CheckboxText>
                  3. 탈퇴 후 삭제한 계정에 대한 정보 복구는 불가합니다.
                </CheckboxText>
                <CheckboxItem>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      onChange={() => handleCheckboxChange()}
                    />
                    <CheckboxText>위의 내용을 모두 확인했습니다.</CheckboxText>
                  </CheckboxLabel>
                </CheckboxItem>
              </CheckboxList>
            </ModalContent>
            <ButtonWrap>
              <ConfirmButton disabled={!isChecked} onClick={handleConfirm}>
                확인
              </ConfirmButton>
              <CancelButton onClick={handleCancel}>취소</CancelButton>
            </ButtonWrap>
          </ModalWrap>
        </ModalContainer>
      )}
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

//회원 탈퇴 모달
const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
`;

const Outside = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
`;
const ModalWrap = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background-color: white;
  border-radius: 12px;
`;

const ModalHeader = styled.div`
  display: flex;
  width: 100%;
  height: 42px;
  border-bottom: 1px solid #dbdbdb;
  padding: 0 16px;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.p`
  font-size: 16px;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background-color: white;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  color: #359fe5;
  &:hover {
    color: #333;
  }
`;

const ModalContent = styled.ul`
  padding: 16px;
`;

const ModalSubtitle = styled.span`
  margin-bottom: 36px;
  font-weight: bold;
`;
const CheckboxList = styled.ul`
  padding-left: 0;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CheckboxItem = styled.li`
  display: flex;
  align-items: center;
  margin: 12px 0;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const CheckboxText = styled.span`
  flex-grow: 1;
  margin-bottom: 8px;
`;

const Checkbox = styled.input`
  margin-right: 12px;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
`;
const ConfirmButton = styled.button`
  padding: 8px 16px;
  font-size: 15px;
  font-weight: bold;
  background-color: ${(props) => (props.disabled ? "#ccc" : "#1a1a1a")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  &:hover {
    background-color: ${(props) => (props.disabled ? "#ccc" : "#1a1a1a")};
  }
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  font-size: 15px;
  font-weight: bold;
  background-color: #ccc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
  &:hover {
    background-color: #999;
  }
`;
