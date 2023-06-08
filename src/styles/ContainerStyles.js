import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  width: 100%;
`;
export const CenteredContent = styled.div`
  flex: 1 0 auto;
  margin: 0px auto;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 40px 0px;
`;
export const TitleLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
  margin-left: auto;
  margin-right: auto;
`;
export const Title = styled.div`
  font-size: 50px;
  font-weight: 800;
`;
