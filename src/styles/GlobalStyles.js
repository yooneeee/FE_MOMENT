import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    *{
        margin : 0;
        padding : 0;
        box-sizing: border-box;
        font-family: 'Noto Sans KR', sans-serif;
    }

    a{
        text-decoration: none;
    }

    button{
      outline: none;
        cursor: pointer;
    }
`;
