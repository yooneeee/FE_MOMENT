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
import { GrSearch } from "react-icons/gr";
import { searchBoardAxios } from "../apis/board/searchBoard";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

function Board() {
  const [activeNavItem, setActiveNavItem] = useState("Model");
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  let optArr = ["제목", "닉네임", "장소", "해시태그"];
  const [currentOpt, setCurrentOpt] = useState("제목");
  const [showList, setShowList] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [option, setOption] = useState("title");
  const [showButton, setShowButton] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const toggleShowList = () => setShowList(true);
  const toggleCloseList = () => setShowList(false);
  const optionChangeHandler = (currentOpt) => {
    if (currentOpt === "제목") {
      setOption("title");
    } else if (currentOpt === "해시태그") {
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
    <>
      <Header>
        <Navbar>
          <span>구인/구직 게시판</span>

          <SearchWrap>
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
            <SearchInput
              type="text"
              placeholder="키워드를 입력해주세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SearchButton type="button" onClick={searchButtonClickHandler}>
              <GrSearch style={{ fontSize: "22px" }} />
            </SearchButton>
          </SearchWrap>
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
      {/*       <Header>
        <Navbar>
          <span>게시판</span>
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
      </Header> */}
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
    </>
  );
}

export default Board;

const Header = styled.header`
  padding: 16px 0 16px 0;
  border-bottom: 1px solid #ddd;
  margin: 0 150px;

  @media (max-width: 768px) {
    margin: 0 30px;
  }
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const Logo = styled.span`
  font-size: 24px;
  color: #333;
`;

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #483767;
  border-radius: 30px;
  width: 70%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SelectWrap = styled.div`
  position: relative;
  margin-right: 10px;

  @media (max-width: 768px) {
    margin-right: 5px;
  }
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
  border: none;
  border-radius: 21px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
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

const SearchInput = styled.input`
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
`;

const SearchButton = styled.button`
  padding: 8px 12px;
  background-color: transparent;
  border: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const NavItems = styled.ul`
  display: flex;
  align-items: center;
  gap: 20px;
  list-style: none;
`;

const NavItem = styled.li`
  font-size: 16px;
  color: #999999;
  cursor: pointer;

  &.active {
    color: #483767;
  }
`;

const Content = styled.div`
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

/* 
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
const NavItems = styled.nav`
  display: flex;
  gap: 20px;
  color: #999999;
`;

const NavItem = styled.div`
  cursor: pointer;
  padding: 5px;

  &.active {
    color: black;
  }
`;

const Header = styled.header`
  padding: 16px 0 16px 0;
  border-bottom: 1px solid #ddd;
  margin: 0 150px;
`;

const Content = styled.div`
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
 */
