import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { authKakaoLogin, sendRoleAxios } from "../../apis/auth/authKakaoLogin";
import { useDispatch } from "react-redux";
import { loginSuccess, setUser, setUserRole } from "../../redux/modules/user";
import LoadingSpinner from "../../components/LoadingSpinner";
import styled from "styled-components";
import Swal from "sweetalert2";
import { unreadChatAxios } from "../../apis/main/unreadChat";

function KakaoLoginRedirect() {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [hasRole, setHasRole] = useState(false);
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
  const sendRoleMutation = useMutation(sendRoleAxios, {
    onSuccess: () => {
      closeModal();
      showAlert(
        "success",
        "회원가입 성공!",
        `[${data.data.nickName}]님 회원가입이 완료되었습니다✨`
      );
      dispatch(loginSuccess());
      navigate("/main");
    },
    onError: () => {
      alert("포지션 전송을 실패했습니다!");
    },
  });

  const closeModal = () => {
    setModal(false);
  };
  const roleButtonHandler = (e) => {
    e.preventDefault();
    if (!role) {
      showAlert("error", "회원가입 실패!", "포지션을 선택해주세요.");
    } else {
      sendRoleMutation.mutate(role);
      dispatch(setUserRole({ role: role }));
    }
  };

  useEffect(() => {
    const redirectHandler = async () => {
      if (data) {
        if (data.data.role !== null) {
          setHasRole(true);
        } else {
          setLoading(false);
          setModal(true);
        }
        dispatch(
          setUser({
            nickName: data.data.nickName,
            profileImg: data.data.profileImg,
            role: data.data.role,
            userId: data.data.userId,
          })
        );
      } else if (isError) {
        showAlert(
          "error",
          "로그인 실패!",
          "로그인이 실패되었습니다. 다시 확인해 주세요."
        );
        navigate("/login");
      }
      setLoading(true);
    };

    redirectHandler();
  }, [data, isError, dispatch, navigate]);

  useEffect(() => {
    if (hasRole) {
      setModal(false);
      showAlert(
        "success",
        "로그인 성공!",
        `[${data.data.nickName}]님 로그인되었습니다✨`
      );
      unreadChatAxios()
        .then((data) => {
          if (data) {
            Swal.fire({
              icon: "info",
              text: `읽지않은 채팅이 있습니다.✨`,
              confirmButtonText: "확인",
            }).then(() => {
              navigate(`/chatroomlist/${data.data.userId}`);
            });
          } else {
            return;
          }
        })
        .catch((error) => {
          console.error(error);
        });
      dispatch(loginSuccess());
      navigate("/main");
    }
  }, [hasRole, data, dispatch, navigate]);

  const showAlert = (icon, title, text) => {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonText: "확인",
    });
  };
  return (
    <>
      {loading && <LoadingSpinner />}
      {modal && (
        <div>
          <Outside />
          <ModalWrap>
            <ModalHeader>
              <p>포지션을 선택해주세요</p>
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
  z-index: 1000;
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
