import React, { useRef, useState } from "react";
import styled from "styled-components";
import BoardItem from "../components/BoardItem";
import { getBoard } from "../apis/create/getBoard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import LoadingSpinner from "../components/LoadingSpinner";
import { useInfiniteQuery, useMutation } from "react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { searchBoardAxios } from "../apis/board/searchBoard";
function Board() {
  const [activeNavItem, setActiveNavItem] = useState("Model");
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  let optArr = ["닉네임", "장소", "해시태그"];
  const [currentOpt, setCurrentOpt] = useState("닉네임");
  const [showList, setShowList] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [option, setOption] = useState("userNickName");
  const [showButton, setShowButton] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const toggleShowList = () => setShowList(true);
  const toggleCloseList = () => setShowList(false);
  const optionChangeHandler = (currentOpt) => {
    if (currentOpt === "해시태그") {
      setOption("keyWord");
    } else if (currentOpt === "닉네임") {
      setOption("userNickName");
    } else if (currentOpt === "장소") {
      setOption("location");
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
  const searchMutation = useMutation(searchBoardAxios, {
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
      setKeyword("");
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
      Swal.fire({
        icon: "warning",
        title: "검색어를 입력해주세요!",
        confirmButtonText: "확인",
      });
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
  const ShowButtonClick = () => {
    const { scrollY } = window;
    scrollY > 200 ? setShowButton(true) : setShowButton(false);
  };
  useEffect(() => {
    window.addEventListener("scroll", ShowButtonClick);
    return () => {
      window.removeEventListener("scroll", ShowButtonClick);
    };
  }, []);

  const handleNavItemClick = (item) => {
    setActiveNavItem(item);
    setSearchResults([]);
  };

  const { isLoading, isError, data, fetchNextPage } = useInfiniteQuery(
    ["getBoard", activeNavItem], // activeNavItem을 키로 사용하여 캐시 분리
    ({ pageParam = 0 }) => getBoard({ pageParam, activeNavItem }),
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

  // 바닥 div 추적
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
    return <h1>오류가 발생하였습니다...!</h1>;
  }

  return (
    <Container>
      <Header>
        <Navbar>
          <span>게시판</span>
          <Search>
            <SelectWrap ref={selectWrapRef}>
              <SelectButton onClick={toggleShowList}>
                {currentOpt}
                <TbTriangleInvertedFilled />
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
            <button type="button" onClick={searchButtonClickHandler}>
              검색
            </button>
          </Search>
          <NavItems>
            <NavItem
              className={activeNavItem === "Model" ? "active" : ""}
              onClick={() => {
                handleNavItemClick("Model");
              }}
            >
              Model
            </NavItem>
            <NavItem
              className={activeNavItem === "Photographer" ? "active" : ""}
              onClick={() => handleNavItemClick("Photographer")}
            >
              Photographer
            </NavItem>
          </NavItems>
        </Navbar>
      </Header>
      <Content>
        {searchResults.length > 0 ? (
          <>
            {searchResults.map((item) => (
              <BoardItem
                onClick={() => {
                  if (isLoggedIn) {
                    navigate(`${item.boardId}`);
                  } else {
                    Swal.fire({
                      icon: "warning",
                      title: "회원 전용 서비스!",
                      text: `로그인이 필요한 서비스입니다🙏`,
                      confirmButtonText: "확인",
                    });
                  }
                }}
                item={item}
                key={item.boardId}
              />
            ))}
          </>
        ) : (
          data.pages
            .flatMap((page) => page.content)
            .map((item) => (
              <BoardItem
                onClick={() => {
                  if (isLoggedIn) {
                    navigate(`${item.boardId}`);
                  } else {
                    Swal.fire({
                      icon: "warning",
                      title: "회원 전용 서비스!",
                      text: `로그인이 필요한 서비스입니다🙏`,
                      confirmButtonText: "확인",
                    });
                  }
                }}
                item={item}
                key={item.boardId}
              />
            ))
        )}

        <div ref={bottomObserverRef}></div>
      </Content>
      {showButton && <ScrollToTopButton />}
    </Container>
  );
}

export default Board;

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
    border-radius: 8px;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    font-size: 16px;
    flex: 1;

    &:focus {
      outline: none;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.3);
    }
  }

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    background-color: #483767;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;

    &:hover:not(:disabled) {
      opacity: 70%;
    }

    &:focus {
      outline: none;
    }
  }
`;
const Search = styled.div`
  width: 60%;
  display: flex;
  gap: 10px;
`;
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

const Header = styled.header`
  padding: 16px;
  width: 80%;
  border-bottom: 1px solid #ddd;
`;

const Content = styled.div`
  width: 80%;
`;
const SelectWrap = styled.div`
  position: relative;
`;

const SelectButton = styled.button`
  width: 100px;
  height: 40px;
  padding: 0 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: white;
  cursor: pointer;
`;

const LanguageUl = styled.ul`
  width: 100px;
  z-index: 10;
  margin: 0;
  padding-left: 0;
  list-style: none;
  position: absolute;
  border: 1px solid lightgray;
  border-radius: 5px;
  overflow: hidden;
`;

const LanguageLi = styled.li`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  /*   border: 1px solid lightgrey; */
  /*   border-left: 1px solid lightgrey;
  border-right: 1px solid lightgrey; */
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background-color: lightgrey;
    /* border-radius: 5px; */
  }
  /*   &:first-child {
    border-top: 1px solid lightgrey;
    border-radius: 5px;
  }
  &:last-child {
    border-bottom: 1px solid lightgrey;
    border-radius: 5px;
  } */
`;
