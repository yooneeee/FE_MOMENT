import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import "../css/App.css";
import { getFeedAxios } from "../apis/feed/getFeedAxios";
import { useInfiniteQuery, useMutation } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import FeedCard from "../components/FeedCard";
import FeedDetail from "../components/FeedDetail";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useInView } from "react-intersection-observer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { searchFeedAxios } from "../apis/feed/searchFeedAxios";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GrSearch } from "react-icons/gr";
import { throttle } from "lodash";

function Feed() {
  const [activeNavItem, setActiveNavItem] = useState("Latest");
  const [feedDetailOpen, setFeedDetailOpen] = useState([]);
  let optArr = ["내용", "닉네임", "해시태그"];
  const [currentOpt, setCurrentOpt] = useState("내용");
  const [showList, setShowList] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [option, setOption] = useState("contents");
  const [showButton, setShowButton] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const toggleShowList = () => setShowList(true);
  const toggleCloseList = () => setShowList(false);
  const optionChangeHandler = (currentOpt) => {
    if (currentOpt === "내용") {
      setOption("contents");
    } else if (currentOpt === "해시태그") {
      setOption("tag");
    } else if (currentOpt === "닉네임") {
      setOption("userNickName");
    }
  };
  const liClickHandler = (index) => {
    setCurrentOpt(optArr[index]);
    optionChangeHandler(optArr[index]);
    toggleCloseList();
  };

  const selectWrapRef = useRef();
  useEffect(() => {
    const clickListOutside = (e) => {
      if (selectWrapRef.current && !selectWrapRef.current.contains(e.target)) {
        toggleCloseList();
      }
    };
    document.addEventListener("mousedown", clickListOutside);
    return () => {
      document.removeEventListener("mousedown", clickListOutside);
    };
  }, []);

  const searchMutation = useMutation(searchFeedAxios, {
    onSuccess: (response) => {
      if (response.data.empty === true) {
        setIsEmpty(true);
        Swal.fire({
          icon: "warning",
          title: "검색결과가 없습니다!",
          confirmButtonText: "확인",
        });
      }
      setSearchResults(response.data.content);
      // setKeyword("");
    },
    onError: () => {
      Swal.fire({
        icon: "warning",
        title: "검색결과가 없습니다!",
        confirmButtonText: "확인",
      });
    },
  });

  const searchButtonClickHandler = () => {
    if (keyword.trim() === "") {
      // Swal.fire({
      //   icon: "warning",
      //   title: "검색어를 입력해주세요!",
      //   confirmButtonText: "확인",
      // });
      setSearchResults([]);
      return;
    }
    const role = activeNavItem.toUpperCase();
    searchMutation.mutate({ keyword, option, role });
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchButtonClickHandler();
    }
  };

  const handleNavItemClick = (item) => {
    setActiveNavItem(item);
    setSearchResults([]);
  };

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // 화면 내릴 시 최상단 up 버튼
  const handleScrollThrottled = useCallback(
    throttle(() => {
      const { scrollY } = window;
      scrollY > 200 ? setShowButton(true) : setShowButton(false);
    }, 300),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScrollThrottled);
    return () => {
      window.removeEventListener("scroll", handleScrollThrottled);
    };
  }, [handleScrollThrottled]);

  const openFeedDetail = (photoId) => {
    if (isLoggedIn) {
      setFeedDetailOpen((prevOpen) => [...prevOpen, photoId]);
    } else {
      Swal.fire({
        icon: "warning",
        title: "회원 전용 서비스!",
        text: `로그인이 필요한 서비스입니다🙏`,
        confirmButtonText: "확인",
      });
    }
  };

  const closeFeedDetail = (photoId) => {
    setFeedDetailOpen((prevOpen) => prevOpen.filter((id) => id !== photoId));
  };

  // 무한 스크롤
  const { isLoading, isError, data, fetchNextPage } = useInfiniteQuery(
    ["getFeedAxios", activeNavItem],
    ({ pageParam = 0 }) => getFeedAxios({ pageParam, activeNavItem }),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.last === true) {
          return;
        } else {
          return lastPage.number + 1;
        }
      },
    }
  );

  const [bottomObserverRef, bottomInView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (bottomInView) {
      fetchNextPage();
    }
  }, [bottomInView, fetchNextPage]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h3>에러가 발생하였습니다.</h3>;
  }

  return (
    <>
      <Header>
        <Navbar>
          <span>포트폴리오</span>
          <Search>
            <SelectWrap ref={selectWrapRef}>
              <SelectButton onClick={toggleShowList}>
                {currentOpt}
                <MdOutlineKeyboardArrowDown style={{ fontSize: "18px" }} />
              </SelectButton>
              {showList && (
                <LanguageUl>
                  {optArr.map((item, index) => {
                    return (
                      <LanguageLi
                        key={index}
                        onClick={() => liClickHandler(index)}
                      >
                        {item}
                      </LanguageLi>
                    );
                  })}
                </LanguageUl>
              )}
            </SelectWrap>
            <input
              type="text"
              placeholder="키워드를 입력해주세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
            ></input>
            <SearchButton type="button" onClick={searchButtonClickHandler}>
              <GrSearch style={{ fontSize: "22px" }} />
            </SearchButton>
          </Search>
          <NavItems>
            <NavItem
              className={activeNavItem === "Latest" ? "active" : ""}
              onClick={() => {
                handleNavItemClick("Latest");
              }}
            >
              최신순
            </NavItem>
            <NavItem
              className={activeNavItem === "Popularity" ? "active" : ""}
              onClick={() => handleNavItemClick("Popularity")}
            >
              인기순
            </NavItem>
          </NavItems>
        </Navbar>
      </Header>
      <FeedContainer>
        {searchResults.length > 0 ? (
          <>
            {searchResults.map((item) => {
              const isOpen = feedDetailOpen.includes(item.photoId);
              return (
                <React.Fragment key={item.photoId}>
                  <FeedCard
                    data={item}
                    onClick={() => {
                      openFeedDetail(item.photoId);
                    }}
                  />
                  {isOpen && (
                    <FeedDetail
                      open={() => openFeedDetail(item.photoId)}
                      close={() => closeFeedDetail(item.photoId)}
                      photoId={item.photoId}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </>
        ) : (
          data.pages
            .flatMap((page) => {
              return page.content;
            })
            .map((item) => {
              const isOpen = feedDetailOpen.includes(item.photoId);
              return (
                <React.Fragment key={item.photoId}>
                  <FeedCard
                    data={item}
                    onClick={() => {
                      openFeedDetail(item.photoId);
                    }}
                  />
                  {isOpen && (
                    <FeedDetail
                      open={() => openFeedDetail(item.photoId)}
                      close={() => closeFeedDetail(item.photoId)}
                      photoId={item.photoId}
                    />
                  )}
                </React.Fragment>
              );
            })
        )}
      </FeedContainer>
      {data.pages[data.pages.length - 1].last === false ? (
        <BottomDiv ref={bottomObserverRef}></BottomDiv>
      ) : null}
      {showButton && <ScrollToTopButton />}
    </>
  );
}

export default Feed;

const BottomDiv = styled.div`
  height: 1px;
`;

const FeedContainer = styled.div`
  padding: 30px 150px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 45px;

  @media (max-width: 1300px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

/* const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
`; */

const NavItems = styled.nav`
  display: flex;
  gap: 20px;
  color: #999999;
`;

const NavItem = styled.div`
  cursor: pointer;
  padding: 5px 5px 5px 5px;

  &.active {
    color: black;
  }
`;

const Header = styled.div`
  padding: 16px 0 16px 0;
  border-bottom: 1px solid #ddd;
  margin: 0 150px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;

  input {
    padding: 8px 12px;
    border: none;
    font-size: 16px;
    flex: 1;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.3);
    }
  }

  button {
    margin: 5px;
    border: none;
    border-radius: 21px;
    color: black;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    background-color: white;
    &:focus {
      outline: none;
    }
  }
`;
const Search = styled.div`
  border: 1px solid #483767;
  border-radius: 30px;
  width: 60%;
  display: flex;
`;

const Content = styled.div`
  padding: 30px 150px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: auto;
  @media (max-width: 1300px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
const SelectWrap = styled.div`
  position: relative;
`;

const SelectButton = styled.button`
  margin: 5px;
  width: 100px;
  padding: 10px 5px;
  gap: 5px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
    opacity: 70%;
  }
`;

const LanguageUl = styled.ul`
  width: 100px;
  z-index: 10;
  margin: 0;
  padding-left: 0;
  list-style: none;
  position: absolute;
  color: #483767;
  border-radius: 7px;
  overflow: hidden;
`;

const LanguageLi = styled.li`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
`;
const SearchButton = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
`;
