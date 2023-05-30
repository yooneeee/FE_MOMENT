import React, { useState, useRef } from "react";
import styled from "styled-components";
import { mypageIngormationAxios, mypageAxios } from "../apis/mypage/mypage";
import { useMutation } from "react-query";
import { useQuery } from "react-query";

function MyPageInformation() {
  const { isLoading, isError, data } = useQuery("mypageAxios", mypageAxios);
  if (isLoading) {
    return <p>로딩중입니다....!</p>;
  }
  if (isError) {
    return <p>오류가 발생하였습니다...!</p>;
  }
  /* 기본 이미지 토끼, 추후에 바꿀 예정 */
  const [image, setImage] = useState("img/snowball.png");
  const fileInput = useRef(null);

  const [pwIsVisible, setpwIsVisible] = useState(false);
  const [nickIsVisible, setnickIsVisible] = useState(false);
  const [imgIsVisible, setImgIsVisible] = useState(false);
  const [roleIsVisivle, setRoleVisivle] = useState(false);

  // const [newImg, setNewImg] = useState("");
  const [newNick, setNewNick] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newRole, setNewRole] = useState("");

  /* 버튼 클릭시 히든 폼 */
  const nicknameHandler = () => {
    setnickIsVisible(!nickIsVisible);
  };
  const pwHandler = () => {
    setpwIsVisible(!pwIsVisible);
  };
  const imgHandler = () => {
    setImgIsVisible(!imgIsVisible);
  };
  const roleHandler = () => {
    setRoleVisivle(!roleIsVisivle);
  };

  /* 취소 버튼 클릭시 되돌아가기 */
  const nickCancelHandler = () => {
    setnickIsVisible(false);
  };
  const pwCancelHandler = () => {
    setpwIsVisible(false);
  };
  const imgCancelHandler = () => {
    setImgIsVisible(false);
    setImage("img/snowball.png");
  };
  const basiCImgHandler = () => {
    setImage("img/snowball.png");
  };
  const roleCancelHandler = () => {
    setRoleVisivle(false);
  };

  /* 프로필 이미지 선택 */
  const fileSelectHandler = (e) => {
    const file = e.target.files[0];
    // 파일 처리 로직 추가
    // 이미지 업로드 후 이미지 변경 로직
    const reader = new FileReader();
    reader.onload = () => {
      const uploadedImage = reader.result;
      setImage(uploadedImage);
    };
    reader.readAsDataURL(file);
  };

  /* 프로필 수정 */
  // const imgChangeHandler = (e) => {
  //   setNewImg(e.target.value);
  // };
  const nickChangeHandler = (e) => {
    setNewNick(e.target.value);
  };
  const pwChangeHandler = (e) => {
    setNewPw(e.target.value);
  };
  const roleChangeHandler = (e) => {
    // const selectedRole = e.target.innerText;
    // setNewRole(selectedRole);
    // setRoleVisivle(false);
    setNewRole("PHOTOGRAPHER");
  };
  // const roleButtonHandler = (e) => {
  //   roleChangeHandler(e);
  //   setRoleVisivle(true);
  // };

  /* 서버 통신 */
  // const MypageMutation = useMutation(mypageIngormationAxios, {
  //   onSuccess: () => {
  //     alert("회원정보 수정 완료!");
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //   },
  // });

  // console.log(MypageMutation);
  /* 변경 버튼 클릭 */
  const changeButtonHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("profileImg", image);

    const update = {
      nickName: newNick,
      password: newPw,
      role: newRole,
    };

    formData.append("update", JSON.stringify(update));

    // formData.append(
    //   "update",
    //   new Blob([JSON.stringify(update)], { type: "application/json" })
    // );
    // MypageMutation.mutate(formData);
    // console.log("서버 전송 완료!");
  };

  return (
    <>
      {/* <div>안녕</div> */}
      <Container>
        <Box>
          <Title>
            기본 회원정보<span>필수</span>
          </Title>
          <Line />
          <Text1>사진</Text1>
          <ProfileContainer>
            <ProfileImg
              src={image}
              alt="프로필 이미지"
              //   onClick={() => {
              //     fileInput.current.click();
              //   }}
            />
          </ProfileContainer>
          <TextColumn>
            <ProfileText>
              {imgIsVisible ? (
                <HiddenForm>
                  <UploadButton>
                    사진선택
                    <input type="file" onChange={fileSelectHandler}></input>
                  </UploadButton>
                  <BasicImgButton onClick={basiCImgHandler}>
                    기본이미지로 변경
                  </BasicImgButton>
                  <ButtonColumn>
                    <HiddenFormBtn onClick={imgCancelHandler}>
                      취소
                    </HiddenFormBtn>
                    <HiddenFormBtn>완료</HiddenFormBtn>
                  </ButtonColumn>
                </HiddenForm>
              ) : (
                <>
                  <span>회원님을 알릴 수 있는 사진을 등록해 주세요.</span>
                  <br />
                  <span>
                    등록 된 사진은 회원님의 게시물이나 피드에 사용됩니다.
                  </span>
                </>
              )}
            </ProfileText>
          </TextColumn>
          {imgIsVisible ? null : (
            <Button onClick={imgHandler}>사진 변경</Button>
          )}
        </Box>
        <Line1 />
        <Box>
          <Text>닉네임</Text>
          <TextColumn>
            {nickIsVisible ? (
              <HiddenForm>
                <HiddenNick>
                  <span>길이는 최대 ~자 이내로 작성해주세요.</span>
                  <br />
                  <span>중복 닉네임 불가합니다.</span>
                </HiddenNick>
                <HiddenInput
                  type="text"
                  placeholder="닉네임 입력(최대 ~자)"
                  value={newNick}
                  onChange={nickChangeHandler}
                />
                <ButtonColumn>
                  <HiddenFormBtn onClick={nickCancelHandler}>
                    취소
                  </HiddenFormBtn>
                  <HiddenFormBtn>완료</HiddenFormBtn>
                </ButtonColumn>
              </HiddenForm>
            ) : (
              <span>{data.nickName}</span>
            )}
          </TextColumn>
          {nickIsVisible ? null : (
            <Button onClick={nicknameHandler}>닉네임 변경</Button>
          )}
        </Box>
        <Line1 />
        <Box>
          <Text>
            <span>비밀번호</span>
          </Text>
          <TextColumn>
            {pwIsVisible ? (
              <HiddenForm>
                <Column>
                  <span>현재 비밀번호</span>
                  <HiddenInput type="password" />
                </Column>
                <Column>
                  <span>신규 비밀번호</span>
                  <HiddenInput
                    type="password"
                    value={newPw}
                    onChange={pwChangeHandler}
                  />
                </Column>
                {/* <Column>
                  <span>신규 비밀번호 재 입력</span>
                  <HiddenInput type="password" />
                </Column> */}
                <ButtonColumn>
                  <HiddenFormBtn onClick={pwCancelHandler}>취소</HiddenFormBtn>
                  <HiddenFormBtn>완료</HiddenFormBtn>
                </ButtonColumn>
              </HiddenForm>
            ) : (
              <span>********</span>
            )}
          </TextColumn>
          {pwIsVisible ? null : (
            <Button onClick={pwHandler}>비밀번호 변경</Button>
          )}
        </Box>
        <Line1 />
        <Box>
          <Text>
            <span>Role</span>
          </Text>
          <TextColumn>
            {roleIsVisivle ? (
              <HiddenForm>
                <Column>
                  <UploadButton onClick={roleChangeHandler}>
                    PHOTOGRAPHER
                  </UploadButton>
                </Column>
                <ButtonColumn>
                  <HiddenFormBtn onClick={roleCancelHandler}>
                    취소
                  </HiddenFormBtn>
                  <HiddenFormBtn>완료</HiddenFormBtn>
                </ButtonColumn>
              </HiddenForm>
            ) : (
              <span>Photographer</span>
            )}
          </TextColumn>
          {roleIsVisivle ? null : (
            <Button onClick={roleHandler}>Role 변경</Button>
          )}
        </Box>
        <Line1 />
        <button onClick={changeButtonHandler}>정보변경</button>
      </Container>
    </>
  );
}

