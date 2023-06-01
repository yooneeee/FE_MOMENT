import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { authKakaoLogin, sendRoleAxios } from "../../apis/auth/authKakaoLogin";
import { useDispatch } from "react-redux";
import { loginSuccess, setUser, setUserRole } from "../../redux/modules/user";
import LoadingSpinner from "../../components/LoadingSpinner";
import styled from "styled-components";

function KakaoLoginRedirect() {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [active, setActive] = useState(role !== "");
  const dispatch = useDispatch();
  const { data, isError } = useQuery("authKakaoLogin", async () => {
    try {
      const result = await authKakaoLogin(code);
      return result;
    } catch (error) {
      throw new Error("Kakao login failed");
    }
  });

  const roleButtonClickHandler = useCallback((selectedRole) => {
    setRole(selectedRole);
  }, []);
  const MemoizedSelectionButton = React.memo(SelectionButton);
  const redirectHandler = () => {
    if (data) {
      setLoading(false);
      setModal(true);
      /*  alert("로그인 성공");
      dispatch(loginSuccess());*/
      dispatch(
        setUser({
          nickName: data.data.nickName,
          profileImg: data.data.profileImg,
          role: data.data.role,
          userId: data.data.userId,
        })
      );
      /*     navigate("/main"); */
    } else if (isError) {
      alert("로그인 실패");
      navigate("/login");
    }
    return false;
  };
  useEffect(() => {
    redirectHandler();
  }, [data, isError]);
  const sendRoleMutation = useMutation(sendRoleAxios, {
    onSuccess: () => {
      closeModal();
      alert("회원님의 회원가입이 완료되었습니다!");
      dispatch(loginSuccess());
      navigate("/main");
    },
    onError: () => {
      alert("회원님의 역할 전송을 실패했습니다!");
    },
  });

  const closeModal = () => {
    setModal(false);
  };
  const roleButtonHandler = () => {
    sendRoleMutation.mutate(role);
    dispatch(setUserRole({ role: role }));
  };

  const activeHandler = () => {
    setActive(!role);
  };
  useEffect(() => {
    activeHandler();
  }, [role]);

  return (
    <>
      {/*  <LoadingSpinner /> */}
      {modal && (
        <div>
          <Outside onClick={closeModal} />
          <ModalWrap>
            <ModalHeader>
              <p>직업을 선택해주세요</p>
              <button onClick={closeModal}>x</button>
            </ModalHeader>
            <ButtonContainer>
              <MemoizedSelectionButton
                onClick={() => roleButtonClickHandler("MODEL")}
                style={{
                  backgroundColor: role === "MODEL" ? "#000000" : "#ffffff",
                  color: role === "MODEL" ? "#ffffff" : "#000000",
                }}
              >
                모델
              </MemoizedSelectionButton>
              <MemoizedSelectionButton
                onClick={() => roleButtonClickHandler("PHOTOGRAPHER")}
                style={{
                  backgroundColor:
                    role === "PHOTOGRAPHER" ? "#000000" : "#ffffff",
                  color: role === "PHOTOGRAPHER" ? "#ffffff" : "#000000",
                }}
              >
                사진작가
              </MemoizedSelectionButton>
            </ButtonContainer>
            <ConfirmButtonContainer>
              <ConfirmButton
                type="button"
                onClick={roleButtonHandler}
                bgcolor={role ? "black" : "lightgrey"}
              >
                확인
              </ConfirmButton>
            </ConfirmButtonContainer>
          </ModalWrap>
        </div>
      )}
    </>
  );
}

export default KakaoLoginRedirect;

const Outside = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  z-index: 5;
`;

const ModalHeader = styled.div`
  display: flex;
  width: 100%;
  height: 42px;
  border-bottom: 1px solid #dbdbdb;
  padding: 0 16px;
  justify-content: space-between;
  align-items: center;

  p {
    font-size: 16px;
    font-weight: bold;
  }

  button {
    background-color: white;
    border: none;
    font-size: 1.1rem;
    font-weight: bold;
    color: #b9c4cc;
    &:hover {
      color: #333;
    }
  }
`;
export const InputTitle = styled.label`
  font-size: 17px;
  font-weight: 600;
  color: #262626;
  margin-top: 15px;
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 30px;
  margin: 10px 0;
  align-items: center;
`;

const SelectionButton = styled.button`
  background-color: #ffffff;
  width: 150px;
  border-radius: 5px;
  margin-top: 10px;
  color: #000000;
  padding: 10px 40px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;

  &:active,
  &:focus {
    background-color: #000000;
    color: white;
  }
`;

const ConfirmButton = styled.button`
  background-color: ${(props) => props.bgcolor || "black"};
  border-radius: 30px;
  margin-top: 20px;
  color: #ffffff;
  padding: 10px 40px;
  font-size: 15px;
  font-weight: 800;
  border: none;
  cursor: pointer;
`;

const ConfirmButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  padding-bottom: 20px;
`;
