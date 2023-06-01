import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import authKakaoLogin from "../../apis/auth/authKakaoLogin";
import { useDispatch } from "react-redux";
import { loginSuccess, setUser } from "../../redux/modules/user";
import LoadingSpinner from "../../components/LoadingSpinner";

function KakaoLoginRedirect() {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const dispatch = useDispatch();
  const { data, isError } = useQuery("authKakaoLogin", async () => {
    try {
      const result = await authKakaoLogin(code);
      return result;
    } catch (error) {
      throw new Error("Kakao login failed");
    }
  });
  const redirectHandler = () => {
    if (data) {
      alert("로그인 성공");
      dispatch(loginSuccess());
      dispatch(
        setUser({
          nickName: data.nickName,
          profileImg: data.profileImg,
          role: data.role,
          userId: data.userId,
        })
      );
      navigate("/main");
    } else if (isError) {
      alert("로그인 실패");
      navigate("/login");
    }
    return false;
  };
  useEffect(() => {
    redirectHandler();
  }, [data]);
  return <LoadingSpinner />;
}

export default KakaoLoginRedirect;
