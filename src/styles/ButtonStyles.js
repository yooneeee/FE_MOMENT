import { css } from "styled-components";
import styled from "styled-components";

export const buttonStyles = css`
  display: flex;
  border: none;
  border-radius: 64px;
  width: 100%;
  padding: 12px 19px;
  align-items: center;
  color: #111;
  margin-bottom: 10px;
  cursor: pointer;
`;
export const KakaoLoginButton = styled.button`
  ${buttonStyles}
  background-color: #fee500;
`;
export const KakaoLogoImage = styled.img`
  display: block;
  border-style: none;
  width: 100%;
  height: 100%;
  color: #000000;
`;
export const KakaoLogoContainer = styled.div`
  width: 24px;
  height: 24px;
`;
export const EmailButton = styled.button`
  ${buttonStyles}
  border: 1px #000000 solid;
  background-color: #000000;
  color: #ffffff;
`;
export const ButtonText = styled.div`
  display: inline-block;
  width: 100%;
  text-align: center;
  font-weight: 700;
  font-size: 18px;
  color: #000000 85%;
`;
