// 스크롤 활성화 함수
const enableScroll = () => {
  // 이전에 저장한 스크롤 위치 가져오기
  const scrollPosition = Math.abs(parseInt(document.body.style.top));
  // 스크롤 활성화 및 스크롤 위치 복원
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollPosition);
};

export default enableScroll;
