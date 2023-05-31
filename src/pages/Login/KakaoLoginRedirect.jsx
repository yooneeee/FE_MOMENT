import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import authKakaoLogin from "../../apis/auth/authKakaoLogin";

function KakaoLoginRedirect() {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");

  const { data, isError } = useQuery("authKakaoLogin", async () => {
    const result = await authKakaoLogin(code);
    console.log(code);
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

export default KakaoLoginRedirect;
