import React, { useState } from "react";
import { useMutation } from "react-query";
import styled from "styled-components";
import { deleteUserAxios } from "../apis/auth/login";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/modules/user";

function DeleteUser({ handleModalClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
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
    handleModalClose();
  };
  return (
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
              1. 회원 탈퇴 시 개인 정보 및 서비스 이용내역은 즉시 삭제됩니다.
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
  );
}

export default DeleteUser;

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
