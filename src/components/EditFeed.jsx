import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "../css/CreateFeedModal.css";
import disableScroll from "./DisableScroll";
import enableScroll from "./EnableScroll";
import { useInput } from "../hooks/useInput";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import UserDataComponent from "./UserDataComponent";
import Swal from "sweetalert2";
import { getFeedAxios } from "../apis/feed/getFeedAxios";
import { mypageFeedEditAxios } from "../apis/mypage/mypage";
import { feedDetailAxios } from "../apis/feed/feedDetailAxios";
import Slider from "react-slick";

const EditFeed = (props) => {
  const { open, close, photoId, item } = props;

  const { data: getdata } = useQuery(
    ["getFeedAxios", photoId],
    () => getFeedAxios({ activeNavItem: "Latest" }),
    {
      keepPreviousData: true,
    }
  );
  const { data: DetailData } = useQuery(
    ["feedDetailAxios", feedDetailAxios],
    () => feedDetailAxios(photoId)
  );
  //   console.log("getdata:::", getdata);
  //   console.log("item:::", item);
  //   console.log("DetailData:::", DetailData);

  const [content, onChangeContentHandler] = useInput();
  const [isSaving, setIsSaving] = useState(false); // 버튼 비활성화
  const modalRef = useRef(null);
  const loginUserData = UserDataComponent();
  const queryClient = useQueryClient();

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

  // 서버 통신
  const editFeedMutation = useMutation(mypageFeedEditAxios, {
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "포트폴리오 수정 완료!",
        text: `포트폴리오가 수정되었습니다✨`,
        confirmButtonText: "확인",
      });
      close();
      queryClient.invalidateQueries("getFeedAxios");
      queryClient.invalidateQueries("mypage");
    },
    onError: (error) => {
      alert(error);
    },
  });

  useEffect(() => {
    if (editFeedMutation.isSuccess || editFeedMutation.isError) {
      setIsSaving(false);
    }
  }, [editFeedMutation.isSuccess, editFeedMutation.isError]);

  const saveButtonHandler = () => {
    const contents = {
      content,
    };
    editFeedMutation.mutate({ photoId, contents });
  };

  if (!getdata) return "Loading...";
  const contentData = getdata.content.find(
    (content) => content.photoId === item.photoId
  );

  //   const ImgArray = DetailData.photoUrls;
  const ImgArray = DetailData ? DetailData.photoUrls : [];

  return (
    <div className={open ? "openModal create-feed-modal" : "create-feed-modal"}>
      {open ? (
        <section ref={modalRef}>
          <Header>
            <HeaderTitle>포트폴리오 수정하기</HeaderTitle>
            <HeaderTitleBox>
              <SaveButton onClick={saveButtonHandler} disabled={isSaving}>
                수정하기
              </SaveButton>
              <CloseButton onClick={close}>
                <AiOutlineClose />
              </CloseButton>
            </HeaderTitleBox>
          </Header>
          {getdata && (
            <Container>
              <MainBody>
                <ImgContainerBox>
                  <Styled_Slide {...settings}>
                    {ImgArray.map((img, index) => {
                      return (
                        <SliderBox key={index}>
                          <SliderBody image={img} alt="피드사진" />
                        </SliderBox>
                      );
                    })}
                  </Styled_Slide>
                </ImgContainerBox>
              </MainBody>

              <InputSection>
                <ProfileBox>
                  <ProfileImg
                    src={loginUserData.profileImg}
                    alt="프로필이미지"
                  />
                  <div>
                    <Position>{loginUserData.role}</Position>
                    <p>{loginUserData.nickName}</p>
                  </div>
                </ProfileBox>
                <InputTextArea
                  placeholder={`${contentData.content}`}
                  value={content}
                  onChange={onChangeContentHandler}
                  maxLength={100}
                ></InputTextArea>
              </InputSection>
            </Container>
          )}
        </section>
      ) : null}
    </div>
  );
};

export default EditFeed;

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
  position: relative;
  /* @media (max-width: 1076px) {
    height: 596px;
  } */
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
const CloseButton = styled.button`
  margin-top: 3px;
  background-color: transparent;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #eee;
`;

const HeaderTitle = styled.div`
  padding: 5px;
  margin-left: 6px;
`;

const HeaderTitleBox = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  margin: 0 10px 0 auto;
`;

const SaveButton = styled.div`
  padding: 5px;
  background-color: transparent;
  font-weight: 600;
  font-size: 13.333px;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  @media (max-width: 1076px) {
    width: 80vw;
    height: 50vw;
  }
`;

const MainBody = styled.div`
  /* display: flex;
  min-height: 700px;
  max-height: 700px;
  overflow: hidden;
  background-color: #eee; */
  max-height: 700px;
`;

const ImgContainerBox = styled.div`
  /* width: 720px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center; */
  position: relative;
  width: 650px;
  height: 700px;
  background-color: #eee;
  /* height: 100%; */
  /* padding-bottom: 100%; */
  display: flex;

  /* @media (max-width: 1076px) {
    width: 596px;
    height: 596px;
  } */
  @media (max-width: 1076px) {
    width: 50vw;
    height: 80vw;
  }
`;

const InputSection = styled.div`
  min-width: 350px;
  min-height: 700px;
  padding: 10px;
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  color: black;
`;

const ProfileImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 70%;
  object-fit: cover;
  padding: 15px;
  flex-shrink: 0;
`;

const Position = styled.p`
  color: #787878;
  margin-bottom: 5px;
`;

const InputTextArea = styled.textarea`
  margin-left: 5px;
  width: 98%;
  height: 50%;
  padding: 10px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 500;
  resize: none;
  border: none;
  outline: none;
`;
