import React from "react";
import styled from "styled-components";

function TermsofService({ chechModalClose }) {
  return (
    <ModalContainer>
      <Outside onClick={chechModalClose} />
      <ModalWrap>
        <ModalHeader>
          <ModalTitle>Moment 이용 약관</ModalTitle>
          <CloseButton onClick={chechModalClose}>x</CloseButton>
        </ModalHeader>
        <ModalContent>
          <ModalSubtitle>
            회원 가입를 원하시는 경우, 아래 항목을 읽어보시고 동의하신 후,
            [회원가입]을 진행해주세요.
          </ModalSubtitle>
          <CheckboxList>
            <StSpan>제 1조</StSpan>
            <CheckboxText>
              주식회사 벼랑위의 포모(이하 '회사')가 인터넷과 모바일 등
              플랫폼(이하 ‘Moment’)을 통해 제공하는 다양한 서비스를 이용하여
              주셔서 감사합니다. 회사는 이용자가 ‘Moment’을 더 편리하게 이용할
              수 있도록 서비스 이용약관(이하 '본 약관')을 마련하였습니다. 본
              약관은 이용자가 서비스를 이용하는데 필요한 권리, 의무 및 책임사항
              기타 필요한 사항을 규정하고 있으므로 주의깊게 살펴봐 주시기
              바랍니다.
            </CheckboxText>
            <StSpan>제 2조</StSpan>
            <CheckboxText>
              이용자가 제공한 모든 정보는 다음의 목적을 위해 활용하며, 하기 목적
              이외의 용도로는 사용되지 않습니다. <br />
              ① 개인정보 수집 항목 및 수집·이용 목적 <br />
              가) 수집 항목 (필수항목) - 닉네임, 성별, 이메일, 직업 등 회원가입
              페이지에 기재된 정보 또는 신청자가 제공한 정보
              <br />
              나) 수집 및 이용 목적
              <br />
              - 회원 가입 의사 확인, 회원제 서비스 제공
              <br /> - 이용자 식별, 본인 인증
              <br /> - 고객 상담, 불만, 민원 사무 처리 <br />
              -상품∙서비스 이용 실적 정보 통계∙분석
              <br />
              ② 개인정보 보유 및 이용기간 - 수집·이용 동의일로부터 개인정보의
              수집·이용목적을 달성할 때까지 <br />③ 동의거부관리 - 귀하께서는 본
              안내에 따른 개인정보 수집, 이용에 대하여 동의를 거부하실 권리가
              있습니다. 다만, 귀하가 개인정보의 수집/이용에 동의를 거부하시는
              경우에 회원가입 있어 불이익이 발생할 수 있음을 알려드립니다.
            </CheckboxText>
            <StSpan>제 3조</StSpan>
            <CheckboxText>
              1. “회원”이 “서비스” 내에 게시한 사용자 디자인 및 후기성
              게시물(이하 “게시물”)의 저작권은 해당 게시물의 저작자에게
              귀속됩니다.
              <br />
              2. “회원”이 “서비스” 내에 게시하는 게시물은 검색 결과 또는
              “서비스” 안내 및 관련 프로모션 등의 내용에 포함 또는 노출될 수
              있습니다.
              <br />
              3. “회사” 는 “회사” 또는 “서비스” 의 안내 또는 홍보의 목적으로
              “회원” 이 “서비스” 내에 게시한 게시물의 그 일부 또는 전체를 사전의
              동의 없이 수정, 복제 및 편집하여 사용할 수 있습니다.
              <br />
              4. “회사”가 “회원”이 “서비스” 내에 게시한 게시물을 활용할 경우
              “회사”는 저작권법 규정을 준수하며, “회원”은 언제든지 고객센터 또는
              서비스 내 관리기능을 통해 해당 게시물에 대해 삭제, 검색 결과 제외,
              비공개 등의 조치를 위할 수 있습니다.
              <br /> 5. “회사” 는 본 조의 3항 이외의 방법으로 회원의 게시물을
              이용하고자 하는 경우 전화, 팩스 또는 전자우편 등을 통해 사전에
              “회원” 의 동의를 얻어야 합니다.
            </CheckboxText>
            <StSpan>제 4조</StSpan>
            <CheckboxText>
              1. 회사는 다음 각 호에 해당하는 “사용자 디자인”이나 “게시물”을
              사전 통지 없이 삭제하거나 이동 또는 등록을 거부할 수 있으며,
              회사는 관련 법에 따라 조치를 취하여야 합니다.
              <br />
              1) 정보통신망법 및 저작권법 등 관련 법에 위반되는 내용을 포함하는
              경우
              <br />
              2) 청소년보호법에 위반되는 내용을 포함는 경우
              <br />
              　3) 다른 회원 또는 제삼자에게 심한 모욕을 주거나 명예를
              손상시키는 내용인 경우
              <br />
              　4) 범죄와 결부된다고 객관적으로 인정되는 내용일 경우
              <br />
              5) 기타 관계 법령에 위반되거나, 본 약관에서 정한 내용에 위반될
              경우
              <br />
              2. 회사는 전항에 따른 권리자의 요청이 없는 경우라도 권리침해가
              인정될 만한 사유가 있거나 기타 회사 정책 및 관련 법에 위반되는
              경우에는 관련 법에 따라 해당 게시물에 대해 임시 조치 등을 취할 수
              있습니다.
            </CheckboxText>
            <StSpan>제 5조</StSpan>
            <CheckboxText>
              1. “회사” 또는 “서비스” 가 작성한 게시물에 대한 저작권 및 기타
              지적재산권은 “회사” 에 귀속합니다.
              <br />
              2. “회사” 또는 “서비스” 는 “회원” 이 게시 또는 등록한 게시물, 공개
              설정한 디자인 등에 대하여 “서비스” 운영, 전시 또는 홍보하기 위한
              목적으로 활용할 수 있습니다.
              <br />
              4. “회사” 또는 “서비스” 는 “이용자” 의 이미지, 매칭 데이터 등을
              통계, 홍보 등의 목적으로 저장 및 사용할 수 있습니다.
            </CheckboxText>
          </CheckboxList>
        </ModalContent>
        <ButtonWrap>
          <ConfirmButton type="button" onClick={chechModalClose}>
            확인
          </ConfirmButton>
        </ButtonWrap>
      </ModalWrap>
    </ModalContainer>
  );
}

export default TermsofService;

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
  height: 56px;
  border-bottom: 1px solid #dbdbdb;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background-color: white;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  color: #000000;
  &:hover {
    color: #333;
  }
`;

const ModalContent = styled.ul`
  padding: 16px;
  max-height: 500px;
  overflow-y: scroll;
`;

const ModalSubtitle = styled.span`
  margin-bottom: 36px;
  font-weight: bold;
`;
const CheckboxList = styled.div`
  padding-left: 0;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const StSpan = styled.span`
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 4px;
`;
const CheckboxText = styled.span`
  flex-grow: 1;
  margin-bottom: 10px;
`;

const ButtonWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ConfirmButton = styled.button`
  width: 100%;
  height: 56px;
  padding: 8px 16px;
  font-size: 15px;
  font-weight: bold;
  background-color: #483767;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;
