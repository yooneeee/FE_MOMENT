import React, { useEffect, useRef, useState } from "react";
import "../css/FeedDetailModal.css";
import disableScroll from "./DisableScroll";
import enableScroll from "./EnableScroll";
import { feedDetailAxios } from "../apis/feed/feedDetailAxios";
import { useQuery, useQueryClient } from "react-query";
import { AiOutlineClose } from "react-icons/ai";
import { useMutation } from "react-query";
import heartAxios from "../apis/feed/heartAxios";
import HeartButton from "./HeartButton";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { mypage } from "../apis/mypage/mypage";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { feedLikeListAxios } from "../apis/feed/feedLikeListAxios";
import LikeListModal from "./LikeListModal";

const FeedDetail = (props) => {
  const { open, close, photoId } = props;
  const modalRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showLikeListModal, setShowLikeListModal] = useState(false);
  const showLikeList = () => {
    setShowLikeListModal(!showLikeListModal);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  // 모달창 바깥을 눌렀을 때 모달 close
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      close();
    }
  };

  // 스크롤 방지
  useEffect(() => {
    disableScroll();
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      enableScroll();
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // 피드 데이터 받아오기
  const { isError, isLoading, data } = useQuery(
    ["feedDetailAxios", feedDetailAxios],
    () => feedDetailAxios(photoId)
  );

  // 좋아요 버튼
  const likeButtonMutation = useMutation(heartAxios, {
    onSuccess: () => {
      queryClient.invalidateQueries("feedDetailAxios");
      queryClient.invalidateQueries("getFeedAxios");
      queryClient.invalidateQueries("mypage", mypage);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const likeButtonHandler = () => {
    likeButtonMutation.mutate(photoId);
  };

  const likeListButtonHandler = () => {
    showLikeList();
  };

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <h1>오류가 발생하였습니다...!</h1>;
  }

  const ImgArray = data.photoUrls;

  return (
    <div className={open ? "openModal feed-datail-modal" : "feed-datail-modal"}>
      {open && (
        <section ref={modalRef}>
          <AllContainer>
            <MainBody>
              <ImgContainer>
                <Styled_Slide {...settings}>
                  {ImgArray.map((img, index) => {
                    return (
                      <SliderBox key={index}>
                        <SliderBody image={img} alt="피드사진" />
                      </SliderBox>
                    );
                  })}
                </Styled_Slide>
              </ImgContainer>
            </MainBody>
            <ContentSection>
              <CloseButtonBox>
                <button className="close" onClick={close}>
                  <AiOutlineClose />
                </button>
              </CloseButtonBox>
              <ProfileContainer>
                <ProfileImg
                  src={data.profileUrl}
                  onClick={() => {
                    navigate(`/page/${data.hostId}`);
                  }}
                  alt="프로필사진"
                />
                <div>
                  <Position>{data.role}</Position>
                  <p>{data.nickName}</p>
                </div>

                <LoveButtonContainer>
                  <HeartButton
                    like={data.checkLove}
                    onClick={likeButtonHandler}
                  />
                  <LikeList onClick={likeListButtonHandler}>
                    <LoveCnt>{data.photoLoveCnt}</LoveCnt>
                  </LikeList>
                  {showLikeListModal && (
                    <LikeListModal
                      showLikeList={showLikeList}
                      photoId={photoId}
                    />
                  )}
                </LoveButtonContainer>
              </ProfileContainer>

              <ContentArea>
                <Content>
                  {data.contents === "undefined" ? null : data.contents}
                </Content>
              </ContentArea>

              <HashTagContainer>
                {data.tag_photoList.map((item) => {
                  return <HashTag key={item.tagId}>{item.tag}</HashTag>;
                })}
              </HashTagContainer>
            </ContentSection>
          </AllContainer>
        </section>
      )}
    </div>
  );
};

export default FeedDetail;

const Styled_Slide = styled(Slider)`
  width: 100%;
  /* padding-bottom: 100%; */

  .slick-prev,
  .slick-next {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    font-size: 20px;
    opacity: 0.8;
  }

  .slick-prev {
    left: 3px;
  }

  .slick-next {
    right: 3px;
  }

  .slick-dots {
    bottom: 20px; /* Increase the bottom position by 20px */
  }
`;

const SliderBox = styled.div`
  /* background-color: aqua; */
  /* position: relative; */
  @media (max-width: 1076px) {
    height: 596px;
  }
`;

const LoveCnt = styled.div`
  margin-left: 5px;
`;

const ProfileImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 70%;
  object-fit: cover;
  padding: 15px;
  flex-shrink: 0;

  @media (max-width: 1076px) {
    width: 70px;
    height: 70px;
  }
`;

const LoveButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 5px;
  align-items: center;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 10px;
  margin-left: auto;
  margin-right: 5px;

  @media (max-width: 1076px) {
    width: 55px;
    font-size: 5px;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  color: black;
  justify-content: space-between;
  border-bottom: 1px solid #eee;

  @media (max-width: 1120px) {
    font-size: 12px;
  }
`;

const CloseButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ContentSection = styled.div`
  padding: 10px;
  width: 400px;

  @media (max-width: 1076px) {
    width: 900px;
    height: 600px;
  }
`;

const Position = styled.p`
  color: #787878;
  margin-bottom: 5px;
`;

const SliderBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aqua;
  padding-bottom: 107.7%;
  background-image: ${(props) => `url(${props.image})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

/////////////////////////////

const AllContainer = styled.div`
  display: flex;
`;

const HashTagContainer = styled.div`
  margin-top: 20px;
  padding: 10px 0 10px 0;
  display: flex;
  gap: 5px;
  margin-left: 5px;
  flex-wrap: wrap;

  @media (max-width: 1076px) {
    flex-wrap: wrap;
  }
`;

const HashTag = styled.div`
  background-color: #483767;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 40px;
  font-size: 14px;

  @media (max-width: 1076px) {
    font-size: 13px;
  }
`;

const MainBody = styled.div`
  /* display: flex; */
  max-height: 700px;
  /* overflow: hidden; */
`;

const ContentArea = styled.div`
  margin: 20px 10px 10px 10px;
  /* width: 300px; */
  font-size: 17px;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;

  @media (max-width: 1076px) {
    font-size: 14px;
  }
`;

const ImgContainer = styled.div`
  position: relative;
  width: 650px;
  height: 700px;
  background-color: #eee;
  /* height: 100%; */
  /* padding-bottom: 100%; */
  display: flex;

  @media (max-width: 1076px) {
    width: 596px;
    height: 596px;
  }
`;

const Content = styled.p`
  width: 100%;
  /* font-size: 1em; */
  white-space: pre-wrap; /* Add this line */
`;

const FeedImg = styled.div`
  width: 100%;
  height: auto;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: ${(props) => `url(${props.image})`};
`;

const PrevArrow = ({ onClick }) => (
  <ArrowButton className="slick-prev" onClick={onClick}></ArrowButton>
);

const NextArrow = ({ onClick }) => (
  <ArrowButton className="slick-next" onClick={onClick}></ArrowButton>
);

const ArrowButton = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
`;

const LikeList = styled.button`
  background-color: white;
`;
