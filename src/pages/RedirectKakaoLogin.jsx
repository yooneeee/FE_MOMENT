import React, { useEffect } from "react";
import authKakaoLogin from "../apis/auth/kakaoLogin";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

function RedirectKakaoLogin() {
  const navigate = useNavigate();
  const redirectCode = new URL(window.location.href).searchParams.get("code");
  const { data, isError } = useQuery("kakaoAuth", async () => {
    const result = await authKakaoLogin(redirectCode);
    return result;
  });
  const redirectHandler = () => {
    if (data) {
      alert("로그인 성공");
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
  return <div>RedirectKakaoLogin</div>;
}

export default RedirectKakaoLogin;
