import { styled } from "styled-components";

export const InputWrap = styled.div`
  display: flex;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  background-color: white;
  border: 1px solid #e2e0e0;
  &:focus-within {
    border: 1px solid #636363;
  }
`;
export const InputTitle = styled.label`
  font-size: 17px;
  font-weight: 600;
  color: #262626;
  margin-top: 15px;
`;
export const Input = styled.input`
  width: 100%;
  outline: none;
  border: none;
  height: 17px;
  font-size: 14px;
  font-weight: 400;
  &::placeholder {
    color: #cacaca;
  }
`;