export default MyPageInformation;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  /* max-width: 50%; */
  margin: 10px auto 0;
`;
const Title = styled.div`
  font-size: 25px;
  font-weight: 700;
  margin-top: 20px;

  span {
    margin-left: 10px;
    color: #afafaf;
    font-size: 25px;
  }
`;

const ProfileContainer = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  /* cursor: pointer; */
`;
const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const ProfileText = styled.div`
  margin-top: 10px;
  font-weight: 600;
`;
const UploadButton = styled.label`
  display: inline-block;
  padding: 15px 25px;
  background-color: #ffffff;
  color: #000000;
  border: 1px #b3b3b3 solid;
  /* border-radius: 4px; */
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }

  input[type="file"] {
    display: none;
  }
`;
const BasicImgButton = styled(UploadButton)`
  margin-left: 5px;
`;

const Box = styled.div`
  width: 100%;
  margin: 10px auto 0;
`;
const HiddenForm = styled.div`
  padding: 10px;
`;
const HiddenNick = styled.div`
  margin-bottom: 10px;
`;
const Column = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const HiddenInput = styled.input`
  width: 100%;
  max-width: 55%;
  border: 1px solid #cacaca;
  padding: 5px 10px;
  outline: none;

  &::placeholder {
    color: #cacaca;
  }
`;

const ButtonColumn = styled.div`
  width: 100%;
  max-width: 33%;
  display: flex;
  justify-content: space-between;
  /* margin: 0 auto 5px; */
  margin: 0 0 5px;
`;
const HiddenFormBtn = styled.button`
  padding: 8px 19px;
  border: none;
  background-color: #d1d1d1;
  margin-top: 10px;
`;
const Text = styled.div`
  float: left;
  width: 100%;
  max-width: 30%;
  /* background-color: #c0f10d; */
  height: auto;
  padding: 15px 0;
  box-sizing: border-box;
  border-top: 1px solid #f1f1f1;
  border-bottom: none;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
`;
const Text1 = styled(Text)`
  height: 30vh;
`;
const TextColumn = styled.div`
  display: inline-block;
  width: 100%;
  max-width: 55%;
  /* background-color: #ffb773; */
  height: auto;
  padding: 15px 0;
  box-sizing: border-box;
  border-top: 1px solid #f1f1f1;
  border-bottom: none;
  font-size: 14px;
  text-align: left;

  span {
    font-weight: 800;
    font-size: 15px;
  }
`;
const Button = styled.button`
  max-width: 15%;
  border: 1px #d1d1d1 solid;
  /* border-radius: 8px; */
  background-color: transparent;
  padding: 7px 5px;
  font-size: 14px;
`;
const Line = styled.div`
  border-top: 4px solid #000000;
  width: 100%;
  margin: 20px auto;
`;
const Line1 = styled.div`
  border-top: 1px solid #d6d6d6;
  width: 100%;
  margin: 10px auto;
`;
