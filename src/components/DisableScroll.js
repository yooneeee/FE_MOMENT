const disableScroll = () => {
  // 현재 스크롤 위치 저장
  const scrollPosition =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop;
  // 스크롤 위치 고정 및 스크롤 막기
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = "100%";
};

export default disableScroll;
